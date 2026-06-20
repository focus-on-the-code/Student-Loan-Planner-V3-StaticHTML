// @ts-check

export const planCopy = Object.freeze({
  rap: { name: 'Repayment Assistance Plan (RAP)', summary: 'Income-based planning estimate with interest protection and principal-support estimates where applicable.' },
  'tiered-standard': { name: 'Tiered Standard', summary: 'Balance-tiered fixed-payment estimate for post-transition borrowers.' },
  standard: { name: 'Standard Repayment', summary: 'Fixed amortizing payment over the applicable standard term.' },
  graduated: { name: 'Graduated Repayment', summary: 'Payments start lower and rise over time within the modeled term.' },
  extended: { name: 'Extended Repayment', summary: 'Longer fixed or graduated repayment estimate for borrowers meeting balance/program thresholds.' },
  'ibr-10': { name: 'IBR 10%', summary: 'Income-Based Repayment estimate using 10% of discretionary income and a 20-year term.' },
  'ibr-15': { name: 'IBR 15%', summary: 'Income-Based Repayment estimate using 15% of discretionary income and a 25-year term.' },
  paye: { name: 'PAYE', summary: 'Legacy income-driven plan estimate with grandfathering-sensitive eligibility.' },
  icr: { name: 'ICR', summary: 'Income-Contingent Repayment estimate using income share and factor-table scaffolding.' },
  'ffel-income-sensitive': { name: 'FFEL Income-Sensitive', summary: 'FFEL-only estimate with lender-formula limitations.' },
  perkins: { name: 'Perkins Repayment', summary: 'Estimator-level Perkins repayment information with school-servicing caveats.' },
  'alternative-repayment': { name: 'Alternative Repayment', summary: 'Informational only; no custom payment formula is invented.' },
  'save-repaye-historical': { name: 'SAVE/REPAYE', summary: 'Historical or unavailable status unless current official rules restore availability.' }
});
