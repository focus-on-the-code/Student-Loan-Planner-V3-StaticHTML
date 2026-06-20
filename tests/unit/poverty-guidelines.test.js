import test from 'node:test';
import assert from 'node:assert/strict';
import { povertyGuidelineCentsAtPercent, povertyGuidelineDollars, povertyGuidelines2026 } from '../../js/rules/annual/2026/poverty-guidelines.js';

test('contains source metadata for 2026 poverty guidelines', () => {
  assert.equal(povertyGuidelines2026.year, 2026);
  assert.deepEqual(povertyGuidelines2026.sourceIds, ['fr-2026-poverty-guidelines']);
});

test('returns 2026 contiguous-state poverty guidelines', () => {
  assert.equal(povertyGuidelineDollars('contiguous', 1), 15960);
  assert.equal(povertyGuidelineDollars('contiguous', 8), 55720);
  assert.equal(povertyGuidelineDollars('contiguous', 9), 61400);
});

test('returns 2026 Alaska poverty guidelines', () => {
  assert.equal(povertyGuidelineDollars('alaska', 1), 19950);
  assert.equal(povertyGuidelineDollars('alaska', 8), 69650);
  assert.equal(povertyGuidelineDollars('alaska', 9), 76750);
});

test('returns 2026 Hawaii poverty guidelines', () => {
  assert.equal(povertyGuidelineDollars('hawaii', 1), 18360);
  assert.equal(povertyGuidelineDollars('hawaii', 8), 64070);
  assert.equal(povertyGuidelineDollars('hawaii', 9), 70600);
});

test('returns percentage of poverty guideline in cents', () => {
  assert.equal(povertyGuidelineCentsAtPercent('contiguous', 1, 150), 2394000);
});

test('rejects invalid inputs', () => {
  assert.throws(() => povertyGuidelineDollars('mars', 1), /Unknown poverty region/);
  assert.throws(() => povertyGuidelineDollars('contiguous', 0), /Family size/);
});
