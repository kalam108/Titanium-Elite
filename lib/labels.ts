export const SERVICE_KIND_LABELS: Record<string, string> = {
  trek_guide: "Trek guide",
  city_guide: "City guide",
  porter: "Porter",
  homestay: "Homestay",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  inquiry: "Inquiry",
  pending_payment: "Pending payment",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

export const PRICE_UNIT_LABELS: Record<string, string> = {
  per_day: "Per day",
  per_person: "Per person",
  per_trip: "Per trip",
};

export function serviceKindLabel(kind: string): string {
  return SERVICE_KIND_LABELS[kind] ?? kind.replace("_", " ");
}
