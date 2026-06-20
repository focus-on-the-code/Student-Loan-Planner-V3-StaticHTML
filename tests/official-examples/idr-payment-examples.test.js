import test from 'node:test'; import assert from 'node:assert/strict';
import { incomeDrivenPayment } from '../../js/engine/formulas/income-driven.js';
test('zero discretionary income yields zero IDR payment', () => { assert.equal(incomeDrivenPayment({ agiDollars:10000, familySize:1, povertyRegion:'contiguous' }).monthlyPaymentCents, 0); });
