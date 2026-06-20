// @ts-check

import { calculateScenario } from './engine/calculate-scenario.js';
import { clearScenarioSession, loadScenarioFromSession, saveScenarioToSession } from './state/session-storage.js';
import { validateScenario } from './state/validation.js';
import { byId } from './utils/dom.js';
import { formatCents } from './utils/formatting.js';
import { renderSvgLineChart } from './ui/charts/svg-line-chart.js';
import { renderChartTable } from './ui/charts/chart-table.js';

const SAMPLE = Object.freeze({ mode: 'quick', balanceDollars: 55000, interestRatePercent: 6.8, agiDollars: 65000, familySize: 1, povertyRegion: 'contiguous', pslfMonths: 24, publicService: true, loanProgram: 'direct', loanType: 'direct-unsubsidized', firstBorrowedDate: '2020-09-01', repaymentStartDate: '2021-11-01', consolidated: false, taxFilingStatus: 'single', spouseAgiDollars: 0 });
let scenario = loadScenarioFromSession() ?? { ...SAMPLE };
let previousScenario = null;
let showAll = false;
let debounce;

wire();
hydrateForm();
render();

function wire() {
  byId('scenarioForm').addEventListener('submit', (event) => { event.preventDefault(); updateFromForm(); });
  for (const id of ['modeQuick','modeDetailed','balanceDollars', 'interestRatePercent', 'agiDollars', 'familySize', 'povertyRegion', 'loanProgram', 'loanType', 'firstBorrowedDate', 'repaymentStartDate', 'taxFilingStatus', 'spouseAgiDollars', 'pslfMonths', 'publicService', 'consolidated']) {
    byId(id).addEventListener('input', scheduleUpdate);
    byId(id).addEventListener('change', scheduleUpdate);
  }
  byId('loadSampleBtn').addEventListener('click', () => { previousScenario = scenario; scenario = { ...SAMPLE }; hydrateForm(); persistAndRender('Loaded sample scenario.'); });
  byId('undoBtn').addEventListener('click', () => { if (previousScenario) { scenario = previousScenario; previousScenario = null; hydrateForm(); persistAndRender('Undid last change.'); } });
  byId('resetBtn').addEventListener('click', () => { if (!confirm('Reset the estimator to a blank scenario?')) return; previousScenario = scenario; scenario = { ...SAMPLE, balanceDollars: 0, agiDollars: 0 }; hydrateForm(); persistAndRender('Reset estimate.'); });
  byId('deleteBtn').addEventListener('click', () => { if (!confirm('Delete all entered data from this browser session?')) return; clearScenarioSession(); previousScenario = null; scenario = { ...SAMPLE }; hydrateForm(); render(); setStatus('Deleted entered data from this browser session.'); });
  byId('toggleAllPlans').addEventListener('click', () => { showAll = !showAll; render(); });
  byId('printBtn').addEventListener('click', () => window.print());
}

function scheduleUpdate() {
  clearTimeout(debounce);
  setStatus('Updating estimate…');
  debounce = setTimeout(updateFromForm, 350);
}

function updateFromForm() {
  previousScenario = scenario;
  scenario = readForm();
  persistAndRender('Estimate updated.');
}

function persistAndRender(message) {
  saveScenarioToSession(scenario);
  render();
  setStatus(message);
}

function readForm() {
  return {
    mode: byId('modeDetailed').checked ? 'detailed' : 'quick',
    balanceDollars: Number(byId('balanceDollars').value),
    interestRatePercent: Number(byId('interestRatePercent').value),
    agiDollars: Number(byId('agiDollars').value),
    familySize: Number(byId('familySize').value),
    povertyRegion: byId('povertyRegion').value,
    pslfMonths: Number(byId('pslfMonths').value),
    publicService: byId('publicService').checked,
    loanProgram: byId('loanProgram').value,
    loanType: byId('loanType').value,
    firstBorrowedDate: byId('firstBorrowedDate').value,
    repaymentStartDate: byId('repaymentStartDate').value,
    consolidated: byId('consolidated').checked,
    taxFilingStatus: byId('taxFilingStatus').value,
    spouseAgiDollars: Number(byId('spouseAgiDollars').value)
  };
}

