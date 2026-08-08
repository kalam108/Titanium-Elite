import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// ============ enums (mirror of supabase/migrations/20260808000000) ============

export const userRole = pgEnum("user_role", ["traveler", "guide", "admin"]);
export type userRole = (typeof userRole)["enumValues"][number];

export const serviceKind = pgEnum("service_kind", [
  "trek_guide",
  "city_guide",
  "porter",
  "homestay",
]);
export type serviceKind = (typeof serviceKind)["enumValues"][number];

export const verificationStatus = pgEnum("verification_status", [
  "unverified",
  "pending",
  "verified",
  "rejected",
  "expired",
]);
export type verificationStatus = (typeof verificationStatus)["enumValues"][number];

export const documentKind = pgEnum("document_kind", [
  "citizenship",
  "passport",
  "ntb_license",
  "taan_license",
  "first_aid",
  "insurance",
  "photo",
]);
export type documentKind = (typeof documentKind)["enumValues"][number];

export const bookingStatus = pgEnum("booking_status", [
  "inquiry",
  "pending_payment",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "disputed",
]);
export type bookingStatus = (typeof bookingStatus)["enumValues"][number];

export const payoutStatus = pgEnum("payout_status", ["held", "released", "refunded"]);
export type payoutStatus = (typeof payoutStatus)["enumValues"][number];

// ============ profiles ============
// NOTE: id = Better Auth user id (uuid-formatted text). The Supabase migration
// references auth.users (the public/PostgREST boundary); the app writes the
// same tables through its service connection, so this FK is intentionally
// omitted here — auth.users is never populated by Better Auth.

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  role: userRole("role").notNull().default("traveler"),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  country: text("country"),
  locale: text("locale").notNull().default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============ guides ============

export const guides = pgTable(
  "guides",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    profileId: uuid("profile_id")
      .notNull()
      .unique()
      .references(() => profiles.id, { onDelete: "cascade" }),
    headline: text("headline"),
    bio: text("bio"),
    yearsExperience: integer("years_experience"),
    languages: text("languages").array().notNull().default([]),
    regions: text("regions").array().notNull().default([]),
    serviceKinds: serviceKind("service_kinds").array().notNull().default([]),
    baseRatePaisa: bigint("base_rate_paisa", { mode: "number" }),
    currency: text("currency").notNull().default("NPR"),
    maxGroupSize: integer("max_group_size"),
    verificationStatus: verificationStatus("verification_status")
      .notNull()
      .default("unverified"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    trustScore: integer("trust_score").notNull().default(0),
    responseHours: numeric("response_hours"),
    isPublished: boolean("is_published").notNull().default(false),
  },
  (table) => [
    index("guides_verification_published_idx").on(
      table.verificationStatus,
      table.isPublished,
    ),
    index("guides_languages_gin").using("gin", table.languages),
    index("guides_regions_gin").using("gin", table.regions),
  ],
);

// ============ guide_documents ============

export const guideDocuments = pgTable(
  "guide_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => guides.id, { onDelete: "cascade" }),
    kind: documentKind("kind").notNull(),
    storagePath: text("storage_path").notNull(),
    issuer: text("issuer"),
    documentNumber: text("document_number"),
    issuedOn: date("issued_on"),
    expiresOn: date("expires_on"),
    status: verificationStatus("status").notNull().default("pending"),
    reviewedBy: uuid("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("guide_documents_guide_idx").on(table.guideId)],
);

// ============ listings ============

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => guides.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary"),
    description: text("description"),
    serviceKind: serviceKind("service_kind").notNull(),
    region: text("region"),
    durationDays: integer("duration_days"),
    difficulty: smallint("difficulty"),
    maxAltitudeM: integer("max_altitude_m"),
    pricePaisa: bigint("price_paisa", { mode: "number" }).notNull(),
    priceUnit: text("price_unit").notNull().default("per_day"),
    includes: text("includes").array().notNull().default([]),
    excludes: text("excludes").array().notNull().default([]),
    coverImageUrl: text("cover_image_url"),
    gallery: text("gallery").array().notNull().default([]),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("listings_region_service_active_idx").on(
      table.region,
      table.serviceKind,
      table.isActive,
    ),
  ],
);

