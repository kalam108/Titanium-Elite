import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { listings } from "@/db/schema/domain";
import { getGuideDetail, type GuideCardData } from "@/lib/db/guides";

export interface ListingDetail {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  serviceKind: string;
  region: string | null;
  durationDays: number | null;
  difficulty: number | null;
  maxAltitudeM: number | null;
  pricePaisa: number;
  priceUnit: string;
  includes: string[];
  excludes: string[];
  coverImageUrl: string | null;
  gallery: string[];
  createdAt: Date;
  guide: GuideCardData | null;
}

export async function getListingBySlug(slug: string): Promise<ListingDetail | null> {
  const row = await db
    .select()
    .from(listings)
    .where(and(eq(listings.slug, slug), eq(listings.isActive, true)))
    .limit(1);
  const l = row[0];
  if (!l) return null;

  const guide = await getGuideDetail(l.guideId);
  if (!guide) return null; // listings of unverified guides are invisible

  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    summary: l.summary,
    description: l.description,
    serviceKind: l.serviceKind,
    region: l.region,
    durationDays: l.durationDays,
    difficulty: l.difficulty,
    maxAltitudeM: l.maxAltitudeM,
    pricePaisa: Number(l.pricePaisa),
    priceUnit: l.priceUnit,
    includes: l.includes,
    excludes: l.excludes,
    coverImageUrl: l.coverImageUrl,
    gallery: l.gallery,
    createdAt: l.createdAt,
    guide,
  };
}

export interface ListingCardData {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  serviceKind: string;
  region: string | null;
  durationDays: number | null;
  difficulty: number | null;
  maxAltitudeM: number | null;
  pricePaisa: number;
  priceUnit: string;
  coverImageUrl: string | null;
  guideName: string;
  guideSlug: string;
  guideTrustScore: number;
  guideVerified: boolean;
  avgRating: number | null;
  reviewCount: number;
}

export async function getListingsByGuide(guideId: string): Promise<ListingCardData[]> {
  const guide = await getGuideDetail(guideId);
  if (!guide) return [];
  const guideSlug = guide.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return guide.listings.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    summary: null,
    serviceKind: l.serviceKind,
    region: l.region,
    durationDays: l.durationDays,
    difficulty: l.difficulty,
    maxAltitudeM: l.maxAltitudeM,
    pricePaisa: l.pricePaisa,
    priceUnit: l.priceUnit,
    coverImageUrl: l.coverImageUrl,
    guideName: guide.fullName,
    guideSlug,
    guideTrustScore: guide.trustScore,
    guideVerified: true,
    avgRating: guide.reviewStats.avgRating,
    reviewCount: guide.reviewStats.reviewCount,
  }));
}

export async function getRegionListings(region: string): Promise<ListingCardData[]> {
  const rows = await db
    .select({
      listing: listings,
      guideId: listings.guideId,
    })
    .from(listings)
    .where(and(eq(listings.region, region), eq(listings.isActive, true)))
    .orderBy(desc(listings.createdAt));
  const guideIds = [...new Set(rows.map((r) => r.guideId))];
  const details: Array<GuideCardData | null> = [];
  for (const id of guideIds) {
    details.push(await getGuideDetail(id));
  }
  const byId = new Map<string, GuideCardData | null>(guideIds.map((id, i) => [id, details[i]]));
  const out: ListingCardData[] = [];
  for (const r of rows) {
    const guide = byId.get(r.guideId);
    if (!guide) continue;
    out.push({
      id: r.listing.id,
      slug: r.listing.slug,
      title: r.listing.title,
      summary: r.listing.summary,
      serviceKind: r.listing.serviceKind,
      region: r.listing.region,
      durationDays: r.listing.durationDays,
      difficulty: r.listing.difficulty,
      maxAltitudeM: r.listing.maxAltitudeM,
      pricePaisa: Number(r.listing.pricePaisa),
      priceUnit: r.listing.priceUnit,
      coverImageUrl: r.listing.coverImageUrl,
      guideName: guide.fullName,
      guideSlug: guide.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      guideTrustScore: guide.trustScore,
      guideVerified: guide.verificationStatus === "verified",
      avgRating: guide.reviewStats.avgRating,
      reviewCount: guide.reviewStats.reviewCount,
    });
  }
  return out;
}
