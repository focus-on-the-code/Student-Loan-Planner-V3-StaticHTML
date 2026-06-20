// @ts-check
export function remainingQualifyingPayments(current = 0, target = 120) { return Math.max(0, target - Math.max(0, Math.round(current))); }
export function projectedCompletionMonth(current = 0, target = 120) { return remainingQualifyingPayments(current, target); }
