// @ts-check
import { planDefinitions } from '../rules/versions/2026-07-01/plans.js';
import { evaluateAllPlans } from './eligibility/evaluate-all-plans.js';
import { fixedPayment } from './formulas/fixed-payment.js';
import { graduatedPayment } from './formulas/graduated-payment.js';
import { tieredStandardPayment } from './formulas/tiered-standard.js';
import { incomeDrivenPayment } from './formulas/income-driven.js';
import { icrPayment } from './formulas/icr.js';
import { rapPayment } from './formulas/rap.js';
import { incomeSensitivePayment } from './formulas/income-sensitive.js';
import { perkinsPayment } from './formulas/perkins.js';
import { simulatePlan } from './simulation/simulate-plan.js';
import { estimatePslf } from './history/pslf.js';
import { rankPlans } from './ranking.js';
import { buildRecommendations } from './recommendations.js';
import { povertyGuidelineDollars } from '../rules/annual/2026/poverty-guidelines.js';
import { planCopy } from '../content/plan-copy.js';

export function calculateScenario(scenario) {
  const normalized = normalizeScenario(scenario);
  const balanceCents = dollarsToCentsSafe(normalized.balanceDollars);
  const annualInterestRateBps = Math.round(clamp(normalized.interestRatePercent, 0, 30) * 100);
  const eligibilityList = evaluateAllPlans(normalized, planDefinitions);
  const eligibility = Object.fromEntries(eligibilityList.map((item) => [item.planId, item]));
  const standardPayment = fixedPayment({ balanceCents, annualInterestRateBps, termMonths: 120 }).monthlyPaymentCents;
  const plans = planDefinitions.map((definition) => buildProjection(definition, eligibility[definition.id], normalized, balanceCents, annualInterestRateBps, standardPayment));
  const rankedPlans = rankPlans(plans);
  const topPlans = rankedPlans.slice(0, 3);
  const recommendations = buildRecommendations({ rankedPlans, allPlans: plans });
  const poverty = povertyGuidelineDollars(normalized.povertyRegion, normalized.familySize);
  return { scenario: normalized, estimateQuality: qualityForScenario(normalized), assumptions: [`Active rule set: 2026-07-01; rules reviewed 2026-06-18.`, `2026 poverty guideline for ${normalized.povertyRegion}, family size ${normalized.familySize}: $${poverty.toLocaleString()}.`, 'Monthly simulations hold income and interest rate constant unless edited by the borrower.', 'Results are estimates for comparison and are not financial, tax, or legal advice.'], warnings: warningsForScenario(normalized), failures: [], plans, topPlans, recommendations, sourceIds: unique(plans.flatMap((p) => p.eligibility.sourceIds || [])) };
}

function buildProjection(definition, eligibility, scenario, balanceCents, annualInterestRateBps, standardPaymentCents) {
  const payment = paymentForDefinition(definition, scenario, balanceCents, annualInterestRateBps, standardPaymentCents);
  const copy = planCopy[definition.id] || { displayName: definition.displayName, summary: definition.displayName };
  const projection = simulatePlan({ planId: definition.id, name: copy.name, summary: copy.summary, balanceCents, annualInterestRateBps, monthlyPaymentCents: payment.monthlyPaymentCents, termMonths: definition.termMonths || 120, forgivenessTermMonths: definition.forgivenessTermMonths, interestTreatment: definition.interestTreatment, planCreditsCents: payment.planCreditsCents || 0, eligibility });
  projection.pslf = estimatePslf(scenario, projection);
  return projection;
}

function paymentForDefinition(definition, scenario, balanceCents, annualInterestRateBps, standardPaymentCents) {
  switch (definition.formulaId) {
    case 'fixed-payment': return fixedPayment({ balanceCents, annualInterestRateBps, termMonths: definition.termMonths || 120 });
    case 'graduated-payment': return graduatedPayment({ balanceCents, annualInterestRateBps, termMonths: definition.termMonths || 120 });
    case 'tiered-standard': return tieredStandardPayment({ balanceCents, termMonths: definition.termMonths || 120 });
    case 'ibr-10': return incomeDrivenPayment({ ...scenario, percent: 0.1, povertyMultiplier: 1.5, capCents: standardPaymentCents });
    case 'ibr-15': return incomeDrivenPayment({ ...scenario, percent: 0.15, povertyMultiplier: 1.5, capCents: standardPaymentCents });
    case 'paye': return incomeDrivenPayment({ ...scenario, percent: 0.1, povertyMultiplier: 1.5, capCents: standardPaymentCents });
    case 'icr': return icrPayment({ ...scenario, balanceCents, annualInterestRateBps });
    case 'rap': return { ...rapPayment(scenario), planCreditsCents: Math.round(Math.max(0, rapPayment(scenario).monthlyPaymentCents) * 0.25) };
    case 'income-sensitive': return incomeSensitivePayment({ ...scenario, balanceCents });
    case 'perkins': return perkinsPayment({ balanceCents, annualInterestRateBps: annualInterestRateBps || 500 });
    default: return { monthlyPaymentCents: 0 };
  }
}

export function normalizeScenario(scenario = {}) {
  return { mode: scenario.mode || 'quick', balanceDollars: Number(scenario.balanceDollars) || 0, interestRatePercent: Number(scenario.interestRatePercent) || 0, agiDollars: Number(scenario.agiDollars) || 0, familySize: Math.max(1, Math.round(Number(scenario.familySize) || 1)), povertyRegion: scenario.povertyRegion || 'contiguous', pslfMonths: Math.max(0, Math.round(Number(scenario.pslfMonths) || 0)), publicService: Boolean(scenario.publicService), loanProgram: scenario.loanProgram || 'direct', loanType: scenario.loanType || 'direct-unsubsidized', firstBorrowedDate: scenario.firstBorrowedDate || '', repaymentStartDate: scenario.repaymentStartDate || '', transitionCohort: scenario.transitionCohort || 'unknown', parentPlusHistory: scenario.parentPlusHistory || 'none', consolidated: Boolean(scenario.consolidated), payeGrandfathered: Boolean(scenario.payeGrandfathered), taxFilingStatus: scenario.taxFilingStatus || 'single', spouseAgiDollars: Number(scenario.spouseAgiDollars) || 0, idrMonths: Math.max(0, Math.round(Number(scenario.idrMonths) || 0)) };
}
function warningsForScenario(s) { const warnings = []; if (!s.firstBorrowedDate) warnings.push('Some legacy-plan eligibility can change when first-borrowed dates are unknown.'); if (s.loanProgram === 'ffel') warnings.push('FFEL loans may require consolidation for many Direct Loan plans.'); return warnings; }
function qualityForScenario(scenario) { let score = 0; for (const key of ['balanceDollars','interestRatePercent','agiDollars','familySize','loanProgram','firstBorrowedDate']) if (scenario[key] !== undefined && scenario[key] !== '') score += 1; return score >= 6 ? 'detailed' : score >= 4 ? 'improved' : 'basic'; }
function dollarsToCentsSafe(value) { return Math.max(0, Math.round((Number(value) || 0) * 100)); }
function clamp(value, min, max) { return Math.min(max, Math.max(min, Number(value) || 0)); }
function unique(values) { return [...new Set(values)]; }
