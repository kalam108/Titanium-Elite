import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { guides, listings, regions } from "@/db/schema/domain";
import { searchGuides, type GuideCardData } from "@/lib/db/guides";

export interface RegionSummary {
  slug: string;
  name: string;
  district: string | null;
  province: string | null;
  permitRequired: boolean;
  permitNotes: string | null;
  bestMonths: number[];
  heroImageUrl: string | null;
  guideCount: number;
  listingCount: number;
}

export interface RegionDetail extends RegionSummary {
  guides: GuideCardData[];
}

export async function getAllRegions(): Promise<RegionSummary[]> {
  const rows = await db
    .select({
      region: regions,
      guideCount: sql<number>`count(distinct ${guides.id})::int`,
      listingCount: sql<number>`count(distinct ${listings.id})::int`,
    })
    .from(regions)
    .leftJoin(guides, sql`${guides.regions} @> ARRAY[${regions.slug}]::text[]`)
    .leftJoin(
      listings,
      sql`${listings.region} = ${regions.slug} and ${listings.isActive} = true and ${listings.guideId} in (select g2.id from guides g2 where g2.is_published = true and g2.verification_status = 'verified')`,
    )
    .groupBy(regions.slug)
    .orderBy(regions.name);
  return rows.map((r) => ({
    slug: r.region.slug,
    name: r.region.name,
    district: r.region.district,
    province: r.region.province,
    permitRequired: r.region.permitRequired,
    permitNotes: r.region.permitNotes,
    bestMonths: r.region.bestMonths,
    heroImageUrl: r.region.heroImageUrl,
    guideCount: r.guideCount ?? 0,
    listingCount: r.listingCount ?? 0,
  }));
}

export async function getRegionBySlug(slug: string): Promise<RegionDetail | null> {
  const row = await db.select().from(regions).where(eq(regions.slug, slug)).limit(1);
  const region = row[0];
  if (!region) return null;

  const guideResult = await searchGuides({ region: slug, verifiedOnly: true, pageSize: 12 });
  return {
    slug: region.slug,
    name: region.name,
    district: region.district,
    province: region.province,
    permitRequired: region.permitRequired,
    permitNotes: region.permitNotes,
    bestMonths: region.bestMonths,
    heroImageUrl: region.heroImageUrl,
    guideCount: guideResult.total,
    listingCount: await listingCountForRegion(slug),
    guides: guideResult.guides,
  };
}

async function listingCountForRegion(slug: string): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(listings)
    .innerJoin(guides, eq(listings.guideId, guides.id))
    .where(sql`${listings.region} = ${slug} and ${listings.isActive} = true and ${guides.isPublished} = true and ${guides.verificationStatus} = 'verified'`);
  return row[0]?.count ?? 0;
}
