// @ts-check
export function classifyTransitionCohort(scenario) {
  const date = scenario.firstDisbursementDate || scenario.firstBorrowedDate;
  if (!date || date === 'unknown') return 'unknown';
  return date >= '2026-07-01' ? 'post-2026-07-01' : 'pre-2026-07-01';
}
export function estimateHistoryImpact(scenario) {
  const months = Number(scenario.idrMonths || 0);
  if (scenario.consolidated === 'yes') return { outcome: 'uncertain', estimatedCreditedMonths: null, explanation: 'Consolidation history can require official count review.', missingFields: ['official payment count'], sourceIds: ['fsa-repayment-plans'] };
  return { outcome: months > 0 ? 'preserved' : 'not_applicable', estimatedCreditedMonths: months, explanation: 'Existing months are carried forward as entered for estimator purposes.', missingFields: [], sourceIds: ['fsa-repayment-plans'] };
}
