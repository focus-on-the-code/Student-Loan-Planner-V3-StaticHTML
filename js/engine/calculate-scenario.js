// @ts-check

import { amortizedPaymentCents, termTotalCents } from './formulas/amortization.js';
import { povertyGuidelineDollars } from '../rules/annual/2026/poverty-guidelines.js';

const PLAN_COPY = Object.freeze({
  standard: ['Standard Repayment', 'Fixed 10-year repayment estimate.'],
  graduated: ['Graduated Repayment', 'Estimated 10-year schedule with lower initial payment and higher later payment.'],
  extended: ['Extended Repayment', 'Fixed 25-year repayment estimate, generally shown for larger balances.'],
  ibr10: ['IBR 10%', 'Income-based estimate using 10% of discretionary income.'],
  ibr15: ['IBR 15%', 'Income-based estimate using 15% of discretionary income.'],
  paye: ['PAYE', 'Income-driven estimate shown as potentially eligible because grandfathering facts may be required.'],
  icr: ['ICR', 'Income-contingent estimate using a simplified income share comparison.'],
  rap: ['RAP', 'Planning estimate for post-transition borrowers; official eligibility depends on future/transition facts.']
});

/**
 * @typedef {Object} ScenarioInput
 * @property {number} balanceDollars
 * @property {number} interestRatePercent
 * @property {number} agiDollars
 * @property {number} familySize
 * @property {'contiguous'|'alaska'|'hawaii'} povertyRegion
 * @property {number} pslfMonths
 * @property {boolean} publicService
 */

/**
 * Calculate plan comparison estimates for the UI.
 * @param {ScenarioInput} scenario
 */
export function calculateScenario(scenario) {
  const balanceCents = dollarsToCentsSafe(scenario.balanceDollars);
  const rateBps = Math.round(clamp(scenario.interestRatePercent, 0, 30) * 100);
  const agi = Math.max(0, Number(scenario.agiDollars) || 0);
  const familySize = Math.max(1, Math.round(Number(scenario.familySize) || 1));
  const region = scenario.povertyRegion || 'contiguous';
  const poverty = povertyGuidelineDollars(region, familySize);
  const discretionary150 = Math.max(0, agi - poverty * 1.5);
  const discretionary100 = Math.max(0, agi - poverty);
  const standard = fixedPlan('standard', balanceCents, rateBps, 120, 'clearly_eligible');
  const graduated = graduatedPlan(balanceCents, rateBps);
  const extended = fixedPlan('extended', balanceCents, rateBps, 300, balanceCents >= 3000000 ? 'clearly_eligible' : 'potentially_eligible');
  const plans = [
    standard,
    graduated,
    extended,
    incomePlan('ibr10', balanceCents, rateBps, discretionary150, 0.10, 240, 'potentially_eligible', standard.monthlyPaymentNowCents),
    incomePlan('ibr15', balanceCents, rateBps, discretionary150, 0.15, 300, 'potentially_eligible', standard.monthlyPaymentNowCents),
    incomePlan('paye', balanceCents, rateBps, discretionary150, 0.10, 240, 'potentially_eligible', standard.monthlyPaymentNowCents),
    incomePlan('icr', balanceCents, rateBps, discretionary100, 0.20, 300, 'potentially_eligible', null),
    rapPlan(balanceCents, rateBps, agi, familySize)
  ];
  const ranked = [...plans]
    .filter((plan) => plan.eligibility.status === 'clearly_eligible')
    .sort((a, b) => a.monthlyPaymentNowCents - b.monthlyPaymentNowCents || a.totalBorrowerPaymentsCents - b.totalBorrowerPaymentsCents)
    .slice(0, 3);
  return {
    estimateQuality: qualityForScenario(scenario),
    assumptions: [`2026 poverty guideline for ${region}, family size ${familySize}: $${poverty.toLocaleString()}.`, 'Income-driven projections use level income for this milestone.'],
    plans,
    topPlans: ranked,
    sourceIds: ['fr-2026-poverty-guidelines', 'fsa-repayment-plans']
  };
}

