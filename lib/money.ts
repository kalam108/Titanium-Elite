import { MOMO_PRICE_PAISA } from "@/lib/constants";

/**
 * Money is integer paisa everywhere (1 NPR = 100 paisa). Never floats.
 */

export function formatNPR(paisa: number | bigint | null | undefined): string {
  const value = Number(paisa ?? 0) / 100;
  if (!Number.isFinite(value)) return "—";
  return `रु ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatRate(paisa: number | bigint | null | undefined, unit: string): string {
  return `${formatNPR(paisa)}/${unit === "per_day" ? "day" : unit === "per_person" ? "person" : "trip"}`;
}

export function formatPaisaCompact(paisa: number | bigint | null | undefined): string {
  const value = Number(paisa ?? 0) / 100;
  if (value >= 1_000_000) return `रु ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `रु ${(value / 1_000).toFixed(1)}K`;
  return `रु ${Math.round(value)}`;
}

/** The platform's honest tax on adventure. */
export const PLATFORM_FEE_BPS = 800; // 8.00%

export function platformFee(totalPaisa: number): number {
  return Math.round((totalPaisa * PLATFORM_FEE_BPS) / 10000);
}

/** A serious financial metric, translated into the only currency that matters. */
export function formatInMomos(paisa: number): string {
  const plates = Math.round(paisa / MOMO_PRICE_PAISA);
  if (plates >= 1_000_000) return `${(plates / 1_000_000).toFixed(1)}M momos`;
  if (plates >= 1_000) return `${(plates / 1_000).toFixed(1)}K momos`;
  return `${plates.toLocaleString("en-US")} momos`;
}
