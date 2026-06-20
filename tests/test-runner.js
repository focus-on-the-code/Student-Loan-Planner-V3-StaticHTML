// @ts-check

import { dollarsToCents, centsToDollars, monthlyInterestCents, multiplyCents } from '../js/engine/money.js';
import { povertyGuidelineDollars, povertyGuidelineCentsAtPercent } from '../js/rules/annual/2026/poverty-guidelines.js';
import { findSourceById } from '../js/rules/sources.js';
import { isRuleReviewStale, selectRuleSet } from '../js/rules/rule-version.js';

const tests = [];

function test(name, fn) { tests.push({ name, fn }); }
function equal(actual, expected) {
  if (actual !== expected) throw new Error(`Expected ${expected}, received ${actual}`);
}
function ok(value) {
  if (!value) throw new Error('Expected truthy value.');
}

test('money converts dollars to cents', () => equal(dollarsToCents('$1,234.56'), 123456));
test('money converts cents to dollars', () => equal(centsToDollars(123456), 1234.56));
test('money multiplies cents with rounding', () => equal(multiplyCents(101, 0.5), 51));
test('money calculates monthly interest', () => equal(monthlyInterestCents(5500000, 680), 31167));
test('poverty guideline contiguous family 1', () => equal(povertyGuidelineDollars('contiguous', 1), 15960));
test('poverty guideline alaska family 2', () => equal(povertyGuidelineDollars('alaska', 2), 27050));
test('poverty guideline hawaii additional person', () => equal(povertyGuidelineDollars('hawaii', 9), 70600));
test('poverty guideline percent returns cents', () => equal(povertyGuidelineCentsAtPercent('contiguous', 1, 150), 2394000));
test('source registry finds poverty source', () => ok(findSourceById('fr-2026-poverty-guidelines')));
test('rule selection returns active metadata', () => equal(selectRuleSet('2026-07-01').id, '2026-07-01'));
test('rule staleness detects current baseline freshness', () => equal(isRuleReviewStale('2026-06-20'), false));

const results = [];
for (const item of tests) {
  try {
    item.fn();
    results.push({ name: item.name, status: 'pass' });
  } catch (error) {
    results.push({ name: item.name, status: 'fail', message: error instanceof Error ? error.message : String(error) });
  }
}

const passed = results.filter((result) => result.status === 'pass').length;
const failed = results.length - passed;
window.__TEST_RESULTS__ = { total: results.length, passed, failed, results };

const summary = document.getElementById('summary');
if (summary) {
  summary.textContent = `${passed}/${results.length} tests passed`;
  summary.className = failed === 0 ? 'pass' : 'fail';
}
const list = document.getElementById('results');
if (list) {
  for (const result of results) {
    const li = document.createElement('li');
    li.className = result.status === 'pass' ? 'pass' : 'fail';
    li.textContent = result.status === 'pass' ? `PASS ${result.name}` : `FAIL ${result.name}: ${result.message}`;
    list.append(li);
  }
}
