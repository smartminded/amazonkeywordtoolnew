// Shared helpers for keyword rows: formatting, market-size derivation, and CSV export.
import Papa from 'papaparse';

// Bucket search volume into a coarse "market size" label. Used both for display
// and as a filter dimension. Keep these breakpoints in sync with KeywordFilters.
export const MARKET_SIZE_BUCKETS = [
  { key: 'huge',   min: 100000, label: 'Huge' },
  { key: 'large',  min: 10000,  label: 'Large' },
  { key: 'medium', min: 1000,   label: 'Medium' },
  { key: 'small',  min: 0,      label: 'Small' },
];

export function getMarketSize(searchVolume) {
  if (searchVolume == null) return null;
  for (const b of MARKET_SIZE_BUCKETS) {
    if (searchVolume >= b.min) return b;
  }
  return MARKET_SIZE_BUCKETS[MARKET_SIZE_BUCKETS.length - 1];
}

export function formatNumber(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat().format(Math.round(n));
}

export function formatCurrency(value, symbol) {
  if (value == null) return '—';
  return `${symbol}${value.toFixed(2)}`;
}

// Reduces a monthly_searches array into a coarse direction (up / down / flat) and a
// normalized 0..1 array for the sparkline. Returns null when no series is available.
export function summarizeTrend(monthlySearches) {
  if (!Array.isArray(monthlySearches) || monthlySearches.length < 2) return null;
  const series = monthlySearches.slice(-12).map((m) => m.value || 0);
  const max = Math.max(...series, 1);
  const normalized = series.map((v) => v / max);

  const firstHalfAvg = avg(series.slice(0, Math.floor(series.length / 2)));
  const secondHalfAvg = avg(series.slice(Math.floor(series.length / 2)));
  const delta = secondHalfAvg - firstHalfAvg;
  const rel = firstHalfAvg ? delta / firstHalfAvg : 0;

  let direction = 'flat';
  if (rel > 0.1) direction = 'up';
  else if (rel < -0.1) direction = 'down';

  return { series, normalized, direction, delta, rel };
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function exportRowsToCsv(rows, marketplaceCode) {
  const csv = Papa.unparse({
    fields: ['keyword', 'search_volume', 'competition', 'cpc', 'market_size', 'trend', 'source', 'marketplace'],
    data: rows.map((r) => {
      const ms = getMarketSize(r.searchVolume);
      const trend = summarizeTrend(r.monthlySearches);
      return [
        r.keyword,
        r.searchVolume ?? '',
        r.competition ?? '',
        r.cpc ?? '',
        ms?.label ?? '',
        trend?.direction ?? '',
        r.source ?? '',
        marketplaceCode,
      ];
    }),
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `amazon-keywords-${marketplaceCode}-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function isValidAsin(value) {
  return /^[A-Z0-9]{10}$/i.test((value || '').trim());
}

export const DEFAULT_FILTERS = {
  competition: [],
  minVolume: null,
  maxVolume: null,
  marketSize: [],
};
