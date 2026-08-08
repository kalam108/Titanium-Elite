import { and, asc, desc, eq, gte, ilike, inArray, isNotNull, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { availability, guideDocuments, guides, listings, profiles, reviews } from "@/db/schema/domain";
import { guideReviewStats, isGuidePubliclyVisible } from "@/lib/trust";
import { slugify } from "@/lib/utils";

export interface GuideCardData {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  headline: string | null;
  regions: string[];
  serviceKinds: string[];
  baseRatePaisa: number | null;
  trustScore: number;
  verificationStatus: "verified" | "pending" | "unverified" | "rejected" | "expired";
  verifiedAt: Date | null;
  responseHours: string | null;
  yearsExperience: number | null;
  maxGroupSize: number | null;
  reviewStats: { avgRating: number | null; reviewCount: number };
  verifiedDocKinds: string[];
  listingCount: number;
  minListingPricePaisa: number | null;
}

export interface GuideSearchParams {
  region?: string;
  kind?: string;
  language?: string;
  minRating?: number;
  minPricePaisa?: number;
  maxPricePaisa?: number;
  availableFrom?: string;
  availableTo?: string;
  query?: string;
  verifiedOnly?: boolean;
  cursor?: string;
  pageSize?: number;
}

export interface GuideSearchResult {
  guides: GuideCardData[];
  nextCursor: string | null;
  total: number;
}

async function reviewStatsFor(guideIds: string[]) {
  const rows = await db
    .select({ guideId: reviews.guideId, rating: reviews.rating })
    .from(reviews)
    .where(inArray(reviews.guideId, guideIds));
  const byGuide = new Map<string, number[]>();
  for (const r of rows) {
    byGuide.set(r.guideId, [...(byGuide.get(r.guideId) ?? []), r.rating]);
  }
  const out = new Map<string, { avgRating: number | null; reviewCount: number }>();
  for (const id of guideIds) {
    out.set(id, guideReviewStats((byGuide.get(id) ?? []).map((rating) => ({ rating }))));
  }
  return out;
}

async function docKindsFor(guideIds: string[]) {
  const rows = await db
    .select({ guideId: guideDocuments.guideId, kind: guideDocuments.kind, status: guideDocuments.status })
    .from(guideDocuments)
    .where(and(inArray(guideDocuments.guideId, guideIds), eq(guideDocuments.status, "verified")));
  const byGuide = new Map<string, string[]>();
  for (const r of rows) {
    byGuide.set(r.guideId, [...(byGuide.get(r.guideId) ?? []), r.kind]);
  }
  return byGuide;
}

async function listingStatsFor(guideIds: string[]) {
  const rows = await db
    .select({
      guideId: listings.guideId,
      pricePaisa: listings.pricePaisa,
      isActive: listings.isActive,
    })
    .from(listings)
    .where(and(inArray(listings.guideId, guideIds), eq(listings.isActive, true)));
  const counts = new Map<string, number>();
  const minPrices = new Map<string, number>();
  for (const r of rows) {
    counts.set(r.guideId, (counts.get(r.guideId) ?? 0) + 1);
    const price = Number(r.pricePaisa);
    const current = minPrices.get(r.guideId);
    if (current === undefined || price < current) minPrices.set(r.guideId, price);
  }
  return { counts, minPrices };
}

/** Guides blocked (is_available = false) on every day in [from, to]. */
async function blockedGuideIds(from: string, to: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ guideId: availability.guideId })
    .from(availability)
    .where(and(eq(availability.isAvailable, false), gte(availability.date, from), lte(availability.date, to)));
  return rows.map((r) => r.guideId);
}

function toCardData(g: typeof guides.$inferSelect, name: string, avatarUrl: string | null, extra: {
  reviewStats: { avgRating: number | null; reviewCount: number };
  verifiedDocKinds: string[];
  listingCount: number;
  minListingPricePaisa: number | null;
}): GuideCardData {
  return {
    id: g.id,
    fullName: name,
    avatarUrl,
    headline: g.headline,
    regions: g.regions,
    serviceKinds: g.serviceKinds,
    baseRatePaisa: g.baseRatePaisa === null ? null : Number(g.baseRatePaisa),
    trustScore: g.trustScore,
    verificationStatus: g.verificationStatus,
    verifiedAt: g.verifiedAt,
    responseHours: g.responseHours,
    yearsExperience: g.yearsExperience,
    maxGroupSize: g.maxGroupSize,
    ...extra,
  };
}

