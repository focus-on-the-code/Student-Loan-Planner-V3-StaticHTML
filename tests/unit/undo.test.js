import test from 'node:test'; import assert from 'node:assert/strict';
import { createUndoStack } from '../../js/state/undo.js';
test('stores bounded undo snapshots', () => { const u = createUndoStack(1); u.push({a:1}); u.push({a:2}); assert.equal(u.size(),1); assert.deepEqual(u.pop(),{a:2}); });
