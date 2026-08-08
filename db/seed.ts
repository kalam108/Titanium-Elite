import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  account,
  availability,
  bookings,
  guideDocuments,
  guides,
  listings,
  messages,
  payments,
  profiles,
  regions,
  reviews,
  safetyReports,
  user,
  type bookingStatus,
  type serviceKind,
} from "./schema";
import { computeTrustScore, docKindLabel } from "../lib/trust";
import { IMAGES } from "../lib/constants";

// ---------------------------------------------------------------------------
// Deterministic RNG so the demo DB is reproducible.
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260808);
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const ri = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const toYMD = (d: Date) => d.toISOString().slice(0, 10);
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const bookingCode = () =>
  "SL-" + Array.from({ length: 6 }, () => CODE_ALPHABET[Math.floor(rand() * 32)]).join("");

// ---------------------------------------------------------------------------
// Data pools
// ---------------------------------------------------------------------------
const GUIDE_NAMES = [
  "Pasang Sherpa", "Nima Tamang", "Dorje Gurung", "Lhakpa Lama", "Karma Rai",
  "Mingma Sherpa", "Tenzing Gurung", "Ang Nima Sherpa", "Phurba Sherpa", "Dawa Tamang",
  "Sonam Ghale", "Pemba Sherpa", "Chhiring Tamang", "Gyalzen Sherpa", "Kaji Magar",
  "Ram Bahadur Thapa", "Sanjay Karki", "Bikash Rokka", "Rajendra Gurung", "Krishna Nepal",
  "Suraj Thakuri", "Deepak Lama", "Suman Rai", "Arjun Bhandari", "Prakash Poudel",
  "Bishal Shrestha", "Anish Maharjan", "Rabin Adhikari", "Sagar Lamichhane", "Yam Gurung",
  "Tul Bahadur Pun", "Man Bahadur Gurung", "Hari Maya Tamang", "Sarita Gurung", "Maya Sherpa",
  "Gita Rai", "Sunita Magar", "Anita Tamang", "Pabitra Lama", "Kumari Gurung",
];
const TRAVELER_NAMES = [
  "Emma Johansson", "Liam O'Connor", "Sofia Rossi", "Yuki Tanaka", "Hannah Mueller", "Daniel Carter",
];
const LANGUAGES = ["Nepali", "English", "Sherpa", "Tamang", "Hindi", "German", "Japanese", "French", "Mandarin"];
const HEADLINES = [
  "Licensed EBC trek leader with 300+ summits of patience",
  "10 years guiding the Annapurnas, certified first-aid responder",
  "Third-generation Sherpa guide — the mountains are my office",
  "City storyteller: Kathmandu's alleys, momos, and 2,000-year-old temples",
  "Wildlife tracker for Chitwan's rhinos and one very opinionated peacock",
  "Porter turned lead guide — I know exactly what your knees need",
  "Himalayan homestay host, tea expert, and amateur weather god",
  "Mountain biker and certified guide for Mustang's red-rock valleys",
];
const BIOS = [
  "Born and raised in the shadow of the mountains, I started carrying loads at fifteen and never stopped. I hold a government license, renew my first-aid every two years, and I still get nervous before every summit attempt — which is exactly why my clients are safe.",
  "I have guided trekkers from forty countries through the Himalayas. My rule is simple: we walk at your pace, drink tea at mine, and never trust the weather forecast that says 'fine'.",
  "The mountains taught me everything: patience, rope work, and how to share one bed in a tea house without drama. I specialise in keeping first-timers alive and second-timers laughing.",
  "My family has hosted travelers for three generations. Our home has hot water (usually), butter tea (always), and stories that get better the higher we climb.",
  "I left a job in the city to count rhinos for a living. Now I count them with you, safely, and I will not let a one-horned celebrity slow our jeep. Much.",
];
const REVIEW_BODIES = [
  "Pasang is the calmest person I have ever met above 5,000 m. He checked my oxygen, my pace, and my snack supplies daily. Ten out of ten.",
  "We booked ten days and got a friend for life. Never rushed us, carried my son's backpack twice, and knew every tea house along the route.",
  "Professional, punctual, and funny in three languages. The first-aid kit was suspiciously well organised, which I now understand is a good sign.",
  "I had altitude headaches and he rearranged the entire itinerary without a single sigh. That is the test of a great guide.",
  "Knowledgeable about every peak, pass, and yak in the region. The safety briefing was the best I have had in twenty countries of travel.",
  "He saved our trip twice: once from a storm and once from a 'shortcut' I proposed. Book him before the yaks do.",
  "Great communication before the trek, honest about conditions, and the right amount of friendly. Would absolutely book again.",
  "The sub-ratings say it all: safety 5, knowledge 5, communication 5. I have no notes, and I am usually full of notes.",
  "Patience of a saint, knees of a goat. Our 70-year-old trekker finished the whole circuit smiling.",
  "He knows which tea houses are actually good, which is the single most valuable skill a guide can have.",
];
const GUIDE_REPLIES = [
  "Dhanyabad! It was a pleasure walking with you — your pace-setting was professional-grade.",
  "Thank you for the kind words. The tea house tip is now part of my standard route notes.",
  "Honoured! Safe travels, and say namaste to the mountains for me.",
  "Thank you! I will tell my mother — she has been claiming I am good at this for years.",
  "Meherbani. See you on the next trail, hopefully with worse weather stories.",
];
const MESSAGE_POOL = [
  "Namaste! I saw your profile and we would love to book this trek for two people.",
  "Great choice! The season is perfect for it. Any questions about gear?",
  "What dates work for you? I have availability in the first half of October.",
  "October 4-18 works for us. Can you confirm the cost includes the guide's food and lodge?",
  "Yes — that is included. Only the permits and your own lunch in towns are extra.",
  "Perfect. How does the booking process work?",
  "We confirm the itinerary, you pay through the secure escrow, and I meet you at the hotel.",
  "Done — payment made. Looking forward to it!",
  "The weather forecast looks clear, but we always plan for rain. Bring layers.",
  "We are packing! Is there anything you recommend bringing from Kathmandu?",
  "A pair of trekking poles and a small power bank. And less clothes than you think.",
  "Ha! Understood. See you at the hotel on the 3rd.",
  "Update: trail conditions are good, a little snow on the pass but manageable.",
  "Thanks for the update. We are excited (and a little nervous).",
  "No need to be nervous — I have done this pass more times than I can count.",
  "Thank you again for the amazing trip. The review is coming.",
  "Namaste! I just posted the review. Thank you for everything.",
  "Your review made my week. Until the next trail, friend!",
];