export async function searchGuides(params: GuideSearchParams = {}): Promise<GuideSearchResult> {
  const pageSize = Math.min(params.pageSize ?? 12, 30);
  const verifiedOnly = params.verifiedOnly ?? true;

  const conds = [isNotNull(guides.profileId)];
  if (verifiedOnly) {
    conds.push(eq(guides.isPublished, true), eq(guides.verificationStatus, "verified"));
  }
  if (params.region) conds.push(sql`${guides.regions} @> ARRAY[${params.region}]::text[]`);
  if (params.kind) conds.push(sql`${guides.serviceKinds} @> ARRAY[${params.kind}]::service_kind[]`);
  if (params.language) conds.push(sql`${guides.languages} @> ARRAY[${params.language}]::text[]`);
  if (params.minPricePaisa !== undefined) conds.push(gte(guides.baseRatePaisa, params.minPricePaisa));
  if (params.maxPricePaisa !== undefined) conds.push(lte(guides.baseRatePaisa, params.maxPricePaisa));
  if (params.query) {
    const q = `%${params.query.trim()}%`;
    conds.push(or(ilike(guides.headline, q), sql`exists (select 1 from ${profiles} p where p.id = ${guides.profileId} and p.full_name ilike ${q})`)!);
  }
  if (params.cursor) {
    const [tsRaw, idRaw] = params.cursor.split(":");
    const ts = Number(tsRaw);
    conds.push(or(
      sql`(${guides.trustScore}, ${guides.id}) < (${ts}, ${idRaw})`,
    )!);
  }

  const totalRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(guides)
    .where(and(...conds));
  const total = totalRow[0]?.count ?? 0;

  let rows = await db
    .select({
      guide: guides,
      fullName: profiles.fullName,
      avatarUrl: profiles.avatarUrl,
    })
    .from(guides)
    .innerJoin(profiles, eq(profiles.id, guides.profileId))
    .where(and(...conds))
    .orderBy(desc(guides.trustScore), desc(guides.id))
    .limit(pageSize + 1);

  if (params.availableFrom && params.availableTo) {
    const blocked = new Set(await blockedGuideIds(params.availableFrom, params.availableTo));
    rows = rows.filter((r) => !blocked.has(r.guide.id));
  }

  const hasMore = rows.length > pageSize;
  const pageRows = rows.slice(0, pageSize);

  const guideIds = pageRows.map((r) => r.guide.id);
  const reviewStats = await reviewStatsFor(guideIds);
  const docKinds = await docKindsFor(guideIds);
  const { counts, minPrices } = await listingStatsFor(guideIds);

  const guidesOut: GuideCardData[] = [];
  for (const r of pageRows) {
    const stats = reviewStats.get(r.guide.id)!;
    if (params.minRating !== undefined && params.minRating > 0) {
      if (stats.avgRating === null || stats.avgRating < params.minRating) continue;
    }
    guidesOut.push(toCardData(r.guide, r.fullName ?? "", r.avatarUrl, {
      reviewStats: stats,
      verifiedDocKinds: docKinds.get(r.guide.id) ?? [],
      listingCount: counts.get(r.guide.id) ?? 0,
      minListingPricePaisa: minPrices.get(r.guide.id) ?? null,
    }));
  }

  const last = guidesOut[guidesOut.length - 1];
  return {
    guides: guidesOut,
    nextCursor: hasMore && last ? `${last.trustScore}:${last.id}` : null,
    total,
  };
}

export async function getFeaturedGuides(limit = 6): Promise<GuideCardData[]> {
  const result = await searchGuides({ verifiedOnly: true, pageSize: limit });
  return result.guides
    .slice()
    .sort((a, b) => b.trustScore - a.trustScore)
    .slice(0, limit);
}

export interface GuideDetailData extends GuideCardData {
  bio: string | null;
  languages: string[];
  currency: string;
  isPublished: boolean;
  documents: Array<{
    id: string;
    kind: string;
    status: string;
    documentNumber: string | null;
    issuer: string | null;
    expiresOn: string | null;
    reviewedAt: Date | null;
    rejectionReason: string | null;
  }>;
  listings: Array<{
    id: string;
    slug: string;
    title: string;
    serviceKind: string;
    region: string | null;
    durationDays: number | null;
    difficulty: number | null;
    maxAltitudeM: number | null;
    pricePaisa: number;
    priceUnit: string;
    coverImageUrl: string | null;
  }>;
  availabilityNext: Array<{ date: string; isAvailable: boolean }>;
}

