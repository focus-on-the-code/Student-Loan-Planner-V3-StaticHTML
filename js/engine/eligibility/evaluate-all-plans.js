// @ts-check
import { planDefinitions } from '../../rules/versions/2026-07-01/plans.js';
import { evaluatePlanEligibility } from './evaluate-plan.js';
export function evaluateAllPlans(scenario) { return planDefinitions.map((plan) => evaluatePlanEligibility(plan, scenario)); }
