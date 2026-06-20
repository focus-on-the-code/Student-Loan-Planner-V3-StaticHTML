// @ts-check
export function renderChartTable(plans, { metric = 'paymentCents', label = 'Chart data table' } = {}) {
  return `<table><caption>${escapeHtml(label)}</caption><thead><tr><th>Plan</th><th>Year 1</th><th>Year 5</th><th>Year 10</th></tr></thead><tbody>${plans.map((plan) => `<tr><td>${escapeHtml(plan.name)}</td><td>${formatCents(plan.yearly?.[0]?.[metric] ?? 0)}</td><td>${formatCents(plan.yearly?.[4]?.[metric] ?? 0)}</td><td>${formatCents(plan.yearly?.[9]?.[metric] ?? 0)}</td></tr>`).join('')}</tbody></table>`;
}
function formatCents(cents) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((cents || 0) / 100); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>]/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[s])); }
