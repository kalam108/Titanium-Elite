import type {
  guideDocuments,
  guides,
  reviews,
} from "@/db/schema/domain";

/**
 * Trust score mirrors supabase/migrations/20260808000002:
 *   verified docs (0-40) + reviews avg (0-35) + completed bookings (0-15)
 *   + response speed (0-10, 10 pts at <=24h response, linear to 0 at >=168h).
 * The DB trigger does this too; this helper keeps seed + app logic in sync.
 */
export function computeTrustScore(input: {
  verifiedDocCount: number;
  reviewRatings: number[];
  completedBookingCount: number;
  responseHours: number | null | undefined;
}): number {
  const docs = Math.min(input.verifiedDocCount * 10, 40);
  const avg = input.reviewRatings.length
    ? Math.round(
        input.reviewRatings.reduce((a, b) => a + b, 0) / input.reviewRatings.length,
      ) * 7
    : 0;
  const bookings = Math.min(input.completedBookingCount, 15);
  const rh = input.responseHours;
  const speed =
    rh == null
      ? 0
      : Math.max(0, Math.min(10, Math.floor(10 - ((rh - 24) * 10) / 144)));
  return docs + avg + bookings + speed;
}

export interface GuideBadge {
  key: "licensed" | "id" | "first_aid" | "insured" | "top_rated";
  label: string;
  /** Exact kind(s) that were checked, for the tooltip detail. */
  checkedKinds: string[];
  checkedAt: Date | null;
  detail: string;
}

const BADGE_META: Record<
  GuideBadge["key"],
  { label: string; kinds: string[]; explain: (kinds: string) => string }
> = {
  licensed: {
    label: "Licensed",
    kinds: ["ntb_license", "taan_license"],
    explain: (k) =>
      `Government-issued license checked with ${k}. Professional trek/city guiding requires it — this is the single hardest badge to earn.`,
  },
  id: {
    label: "ID Verified",
    kinds: ["citizenship", "passport"],
    explain: (k) =>
      `Government photo ID (${k}) checked against the application. Real name, real person.`,
  },
  first_aid: {
    label: "First Aid Certified",
    kinds: ["first_aid"],
    explain: () =>
      `Valid first-aid certification on file. Covers the basics: altitude sickness, injuries, evacuation starts here.`,
  },
  insured: {
    label: "Insured",
    kinds: ["insurance"],
    explain: () =>
      `Active travel insurance covering guiding activity — for the guide and, where required, clients.`,
  },
  top_rated: {
    label: "Top Rated",
    kinds: [],
    explain: () =>
      `Average rating 4.7+ from at least 5 verified, completed-booking reviews. No fake reviews: reviews require a finished trip.`,
  },
};

export function deriveBadges(input: {
  documents: Array<
    Pick<
      typeof guideDocuments.$inferSelect,
      "kind" | "status" | "expiresOn" | "reviewedAt"
    >
  >;
  reviewStats: {
    avgRating: number | null;
    reviewCount: number;
  };
  verifiedAt: Date | null;
}): GuideBadge[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const verifiedDocs = input.documents.filter((d) => d.status === "verified");
  const valid = (d: (typeof verifiedDocs)[number]) =>
    !d.expiresOn || new Date(`${d.expiresOn}T00:00:00`) >= today;

  const badges: GuideBadge[] = [];

  for (const key of ["licensed", "id", "first_aid", "insured"] as const) {
    const meta = BADGE_META[key];
    const matching = verifiedDocs.filter(
      (d) => meta.kinds.includes(d.kind) && valid(d),
    );
    if (matching.length > 0) {
      badges.push({
        key,
        label: meta.label,
        checkedKinds: meta.kinds,
        checkedAt:
          matching[0].reviewedAt ?? input.verifiedAt ?? new Date(matching[0].expiresOn ?? ""),
        detail: meta.explain(meta.kinds.map((k) => k.replace("_", " ")).join(" + ")),
      });
    }
  }

  const { avgRating, reviewCount } = input.reviewStats;
  if (avgRating !== null && avgRating >= 4.7 && reviewCount >= 5) {
    badges.push({
      key: "top_rated",
      label: "Top Rated",
      checkedKinds: [],
      checkedAt: null,
      detail: BADGE_META.top_rated.explain(""),
    });
  }

  return badges;
}

export function isGuidePubliclyVisible(
  g: Pick<typeof guides.$inferSelect, "verificationStatus" | "isPublished">,
): boolean {
  return g.isPublished && g.verificationStatus === "verified";
}

export function guideReviewStats(rows: Array<Pick<typeof reviews.$inferSelect, "rating">>) {
  if (rows.length === 0) {
    return { avgRating: null, reviewCount: 0 };
  }
  const sum = rows.reduce((a, r) => a + r.rating, 0);
  return { avgRating: sum / rows.length, reviewCount: rows.length };
}

export function docKindLabel(kind: string): string {
  return (
    {
      citizenship: "Citizenship",
      passport: "Passport",
      ntb_license: "NTB license",
      taan_license: "TAAN license",
      first_aid: "First-aid cert",
      insurance: "Insurance",
      photo: "Portrait photo",
    }[kind] ?? kind
  );
}
