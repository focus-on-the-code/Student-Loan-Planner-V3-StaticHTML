import test from 'node:test';
import assert from 'node:assert/strict';
import { amortizedPaymentCents, termTotalCents } from '../../js/engine/formulas/amortization.js';

test('calculates fixed amortized payment', () => {
  assert.equal(amortizedPaymentCents(5500000, 680, 120), 63294);
});

test('handles zero-interest fixed payment', () => {
  assert.equal(amortizedPaymentCents(120000, 0, 12), 10000);
});

test('calculates term total', () => {
  assert.equal(termTotalCents(10000, 12), 120000);
});
