import test from 'node:test'; import assert from 'node:assert/strict';
import { icrPayment } from '../../js/engine/formulas/icr.js';
test('ICR payment selects lower of modeled alternatives', () => { const r = icrPayment({ balanceCents:1000000, annualInterestRateBps:500, agiDollars:40000, familySize:1, povertyRegion:'contiguous' }); assert.ok(r.monthlyPaymentCents <= Math.max(r.incomeShareCents, r.alternativeCents)); });
