// @ts-check
import { simulateMonth } from './simulate-month.js';
import { summarizeYears } from './yearly-summary.js';
export function simulatePlan({ planId, name, summary, balanceCents, annualInterestRateBps, monthlyPaymentCents, termMonths, forgivenessTermMonths = null, interestTreatment = 'ordinary-interest', planCreditsCents = 0, eligibility }) {
  const months = [];
  let balance = balanceCents;
  let qualifying = 0;
  const maxMonths = Math.max(1, Math.min(360, forgivenessTermMonths || termMonths || 120));
  for (let monthIndex = 1; monthIndex <= maxMonths; monthIndex += 1) {
    const interestSubsidyCents = interestTreatment === 'interest-protection-and-principal-support' ? Math.max(0, Math.round(balance * (annualInterestRateBps / 10000) / 12) - monthlyPaymentCents) : 0;
    const row = simulateMonth({ monthIndex, beginningBalanceCents: balance, annualInterestRateBps, paymentCents: monthlyPaymentCents, interestSubsidyCents, planCreditCents: planCreditsCents, qualifyingPaymentCount: qualifying });
    months.push(row); balance = row.endingBalanceCents; qualifying = row.qualifyingPaymentCount;
    if (balance <= 0) break;
  }
  const estimatedForgivenessCents = (forgivenessTermMonths && balance > 0) ? balance : 0;
  return { planId, name, summary, eligibility, monthlyPaymentNowCents: monthlyPaymentCents, annualPaymentNowCents: monthlyPaymentCents * 12, totalBorrowerPaymentsCents: months.reduce((t, m) => t + m.paymentCents, 0), projectedResolutionMonth: months.length, estimatedForgivenessCents, waivedInterestCents: months.reduce((t, m) => t + m.waivedInterestCents, 0), planCreditsCents: months.reduce((t, m) => t + m.planCreditsCents, 0), monthly: months, yearly: summarizeYears(months) };
}
