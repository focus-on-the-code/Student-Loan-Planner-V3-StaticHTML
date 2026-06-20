// @ts-check

export const baselineScenarioFixture = Object.freeze({
  schemaVersion: 1,
  mode: 'quick',
  agiCents: 6500000,
  familySize: 1,
  povertyRegion: 'contiguous',
  loans: Object.freeze([
    Object.freeze({
      id: 'loan-1',
      program: 'direct',
      balanceCents: 5500000,
      interestRateBasisPoints: 680
    })
  ])
});
