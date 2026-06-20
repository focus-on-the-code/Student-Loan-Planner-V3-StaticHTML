// @ts-check

/**
 * Get an element by id or throw a useful error.
 * @template {HTMLElement} T
 * @param {string} id
 * @returns {T}
 */
export function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return /** @type {T} */ (element);
}
