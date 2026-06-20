import test from 'node:test'; import assert from 'node:assert/strict';
import { simulatePlan } from '../../js/engine/simulation/simulate-plan.js';
test('simulates monthly balance records', () => { const p = simulatePlan({ planId:'x', name:'X', summary:'', balanceCents:100000, annualInterestRateBps:0, monthlyPaymentCents:10000, termMonths:12, eligibility:{status:'clearly_eligible'} }); assert.equal(p.monthly.length, 10); assert.equal(p.yearly[0].balanceCents, 0); });
