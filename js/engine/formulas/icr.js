// @ts-check
import { incomeDrivenPayment } from './income-driven.js';
import { amortizedPaymentCents } from './amortization.js';
export function icrPayment(input) {
  const incomeShare = incomeDrivenPayment({ ...input, percent: 0.2, povertyMultiplier: 1 });
  const alternative = Math.round(amortizedPaymentCents(input.balanceCents, input.annualInterestRateBps, 144) * 0.85);
  return { monthlyPaymentCents: Math.min(incomeShare.monthlyPaymentCents, alternative), incomeShareCents: incomeShare.monthlyPaymentCents, alternativeCents: alternative };
}
