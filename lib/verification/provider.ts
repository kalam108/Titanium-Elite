/**
 * Mock verification provider — the swappable seam for real NTB/TAAN checks.
 *
 * Real-world swap path: implement the same `VerificationProvider` interface
 * against the NTB API (or a human review queue) and hand it to
 * `createVerificationService()` at the app root. Nothing else changes.
 */

export interface LicenseCheckResult {
  ok: boolean;
  matchedName?: string;
  expiresOn?: string;
  reason?: string;
}

export type LicenseKind = "ntb_license" | "taan_license";

export interface VerificationProvider {
  verifyLicense(
    kind: LicenseKind,
    number: string,
    issuer: string,
  ): Promise<LicenseCheckResult>;
}

/**
 * Deterministic 32-bit hash so the same number always fails the same way.
 */
function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const FORMATS: Record<LicenseKind, RegExp> = {
  ntb_license: /^NTB-\d{4}-\d{4}$/,
  taan_license: /^TAAN-\d{4}-\d{4}$/,
};

/**
 * Seeded registry of known-good licenses (stands in for the NTB registry
 * table). Anything else that passes the format check is a "real" match with
 * a deterministic ~15% failure rate.
 */
const REGISTRY: Array<{ number: string; name: string; expiresOn: string }> = [
  { number: "NTB-2020-1188", name: "Pasang Sherpa", expiresOn: "2027-12-31" },
  { number: "NTB-2019-0342", name: "Nima Tamang", expiresOn: "2027-12-31" },
  { number: "NTB-2021-7711", name: "Dorje Gurung", expiresOn: "2028-06-30" },
  { number: "TAAN-2018-4455", name: "Lhakpa Lama", expiresOn: "2027-03-31" },
  { number: "TAAN-2022-9012", name: "Karma Rai", expiresOn: "2028-12-31" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Simulates a real NTB/TAAN lookup: format validation, registry match,
 * ~1.5 s latency, and a deterministic ~15% failure on otherwise-valid numbers
 * (hash-based, so retrying never "fixes" a failed license).
 */
export class MockNtbProvider implements VerificationProvider {
  private readonly latencyMs: number;

  constructor(latencyMs = 1500) {
    this.latencyMs = latencyMs;
  }

  async verifyLicense(
    kind: LicenseKind,
    number: string,
    issuer: string,
  ): Promise<LicenseCheckResult> {
    await sleep(this.latencyMs);

    const trimmed = number.trim().toUpperCase();
    const format = FORMATS[kind];
    if (!format.test(trimmed)) {
      return {
        ok: false,
        reason: `"${trimmed}" does not look like a ${kind === "ntb_license" ? "NTB" : "TAAN"} license number. Format: ${kind === "ntb_license" ? "NTB" : "TAAN"}-0000-0000.`,
      };
    }

    const registered = REGISTRY.find((r) => r.number === trimmed);
    if (registered && registered.name.toLowerCase().includes(issuer.toLowerCase())) {
      return { ok: true, matchedName: registered.name, expiresOn: registered.expiresOn };
    }

    // Deterministic failure: ~15% of otherwise-plausible licenses "don't verify".
    if (hash32(`${kind}:${trimmed}`) % 100 < 15) {
      return {
        ok: false,
        reason:
          "License could not be matched to the applicant name in the registry. Please re-check the number and spelling.",
      };
    }

    return {
      ok: true,
      matchedName: issuer,
      expiresOn: "2027-12-31",
    };
  }
}

export function createVerificationService(provider: VerificationProvider = new MockNtbProvider()) {
  return {
    provider,
    verifyLicense: (kind: LicenseKind, number: string, issuer: string) =>
      provider.verifyLicense(kind, number, issuer),
  };
}
