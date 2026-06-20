// @ts-check
export function summarizeYears(months) {
  const years = [];
  for (let i = 0; i < months.length; i += 12) {
    const slice = months.slice(i, i + 12);
    years.push({ year: Math.floor(i / 12) + 1, paymentCents: sum(slice, 'paymentCents'), interestCents: sum(slice, 'interestPaidCents'), principalCents: sum(slice, 'principalPaidCents'), balanceCents: slice.at(-1)?.endingBalanceCents ?? 0 });
  }
  return years;
}
function sum(rows, key) { return rows.reduce((total, row) => total + (row[key] || 0), 0); }
