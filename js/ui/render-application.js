// @ts-check

import { byId } from '../utils/dom.js';
import { formatCurrency } from '../utils/formatting.js';
import { getPreviewState, updatePreviewState } from '../state/estimator-store.js';

/** Render the temporary Pass 1 smoke-test output. */
export function renderPreview() {
  const state = getPreviewState();
  const monthlyInterest = state.balance * (state.annualRate / 100 / 12);
  byId('monthlyInterest').textContent = formatCurrency(monthlyInterest);
}

/** Wire the temporary Pass 1 smoke-test form. */
export function wirePreviewForm() {
  const form = byId('demoForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const balance = Number(/** @type {HTMLInputElement} */ (byId('balanceInput')).value);
    const annualRate = Number(/** @type {HTMLInputElement} */ (byId('rateInput')).value);
    updatePreviewState({ balance, annualRate });
    renderPreview();
  });
}
