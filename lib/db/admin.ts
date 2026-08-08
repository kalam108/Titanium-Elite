import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  bookings,
  guideDocuments,
  guides,
  listings,
  payments,
  profiles,
  reviews,
  safetyReports,
  type serviceKind,
} from "@/db/schema/domain";

export interface AdminKpis {
  verifiedGuides: number;
  pendingGuides: number;
  totalGuides: number;
  totalBookings: number;
  disputedBookings: number;
  disputeRatePct: number;
  gmvPaisa: number;
  escrowHeldPaisa: number;
  escrowReleasedPaisa: number;
  avgTrustScore: number | null;
  avgRating: number | null;
  reviewCount: number;
  reportsOpen: number;
}

export async function getAdminKpis() { const [guideRow, bookingRow, paymentRow, reviewRow, reportRow] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        verified: sql<number>`count(*) filter (where verification_status = 'verified')::int`,
        pending: sql<number>`count(*) filter (where verification_status = 'pending')::int`,
        avgTrust: sql<number | null>`round(avg(trust_score), 1)`,
      })
      .from(guides),
    db
      .select({
        total: sql<number>`count(*)::int`,
        disputed: sql<number>`count(*) filter (where status = 'disputed')::int`,
        gmv: sql<number>`coalesce(sum(total_paisa) filter (where status in ('confirmed','in_progress','completed')), 0)`,
      })
      .from(bookings),
    db
      .select({
        held: sql<number>`coalesce(sum(amount_paisa) filter (where status = 'held'), 0)`,
        released: sql<number>`coalesce(sum(amount_paisa) filter (where status = 'released'), 0)`,
      })
      .from(payments),
    db
      .select({ avg: sql<number | null>`round(avg(rating), 2)`, count: sql<number>`count(*)::int` })
      .from(reviews),
    db
      .select({ count: sql<number>`count(*) filter (where status = 'open')::int` })
      .from(safetyReports),
  ]);

  const g = guideRow[0];
  const b = bookingRow[0];
  const p = paymentRow[0];
  const r = reviewRow[0];
  const s = reportRow[0];
  return {
    verifiedGuides: g?.verified ?? 0,
    pendingGuides: g?.pending ?? 0,
    totalGuides: g?.total ?? 0,
    totalBookings: b?.total ?? 0,
    disputedBookings: b?.disputed ?? 0,
    disputeRatePct: b && b.total > 0 ? Math.round(((b.disputed ?? 0) * 1000) / b.total) / 10 : 0,
    gmvPaisa: Number(b?.gmv ?? 0),
    escrowHeldPaisa: Number(p?.held ?? 0),
    escrowReleasedPaisa: Number(p?.released ?? 0),
    avgTrustScore: g?.avgTrust === null ? null : Number(g?.avgTrust ?? 0),
    avgRating: r?.avg === null ? null : Number(r?.avg ?? 0),
    reviewCount: r?.count ?? 0,
    reportsOpen: s?.count ?? 0,
  };
}

export interface PendingVerificationRow {
  guideId: string;
  guideName: string;
  phone: string | null;
  countries: string;
  headline: string | null;
  yearsExperience: number | null;
  regions: string[];
  serviceKinds: string[];
  submittedAt: Date | null;
  docCount: number;
  documents: Array<{
    id: string;
    kind: string;
    status: string;
    documentNumber: string | null;
    expiresOn: string | null;
    rejectionReason: string | null;
  }>;
}

export async function getPendingVerifications() { const rows = await db
    .select({
      guide: guides,
      fullName: profiles.fullName,
      phone: profiles.phone,
      country: profiles.country,
      profileCreatedAt: profiles.createdAt,
    })
    .from(guides)
    .innerJoin(profiles, eq(profiles.id, guides.profileId))
    .where(inArray(guides.verificationStatus, ["pending", "rejected"]))
    .orderBy(desc(guides.verifiedAt), desc(guides.id));

  if (rows.length === 0) return [];

  const guideIds = rows.map((r) => r.guide.id);
  const docs = await db
    .select()
    .from(guideDocuments)
    .where(inArray(guideDocuments.guideId, guideIds))
    .orderBy(guideDocuments.kind);

  return rows.map((r) => ({
    guideId: r.guide.id,
    guideName: r.fullName ?? "Unknown",
    phone: r.phone,
    countries: [r.country ?? "Nepal"].join(", "),
    headline: r.guide.headline,
    yearsExperience: r.guide.yearsExperience,
    regions: r.guide.regions,
    serviceKinds: r.guide.serviceKinds,
    submittedAt: r.profileCreatedAt,
    docCount: docs.filter((d) => d.guideId === r.guide.id).length,
    documents: docs
      .filter((d) => d.guideId === r.guide.id)
      .map((d) => ({
        id: d.id,
        kind: d.kind,
        status: d.status,
        documentNumber: d.documentNumber,
        expiresOn: d.expiresOn,
        rejectionReason: d.rejectionReason,
      })),
  }));
}

