// @ts-check
export function incomeSensitivePayment({ agiDollars = 0, balanceCents = 0 }) {
  const monthlyPaymentCents = Math.max(5000, Math.min(Math.round((agiDollars * 0.12 / 12) * 100), Math.round(balanceCents * 0.02)));
  return { monthlyPaymentCents, termMonths: 120 };
}
