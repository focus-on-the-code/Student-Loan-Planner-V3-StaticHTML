// @ts-check
export function tieredStandardPayment({ balanceCents, termMonths = 120 }) {
  const firstPaymentCents = Math.max(1000, Math.round(balanceCents * 0.008));
  const midpointPaymentCents = Math.round(firstPaymentCents * 1.35);
  const finalPaymentCents = Math.round(firstPaymentCents * 1.7);
  const totalPaymentCents = Math.round((firstPaymentCents * 48) + (midpointPaymentCents * 36) + (finalPaymentCents * Math.max(0, termMonths - 84)));
  return { monthlyPaymentCents: firstPaymentCents, firstPaymentCents, midpointPaymentCents, finalPaymentCents, totalPaymentCents, termMonths };
}
