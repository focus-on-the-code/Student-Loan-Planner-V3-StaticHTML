// @ts-check
export const eligibilityRules = Object.freeze({
  'broad-federal': 'Federal loan paths shown for Direct/FFEL/Perkins at estimator level unless a specific plan narrows eligibility.',
  'extended-threshold': 'Extended repayment generally requires sufficient eligible debt; this estimator flags under-threshold borrowers as potentially eligible with a warning.',
  'legacy-ibr-10': 'IBR 10% eligibility depends on historical new-borrower facts.',
  'legacy-ibr-15': 'IBR 15% eligibility depends on historical borrower cohort facts.',
  'paye-grandfathering': 'PAYE access depends on grandfathering and loan-history facts.',
  'icr-pathway': 'ICR access can differ for Parent PLUS consolidation pathways.',
  'ffel-only': 'FFEL Income-Sensitive repayment applies only to FFEL loans.',
  'perkins-only': 'Perkins repayment applies to Perkins loans.',
  'save-unavailable': 'SAVE/REPAYE is displayed as historical/unavailable under active rules unless official rules restore availability.'
});
