import test from 'node:test'; import assert from 'node:assert/strict';
import { povertyGuidelineDollars } from '../../js/rules/annual/2026/poverty-guidelines.js';
test('2026 contiguous family-size one guideline example', () => assert.equal(povertyGuidelineDollars('contiguous', 1), 15960));
