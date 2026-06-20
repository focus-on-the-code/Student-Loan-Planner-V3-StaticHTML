// @ts-check
import { povertyGuidelineDollars } from '../../rules/annual/2026/poverty-guidelines.js';
export function discretionaryIncomeDollars({ agiDollars, familySize = 1, povertyRegion = 'contiguous', povertyMultiplier = 1.5 }) {
  return Math.max(0, (Number(agiDollars) || 0) - povertyGuidelineDollars(povertyRegion, familySize) * povertyMultiplier);
}
export function incomeDrivenPayment({ agiDollars, familySize, povertyRegion, percent = 0.1, povertyMultiplier = 1.5, capCents = null }) {
  const discretionary = discretionaryIncomeDollars({ agiDollars, familySize, povertyRegion, povertyMultiplier });
  const raw = Math.round(discretionary * percent / 12 * 100);
  return { monthlyPaymentCents: capCents == null ? raw : Math.min(raw, capCents), discretionaryIncomeDollars: discretionary };
}
