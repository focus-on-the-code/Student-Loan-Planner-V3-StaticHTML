// @ts-check

/** @type {import('../engine/types.js').SourceRecord[]} */
export const sourceRecords = Object.freeze([
  Object.freeze({
    id: 'fr-2026-poverty-guidelines',
    title: 'Annual Update of the HHS Poverty Guidelines',
    publisher: 'Federal Register',
    url: 'https://www.federalregister.gov/documents/2026/01/15/2026-00755/annual-update-of-the-hhs-poverty-guidelines',
    retrievedOn: '2026-06-20',
    publishedOn: '2026-01-15',
    effectiveFrom: '2026-01-15',
    sourceType: 'annual-data',
    notes: 'Primary source for 2026 HHS poverty guidelines used by Milestone 2 poverty fixtures.'
  }),
  Object.freeze({
    id: 'fsa-repayment-plans',
    title: 'Federal Student Aid Repayment Plans',
    publisher: 'Federal Student Aid',
    url: 'https://studentaid.gov/manage-loans/repayment/plans',
    retrievedOn: '2026-06-20',
    sourceType: 'agency-guidance',
    notes: 'Placeholder source registry entry for repayment-plan guidance; formulas are not implemented in Milestone 2.'
  }),
  Object.freeze({
    id: 'fsa-icr-plan',
    title: 'Income-Contingent Repayment Plan',
    publisher: 'Federal Student Aid',
    url: 'https://studentaid.gov/manage-loans/repayment/plans/income-driven',
    retrievedOn: '2026-06-20',
    sourceType: 'agency-guidance',
    notes: 'Placeholder source registry entry for future ICR factor-table implementation.'
  })
]);

/**
 * Find a source by id.
 * @param {string} id
 * @returns {import('../engine/types.js').SourceRecord|null}
 */
export function findSourceById(id) {
  return sourceRecords.find((source) => source.id === id) ?? null;
}