export interface AdminGuideRow {
  id: string;
  fullName: string;
  phone: string | null;
  verificationStatus: string;
  trustScore: number;
  isPublished: boolean;
  yearsExperience: number | null;
  baseRatePaisa: number | null;
  regions: string[];
  serviceKinds: string[];
  verifiedAt: Date | null;
  reviewCount: number;
  avgRating: number | null;
  bookingCount: number;
  reportCount: number;
}

export async function getAdminGuides() { const rows = await db
    .select({
      guide: guides,
      fullName: profiles.fullName,
      phone: profiles.phone,
      rating: reviews.rating,
      bookings: sql<number>`(select count(*) from bookings b where b.guide_id = ${guides.id})::int`,
      reports: sql<number>`(select count(*) from safety_reports sr where sr.guide_id = ${guides.id})::int`,
    })
    .from(guides)
    .innerJoin(profiles, eq(profiles.id, guides.profileId))
    .leftJoin(reviews, eq(reviews.guideId, guides.id))
    .orderBy(desc(guides.trustScore), desc(guides.id));

  const out: AdminGuideRow[] = [];
  const index = new Map<string, AdminGuideRow>();
  for (const r of rows) {
    let row = index.get(r.guide.id);
    if (!row) {
      row = {
        id: r.guide.id,
        fullName: r.fullName ?? "",
        phone: r.phone,
        verificationStatus: r.guide.verificationStatus,
        trustScore: r.guide.trustScore,
        isPublished: r.guide.isPublished,
        yearsExperience: r.guide.yearsExperience,
        baseRatePaisa: r.guide.baseRatePaisa === null ? null : Number(r.guide.baseRatePaisa),
        regions: r.guide.regions,
        serviceKinds: r.guide.serviceKinds,
        verifiedAt: r.guide.verifiedAt,
        reviewCount: 0,
        avgRating: null,
        bookingCount: Number(r.bookings ?? 0),
        reportCount: Number(r.reports ?? 0),
      };
      index.set(r.guide.id, row);
      out.push(row);
    }
    if (r.rating !== null) {
      row.reviewCount++;
      row.avgRating = row.avgRating === null ? r.rating : (row.avgRating * (row.reviewCount - 1) + r.rating) / row.reviewCount;
    }
  }
  return out;
}

export interface AdminBookingRow {
  id: string;
  code: string;
  travelerName: string;
  guideName: string;
  listingTitle: string | null;
  startDate: string;
  endDate: string;
  partySize: number;
  totalPaisa: number;
  status: string;
  createdAt: Date;
  hasPayment: boolean;
  hasReview: boolean;
}

export async function getAdminBookings(limit = 60) { const rows = await db
    .select({
      booking: bookings,
      travelerName: profiles.fullName,
      guideName: sql<string>`(select p2.full_name from guides g2 join profiles p2 on p2.id = g2.profile_id where g2.id = ${bookings.guideId})`,
      listingTitle: sql<string | null>`(select l.title from listings l where l.id = ${bookings.listingId})`,
      hasPayment: sql<boolean>`exists (select 1 from payments p where p.booking_id = ${bookings.id})`,
      hasReview: sql<boolean>`exists (select 1 from reviews rv where rv.booking_id = ${bookings.id})`,
    })
    .from(bookings)
    .innerJoin(profiles, eq(profiles.id, bookings.travelerId))
    .orderBy(desc(bookings.createdAt))
    .limit(limit);
  return rows.map((r) => ({
    id: r.booking.id,
    code: r.booking.code,
    travelerName: r.travelerName ?? "",
    guideName: r.guideName ?? "",
    listingTitle: r.listingTitle,
    startDate: r.booking.startDate,
    endDate: r.booking.endDate,
    partySize: r.booking.partySize,
    totalPaisa: Number(r.booking.totalPaisa),
    status: r.booking.status,
    createdAt: r.booking.createdAt,
    hasPayment: r.hasPayment,
    hasReview: r.hasReview,
  }));
}

export interface AdminReportRow {
  id: string;
  category: string | null;
  body: string;
  status: string;
  createdAt: Date;
  reporterName: string;
  guideName: string | null;
  bookingCode: string | null;
}

