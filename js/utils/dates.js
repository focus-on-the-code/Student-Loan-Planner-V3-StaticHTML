// @ts-check
export function addMonths(isoDate, months) { const d = new Date(`${isoDate || new Date().toISOString().slice(0,10)}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + months); return d.toISOString().slice(0, 10); }
export function isBefore(isoDate, boundary) { return Boolean(isoDate && boundary && isoDate < boundary); }
export function monthsBetween(startIso, endIso) { const a = new Date(`${startIso}T00:00:00Z`), b = new Date(`${endIso}T00:00:00Z`); return (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()); }
