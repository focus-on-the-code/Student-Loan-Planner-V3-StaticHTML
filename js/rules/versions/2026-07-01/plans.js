// @ts-check

export const planDefinitions = Object.freeze([
  plan('rap', 'Repayment Assistance Plan (RAP)', 'income-driven', 'potential', 360, 'rap', 'rap-transition', 360, false, 'interest-protection-and-principal-support', ['fsa-repayment-plans'], ['balanceDollars','interestRatePercent','agiDollars','familySize','transitionCohort']),
  plan('tiered-standard', 'Tiered Standard', 'fixed', 'current', 120, 'tiered-standard', 'direct-or-transition', null, false, 'ordinary-interest', ['fsa-repayment-plans'], ['balanceDollars','interestRatePercent']),
  plan('standard', 'Standard Repayment', 'fixed', 'current', 120, 'fixed-payment', 'broad-federal', null, false, 'ordinary-interest', ['fsa-repayment-plans'], ['balanceDollars','interestRatePercent']),
  plan('graduated', 'Graduated Repayment', 'fixed', 'current', 120, 'graduated-payment', 'broad-federal', null, false, 'ordinary-interest', ['fsa-repayment-plans'], ['balanceDollars','interestRatePercent']),
  plan('extended', 'Extended Repayment', 'fixed', 'current', 300, 'fixed-payment', 'extended-threshold', null, false, 'ordinary-interest', ['fsa-repayment-plans'], ['balanceDollars','interestRatePercent','loanProgram']),
  plan('ibr-10', 'IBR 10%', 'income-driven', 'legacy', 240, 'ibr-10', 'legacy-ibr-10', 240, true, 'ordinary-interest', ['fsa-repayment-plans'], ['agiDollars','familySize','povertyRegion','firstBorrowedDate']),
  plan('ibr-15', 'IBR 15%', 'income-driven', 'legacy', 300, 'ibr-15', 'legacy-ibr-15', 300, true, 'ordinary-interest', ['fsa-repayment-plans'], ['agiDollars','familySize','povertyRegion','firstBorrowedDate']),
  plan('paye', 'PAYE', 'income-driven', 'legacy', 240, 'paye', 'paye-grandfathering', 240, true, 'ordinary-interest', ['fsa-repayment-plans'], ['agiDollars','familySize','povertyRegion','payeGrandfathered']),
  plan('icr', 'ICR', 'income-driven', 'legacy', 300, 'icr', 'icr-pathway', 300, false, 'ordinary-interest', ['fsa-icr-plan'], ['agiDollars','familySize','povertyRegion','parentPlusHistory']),
  plan('ffel-income-sensitive', 'FFEL Income-Sensitive', 'income-driven', 'limited', 120, 'income-sensitive', 'ffel-only', null, false, 'lender-limited', ['fsa-repayment-plans'], ['loanProgram']),
  plan('perkins', 'Perkins Repayment', 'fixed', 'limited', 120, 'perkins', 'perkins-only', null, false, 'school-serviced', ['fsa-repayment-plans'], ['loanProgram']),
  plan('alternative-repayment', 'Alternative Repayment', 'informational', 'informational', null, 'informational', 'servicer-discretion', null, false, 'not-modeled', ['fsa-repayment-plans'], []),
  plan('save-repaye-historical', 'SAVE/REPAYE', 'historical', 'unavailable', null, 'historical', 'save-unavailable', null, false, 'historical', ['fsa-repayment-plans'], [])
]);

function plan(id, displayName, category, availabilityStatus, termMonths, formulaId, eligibilityRuleId, forgivenessTermMonths, standardCap, interestTreatment, sourceIds, requiredFields) {
  return Object.freeze({ id, displayName, category, availabilityStatus, termMonths, formulaId, eligibilityRuleId, forgivenessTermMonths, standardCap, interestTreatment, sourceIds: Object.freeze(sourceIds), requiredFields: Object.freeze(requiredFields) });
}

export function getPlanDefinition(planId) { return planDefinitions.find((plan) => plan.id === planId) ?? null; }
