import test from 'node:test';
import assert from 'node:assert/strict';
import { addCents, centsToDollars, dollarsToCents, formatCents, monthlyInterestCents, multiplyCents } from '../../js/engine/money.js';

test('converts dollars to integer cents', () => {
  assert.equal(dollarsToCents('$1,234.56'), 123456);
  assert.equal(dollarsToCents(12.345), 1235);
});

test('converts integer cents to dollars', () => {
  assert.equal(centsToDollars(123456), 1234.56);
});

test('adds only integer cents', () => {
  assert.equal(addCents(1, 2, 3), 6);
  assert.throws(() => addCents(1.2), /integer cents/);
});

test('multiplies cents with currency rounding', () => {
  assert.equal(multiplyCents(101, 0.5), 51);
});

test('calculates monthly interest from APR basis points', () => {
  assert.equal(monthlyInterestCents(5500000, 680), 31167);
});

test('formats cents as USD', () => {
  assert.equal(formatCents(31167), '$311.67');
});
