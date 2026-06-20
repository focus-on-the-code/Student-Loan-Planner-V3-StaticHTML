// @ts-check
export function normalizePaymentHistory(scenario = {}) { return { pslfMonths: Math.max(0, Math.min(120, Math.round(Number(scenario.pslfMonths) || 0))), idrMonths: Math.max(0, Math.round(Number(scenario.idrMonths) || 0)), publicService: Boolean(scenario.publicService) }; }
