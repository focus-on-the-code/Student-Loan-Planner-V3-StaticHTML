// @ts-check
export function allocatePayment({ beginningBalanceCents, interestCents, paymentCents }) {
  const interestPaidCents = Math.min(paymentCents, interestCents);
  const principalPaidCents = Math.min(beginningBalanceCents, Math.max(0, paymentCents - interestPaidCents));
  return { interestPaidCents, principalPaidCents, unpaidInterestCents: Math.max(0, interestCents - interestPaidCents), endingBalanceCents: Math.max(0, beginningBalanceCents - principalPaidCents) };
}
