// @ts-check

/**
 * Calculate a fixed amortizing monthly payment in integer cents.
 * @param {number} principalCents
 * @param {number} annualRateBasisPoints
 * @param {number} months
 * @returns {number}
 */
export function amortizedPaymentCents(principalCents, annualRateBasisPoints, months) {
  if (!Number.isInteger(principalCents) || principalCents < 0) throw new TypeError('Principal must be nonnegative integer cents.');
  if (!Number.isInteger(annualRateBasisPoints) || annualRateBasisPoints < 0) throw new TypeError('APR must be nonnegative basis points.');
  if (!Number.isInteger(months) || months < 1) throw new TypeError('Months must be a positive integer.');
  if (principalCents === 0) return 0;
  const monthlyRate = annualRateBasisPoints / 10000 / 12;
  if (monthlyRate === 0) return Math.ceil(principalCents / months);
  return Math.round(principalCents * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months)));
}

/**
 * Estimate total paid for a fixed term, allowing final payment rounding effects.
 * @param {number} monthlyPaymentCents
 * @param {number} months
 * @returns {number}
 */
export function termTotalCents(monthlyPaymentCents, months) {
  return monthlyPaymentCents * months;
}
