// @ts-check

/** @type {import('../engine/types.js').RuleSetMetadata} */
export const ruleSetMetadata = Object.freeze({
  id: '2026-07-01',
  effectiveFrom: '2026-07-01',
  effectiveThrough: null,
  reviewedOn: '2026-06-18',
  status: 'active',
  sourceIds: Object.freeze(['fr-2026-poverty-guidelines', 'fsa-repayment-plans']),
  notes: Object.freeze(['Milestone 2 defines metadata and annual-data scaffolding only; repayment formulas follow in later milestones.'])
});

/**
 * Return active rule metadata for a date. Milestone 2 has one active ruleset.
 * @param {string|Date} _date
 * @returns {import('../engine/types.js').RuleSetMetadata}
 */
export function selectRuleSet(_date = new Date()) {
  return ruleSetMetadata;
}

/**
 * Determine whether rules are older than the allowed review window.
 * @param {string|Date} currentDate
 * @param {number} maxAgeMonths
 * @returns {boolean}
 */
export function isRuleReviewStale(currentDate = new Date(), maxAgeMonths = 12) {
  const current = new Date(currentDate);
  const reviewed = new Date(`${ruleSetMetadata.reviewedOn}T00:00:00Z`);
  const staleAfter = new Date(reviewed);
  staleAfter.setUTCMonth(staleAfter.getUTCMonth() + maxAgeMonths);
  return current > staleAfter;
}
