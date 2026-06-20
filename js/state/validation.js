// @ts-check

export function validateScenario(scenario) {
  const errors = [];
  if (!(scenario.balanceDollars > 0)) errors.push('Enter a federal loan balance greater than $0.');
  if (!(scenario.interestRatePercent >= 0)) errors.push('Enter a nonnegative interest rate.');
  if (!(scenario.familySize >= 1)) errors.push('Family size must be at least 1.');
  return { valid: errors.length === 0, errors };
}
