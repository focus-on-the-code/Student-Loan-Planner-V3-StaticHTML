import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScenario } from '../../js/engine/calculate-scenario.js';

const scenario = { balanceDollars: 55000, interestRatePercent: 6.8, agiDollars: 65000, familySize: 1, povertyRegion: 'contiguous', pslfMonths: 24, publicService: true };

test('calculates a plan comparison', () => {
  const result = calculateScenario(scenario);
  assert.equal(result.plans.length, 8);
  assert.ok(result.topPlans.length >= 1);
  assert.equal(result.estimateQuality, 'improved');
});

test('sorts top plans by current monthly payment', () => {
  const result = calculateScenario(scenario);
  const payments = result.topPlans.map((plan) => plan.monthlyPaymentNowCents);
  assert.deepEqual(payments, [...payments].sort((a, b) => a - b));
});
