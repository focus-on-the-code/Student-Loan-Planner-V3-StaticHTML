// @ts-check
export function estimateForgivenessTax({ forgivenessCents = 0, taxable = false, marginalRate = 0.22 }) { return taxable ? Math.round(forgivenessCents * marginalRate) : 0; }
