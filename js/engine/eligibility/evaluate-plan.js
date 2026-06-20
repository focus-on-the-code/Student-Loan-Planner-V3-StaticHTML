// @ts-check
import { reasonCodes } from './reason-codes.js';

export function evaluatePlanEligibility(plan, scenario) {
  const program = scenario.loanProgram || 'direct';
  const missingFields = plan.requiredFields.filter((field) => scenario[field] === undefined || scenario[field] === null || scenario[field] === '' || scenario[field] === 'unknown');
  if (plan.availabilityStatus === 'unavailable') return result(plan, 'unavailable', ['Plan is historical or unavailable under the active rules version.'], [], reasonCodes.unavailable);
  if (plan.category === 'informational') return result(plan, 'potentially_eligible', ['Informational path only; no payment formula is invented.'], missingFields, reasonCodes.informational);
  if (plan.id === 'extended' && Number(scenario.balanceDollars || 0) < 30000) return result(plan, 'potentially_eligible', ['Extended repayment usually requires threshold debt; confirm exact program-specific balance.'], ['program-specific eligible debt'], reasonCodes.threshold);
  if (plan.id === 'ffel-income-sensitive' && program !== 'ffel') return result(plan, 'ineligible', ['FFEL Income-Sensitive repayment is for FFEL loans.'], [], reasonCodes.programMismatch);
  if (plan.id === 'perkins' && program !== 'perkins') return result(plan, 'ineligible', ['Perkins repayment applies to Perkins loans.'], [], reasonCodes.programMismatch);
  if (missingFields.length) return result(plan, 'potentially_eligible', ['More borrower or loan-history facts are needed.'], missingFields, reasonCodes.missingFacts);
  if (['paye','icr','ibr-10','ibr-15','rap'].includes(plan.id)) return result(plan, 'potentially_eligible', ['Eligibility depends on detailed dates, transition rules, and loan history.'], missingFields, reasonCodes.missingFacts);
  return result(plan, 'clearly_eligible', ['Appears eligible based on high-level entries.'], [], reasonCodes.clearlyEligible);
}

function result(plan, status, reasons, missingFields, reasonCode) {
  return { planId: plan.id, status, reasons, missingFields, reasonCodes: [reasonCode], sourceIds: plan.sourceIds };
}
