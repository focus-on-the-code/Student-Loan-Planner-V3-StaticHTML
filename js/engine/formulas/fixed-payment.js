// @ts-check
import { amortizedPaymentCents, termTotalCents } from './amortization.js';
export function fixedPayment({ balanceCents, annualInterestRateBps, termMonths }) {
  const monthlyPaymentCents = amortizedPaymentCents(balanceCents, annualInterestRateBps, termMonths);
  return { monthlyPaymentCents, totalPaymentCents: termTotalCents(monthlyPaymentCents, termMonths), termMonths };
}
