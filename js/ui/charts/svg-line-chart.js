// @ts-check
const COLORS = ['#2e8cff', '#ff76c7', '#ffb15c', '#8f73ff'];

export function renderSvgLineChart(plans, { width = 720, height = 260, metric = 'paymentCents', label = 'Annual payment path chart' } = {}) {
  const years = plans.flatMap((plan) => plan.yearly || []);
  const max = Math.max(1, ...years.map((year) => year[metric] || 0));
  const pad = 38;
  const plotWidth = width - pad * 2;
  const plotHeight = height - pad * 2;
  const series = plans.map((plan, index) => {
    const color = COLORS[index % COLORS.length];
    const rows = (plan.yearly || []).slice(0, 10);
    const points = rows.map((year, i) => pointFor(year, i, rows.length, metric, max, pad, plotWidth, plotHeight, height));
    const polyline = `<polyline class="chart-line" data-plan-id="${escapeAttr(plan.planId)}" points="${points.map((point) => `${point.x},${point.y}`).join(' ')}" fill="none" stroke="${color}" stroke-width="4"/>`;
    const circles = points.map((point) => `<circle class="chart-point" tabindex="0" data-plan-id="${escapeAttr(plan.planId)}" data-callout="${escapeAttr(`${plan.name} — Year ${point.year}: ${formatDollars(point.valueCents)}`)}" cx="${point.x}" cy="${point.y}" r="5" fill="${color}" aria-label="${escapeAttr(`${plan.name}, year ${point.year}, ${formatDollars(point.valueCents)}`)}"><title>${escapeHtml(`${plan.name} year ${point.year}: ${formatDollars(point.valueCents)}`)}</title></circle>`).join('');
    return `${polyline}${circles}<text x="${pad}" y="${18 + index * 16}" fill="${color}">${escapeHtml(plan.name)}</text>`;
  }).join('');
  return `<svg class="payment-chart interactive-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttr(label)}"><line x1="${pad}" y1="${height-pad}" x2="${width-pad}" y2="${height-pad}" stroke="#9aa6c0"/><line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height-pad}" stroke="#9aa6c0"/><text x="${width-pad-36}" y="${height-10}">Year</text>${series}</svg>`;
}

function pointFor(year, index, count, metric, max, pad, plotWidth, plotHeight, height) {
  const valueCents = year[metric] || 0;
  const x = pad + index * (plotWidth / Math.max(1, count - 1));
  const y = height - pad - (valueCents / max) * plotHeight;
  return { x: Math.round(x), y: Math.round(y), year: year.year, valueCents };
}
function formatDollars(cents) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((cents || 0) / 100); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>]/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[s])); }
function escapeAttr(value) { return escapeHtml(value).replace(/"/g, '&quot;'); }
