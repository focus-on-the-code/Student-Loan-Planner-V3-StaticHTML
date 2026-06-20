// @ts-check

/**
 * Format a number as US currency for UI display.
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(Number.isFinite(value) ? value : 0);
}

/** @param {number} cents */
export function formatCents(cents) {
  return formatCurrency(cents / 100);
}