function hydrateForm() {
  for (const [key, value] of Object.entries(scenario)) {
    const element = document.getElementById(key);
    if (!element) continue;
    if (key === 'mode') { byId('modeDetailed').checked = value === 'detailed'; byId('modeQuick').checked = value !== 'detailed'; }
    else if (element instanceof HTMLInputElement && element.type === 'checkbox') element.checked = Boolean(value);
    else element.value = String(value);
  }
}

function render() {
  const validation = validateScenario(scenario);
  byId('validationMessages').textContent = validation.errors.join(' ');
  byId('undoBtn').disabled = !previousScenario;
  const results = calculateScenario(scenario);
  byId('qualityStat').textContent = title(results.estimateQuality);
  byId('lowestPayment').textContent = results.topPlans[0] ? formatCents(results.topPlans[0].monthlyPaymentNowCents) : '—';
  renderRows('topPlanRows', results.topPlans, true);
  renderRows('allPlanRows', results.plans, false);
  byId('allPlansWrap').classList.toggle('hidden', !showAll);
  byId('toggleAllPlans').textContent = showAll ? 'Hide all plans' : 'Show all plans';
  byId('assumptions').innerHTML = results.assumptions.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  renderChart(results.plans.slice(0, 5));
  byId('planDetails').innerHTML = results.plans.slice(0, 6).map((p) => `<details><summary>${escapeHtml(p.name)} — ${label(p.eligibility.status)}</summary><p>${escapeHtml(p.summary)}</p><p>${escapeHtml(p.eligibility.reasons.join(' '))}</p></details>`).join('');
  byId('recommendations').innerHTML = results.recommendations.map((r) => `<li>${escapeHtml(r.text)}</li>`).join('');
}

function renderRows(id, plans, compact) {
  byId(id).innerHTML = plans.map((plan) => `<tr><td><strong>${escapeHtml(plan.name)}</strong><br><span class="note">${escapeHtml(plan.summary)}</span></td><td>${label(plan.eligibility.status)}</td><td>${formatCents(plan.monthlyPaymentNowCents)}</td><td>${formatCents(compact ? plan.totalBorrowerPaymentsCents : plan.annualPaymentNowCents)}</td><td>${compact ? formatCents(plan.estimatedForgivenessCents) : escapeHtml(plan.eligibility.reasons.join(' '))}</td></tr>`).join('');
}

function renderChart(plans) {
  const max = Math.max(1, ...plans.flatMap((plan) => plan.yearly.slice(0, 10).map((year) => year.paymentCents)));
  const width = 720, height = 240, pad = 34;
  const polylines = plans.map((plan, index) => {
    const points = plan.yearly.slice(0, 10).map((year, i) => `${pad + i * ((width - pad * 2) / 9)},${height - pad - (year.paymentCents / max) * (height - pad * 2)}`).join(' ');
    const colors = ['#2e8cff', '#ff76c7', '#ffb15c', '#8f73ff', '#1a8e66'];
    return `<polyline points="${points}" fill="none" stroke="${colors[index % colors.length]}" stroke-width="4"/><text x="${pad}" y="${20 + index * 16}">${escapeHtml(plan.name)}</text>`;
  }).join('');
  byId('chart').innerHTML = renderSvgLineChart(plans);
  byId('chartTable').innerHTML = renderChartTable(plans);
}

function setStatus(message) { byId('liveStatus').textContent = message; byId('statusChip').textContent = message; }
function label(status) { return status.replace('_', ' '); }
function title(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function escapeHtml(str) { return String(str ?? '').replace(/[&<>"]/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s])); }
