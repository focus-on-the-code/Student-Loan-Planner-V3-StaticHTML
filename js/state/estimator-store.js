// @ts-check

/**
 * @typedef {Object} PreviewState
 * @property {number} balance
 * @property {number} annualRate
 */

/** @type {PreviewState} */
const state = {
  balance: 55000,
  annualRate: 6.8
};

/**
 * Update the temporary Pass 1 preview state.
 * This is intentionally not the production repayment engine.
 * @param {Partial<PreviewState>} patch
 * @returns {PreviewState}
 */
export function updatePreviewState(patch) {
  if (typeof patch.balance === 'number' && Number.isFinite(patch.balance)) {
    state.balance = Math.max(0, patch.balance);
  }
  if (typeof patch.annualRate === 'number' && Number.isFinite(patch.annualRate)) {
    state.annualRate = Math.min(30, Math.max(0, patch.annualRate));
  }
  return getPreviewState();
}

/**
 * Get a copy of the temporary preview state.
 * @returns {PreviewState}
 */
export function getPreviewState() {
  return { ...state };
}
