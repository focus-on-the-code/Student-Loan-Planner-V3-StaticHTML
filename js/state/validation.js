// @ts-check
export function validateScenario(scenario = {}) {
  const errors = [], warnings = [], fields = {};
  reqNumber('balanceDollars', 'Loan balance must be zero or greater.', 0);
  reqNumber('interestRatePercent', 'Interest rate must be between 0 and 30.', 0, 30);
  reqNumber('agiDollars', 'AGI must be zero or greater.', 0);
  reqNumber('familySize', 'Family size must be at least 1.', 1);
  if (scenario.firstBorrowedDate && !/^\d{4}-\d{2}-\d{2}$/.test(scenario.firstBorrowedDate)) add('firstBorrowedDate','Use YYYY-MM-DD for first borrowed date.');
  if (scenario.pslfMonths > 120) add('pslfMonths','PSLF qualifying payments cannot exceed 120.');
  if (!scenario.firstBorrowedDate) warnings.push('Unknown first-borrowed date may reduce eligibility confidence.');
  return { valid: errors.length === 0, errors, warnings, fields };
  function reqNumber(key, message, min, max = Infinity) { const n = Number(scenario[key]); if (!Number.isFinite(n) || n < min || n > max) add(key, message); }
  function add(key, message) { fields[key] = message; errors.push(message); }
}
