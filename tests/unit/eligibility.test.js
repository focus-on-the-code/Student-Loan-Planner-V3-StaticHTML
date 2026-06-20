import test from 'node:test'; import assert from 'node:assert/strict';
import { evaluateAllPlans } from '../../js/engine/eligibility/evaluate-all-plans.js';
import { baselineScenarioFixture as scenario } from '../fixtures/baseline-scenario.js';
test('evaluates eligibility for every registered plan', () => { const results = evaluateAllPlans(scenario); assert.equal(results.length, 13); assert.ok(results.some(r => r.status === 'clearly_eligible')); });
