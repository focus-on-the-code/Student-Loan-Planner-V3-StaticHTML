import test from 'node:test'; import assert from 'node:assert/strict';
import { remainingQualifyingPayments } from '../../js/engine/history/qualifying-payments.js';
test('120 PSLF payments leaves zero remaining', () => assert.equal(remainingQualifyingPayments(120), 0));
