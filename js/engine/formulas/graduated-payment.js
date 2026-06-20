// @ts-check
import { amortizedPaymentCents } from './amortization.js';
export function graduatedPayment({ balanceCents, annualInterestRateBps, termMonths = 120 }) {
  const standard = amortizedPaymentCents(balanceCents, annualInterestRateBps, termMonths);
  const firstPaymentCents = Math.max(5000, Math.round(standard * 0.72));
  const lastPaymentCents = Math.round(standard * 1.55);
  const totalPaymentCents = Math.round(standard * termMonths * 1.08);
  return { firstPaymentCents, monthlyPaymentCents: firstPaymentCents, lastPaymentCents, totalPaymentCents, termMonths };
}