export async function getAdminReports(): Promise<AdminReportRow[]> {
  const rows = await db
    .select({
      report: safetyReports,
      reporterName: profiles.fullName,
      guideName: sql<string | null>`(select p2.full_name from guides g2 join profiles p2 on p2.id = g2.profile_id where g2.id = ${safetyReports.guideId})`,
      bookingCode: sql<string | null>`(select b.code from bookings b where b.id = ${safetyReports.bookingId})`,
    })
    .from(safetyReports)
    .innerJoin(profiles, eq(profiles.id, safetyReports.reporterId))
    .orderBy(desc(safetyReports.createdAt));
  return rows.map((r) => ({
    id: r.report.id,
    category: r.report.category,
    body: r.report.body,
    status: r.report.status,
    createdAt: r.report.createdAt,
    reporterName: r.reporterName ?? "",
    guideName: r.guideName,
    bookingCode: r.bookingCode,
  }));
}

export interface RecentActivity {
  latestBookings: AdminBookingRow[];
  latestReports: AdminReportRow[];
  pendingCount: number;
  reportsOpenCount: number;
}

export async function getAdminRecentActivity(): Promise<RecentActivity> {
  const [latestBookings, latestReports, pending, openReports] = await Promise.all([
    getAdminBookings(8),
    getAdminReports(),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(guides)
      .where(eq(guides.verificationStatus, "pending")),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(safetyReports)
      .where(eq(safetyReports.status, "open")),
  ]);
  return {
    latestBookings,
    latestReports: latestReports.slice(0, 5),
    pendingCount: pending[0]?.count ?? 0,
    reportsOpenCount: openReports[0]?.count ?? 0,
  };
}

export async function getGuideDocumentsForAdmin(guideId: string) {
  return db
    .select()
    .from(guideDocuments)
    .where(and(eq(guideDocuments.guideId, guideId)))
    .orderBy(guideDocuments.kind);
}

export interface AdminListingRow {
  id: string;
  title: string;
  slug: string;
  guideName: string;
  guideId: string;
  serviceKind: string;
  region: string | null;
  durationDays: number | null;
  difficulty: number | null;
  pricePaisa: number;
  priceUnit: string;
  isActive: boolean;
  createdAt: Date;
  bookingCount: number;
}

export async function getAdminListings(opts: { limit?: number; status?: string; query?: string; kind?: serviceKind } = {}) { const conds = [];
  if (opts.query) {
    const q = `%${opts.query.trim()}%`;
    conds.push(
      or(
        ilike(listings.title, q),
        ilike(listings.slug, q),
        sql`exists (select 1 from guides g2 join profiles p2 on p2.id = g2.profile_id where g2.id = ${listings.guideId} and p2.full_name ilike ${q})`,
      )!,
    );
  }
  if (opts.kind) conds.push(eq(listings.serviceKind, opts.kind));

  const rows = await db
    .select({
      listing: listings,
      guideName: sql<string>`(select p.full_name from guides g join profiles p on p.id = g.profile_id where g.id = ${listings.guideId})`,
      bookingCount: sql<number>`(select count(*) from bookings b where b.listing_id = ${listings.id})::int`,
    })
    .from(listings)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(listings.createdAt));

  return rows.map((r) => ({
    id: r.listing.id,
    title: r.listing.title,
    slug: r.listing.slug,
    guideName: r.guideName ?? "",
    guideId: r.listing.guideId,
    serviceKind: r.listing.serviceKind,
    region: r.listing.region,
    durationDays: r.listing.durationDays,
    difficulty: r.listing.difficulty,
    pricePaisa: Number(r.listing.pricePaisa),
    priceUnit: r.listing.priceUnit,
    isActive: r.listing.isActive,
    createdAt: r.listing.createdAt,
    bookingCount: Number(r.bookingCount ?? 0),
  }));
}

export interface AdminGuideOption {
  id: string;
  fullName: string;
  verificationStatus: string;
  isPublished: boolean;
}

export async function getAdminGuideOptions() { const rows = await db
    .select({ guide: guides, fullName: profiles.fullName })
    .from(guides)
    .innerJoin(profiles, eq(profiles.id, guides.profileId))
    .orderBy(profiles.fullName);
  return rows.map((r) => ({
    id: r.guide.id,
    fullName: r.fullName ?? "Unknown",
    verificationStatus: r.guide.verificationStatus,
    isPublished: r.guide.isPublished,
  }));
}







