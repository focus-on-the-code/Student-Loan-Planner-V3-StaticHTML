// @ts-check
export function accrueMonthlyInterestCents(balanceCents, annualInterestRateBps) { return Math.max(0, Math.round(balanceCents * (annualInterestRateBps / 10000) / 12)); }