export async function getGuideBySlug(slug: string): Promise<GuideDetailData | null> {
  const candidates = await db
    .select({ id: guides.id, fullName: profiles.fullName })
    .from(guides)
    .innerJoin(profiles, eq(profiles.id, guides.profileId));
  const bySlug = candidates.find((c) => slugify(c.fullName ?? "") === slug);
  const byId = candidates.find((c) => c.id === slug);
  const match = bySlug ?? byId;
  if (!match) return null;
  return getGuideDetail(match.id);
}

export async function getGuideDetail(guideId: string): Promise<GuideDetailData | null> {
  const rows = await db
    .select({ guide: guides, fullName: profiles.fullName, avatarUrl: profiles.avatarUrl })
    .from(guides)
    .innerJoin(profiles, eq(profiles.id, guides.profileId))
    .where(eq(guides.id, guideId))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const g = row.guide;
  if (!isGuidePubliclyVisible(g)) return null;

  const [docRows, listingRows, reviewRows, availabilityRows] = await Promise.all([
    db.select().from(guideDocuments).where(eq(guideDocuments.guideId, g.id)).orderBy(asc(guideDocuments.kind)),
    db.select().from(listings).where(and(eq(listings.guideId, g.id), eq(listings.isActive, true))).orderBy(asc(listings.pricePaisa)),
    db.select().from(reviews).where(eq(reviews.guideId, g.id)).orderBy(desc(reviews.createdAt)),
    db.select().from(availability).where(and(
      eq(availability.guideId, g.id),
      gte(availability.date, sql`current_date`),
      lte(availability.date, sql`current_date + interval '60 days'`),
    )).orderBy(asc(availability.date)),
  ]);

  const stats = guideReviewStats(reviewRows);
  const verifiedKinds = docRows.filter((d) => d.status === "verified").map((d) => d.kind);

  return {
    ...toCardData(g, row.fullName ?? "", row.avatarUrl, {
      reviewStats: stats,
      verifiedDocKinds: verifiedKinds,
      listingCount: listingRows.length,
      minListingPricePaisa: listingRows.length ? Number(listingRows[0].pricePaisa) : null,
    }),
    bio: g.bio,
    languages: g.languages,
    currency: g.currency,
    isPublished: g.isPublished,
    documents: docRows.map((d) => ({
      id: d.id,
      kind: d.kind,
      status: d.status,
      documentNumber: d.documentNumber,
      issuer: d.issuer,
      expiresOn: d.expiresOn,
      reviewedAt: d.reviewedAt,
      rejectionReason: d.rejectionReason,
    })),
    listings: listingRows.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      serviceKind: l.serviceKind,
      region: l.region,
      durationDays: l.durationDays,
      difficulty: l.difficulty,
      maxAltitudeM: l.maxAltitudeM,
      pricePaisa: Number(l.pricePaisa),
      priceUnit: l.priceUnit,
      coverImageUrl: l.coverImageUrl,
    })),
    availabilityNext: availabilityRows.map((a) => ({ date: a.date, isAvailable: a.isAvailable })),
  };
}

export interface GuideReviewPage {
  reviews: Array<{
    id: string;
    rating: number;
    safetyRating: number | null;
    knowledgeRating: number | null;
    communicationRating: number | null;
    body: string | null;
    guideReply: string | null;
    createdAt: Date;
    travelerName: string | null;
    travelerCountry: string | null;
  }>;
  nextCursor: string | null;
  total: number;
}

export async function getGuideReviews(guideId: string, cursor?: string, pageSize = 8): Promise<GuideReviewPage> {
  const conds = [eq(reviews.guideId, guideId)];
  if (cursor) conds.push(sql`${reviews.createdAt} < ${cursor}::timestamptz`);
  const rows = await db
    .select({
      review: reviews,
      travelerName: profiles.fullName,
      travelerCountry: profiles.country,
    })
    .from(reviews)
    .innerJoin(profiles, eq(profiles.id, reviews.travelerId))
    .where(and(...conds))
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .limit(pageSize + 1);
  const totalRow = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(reviews)
    .where(eq(reviews.guideId, guideId));
  const hasMore = rows.length > pageSize;
  return {
    reviews: rows.slice(0, pageSize).map((r) => ({
      id: r.review.id,
      rating: r.review.rating,
      safetyRating: r.review.safetyRating,
      knowledgeRating: r.review.knowledgeRating,
      communicationRating: r.review.communicationRating,
      body: r.review.body,
      guideReply: r.review.guideReply,
      createdAt: r.review.createdAt,
      travelerName: r.travelerName,
      travelerCountry: r.travelerCountry,
    })),
    nextCursor: hasMore ? rows[pageSize - 1].review.createdAt.toISOString() : null,
    total: totalRow[0]?.count ?? 0,
  };
}
