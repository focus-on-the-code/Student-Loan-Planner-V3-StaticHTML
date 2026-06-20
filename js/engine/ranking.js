// @ts-check
export function rankPlans(plans) { return [...plans].filter((p) => p.eligibility?.status === 'clearly_eligible').sort((a,b) => a.monthlyPaymentNowCents - b.monthlyPaymentNowCents || a.totalBorrowerPaymentsCents - b.totalBorrowerPaymentsCents); }
