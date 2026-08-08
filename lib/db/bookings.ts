import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { availability, bookings, guides, listings } from "@/db/schema/domain";
import { platformFee } from "@/lib/money";

export interface BookingCardData {
  id: string;
  code: string;
  status: string;
  startDate: string;
  endDate: string;
  partySize: number;
  totalPaisa: number;
  platformFeePaisa: number;
  travelerNote: string | null;
  guideNote: string | null;
  cancelledReason: string | null;
  createdAt: Date;
  guideId: string;
  guideName: string;
  guideSlug: string;
  guideTrustScore: number;
  travelerId: string;
  travelerName: string;
  listingId: string | null;
  listingTitle: string | null;
  listingSlug: string | null;
  coverImageUrl: string | null;
  paymentStatus: string | null;
  escrowReleaseAt: Date | null;
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function bookingCode(): string {
  let out = "NP";
  for (let i = 0; i < 8; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

async function toBookingCard(rows: Array<{
  booking: typeof bookings.$inferSelect;
  guideName: string | null;
  guideSlug: string;
  guideTrustScore: number;
  travelerName: string | null;
  listingTitle: string | null;
  listingSlug: string | null;
  coverImageUrl: string | null;
  paymentStatus: string | null;
  escrowReleaseAt: Date | null;
}>): Promise<BookingCardData[]> {
  const listingIds = [...new Set(rows.map((r) => r.booking.listingId).filter(Boolean))] as string[];
  const listingRows = listingIds.length
    ? await db.select().from(listings).where(inArray(listings.id, listingIds))
    : [];
  const listingById = new Map(listingRows.map((l) => [l.id, l]));
  return rows.map((r) => ({
    id: r.booking.id,
    code: r.booking.code,
    status: r.booking.status,
    startDate: r.booking.startDate,
    endDate: r.booking.endDate,
    partySize: r.booking.partySize,
    totalPaisa: Number(r.booking.totalPaisa),
    platformFeePaisa: Number(r.booking.platformFeePaisa),
    travelerNote: r.booking.travelerNote,
    guideNote: r.booking.guideNote,
    cancelledReason: r.booking.cancelledReason,
    createdAt: r.booking.createdAt,
    guideId: r.booking.guideId,
    guideName: r.guideName ?? "",
    guideSlug: r.guideSlug,
    guideTrustScore: r.guideTrustScore,
    travelerId: r.booking.travelerId,
    travelerName: r.travelerName ?? "",
    listingId: r.booking.listingId,
    listingTitle: listingById.get(r.booking.listingId ?? "")?.title ?? r.listingTitle,
    listingSlug: listingById.get(r.booking.listingId ?? "")?.slug ?? r.listingSlug,
    coverImageUrl: listingById.get(r.booking.listingId ?? "")?.coverImageUrl ?? r.coverImageUrl,
    paymentStatus: r.paymentStatus,
    escrowReleaseAt: r.escrowReleaseAt,
  }));
}

export async function getBookingsForProfile(profileId: string, role: "traveler" | "guide") {
  const rows = await db
    .select({
      booking: bookings,
      guideName: sql<string | null>`(select g2.profile_full_name from (
        select g.id, p.full_name as profile_full_name from guides g join profiles p on p.id = g.profile_id
      ) g2 where g2.id = ${bookings.guideId})`,
      guideSlug: sql<string>`''`,
      guideTrustScore: sql<number>`(select g3.trust_score from guides g3 where g3.id = ${bookings.guideId})`,
      travelerName: sql<string | null>`(select p3.full_name from profiles p3 where p3.id = ${bookings.travelerId})`,
      listingTitle: sql<string | null>`(select l.title from listings l where l.id = ${bookings.listingId})`,
      listingSlug: sql<string | null>`(select l.slug from listings l where l.id = ${bookings.listingId})`,
      coverImageUrl: sql<string | null>`(select l.cover_image_url from listings l where l.id = ${bookings.listingId})`,
      paymentStatus: sql<string | null>`(select p.status from payments p where p.booking_id = ${bookings.id} limit 1)`,
      escrowReleaseAt: sql<Date | null>`(select p.escrow_release_at from payments p where p.booking_id = ${bookings.id} limit 1)`,
    })
    .from(bookings)
    .where(role === "traveler" ? eq(bookings.travelerId, profileId) : eq(bookings.guideId, sql`(select id from guides where profile_id = ${profileId})`))
    .orderBy(desc(bookings.createdAt));

  return toBookingCard(rows);
}

export async function getBookingByCode(code: string): Promise<BookingCardData | null> {
  const rows = await db
    .select({
      booking: bookings,
      guideName: sql<string | null>`(select p2.full_name from guides g2 join profiles p2 on p2.id = g2.profile_id where g2.id = ${bookings.guideId})`,
      guideSlug: sql<string>`''`,
      guideTrustScore: sql<number>`(select g3.trust_score from guides g3 where g3.id = ${bookings.guideId})`,
      travelerName: sql<string | null>`(select p3.full_name from profiles p3 where p3.id = ${bookings.travelerId})`,
      listingTitle: sql<string | null>`(select l.title from listings l where l.id = ${bookings.listingId})`,
      listingSlug: sql<string | null>`(select l.slug from listings l where l.id = ${bookings.listingId})`,
      coverImageUrl: sql<string | null>`(select l.cover_image_url from listings l where l.id = ${bookings.listingId})`,
      paymentStatus: sql<string | null>`(select p.status from payments p where p.booking_id = ${bookings.id} limit 1)`,
      escrowReleaseAt: sql<Date | null>`(select p.escrow_release_at from payments p where p.booking_id = ${bookings.id} limit 1)`,
    })
    .from(bookings)
    .where(eq(bookings.code, code))
    .limit(1);
  if (rows.length === 0) return null;
  const [card] = await toBookingCard(rows);
  return card;
}

export interface CreateBookingInput {
  guideId: string;
  listingId: string | null;
  travelerId: string;
  startDate: string;
  endDate: string;
  partySize: number;
  travelerNote?: string;
}

export type CreateBookingResult =
  | { ok: true; bookingId: string; code: string }
  | { ok: false; reason: "date_overlap" | "unavailable" | "not_found" | "invalid_dates" };

const ACTIVE_STATUSES = ["inquiry", "pending_payment", "confirmed", "in_progress"] as const;

export async function createInquiryBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const start = new Date(`${input.startDate}T00:00:00Z`);
  const end = new Date(`${input.endDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return { ok: false, reason: "invalid_dates" };
  }

  const guideRows = await db.select().from(guides).where(eq(guides.id, input.guideId)).limit(1);
  if (guideRows.length === 0 || !guideRows[0].isPublished) return { ok: false, reason: "not_found" };

  const overlap = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(and(
      eq(bookings.guideId, input.guideId),
      inArray(bookings.status, ACTIVE_STATUSES),
      lte(bookings.startDate, input.endDate),
      gte(bookings.endDate, input.startDate),
    ))
    .limit(1);
  if (overlap.length > 0) return { ok: false, reason: "date_overlap" };

  const blocked = await db
    .select({ id: availability.id })
    .from(availability)
    .where(and(
      eq(availability.guideId, input.guideId),
      eq(availability.isAvailable, false),
      lte(availability.date, input.endDate),
      gte(availability.date, input.startDate),
    ))
    .limit(1);
  if (blocked.length > 0) return { ok: false, reason: "unavailable" };

  const listingId = input.listingId;
  let listingPaisa = 0;
  if (listingId) {
    const listingRows = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1);
    if (listingRows.length > 0) {
      listingPaisa = Number(listingRows[0].pricePaisa);
    }
  }
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
  const total = listingId
    ? listingPaisa * Math.max(1, days) * input.partySize
    : (guideRows[0].baseRatePaisa ? Number(guideRows[0].baseRatePaisa) : 0) * days * input.partySize;

  const code = bookingCode();
  const inserted = await db
    .insert(bookings)
    .values({
      id: randomUUID(),
      code,
      travelerId: input.travelerId,
      guideId: input.guideId,
      listingId,
      startDate: input.startDate,
      endDate: input.endDate,
      partySize: input.partySize,
      totalPaisa: total,
      platformFeePaisa: platformFee(total),
      status: "inquiry",
      travelerNote: input.travelerNote || null,
    })
    .returning({ id: bookings.id });
  return { ok: true, bookingId: inserted[0].id, code };
}

export async function getUpcomingAvailableGuideDates(guideId: string, days = 45): Promise<string[]> {
  const rows = await db
    .select({ date: availability.date })
    .from(availability)
    .where(and(
      eq(availability.guideId, guideId),
      eq(availability.isAvailable, true),
      gte(availability.date, sql`current_date`),
      lte(availability.date, sql`current_date + interval '${days} days'`),
    ))
    .orderBy(availability.date);
  return rows.map((r) => r.date);
}
