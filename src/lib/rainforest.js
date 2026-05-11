// Rainforest API client.
//
// Used in Tab 1 Stage 2 to expand each Stage-1 keyword into Amazon's
// live autocomplete completions (marketplace-aware).
//
// In production the request goes through the WordPress proxy
// (/wp-json/akt/v1/rainforest) so the API key never reaches the browser.
// In dev, the key from .env.local is used directly via the Vite proxy.

const DEV = import.meta.env.DEV;

function apiKey() {
  const k = import.meta.env.VITE_RAINFOREST_API_KEY;
  if (!k) throw new Error('RAINFOREST_KEY_MISSING');
  return k;
}

export async function fetchAutocomplete({ term, amazonDomain, signal }) {
  const url = DEV
    ? `/api/rainforest/request?api_key=${encodeURIComponent(apiKey())}&type=autocomplete&amazon_domain=${encodeURIComponent(amazonDomain)}&search_term=${encodeURIComponent(term)}`
    : `${window.AKT_REST_BASE}/rainforest?type=autocomplete&amazon_domain=${encodeURIComponent(amazonDomain)}&search_term=${encodeURIComponent(term)}`;

  const init = DEV
    ? { signal }
    : { signal, headers: { 'X-WP-Nonce': window.AKT_NONCE || '' } };

  const res = await fetch(url, init);
  if (res.status === 429) {
    const err = new Error('RATE_LIMITED');
    err.code = 'RATE_LIMITED';
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`Rainforest HTTP ${res.status}`);
    err.code = 'HTTP_ERROR';
    throw err;
  }
  const data = await res.json();
  if (data?.request_info && data.request_info.success === false) {
    const err = new Error(data.request_info.message || 'Rainforest error');
    err.code = 'API_ERROR';
    throw err;
  }
  const results = data.autocomplete_results || data.results || [];
  return results
    .map((r) => (typeof r === 'string' ? r : r.suggestion || r.text || r.value))
    .filter(Boolean);
}

export function hasCredentials() {
  if (DEV) return !!import.meta.env.VITE_RAINFOREST_API_KEY;
  return !!window.AKT_REST_BASE;
}
