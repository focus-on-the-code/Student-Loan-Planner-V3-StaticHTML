// @ts-check

/**
 * Convert a dollar amount to integer cents using normal currency rounding.
 * @param {number|string} dollars
 * @returns {number}
 */
export function dollarsToCents(dollars) {
  const value = typeof dollars === 'string' ? Number(dollars.replace(/[$,\s]/g, '')) : dollars;
  if (!Number.isFinite(value)) throw new TypeError('Dollar amount must be finite.');
  return Math.round(value * 100);
}

/**
 * Convert integer cents to dollars.
 * @param {number} cents
 * @returns {number}
 */
export function centsToDollars(cents) {
  assertIntegerCents(cents);
  return cents / 100;
}

/**
 * Add integer-cent amounts.
 * @param {...number} amounts
 * @returns {number}
 */
export function addCents(...amounts) {
  return amounts.reduce((total, amount) => {
    assertIntegerCents(amount);
    return total + amount;
  }, 0);
}

/**
 * Multiply cents by a decimal rate and round back to integer cents.
 * @param {number} cents
 * @param {number} multiplier
 * @returns {number}
 */
export function multiplyCents(cents, multiplier) {
  assertIntegerCents(cents);
  if (!Number.isFinite(multiplier)) throw new TypeError('Multiplier must be finite.');
  return Math.round(cents * multiplier);
}

/**
 * Calculate monthly simple interest in cents from a principal and APR basis points.
 * @param {number} principalCents
 * @param {number} annualRateBasisPoints
 * @returns {number}
 */
export function monthlyInterestCents(principalCents, annualRateBasisPoints) {
  assertIntegerCents(principalCents);
  if (!Number.isInteger(annualRateBasisPoints) || annualRateBasisPoints < 0) {
    throw new TypeError('Annual rate basis points must be a nonnegative integer.');
  }
  return Math.round(principalCents * (annualRateBasisPoints / 10000) / 12);
}

/**
 * Format integer cents as US currency for UI/test display. Engine calculations should keep cents.
 * @param {number} cents
 * @returns {string}
 */
export function formatCents(cents) {
  assertIntegerCents(cents);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

/**
 * Assert a value is integer cents.
 * @param {number} cents
 */
export function assertIntegerCents(cents) {
  if (!Number.isInteger(cents)) throw new TypeError('Amount must be integer cents.');
}
