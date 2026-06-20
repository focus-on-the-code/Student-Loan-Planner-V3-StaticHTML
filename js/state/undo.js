// @ts-check
import { deepClone, shallowEqual } from '../utils/object.js';
export function createUndoStack(limit = 20) { let stack = []; return { push(snapshot) { if (stack.length && shallowEqual(stack.at(-1), snapshot)) return; stack = [...stack, deepClone(snapshot)].slice(-limit); }, pop() { return stack.pop() ?? null; }, clear() { stack = []; }, size() { return stack.length; }, canUndo() { return stack.length > 0; } }; }
