// @ts-check
import { formatCents } from '../utils/formatting.js';
import { renderSvgLineChart } from './charts/svg-line-chart.js';
import { renderChartTable } from './charts/chart-table.js';

export function renderApplication(state) {
  const results = state.results;
  if (!results) return { html: '', status: state.statusMessage };
  return {
    status: state.statusMessage,
    lowestPayment: results.topPlans[0] ? formatCents(results.topPlans[0].monthlyPaymentNowCents) : '—',
    topPlans: results.topPlans,
    allPlans: results.plans,
    chartHtml: renderSvgLineChart(results.topPlans),
    chartTableHtml: renderChartTable(results.topPlans)
  };
}
