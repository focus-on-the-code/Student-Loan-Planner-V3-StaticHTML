import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScenario } from '../../js/engine/calculate-scenario.js';
import { baselineScenarioFixture as baselineScenario } from '../fixtures/baseline-scenario.js';

test('calculates the complete plan register', () => {
  const result = calculateScenario(baselineScenario);
  assert.equal(result.plans.length, 13);
  assert.ok(result.plans.every((plan) => plan.eligibility?.status));
  assert.ok(result.topPlans.length <= 3);
});

test('sorts top plans by current monthly payment', () => {
  const result = calculateScenario(baselineScenario);
  const payments = result.topPlans.map((plan) => plan.monthlyPaymentNowCents);
  assert.deepEqual(payments, [...payments].sort((a, b) => a - b));
});
