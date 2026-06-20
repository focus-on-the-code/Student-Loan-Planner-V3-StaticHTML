import test from 'node:test';
import assert from 'node:assert/strict';
import { isRuleReviewStale, ruleSetMetadata, selectRuleSet } from '../../js/rules/rule-version.js';
import { findSourceById } from '../../js/rules/sources.js';

test('selects active 2026 ruleset metadata', () => {
  assert.equal(selectRuleSet('2026-07-01').id, '2026-07-01');
  assert.equal(ruleSetMetadata.status, 'active');
});

test('ruleset source ids resolve in source registry', () => {
  for (const sourceId of ruleSetMetadata.sourceIds) {
    assert.ok(findSourceById(sourceId), `Missing source ${sourceId}`);
  }
});

test('staleness helper respects 12 month window', () => {
  assert.equal(isRuleReviewStale('2026-06-20'), false);
  assert.equal(isRuleReviewStale('2027-07-01'), true);
});
