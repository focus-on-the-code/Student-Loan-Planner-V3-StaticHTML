// @ts-check
import { accrueMonthlyInterestCents } from './interest-accrual.js';
import { allocatePayment } from './payment-allocation.js';
export function simulateMonth({ monthIndex, beginningBalanceCents, annualInterestRateBps, paymentCents, interestSubsidyCents = 0, planCreditCents = 0, qualifyingPaymentCount = 0 }) {
  const interestCents = accrueMonthlyInterestCents(beginningBalanceCents, annualInterestRateBps);
  const allocation = allocatePayment({ beginningBalanceCents, interestCents: Math.max(0, interestCents - interestSubsidyCents), paymentCents });
  const endingBalanceCents = Math.max(0, allocation.endingBalanceCents - planCreditCents);
  return { monthIndex, beginningBalanceCents, interestCents, paymentCents, interestPaidCents: allocation.interestPaidCents, principalPaidCents: allocation.principalPaidCents, unpaidInterestCents: allocation.unpaidInterestCents, waivedInterestCents: interestSubsidyCents, planCreditsCents: planCreditCents, endingBalanceCents, qualifyingPaymentCount: qualifyingPaymentCount + (paymentCents > 0 ? 1 : 0) };
}
