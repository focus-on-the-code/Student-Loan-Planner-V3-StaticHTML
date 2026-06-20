// @ts-check

export const appConfig = Object.freeze({
  appName: 'Student Loan Repayment Plan Estimator',
  schemaVersion: 1,
  activeRuleSetId: '2026-07-01',
  rulesReviewedOn: '2026-06-18',
  undoHistoryLimit: 20,
  inputDebounceMs: 350,
  stalenessThresholdMonths: 12,
  releaseStatus: 'public-beta',
  estimateModes: Object.freeze(['quick', 'detailed']),
  defaultMode: 'quick'
});
