// @ts-check

const TABLES = Object.freeze({
  contiguous: Object.freeze({ base: 15960, additional: 5680 }),
  alaska: Object.freeze({ base: 19950, additional: 7100 }),
  hawaii: Object.freeze({ base: 18360, additional: 6530 })
});

export const povertyGuidelines2026 = Object.freeze({
  year: 2026,
  reviewedOn: '2026-06-20',
  sourceIds: Object.freeze(['fr-2026-poverty-guidelines']),
  regions: TABLES
});

/**
 * Return the annual 100% HHS poverty guideline in dollars.
 * @param {import('../../../engine/types.js').PovertyRegion} region
 * @param {number} familySize
 * @returns {number}
 */
export function povertyGuidelineDollars(region, familySize) {
  const table = TABLES[region];
  if (!table) throw new RangeError(`Unknown poverty region: ${region}`);
  if (!Number.isInteger(familySize) || familySize < 1) throw new RangeError('Family size must be a positive integer.');
  return table.base + table.additional * Math.max(0, familySize - 1);
}

/**
 * Return a percentage of the annual poverty guideline in integer cents.
 * @param {import('../../../engine/types.js').PovertyRegion} region
 * @param {number} familySize
 * @param {number} percent
 * @returns {number}
 */
export function povertyGuidelineCentsAtPercent(region, familySize, percent) {
  if (!Number.isFinite(percent) || percent < 0) throw new RangeError('Percent must be nonnegative.');
  return Math.round(povertyGuidelineDollars(region, familySize) * 100 * (percent / 100));
}