// ============ availability ============

export const availability = pgTable(
  "availability",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => guides.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    isAvailable: boolean("is_available").notNull().default(true),
  },
  (table) => [unique("availability_guide_date_unique").on(table.guideId, table.date)],
);

// ============ bookings ============

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull().unique(),
    travelerId: uuid("traveler_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => guides.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id").references(() => listings.id, {
      onDelete: "set null",
    }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    partySize: integer("party_size").notNull(),
    totalPaisa: bigint("total_paisa", { mode: "number" }).notNull(),
    platformFeePaisa: bigint("platform_fee_paisa", { mode: "number" })
      .notNull()
      .default(0),
    status: bookingStatus("status").notNull().default("inquiry"),
    travelerNote: text("traveler_note"),
    guideNote: text("guide_note"),
    cancelledReason: text("cancelled_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("bookings_traveler_idx").on(table.travelerId),
    index("bookings_guide_status_idx").on(table.guideId, table.status),
  ],
);

// ============ payments ============

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    provider: text("provider").notNull().default("mock"),
    providerRef: text("provider_ref"),
    amountPaisa: bigint("amount_paisa", { mode: "number" }).notNull(),
    status: payoutStatus("status").notNull().default("held"),
    escrowReleaseAt: timestamp("escrow_release_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("payments_booking_idx").on(table.bookingId)],
);

// ============ reviews ============

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id").notNull().unique().references(() => bookings.id, {
      onDelete: "cascade",
    }),
    guideId: uuid("guide_id")
      .notNull()
      .references(() => guides.id, { onDelete: "cascade" }),
    travelerId: uuid("traveler_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    rating: smallint("rating").notNull(),
    safetyRating: smallint("safety_rating"),
    knowledgeRating: smallint("knowledge_rating"),
    communicationRating: smallint("communication_rating"),
    body: text("body"),
    guideReply: text("guide_reply"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("reviews_guide_idx").on(table.guideId)],
);

// ============ messages ============

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("messages_booking_idx").on(table.bookingId)],
);

// ============ safety_reports ============

export const safetyReports = pgTable(
  "safety_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    guideId: uuid("guide_id").references(() => guides.id, { onDelete: "set null" }),
    bookingId: uuid("booking_id").references(() => bookings.id, {
      onDelete: "set null",
    }),
    category: text("category"),
    body: text("body").notNull(),
    status: text("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("safety_reports_status_idx").on(table.status)],
);

// ============ regions ============

export const regions = pgTable("regions", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  district: text("district"),
  province: text("province"),
  permitRequired: boolean("permit_required").notNull().default(false),
  permitNotes: text("permit_notes"),
  bestMonths: integer("best_months").array().notNull().default([]),
  heroImageUrl: text("hero_image_url"),
});

// ============ relations ============

export const profilesRelations = relations(profiles, ({ many }) => ({
  guides: many(guides),
  bookings: many(bookings),
  messages: many(messages),
}));

export const guidesRelations = relations(guides, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [guides.profileId],
    references: [profiles.id],
  }),
  documents: many(guideDocuments),
  listings: many(listings),
  bookings: many(bookings),
  reviews: many(reviews),
}));

export const guideDocumentsRelations = relations(guideDocuments, ({ one }) => ({
  guide: one(guides, {
    fields: [guideDocuments.guideId],
    references: [guides.id],
  }),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  guide: one(guides, {
    fields: [listings.guideId],
    references: [guides.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  traveler: one(profiles, {
    fields: [bookings.travelerId],
    references: [profiles.id],
  }),
  guide: one(guides, {
    fields: [bookings.guideId],
    references: [guides.id],
  }),
  listing: one(listings, {
    fields: [bookings.listingId],
    references: [listings.id],
  }),
  payments: many(payments),
  messages: many(messages),
  review: one(reviews, {
    fields: [bookings.id],
    references: [reviews.bookingId],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  guide: one(guides, {
    fields: [reviews.guideId],
    references: [guides.id],
  }),
  traveler: one(profiles, {
    fields: [reviews.travelerId],
    references: [profiles.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
  sender: one(profiles, {
    fields: [messages.senderId],
    references: [profiles.id],
  }),
}));