// ---------------------------------------------------------------------------
// Regions (single source of truth; also used by the marketing pages)
// ---------------------------------------------------------------------------
type RegionSeed = {
  slug: string; name: string; district: string; province: string;
  permitRequired: boolean; permitNotes: string; bestMonths: number[];
};
export const REGION_SEEDS: RegionSeed[] = [
  { slug: "everest", name: "Everest (Khumbu)", district: "Solukhumbu", province: "Province 1", permitRequired: true, permitNotes: "Sagarmatha National Park entry (NPR 3,000) + TIMS card. Trekking route to EBC needs no extra climbing permit.", bestMonths: [3, 4, 5, 9, 10, 11] },
  { slug: "annapurna", name: "Annapurna", district: "Kaski/Myagdi", province: "Gandaki", permitRequired: true, permitNotes: "ACAP permit (NPR 3,000) + TIMS card. Ring route and ABC both covered.", bestMonths: [3, 4, 5, 10, 11] },
  { slug: "langtang", name: "Langtang", district: "Rasuwa", province: "Bagmati", permitRequired: true, permitNotes: "TIMS card only — the closest big mountain valley to Kathmandu.", bestMonths: [3, 4, 5, 10, 11] },
  { slug: "manaslu", name: "Manaslu", district: "Gorkha", province: "Gandaki", permitRequired: true, permitNotes: "Restricted area: special permit (USD 75-100/day), MCAP, TIMS. Solo trekking not allowed — a licensed guide is mandatory.", bestMonths: [3, 4, 5, 10, 11] },
  { slug: "mustang", name: "Mustang", district: "Mustang", province: "Gandaki", permitRequired: true, permitNotes: "Upper Mustang restricted permit (USD 50/day) + ACAP. Lower Mustang needs only ACAP.", bestMonths: [4, 5, 9, 10] },
  { slug: "kanchenjunga", name: "Kanchenjunga", district: "Taplejung", province: "Koshi", permitRequired: true, permitNotes: "Restricted: special permit + KCAP. Remote, rarely crowded, four mountain walls for the price of one.", bestMonths: [3, 4, 10, 11] },
  { slug: "makalu", name: "Makalu", district: "Sankhuwasabha", province: "Koshi", permitRequired: true, permitNotes: "Restricted area permit + MCAP. The wildest trek Nepal has to offer, bar none.", bestMonths: [4, 5, 10] },
  { slug: "dolpo", name: "Dolpo", district: "Dolpa", province: "Karnali", permitRequired: true, permitNotes: "Restricted: Upper Dolpo permit (USD 10/day) + Shey Phoksundo NP entry. Film-set landscapes.", bestMonths: [5, 6, 9, 10] },
  { slug: "kathmandu-valley", name: "Kathmandu Valley", district: "Kathmandu", province: "Bagmati", permitRequired: false, permitNotes: "No trekking permits. UNESCO heritage sites, temple culture, and the world's most organised traffic chaos.", bestMonths: [10, 11, 2, 3] },
  { slug: "pokhara", name: "Pokhara", district: "Kaski", province: "Gandaki", permitRequired: false, permitNotes: "Lakeside base for the Annapurnas. No permit for town; Sarangkot sunrise is free of charge, views are not.", bestMonths: [9, 10, 11, 3] },
  { slug: "chitwan", name: "Chitwan", district: "Chitwan", province: "Bagmati", permitRequired: true, permitNotes: "Chitwan National Park entry (NPR 2,000) + guide fee for jungle activities. Rhinos do not like surprises.", bestMonths: [10, 11, 12, 1, 2] },
  { slug: "lumbini", name: "Lumbini", district: "Rupandehi", province: "Lumbini", permitRequired: false, permitNotes: "Birthplace of the Buddha. The Maya Devi Temple and monastic zone are open year-round.", bestMonths: [11, 12, 1, 2] },
];

