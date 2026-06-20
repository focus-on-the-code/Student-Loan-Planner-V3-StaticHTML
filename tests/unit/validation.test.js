import test from 'node:test'; import assert from 'node:assert/strict';
import { validateScenario } from '../../js/state/validation.js';
test('validates scenario fields', () => { assert.equal(validateScenario({ balanceDollars:-1, interestRatePercent:99, agiDollars:0, familySize:1 }).valid, false); });
