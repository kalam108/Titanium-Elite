"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { listings } from "@/db/schema/domain";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";

export const listingInputSchema = z.object({
  guideId: z.string().uuid("Select a guide."),
  title: z.string().trim().min(4, "Title needs at least 4 characters.").max(120),
  serviceKind: z.enum(["trek_guide", "city_guide", "porter", "homestay"]),
  region: z.string().min(1, "Select a region."),
  durationDays: z.number().int("Whole days only.").min(1, "At least 1 day.").max(60),
  difficulty: z.number().int().min(1).max(5),
  maxAltitudeM: z.number().int().min(0).max(9000),
  priceNPR: z.number().int().min(50, "Minimum NPR 50.").max(5_000_000),
  priceUnit: z.enum(["per_day", "per_person", "per_trip"]),
  summary: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().max(3000).optional().or(z.literal("")),
  includes: z.string().trim().optional().or(z.literal("")),
  excludes: z.string().trim().optional().or(z.literal("")),
  coverImageUrl: z.union([z.url("Enter a valid image URL."), z.literal("")]).optional(),
  isActive: z.boolean(),
});

export type ListingInput = z.infer<typeof listingInputSchema>;

export interface ListingActionState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

function uniqueSlug(title: string) {
  const base = slugify(title).slice(0, 70);
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createListingAction(
  input: ListingInput,
): Promise<ListingActionState> {
  await requireAdmin();

  const parsed = listingInputSchema.safeParse(input);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const v = parsed.data;

  try {
    await db.insert(listings).values({
      guideId: v.guideId,
      title: v.title,
      slug: uniqueSlug(v.title),
      summary: v.summary || null,
      description: v.description || null,
      serviceKind: v.serviceKind,
      region: v.region,
      durationDays: v.durationDays,
      difficulty: v.difficulty,
      maxAltitudeM: v.maxAltitudeM,
      pricePaisa: v.priceNPR * 100,
      priceUnit: v.priceUnit,
      includes: v.includes ? v.includes.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      excludes: v.excludes ? v.excludes.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      coverImageUrl: v.coverImageUrl || null,
      isActive: v.isActive,
    });
  } catch (e) {
    console.error("createListingAction failed", e);
    return { error: "Could not create the listing. Please try again." };
  }

  revalidatePath("/admin/listings");
  redirect("/admin/listings");
}

export async function toggleListingActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const nextActive = formData.get("active") === "true";
  if (!id) return;

  await db.update(listings).set({ isActive: nextActive }).where(eq(listings.id, id));
  revalidatePath("/admin/listings");
}

export async function deleteListingAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.delete(listings).where(sql`${listings.id} = ${id}`);
  revalidatePath("/admin/listings");
}