const LISTING_TEMPLATES: Array<{
  title: string; kind: serviceKind; region: string; days: number;
  difficulty: number; altitude: number; base: [number, number];
}> = [
    { title: "Everest Base Camp Trek 14 Days", kind: "trek_guide", region: "everest", days: 14, difficulty: 4, altitude: 5545, base: [3500, 6000] },
    { title: "Gokyo Lakes & EBC 16 Days", kind: "trek_guide", region: "everest", days: 16, difficulty: 4, altitude: 5545, base: [3800, 6500] },
    { title: "Everest View Luxury Lodge Trek 9 Days", kind: "trek_guide", region: "everest", days: 9, difficulty: 3, altitude: 3880, base: [5000, 9000] },
    { title: "Island Peak Climbing 21 Days", kind: "trek_guide", region: "everest", days: 21, difficulty: 5, altitude: 6189, base: [4500, 7500] },
    { title: "Annapurna Circuit 12 Days", kind: "trek_guide", region: "annapurna", days: 12, difficulty: 4, altitude: 5416, base: [3000, 5500] },
    { title: "Poon Hill Sunrise 4 Days", kind: "trek_guide", region: "annapurna", days: 4, difficulty: 2, altitude: 3210, base: [2500, 4500] },
    { title: "Annapurna Base Camp 10 Days", kind: "trek_guide", region: "annapurna", days: 10, difficulty: 3, altitude: 4130, base: [3000, 5500] },
    { title: "Mardi Himal View Trek 6 Days", kind: "trek_guide", region: "annapurna", days: 6, difficulty: 3, altitude: 4500, base: [2800, 5000] },
    { title: "Langtang Valley 7 Days", kind: "trek_guide", region: "langtang", days: 7, difficulty: 3, altitude: 3870, base: [2800, 5000] },
    { title: "Gosaikunda Lake & Helambu 9 Days", kind: "trek_guide", region: "langtang", days: 9, difficulty: 3, altitude: 4380, base: [3000, 5200] },
    { title: "Manaslu Circuit 18 Days", kind: "trek_guide", region: "manaslu", days: 18, difficulty: 5, altitude: 5106, base: [3800, 6500] },
    { title: "Tsum Valley & Manaslu 20 Days", kind: "trek_guide", region: "manaslu", days: 20, difficulty: 5, altitude: 5106, base: [4000, 6800] },
    { title: "Upper Mustang Jeep & Trek 12 Days", kind: "trek_guide", region: "mustang", days: 12, difficulty: 3, altitude: 4230, base: [4200, 7500] },
    { title: "Kanchenjunga North Base Camp 22 Days", kind: "trek_guide", region: "kanchenjunga", days: 22, difficulty: 5, altitude: 5143, base: [4000, 6800] },
    { title: "Makalu Base Camp 21 Days", kind: "trek_guide", region: "makalu", days: 21, difficulty: 5, altitude: 4870, base: [4000, 6800] },
    { title: "Upper Dolpo Shey Gompa Trek 24 Days", kind: "trek_guide", region: "dolpo", days: 24, difficulty: 5, altitude: 5150, base: [4200, 7200] },
    { title: "Kathmandu Heritage Walk 1 Day", kind: "city_guide", region: "kathmandu-valley", days: 1, difficulty: 1, altitude: 1400, base: [2000, 4000] },
    { title: "Bhaktapur & Nagarkot Day Trip", kind: "city_guide", region: "kathmandu-valley", days: 1, difficulty: 1, altitude: 2175, base: [2500, 4500] },
    { title: "Kathmandu Valley Highlights 3 Days", kind: "city_guide", region: "kathmandu-valley", days: 3, difficulty: 2, altitude: 1400, base: [3000, 5500] },
    { title: "Pokhara & Sarangkot Sunrise 2 Days", kind: "city_guide", region: "pokhara", days: 2, difficulty: 1, altitude: 1592, base: [3000, 5000] },
    { title: "Chitwan Wildlife Safari 3 Days", kind: "city_guide", region: "chitwan", days: 3, difficulty: 2, altitude: 415, base: [4000, 7000] },
    { title: "Chitwan Jungle Explorer 2 Days", kind: "city_guide", region: "chitwan", days: 2, difficulty: 1, altitude: 415, base: [3500, 6000] },
    { title: "Lumbini Pilgrimage Tour 2 Days", kind: "city_guide", region: "lumbini", days: 2, difficulty: 1, altitude: 150, base: [3000, 5000] },
    { title: "Porter Support EBC 14 Days", kind: "porter", region: "everest", days: 14, difficulty: 2, altitude: 5545, base: [1500, 3000] },
    { title: "Porter Support Annapurna Circuit 12 Days", kind: "porter", region: "annapurna", days: 12, difficulty: 2, altitude: 5416, base: [1500, 2800] },
    { title: "Khumbu Homestay Experience 5 Days", kind: "homestay", region: "everest", days: 5, difficulty: 1, altitude: 3440, base: [800, 2000] },
    { title: "Annapurna Farmstay & Cooking 4 Days", kind: "homestay", region: "annapurna", days: 4, difficulty: 1, altitude: 2000, base: [800, 1800] },
  ];

