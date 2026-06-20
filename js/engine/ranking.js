// @ts-check
const DEFAULT_PLAN_ORDER = Object.freeze(['rap','tiered-standard','standard','graduated','extended','ibr-10','ibr-15','paye','icr','ffel-income-sensitive','perkins','alternative-repayment','save-repaye-historical']);
export function rankPlans(plans) {
  return [...plans]
    .filter((plan) => plan.eligibility?.status === 'clearly_eligible' && plan.projectedResolutionMonth !== 0)
    .sort((a, b) => a.monthlyPaymentNowCents - b.monthlyPaymentNowCents || a.totalBorrowerPaymentsCents - b.totalBorrowerPaymentsCents || order(a.planId) - order(b.planId));
}
function order(planId) { const index = DEFAULT_PLAN_ORDER.indexOf(planId); return index === -1 ? Number.MAX_SAFE_INTEGER : index; }
