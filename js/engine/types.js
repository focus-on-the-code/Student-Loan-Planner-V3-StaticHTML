// @ts-check

/**
 * @typedef {'contiguous'|'alaska'|'hawaii'} PovertyRegion
 */

/**
 * @typedef {Object} MoneyAmount
 * @property {number} cents Integer cents.
 */

/**
 * @typedef {Object} SourceRecord
 * @property {string} id
 * @property {string} title
 * @property {string} publisher
 * @property {string} url
 * @property {string} retrievedOn
 * @property {string=} publishedOn
 * @property {string=} effectiveFrom
 * @property {'statute'|'regulation'|'federal-register'|'agency-guidance'|'annual-data'|'technical-doc'} sourceType
 * @property {string=} notes
 */

/**
 * @typedef {Object} RuleSetMetadata
 * @property {string} id
 * @property {string} effectiveFrom
 * @property {string|null} effectiveThrough
 * @property {string} reviewedOn
 * @property {'draft'|'active'|'superseded'} status
 * @property {string[]} sourceIds
 * @property {string[]} notes
 */

/**
 * @typedef {Object} EligibilityResult
 * @property {string} planId
 * @property {'clearly_eligible'|'potentially_eligible'|'unavailable'|'ineligible'} status
 * @property {string[]} reasons
 * @property {string[]} missingFields
 * @property {string[]} sourceIds
 */

/**
 * @typedef {Object} LoanSummary
 * @property {string} id
 * @property {'direct'|'ffel'|'perkins'|'private'|'unknown'} program
 * @property {number} balanceCents
 * @property {number} interestRateBasisPoints
 */

/**
 * @typedef {Object} Scenario
 * @property {1} schemaVersion
 * @property {'quick'|'detailed'} mode
 * @property {number} agiCents
 * @property {number} familySize
 * @property {PovertyRegion} povertyRegion
 * @property {LoanSummary[]} loans
 */

export const TYPE_MODULE_VERSION = '2026-06-20-milestone-2';