const INCLUDES_POOL = [
  "Licensed guide (NTB/TAAN checked)",
  "Tea house/lodge accommodation during the trek",
  "Guide's food, lodge and insurance",
  "All meals on trek (breakfast, lunch, dinner)",
  "Transport to trailhead and return",
  "First-aid kit and altitude monitoring",
  "Oxygen saturation check twice daily",
  "Sightseeing entry fees",
  "Jungle activities with licensed naturalist",
  "Pickup from your hotel in Kathmandu",
];
const EXCLUDES_POOL = [
  "National park and TIMS permits",
  "Travel insurance (mandatory)",
  "Personal gear and trekking poles",
  "Lunch and dinner in towns",
  "Drinks, desserts and hot showers",
  "Tips for guide and porters",
  "International flights and visa",
  "Airport departure tax",
];

const SAFETY_REPORTS_SEED = [
  { category: "No-show", body: "Guide was 45 minutes late to the pickup and then argued the meeting point was different. Trip went ahead but the start was chaotic." },
  { category: "Price changed on arrival", body: "The homestay owner quoted NPR 2,000 more per night than the confirmed booking price, saying 'the booking platform makes a mistake sometimes'." },
  { category: "Safety concern", body: "Guide pushed the group over a pass in deteriorating weather against our request to turn back. Everyone made it down but the decision-making was worrying." },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("Resetting domain tables…");
  await db.execute(sql`truncate availability, messages, payments, reviews, bookings, listings, guide_documents, guides, safety_reports, regions, profiles cascade;`);

  const demoEmails = ["traveler@demo.np", "guide@demo.np", "admin@demo.np"];
  await db.delete(user).where(sql`email in ${demoEmails}`);
  console.log("Creating demo auth users…");

  const passwordHash = await hashPassword("demo1234");

  async function createAuthUser(email: string, name: string, role: "admin" | "guide" | "traveler") {
    const id = randomUUID();
    await db.insert(user).values({ id, name, email, emailVerified: true, role });
    await db.insert(account).values({
      id: randomUUID(), userId: id, accountId: id, providerId: "credential", password: passwordHash,
    });
    return { id, email, name, role };
  }

  const demoAdmin = await createAuthUser("admin@demo.np", "Elite Admin", "admin");
  const demoGuide = await createAuthUser("guide@demo.np", "Pasang Sherpa", "guide");
  const demoTraveler = await createAuthUser("traveler@demo.np", "Emma Johansson", "traveler");

  // env-configured admin (existing script behavior)
  const envAdminEmail = process.env.ADMIN_EMAIL;
  let envAdminId: string | undefined;
  if (envAdminEmail) {
    const existing = await db.select({ id: user.id }).from(user).where(sql`email = ${envAdminEmail}`).limit(1);
    if (existing.length === 0 && envAdminEmail !== demoAdmin.email) {
      const u = await createAuthUser(envAdminEmail, "Elite Admin", "admin");
      envAdminId = u.id;
      console.log(`Admin ${envAdminEmail} created.`);
    }
  }

  // -------------------------------------------------------------------------
  // Profiles
  // -------------------------------------------------------------------------
  const adminProfile = { id: demoAdmin.id, role: "admin" as const, fullName: "Elite Admin", locale: "en" };
  const guideProfile = { id: demoGuide.id, role: "guide" as const, fullName: "Pasang Sherpa", phone: "+977-980-000-0001", country: "Nepal", locale: "en" };
  const travelerProfile = { id: demoTraveler.id, role: "traveler" as const, fullName: "Emma Johansson", phone: "+46-70-000-0001", country: "Sweden", locale: "en" };
  const extraTravelers = TRAVELER_NAMES.filter((n) => n !== "Emma Johansson").map((name, i) => ({
    id: randomUUID(), role: "traveler" as const, fullName: name,
    phone: `+${[1, 44, 39, 81, 49][i]}-70-000-00${i + 2}`, country: ["USA", "Ireland", "Italy", "Japan", "Germany"][i], locale: "en",
  }));
  const allTravelers = [travelerProfile, ...extraTravelers];
  await db.insert(profiles).values([
    adminProfile, guideProfile, ...allTravelers,
    ...GUIDE_NAMES.filter((n) => n !== "Pasang Sherpa").map((name, i) => ({
      id: randomUUID(), role: "guide" as const, fullName: name,
      phone: `+977-981-000-${String(1000 + i)}`, country: "Nepal", locale: "en",
    })),
  ]);
  const profilesAll = await db.select({ id: profiles.id, fullName: profiles.fullName, role: profiles.role }).from(profiles);
  const profileByFullName = new Map(profilesAll.map((p) => [p.fullName, p]));
  const guideProfiles = profilesAll.filter((p) => p.role === "guide");
  const travelerIds = allTravelers.map((t) => t.id);

  // -------------------------------------------------------------------------
  // Regions
  // -------------------------------------------------------------------------
  await db.insert(regions).values(
    REGION_SEEDS.map((r, i) => ({
      slug: r.slug, name: r.name, district: r.district, province: r.province,
      permitRequired: r.permitRequired, permitNotes: r.permitNotes,
      bestMonths: r.bestMonths,
      heroImageUrl: IMAGES.landscape[i % IMAGES.landscape.length],
    })),
  );

  // -------------------------------------------------------------------------
  // Guides (40: 28 verified, 6 pending, 4 unverified, 2 rejected)
  // -------------------------------------------------------------------------
  const statuses: Array<"verified" | "pending" | "unverified" | "rejected"> = [
    ...Array(28).fill("verified"),
    ...Array(6).fill("pending"),
    ...Array(4).fill("unverified"),
    ...Array(2).fill("rejected"),
  ];
  const guideRows = guideProfiles.map((p, i) => {
    const status = statuses[i];
    const isDemoGuide = p.id === demoGuide.id;
    const regionsPick = isDemoGuide
      ? ["everest", "annapurna"]
      : Array.from(new Set([REGION_SEEDS[i % 12].slug, REGION_SEEDS[(i + 5) % 12].slug]));
    const kinds: serviceKind[] = isDemoGuide
      ? ["trek_guide", "city_guide"]
      : pick(["trek_guide", "trek_guide", "city_guide", "porter", "homestay"]) === "trek_guide"
        ? ["trek_guide"]
        : [pick(["trek_guide", "city_guide", "porter", "homestay"])];
    const langs = Array.from(new Set(["Nepali", "English", ...Array(ri(0, 2)).fill(0).map(() => pick(LANGUAGES))])).slice(0, 4);
    return {
      id: randomUUID(),
      profileId: p.id,
      headline: isDemoGuide ? "Licensed EBC trek leader with 300+ summits of patience" : pick(HEADLINES),
      bio: pick(BIOS),
      yearsExperience: ri(2, 25),
      languages: langs,
      regions: regionsPick,
      serviceKinds: kinds,
      baseRatePaisa: ri(2500, 9000) * 100,
      currency: "NPR",
      maxGroupSize: isDemoGuide ? 12 : ri(4, 12),
      verificationStatus: status,
      verifiedAt: status === "verified" ? addDays(new Date(), -ri(30, 700)) : null,
      trustScore: 0,
      responseHours: String(status === "verified" ? ri(2, 36) : ri(10, 120)),
      isPublished: status === "verified",
    };
  });

  // demo guide must be verified & published
  const demoGuideRow = guideRows.find((g) => g.profileId === demoGuide.id)!;
  demoGuideRow.verificationStatus = "verified";
  demoGuideRow.verifiedAt = addDays(new Date(), -420);
  demoGuideRow.isPublished = true;
  demoGuideRow.responseHours = "6";

  await db.insert(guides).values(guideRows);
  const insertedGuides = await db.select().from(guides);
  const guideByProfile = new Map(insertedGuides.map((g) => [g.id, g]));
  const demoGuideDb = guideByProfile.get(demoGuideRow.id)!;

  // -------------------------------------------------------------------------
  // Guide documents
  // -------------------------------------------------------------------------
  const docRows: Array<typeof guideDocuments.$inferInsert> = [];
  for (const g of insertedGuides) {
    const s = g.verificationStatus;
    const base = { guideId: g.id, issuer: "Government of Nepal" };
    const add = (kind: string, status: "verified" | "pending" | "rejected", reviewedAt?: Date | null, number?: string) => {
      const docStatus = s === "expired" ? "expired" : status;
      docRows.push({
        ...base,
        kind: kind as typeof guideDocuments.$inferInsert.kind,
        storagePath: `guide-docs/${g.profileId}/${kind}.pdf`,
        documentNumber: number,
        issuedOn: "2019-01-15",
        expiresOn: kind === "citizenship" ? null : "2027-12-31",
        status: docStatus,
        reviewedBy: adminProfile.id,
        reviewedAt: reviewedAt ?? (status === "verified" ? g.verifiedAt ?? new Date() : null),
      });
    };
    if (s === "unverified") continue;
    const isTrek = g.serviceKinds.includes("trek_guide");
    add("citizenship", s === "verified" ? "verified" : s === "rejected" ? "rejected" : "pending", g.verifiedAt);
    add("passport", "verified", g.verifiedAt, `PP-${ri(1000000, 9999999)}`);
    add(isTrek ? "ntb_license" : "taan_license", s === "verified" ? "verified" : "pending", g.verifiedAt, `${isTrek ? "NTB" : "TAAN"}-${ri(2015, 2024)}-${ri(1000, 9999)}`);
    add("first_aid", s === "verified" ? "verified" : "pending", g.verifiedAt);
    add("insurance", s === "verified" ? "verified" : "pending", g.verifiedAt);
    add("photo", s === "verified" ? "verified" : "pending", g.verifiedAt);
  }
  await db.insert(guideDocuments).values(docRows);
  const docRowsByGuide = new Map<string, typeof docRows>();
  for (const d of docRows) {
    docRowsByGuide.set(d.guideId, [...(docRowsByGuide.get(d.guideId) ?? []), d]);
  }

  // -------------------------------------------------------------------------
  // Listings (~70)
  // -------------------------------------------------------------------------
  const listingRows: Array<typeof listings.$inferInsert> = [];
  let guideIdx = 0;
  for (const g of insertedGuides.filter((x) => x.isPublished)) {
    const templates = LISTING_TEMPLATES.filter((t) => g.regions.includes(t.region) && g.serviceKinds.includes(t.kind));
    const count = templates.length === 0 ? 0 : Math.min(3, Math.max(1, templates.length));
    const chosen = templates.slice(0, count);
    for (const t of chosen) {
      const idx = listingRows.length;
      listingRows.push({
        guideId: g.id,
        title: t.title,
        slug: `${slugify(t.title)}-${guideIdx}-${idx % 97}`,
        summary: `${t.title.toLowerCase() === t.title ? t.title : t.title} with a licensed ${t.kind.replace("_", " ")} guide. Small groups, honest prices, real mountains.`,
        description: `${t.title} in ${t.region} with a verified local guide. We keep groups small (max ${g.maxGroupSize}), climb slow, and eat well. Day-by-day itinerary is flexible — altitude days, rest days, and a victory meal on day ${t.days}.`,
        serviceKind: t.kind,
        region: t.region,
        durationDays: t.days,
        difficulty: t.difficulty,
        maxAltitudeM: t.altitude,
        pricePaisa: (ri(t.base[0], t.base[1]) * 100),
        priceUnit: "per_day",
        includes: Array.from(new Set([...INCLUDES_POOL.slice(0, ri(4, 6))])),
        excludes: Array.from(new Set([...EXCLUDES_POOL.slice(0, ri(3, 5))])),
        coverImageUrl: IMAGES.landscape[ri(0, IMAGES.landscape.length - 1)],
        gallery: Array.from({ length: 3 }, () => IMAGES.landscape[ri(0, IMAGES.landscape.length - 1)]),
        isActive: true,
      });
    }
    guideIdx++;
  }
  await db.insert(listings).values(listingRows);
  const insertedListings = await db.select().from(listings);

  // -------------------------------------------------------------------------
  // Bookings (120) spread over ~18 months
  // -------------------------------------------------------------------------
  const today = new Date();
  const monthsAgo18 = addDays(today, -548);
  type BookingSpec = { status: bookingStatus; start: Date; end: Date };
  const specs: BookingSpec[] = [];
  for (let i = 0; i < 120; i++) {
    const roll = rand();
    let status: bookingStatus; let start: Date; let end: Date;
    if (roll < 0.62) { status = "completed"; start = addDays(monthsAgo18, ri(0, 455)); end = addDays(start, ri(2, 18)); }
    else if (roll < 0.68) { status = "cancelled"; start = addDays(monthsAgo18, ri(0, 455)); end = addDays(start, ri(2, 18)); }
    else if (roll < 0.71) { status = "disputed"; start = addDays(monthsAgo18, ri(0, 380)); end = addDays(start, ri(2, 18)); }
    else if (roll < 0.76) { status = "confirmed"; start = addDays(today, ri(15, 90)); end = addDays(start, ri(2, 18)); }
    else if (roll < 0.80) { status = "pending_payment"; start = addDays(today, ri(7, 45)); end = addDays(start, ri(2, 18)); }
    else if (roll < 0.84) { status = "in_progress"; start = addDays(today, -ri(0, 14)); end = addDays(today, ri(1, 14)); }
    else { status = "inquiry"; start = addDays(today, ri(30, 120)); end = addDays(start, ri(2, 18)); }
    specs.push({ status, start, end });
  }

  const publishedGuideIds = insertedGuides.filter((g) => g.isPublished).map((g) => g.id);
  const bookingRows: Array<typeof bookings.$inferInsert> = [];
  const demoGuideBookings: number[] = [];
  specs.forEach((s, i) => {
    const listing = insertedListings[i % insertedListings.length];
    const isDemo = i % 7 === 0 && s.status === "completed"; // give the demo traveler a nice spread
    const travelerId = isDemo ? travelerProfile.id : travelerIds[ri(0, travelerIds.length - 1)];
    const guide = guideByProfile.get(listing.guideId)!;
    const party = ri(1, 6);
    const days = Math.max(1, Math.round((s.end.getTime() - s.start.getTime()) / 86400000));
    const total = listing.pricePaisa * party * days;
    const platformFeePaisa = Math.round((total * 800) / 10000);
    bookingRows.push({
      code: bookingCode(),
      travelerId,
      guideId: guide.id,
      listingId: listing.id,
      startDate: toYMD(s.start),
      endDate: toYMD(s.end),
      partySize: party,
      totalPaisa: total,
      platformFeePaisa,
      status: s.status,
      travelerNote: i % 5 === 0 ? "Vegetarian meals please — and my partner is nervous about bridges." : undefined,
      guideNote: s.status === "confirmed" || s.status === "in_progress" ? "Meeting at hotel lobby at 7am." : undefined,
      cancelledReason: s.status === "cancelled" ? pick(["Family emergency", "Weather forecast improved (we went to Pokhara instead)", "Sickness", "Flight rescheduled"]) : undefined,
      createdAt: addDays(s.start, -ri(10, 45)),
    });
    if (guide.id === demoGuideDb.id) demoGuideBookings.push(i);
  });
  await db.insert(bookings).values(bookingRows);
  const insertedBookings = await db.select().from(bookings);

  // -------------------------------------------------------------------------
  // Payments (for paid statuses)
  // -------------------------------------------------------------------------
  const paymentRows: Array<typeof payments.$inferInsert> = [];
  for (const b of insertedBookings) {
    if (!["confirmed", "in_progress", "completed", "disputed"].includes(b.status)) continue;
    const isReleased = b.status === "completed";
    paymentRows.push({
      bookingId: b.id,
      provider: "mock",
      providerRef: `MOCK-${b.code.slice(3)}`,
      amountPaisa: b.totalPaisa - b.platformFeePaisa,
      status: isReleased ? "released" : "held",
      escrowReleaseAt: b.status === "completed" ? addDays(new Date(`${b.endDate}T00:00:00Z`), 3) : null,
      createdAt: b.createdAt,
    });
  }
  await db.insert(payments).values(paymentRows);

  // -------------------------------------------------------------------------
  // Reviews (90, only on completed bookings)
  // -------------------------------------------------------------------------
  const completedBookings = insertedBookings.filter((b) => b.status === "completed");
  const reviewRows: Array<typeof reviews.$inferInsert> = [];
  for (const b of completedBookings.slice(0, 90)) {
    const rating = ri(1, 10) < 9 ? ri(4, 5) : 3;
    const sub = (deviation: number) => Math.max(1, Math.min(5, rating + deviation));
    reviewRows.push({
      bookingId: b.id,
      guideId: b.guideId,
      travelerId: b.travelerId,
      rating,
      safetyRating: sub(ri(0, 1)),
      knowledgeRating: sub(ri(-1, 1)),
      communicationRating: sub(ri(-1, 0)),
      body: pick(REVIEW_BODIES),
      guideReply: rand() < 0.45 ? pick(GUIDE_REPLIES) : null,
      createdAt: addDays(new Date(`${b.endDate}T00:00:00Z`), ri(1, 7)),
    });
  }
  await db.insert(reviews).values(reviewRows);

  // -------------------------------------------------------------------------
  // Messages (~300 across conversational bookings)
  // -------------------------------------------------------------------------
  const messageRows: Array<typeof messages.$inferInsert> = [];
  const chatStatuses = new Set(["inquiry", "pending_payment", "confirmed", "in_progress", "completed", "disputed"]);
  const chatBookings = insertedBookings.filter((b) => chatStatuses.has(b.status));
  let targetMessages = 0;
  for (const b of chatBookings) {
    if (targetMessages >= 300) break;
    const n = Math.min(ri(2, 8), 300 - targetMessages);
    for (let m = 0; m < n; m++) {
      const fromGuide = m % 2 === 1;
      messageRows.push({
        bookingId: b.id,
        senderId: fromGuide ? guideByProfile.get(b.guideId)!.profileId : b.travelerId,
        body: pick(MESSAGE_POOL),
        readAt: m < n - 1 ? addDays(b.createdAt, m) : null,
        createdAt: addDays(b.createdAt, m),
      });
      targetMessages++;
    }
  }
  await db.insert(messages).values(messageRows);

  // -------------------------------------------------------------------------
  // Availability: blocked dates for upcoming bookings + free dates for demo guide
  // -------------------------------------------------------------------------
  const availabilityRows: Array<typeof availability.$inferInsert> = [];
  for (const b of insertedBookings) {
    if (!["confirmed", "in_progress", "pending_payment"].includes(b.status)) continue;
    const start = new Date(`${b.startDate}T00:00:00Z`);
    const end = new Date(`${b.endDate}T00:00:00Z`);
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      availabilityRows.push({ guideId: b.guideId, date: d.toISOString().slice(0, 10), isAvailable: false });
    }
  }
  for (let i = 1; i <= 45; i++) {
    availabilityRows.push({ guideId: demoGuideDb.id, date: toYMD(addDays(today, i)), isAvailable: true });
  }
  const uniqueAvailability = Array.from(
    new Map(availabilityRows.map((a) => [`${a.guideId}:${a.date}`, a])).values(),
  );
  await db.insert(availability).values(uniqueAvailability);

  // -------------------------------------------------------------------------
  // Safety reports (3)
  // -------------------------------------------------------------------------
  const disputed = insertedBookings.find((b) => b.status === "disputed");
  await db.insert(safetyReports).values(SAFETY_REPORTS_SEED.map((r, i) => ({
    reporterId: travelerIds[i % travelerIds.length],
    guideId: disputed && i === 2 ? disputed.guideId : insertedGuides[i % insertedGuides.length].id,
    bookingId: disputed && i === 2 ? disputed.id : null,
    category: r.category,
    body: r.body,
    status: i === 2 ? "investigating" : "open",
    createdAt: addDays(today, -ri(5, 90)),
  })));

  // -------------------------------------------------------------------------
  // Trust scores — computed in TS (mirrors the SQL function the trigger runs)
  // -------------------------------------------------------------------------
  const reviewsByGuide = new Map<string, number[]>();
  for (const r of reviewRows) {
    reviewsByGuide.set(r.guideId, [...(reviewsByGuide.get(r.guideId) ?? []), r.rating]);
  }
  const bookingsByGuide = new Map<string, number>();
  for (const b of insertedBookings) {
    if (b.status === "completed") bookingsByGuide.set(b.guideId, (bookingsByGuide.get(b.guideId) ?? 0) + 1);
  }
  const verifiedDocsByGuide = new Map<string, number>();
  for (const d of docRows) {
    if (d.status === "verified") verifiedDocsByGuide.set(d.guideId, (verifiedDocsByGuide.get(d.guideId) ?? 0) + 1);
  }
  for (const g of insertedGuides) {
    const score = computeTrustScore({
      verifiedDocCount: verifiedDocsByGuide.get(g.id) ?? 0,
      reviewRatings: reviewsByGuide.get(g.id) ?? [],
      completedBookingCount: bookingsByGuide.get(g.id) ?? 0,
      responseHours: g.responseHours ? Number(g.responseHours) : null,
    });
    await db.update(guides).set({ trustScore: score }).where(sql`id = ${g.id}`);
  }

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------
  const stats = {
    guides: insertedGuides.length,
    verified: insertedGuides.filter((g) => g.verificationStatus === "verified").length,
    listings: insertedListings.length,
    bookings: insertedBookings.length,
    reviews: reviewRows.length,
    messages: messageRows.length,
    regions: REGION_SEEDS.length,
  };
  const demoTrust = await db
    .select({ trustScore: guides.trustScore })
    .from(guides)
    .where(sql`id = ${demoGuideDb.id}`)
    .limit(1);
  console.log(`
Seed complete.
  ${stats.guides} guides (${stats.verified} verified) · ${stats.listings} listings · ${stats.regions} regions
  ${stats.bookings} bookings · ${stats.reviews} reviews · ${stats.messages} messages
  Demo guide trust score: ${demoTrust[0]?.trustScore ?? "?"} (recomputed by trigger)
  Demo guide bookings: ${demoGuideBookings.length}

Demo logins (password: demo1234):
  traveler@demo.np  — traveler dashboard, has bookings
  guide@demo.np     — Pasang Sherpa, verified guide, 2 regions
  admin@demo.np     — admin console`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
