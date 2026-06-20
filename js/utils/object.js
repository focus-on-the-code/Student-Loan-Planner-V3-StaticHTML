// @ts-check
export function deepClone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
export function stableStringify(value) { return JSON.stringify(value, Object.keys(flattenKeys(value)).sort()); }
export function shallowEqual(a, b) { return stableStringify(a) === stableStringify(b); }
function flattenKeys(value, out = {}) { if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) { out[k] = true; flattenKeys(v, out); } return out; }
