// @ts-check
import { amortizedPaymentCents } from './amortization.js';
export function perkinsPayment({ balanceCents, annualInterestRateBps = 500, termMonths = 120 }) {
  const monthlyPaymentCents = amortizedPaymentCents(balanceCents, annualInterestRateBps, termMonths);
  return { monthlyPaymentCents, termMonths, totalPaymentCents: monthlyPaymentCents * termMonths };
}
