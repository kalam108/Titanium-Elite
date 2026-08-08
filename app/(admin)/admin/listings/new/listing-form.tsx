"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { serviceKindLabel } from "@/lib/labels";
import { createListingAction, listingInputSchema, type ListingActionState, type ListingInput } from "../actions";

const SERVICE_KINDS = ["trek_guide", "city_guide", "porter", "homestay"] as const;
const PRICE_UNITS = ["per_day", "per_person", "per_trip"] as const;

type GuideOption = { id: string; fullName: string; verificationStatus: string; isPublished: boolean };
type RegionOption = { slug: string; name: string };

export function ListingForm({
  guides,
  regions,
}: {
  guides: GuideOption[];
  regions: RegionOption[];
}) {
  const router = useRouter();
  const form = useForm<ListingInput>({
    resolver: zodResolver(listingInputSchema),
    defaultValues: {
      guideId: "",
      title: "",
      serviceKind: "trek_guide",
      region: "",
      durationDays: 1,
      difficulty: 2,
      maxAltitudeM: 0,
      priceNPR: 3000,
      priceUnit: "per_day",
      summary: "",
      description: "",
      includes: "",
      excludes: "",
      coverImageUrl: "",
      isActive: true,
    },
  });

  async function onSubmit(values: ListingInput) {
    const result = (await createListingAction(values)) as ListingActionState | undefined;
    if (result?.fieldErrors) {
      for (const [key, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.length) form.setError(key as keyof ListingInput, { message: messages[0] });
      }
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Listing created.");
    router.push("/admin/listings");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service details</CardTitle>
            <CardDescription>What travelers book, and for whom.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name="guideId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="listing-guide">Guide</FieldLabel>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(v) => field.onChange(v ?? "")}
                      items={guides.map((g) => ({
                        label: `${g.fullName} — ${g.verificationStatus}${g.isPublished ? "" : " (not published)"}`,
                        value: g.id,
                      }))}
                    >
                      <SelectTrigger className="w-full" id="listing-guide">
                        <SelectValue placeholder="Select a guide" />
                      </SelectTrigger>
                      <SelectContent>
                        {guides.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.fullName} — {g.verificationStatus}
                            {!g.isPublished ? " (not published)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="listing-title">Title</FieldLabel>
                    <Input {...field} id="listing-title" placeholder="Annapurna Base Camp 10 Days" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="serviceKind"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-kind">Service kind</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                        items={SERVICE_KINDS.map((k) => ({ label: serviceKindLabel(k), value: k }))}
                      >
                        <SelectTrigger className="w-full" id="listing-kind">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_KINDS.map((k) => (
                            <SelectItem key={k} value={k}>
                              {serviceKindLabel(k)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="region"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-region">Region</FieldLabel>
                      <Select
                        value={field.value || undefined}
                        onValueChange={(v) => field.onChange(v ?? "")}
                        items={regions.map((r) => ({ label: r.name, value: r.slug }))}
                      >
                        <SelectTrigger className="w-full" id="listing-region">
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((r) => (
                            <SelectItem key={r.slug} value={r.slug}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="durationDays"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-days">Duration (days)</FieldLabel>
                      <Input
                        {...field}
                        id="listing-days"
                        type="number"
                        min={1}
                        max={60}
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="difficulty"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-difficulty">Difficulty (1–5)</FieldLabel>
                      <Input
                        {...field}
                        id="listing-difficulty"
                        type="number"
                        min={1}
                        max={5}
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="maxAltitudeM"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-altitude">Max altitude (m)</FieldLabel>
                      <Input
                        {...field}
                        id="listing-altitude"
                        type="number"
                        min={0}
                        max={9000}
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Stored in paisa; you enter whole NPR.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="priceNPR"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-price">Price (NPR)</FieldLabel>
                      <Input
                        {...field}
                        id="listing-price"
                        type="number"
                        min={50}
                        step={50}
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="priceUnit"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="listing-price-unit">Charged</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={(v) => field.onChange(v)}
                        items={PRICE_UNITS.map((u) => ({ label: u.replace("_", " "), value: u }))}
                      >
                        <SelectTrigger className="w-full" id="listing-price-unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRICE_UNITS.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Copy</CardTitle>
            <CardDescription>What the listing looks like on the marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name="summary"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="listing-summary">Summary</FieldLabel>
                    <Textarea {...field} id="listing-summary" rows={2} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="listing-description">Description</FieldLabel>
                    <Textarea {...field} id="listing-description" rows={5} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="includes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-includes">Includes (one per line)</FieldLabel>
                      <Textarea {...field} id="listing-includes" rows={4} aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="excludes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="listing-excludes">Excludes (one per line)</FieldLabel>
                      <Textarea {...field} id="listing-excludes" rows={4} aria-invalid={fieldState.invalid} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="coverImageUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="listing-cover">Cover image URL</FieldLabel>
                    <Input {...field} id="listing-cover" type="url" placeholder="https://images.unsplash.com/…" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="listing-active"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
                <FieldLabel htmlFor="listing-active">Publish immediately</FieldLabel>
              </Field>
            )}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/listings")}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating…" : "Create listing"}
            </Button>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
