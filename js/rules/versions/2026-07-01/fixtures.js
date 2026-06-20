// @ts-check
export const fixtures = Object.freeze({
  quickDirect: scenario('quick-direct', 'direct', 55000, 6.8, 65000, 1, '2018-09-01'),
  detailedDirect: scenario('detailed-direct', 'direct', 72000, 6.4, 82000, 2, '2024-08-15'),
  ffel: scenario('ffel', 'ffel', 28000, 5.8, 54000, 1, '2009-09-01'),
  parentPlus: scenario('parent-plus', 'parent-plus', 42000, 7.2, 90000, 2, '2022-08-01'),
  consolidatedParentPlus: Object.freeze({ ...scenario('consolidated-parent-plus', 'parent-plus', 64000, 7.1, 98000, 2, '2023-07-01'), consolidated: 'yes', parentPlusHistory: 'yes' }),
  perkins: scenario('perkins', 'perkins', 9000, 5, 38000, 1, '2012-09-01'),
  lowIncome: scenario('low-income', 'direct', 36000, 5.5, 18000, 2, '2021-09-01'),
  zeroDiscretionary: scenario('zero-discretionary', 'direct', 30000, 4.9, 0, 1, '2020-09-01'),
  dateBoundaryPre: scenario('date-boundary-pre', 'direct', 30000, 5, 55000, 1, '2026-06-30'),
  dateBoundaryPost: scenario('date-boundary-post', 'direct', 30000, 5, 55000, 1, '2026-07-01'),
  extendedThreshold: scenario('extended-threshold', 'direct', 30000, 5, 55000, 1, '2020-01-01'),
  pslfNear120: Object.freeze({ ...scenario('pslf-near-120', 'direct', 45000, 6.1, 61000, 1, '2016-09-01'), pslfMonths: 110, publicService: true })
});
export const baselineScenarioFixture = fixtures.quickDirect;
function scenario(id, loanProgram, balanceDollars, interestRatePercent, agiDollars, familySize, firstDisbursementDate) { return Object.freeze({ schemaVersion: 1, id, mode: 'quick', loanProgram, balanceDollars, interestRatePercent, agiDollars, familySize, povertyRegion: 'contiguous', firstDisbursementDate, pslfMonths: 0, publicService: false }); }
