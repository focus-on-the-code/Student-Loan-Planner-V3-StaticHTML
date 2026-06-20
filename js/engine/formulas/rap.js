// @ts-check
export function rapPayment({ agiDollars = 0, familySize = 1 }) {
  const adjusted = Math.max(0, agiDollars - Math.max(0, familySize - 1) * 5000);
  const percent = adjusted < 30000 ? 0.01 : adjusted < 60000 ? 0.03 : adjusted < 100000 ? 0.05 : 0.08;
  return { monthlyPaymentCents: Math.max(1000, Math.round(adjusted * percent / 12 * 100)), adjustedIncomeDollars: adjusted, percent };
}