function fixedPlan(id, balanceCents, rateBps, months, status) {
  const monthly = amortizedPaymentCents(balanceCents, rateBps, months);
  return plan(id, status, monthly, months, termTotalCents(monthly, months), yearlyLevel(monthly, months));
}

function graduatedPlan(balanceCents, rateBps) {
  const standard = amortizedPaymentCents(balanceCents, rateBps, 120);
  const first = Math.max(5000, Math.round(standard * 0.72));
  const total = Math.round(termTotalCents(standard, 120) * 1.08);
  return plan('graduated', 'clearly_eligible', first, 120, total, yearlyRamp(first, Math.round(standard * 1.45), 10));
}

function incomePlan(id, balanceCents, rateBps, discretionaryDollars, share, months, status, capCents) {
  const raw = Math.round(discretionaryDollars * share / 12 * 100);
  const monthly = capCents ? Math.min(raw, capCents) : raw;
  const interestMonthly = Math.round(balanceCents * (rateBps / 10000) / 12);
  const total = monthly * months;
  const forgiveness = Math.max(0, balanceCents + Math.max(0, interestMonthly - monthly) * months - total);
  const result = plan(id, status, monthly, months, total, yearlyLevel(monthly, months));
  result.estimatedForgivenessCents = forgiveness;
  return result;
}

function rapPlan(balanceCents, rateBps, agi, familySize) {
  const dependentAdjustment = Math.max(0, familySize - 1) * 5000;
  const adjustedAgi = Math.max(0, agi - dependentAdjustment);
  const share = adjustedAgi < 30000 ? 0.01 : adjustedAgi < 60000 ? 0.03 : adjustedAgi < 100000 ? 0.05 : 0.08;
  const monthly = Math.max(1000, Math.round(adjustedAgi * share / 12 * 100));
  const months = 360;
  const interestMonthly = Math.round(balanceCents * (rateBps / 10000) / 12);
  const total = monthly * months;
  const result = plan('rap', 'potentially_eligible', monthly, months, total, yearlyLevel(monthly, months));
  result.waivedInterestCents = Math.max(0, interestMonthly - monthly) * Math.min(months, 60);
  result.planCreditsCents = Math.max(0, Math.round(monthly * 0.25)) * Math.min(months, 60);
  result.estimatedForgivenessCents = Math.max(0, balanceCents + interestMonthly * months - total - result.waivedInterestCents - result.planCreditsCents);
  return result;
}

function plan(id, status, monthly, months, total, yearly) {
  const [name, summary] = PLAN_COPY[id];
  return {
    planId: id,
    name,
    summary,
    eligibility: { status, reasons: status === 'clearly_eligible' ? ['Shown based on current high-level entries.'] : ['More loan-history or transition facts may be required.'], missingFields: status === 'clearly_eligible' ? [] : ['Detailed loan history'], sourceIds: ['fsa-repayment-plans'] },
    monthlyPaymentNowCents: monthly,
    annualPaymentNowCents: monthly * 12,
    totalBorrowerPaymentsCents: total,
    projectedResolutionMonth: months,
    estimatedForgivenessCents: 0,
    waivedInterestCents: 0,
    planCreditsCents: 0,
    yearly
  };
}

function yearlyLevel(monthly, months) {
  return Array.from({ length: Math.ceil(months / 12) }, (_, index) => ({ year: index + 1, paymentCents: monthly * 12, balanceCents: null }));
}

function yearlyRamp(start, end, years) {
  return Array.from({ length: years }, (_, index) => ({ year: index + 1, paymentCents: Math.round((start + (end - start) * (index / Math.max(1, years - 1))) * 12), balanceCents: null }));
}

function qualityForScenario(scenario) {
  let score = 0;
  if (scenario.balanceDollars > 0) score += 1;
  if (scenario.interestRatePercent >= 0) score += 1;
  if (scenario.agiDollars >= 0) score += 1;
  if (scenario.familySize > 0) score += 1;
  return score >= 4 ? 'improved' : 'basic';
}

function dollarsToCentsSafe(value) { return Math.max(0, Math.round((Number(value) || 0) * 100)); }
function clamp(value, min, max) { return Math.min(max, Math.max(min, Number(value) || 0)); }
