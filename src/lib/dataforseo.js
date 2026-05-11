// DataForSEO client.
//
// Two endpoints are used:
//   - keywords_data/google_ads/search_volume/live  → search volume, CPC, competition for a keyword set
//   - keywords_data/dataforseo_trends/explore/live → trend (12-month) timeline per keyword
//
// We also call keywords_data/google_ads/keywords_for_keywords/live to expand a single
// seed term into a related keyword set (Stage 1 of the Tab 1 pipeline).
//
// In production the requests are proxied through the WordPress plugin's
// /wp-json/akt/v1/dataforseo endpoint so DataForSEO credentials never reach
// the browser bundle. In dev (`npm run dev`) the request goes direct to
// api.dataforseo.com via the Vite proxy using VITE_DATAFORSEO_* from .env.local.

const DEV = import.meta.env.DEV;

function authHeader() {
  const login = import.meta.env.VITE_DATAFORSEO_LOGIN;
  const password = import.meta.env.VITE_DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error('DATAFORSEO_CREDENTIALS_MISSING');
  }
  return 'Basic ' + btoa(`${login}:${password}`);
}

async function post(path, body) {
  const res = DEV
    ? await fetch(`/api/dataforseo${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader(),
        },
        body: JSON.stringify(body),
      })
    : await fetch(`${window.AKT_REST_BASE}/dataforseo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.AKT_NONCE || '',
        },
        body: JSON.stringify({ path, body }),
      });

  if (res.status === 429) {
    const err = new Error('RATE_LIMITED');
    err.code = 'RATE_LIMITED';
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`DataForSEO HTTP ${res.status}`);
    err.code = 'HTTP_ERROR';
    throw err;
  }
  const data = await res.json();
  if (data?.status_code && data.status_code >= 40000) {
    const err = new Error(data.status_message || 'DataForSEO error');
    err.code = 'API_ERROR';
    throw err;
  }
  return data;
}

function pickItems(response) {
  const tasks = response?.tasks || [];
  return tasks.flatMap((t) => t.result || []).flatMap((r) => r.items || r);
}

/**
 * Stage 1: expand a seed keyword into related keywords with volume / CPC / competition.
 * Returns: array of { keyword, searchVolume, competition, cpc, monthlySearches }.
 */
export async function fetchKeywordsForSeed({ seed, locationCode, languageCode, limit = 100 }) {
  const data = await post('/v3/keywords_data/google_ads/keywords_for_keywords/live', [
    {
      keywords: [seed],
      location_code: locationCode,
      language_code: languageCode,
      limit,
      sort_by: 'search_volume',
    },
  ]);

  const items = pickItems(data);
  return items
    .filter((i) => i?.keyword)
    .map((i) => ({
      keyword: i.keyword,
      searchVolume: i.search_volume ?? null,
      competition: normalizeCompetition(i.competition),
      cpc: typeof i.cpc === 'number' ? i.cpc : null,
      monthlySearches: Array.isArray(i.monthly_searches)
        ? i.monthly_searches.map((m) => ({ year: m.year, month: m.month, value: m.search_volume ?? 0 }))
        : null,
      source: 'dataforseo',
    }));
}

/**
 * Enrich an arbitrary set of keywords with volume / CPC / competition.
 * Used to back-fill metrics for autosuggest-derived keywords (Stage 2).
 * DataForSEO accepts up to 1000 keywords per call.
 */
export async function fetchSearchVolume({ keywords, locationCode, languageCode }) {
  if (!keywords?.length) return [];
  const data = await post('/v3/keywords_data/google_ads/search_volume/live', [
    {
      keywords,
      location_code: locationCode,
      language_code: languageCode,
    },
  ]);
  const items = pickItems(data);
  const map = new Map();
  for (const i of items) {
    if (!i?.keyword) continue;
    map.set(i.keyword.toLowerCase(), {
      searchVolume: i.search_volume ?? null,
      competition: normalizeCompetition(i.competition),
      cpc: typeof i.cpc === 'number' ? i.cpc : null,
      monthlySearches: Array.isArray(i.monthly_searches)
        ? i.monthly_searches.map((m) => ({ year: m.year, month: m.month, value: m.search_volume ?? 0 }))
        : null,
    });
  }
  return map;
}

/**
 * Reverse ASIN: keywords a given ASIN ranks for.
 * Restricted to the four marketplaces with provider coverage (US, AE, EG, SA).
 *
 * The Amazon ranked_keywords endpoint returns keyword + Amazon search volume only
 * (no competition / CPC / trend). We enrich the response by piping the keyword set
 * through the Google Ads search_volume endpoint so the table can render the same
 * columns as Tab 1 — provider returns null and the cell shows "—" when unavailable.
 */
export async function fetchKeywordsForProduct({ asin, locationCode, languageCode, limit = 200 }) {
  const data = await post('/v3/dataforseo_labs/amazon/ranked_keywords/live', [
    {
      asin,
      location_code: locationCode,
      language_code: languageCode,
      limit,
      ignore_synonyms: true,
    },
  ]);
  const items = pickItems(data);
  const base = items
    .filter((i) => i?.keyword_data?.keyword)
    .map((i) => ({
      keyword: i.keyword_data.keyword,
      searchVolume: i.keyword_data?.keyword_info?.search_volume ?? null,
      competition: null,
      cpc: null,
      monthlySearches: null,
      source: 'dataforseo',
    }));

  if (!base.length) return base;

  // Enrich with Google Ads metrics (competition / CPC / monthly trend).
  // Best-effort: if the call fails, return the base set unchanged.
  try {
    const metrics = await fetchSearchVolume({
      keywords: base.map((b) => b.keyword),
      locationCode,
      languageCode,
    });
    return base.map((b) => {
      const m = metrics.get(b.keyword.toLowerCase());
      if (!m) return b;
      return {
        ...b,
        searchVolume: b.searchVolume ?? m.searchVolume,
        competition: m.competition,
        cpc: m.cpc,
        monthlySearches: m.monthlySearches,
      };
    });
  } catch {
    return base;
  }
}

function normalizeCompetition(c) {
  if (c == null) return null;
  if (typeof c === 'string') {
    const upper = c.toUpperCase();
    if (['LOW', 'MEDIUM', 'HIGH'].includes(upper)) return upper;
  }
  if (typeof c === 'number') {
    if (c < 0.34) return 'LOW';
    if (c < 0.67) return 'MEDIUM';
    return 'HIGH';
  }
  return null;
}

export function hasCredentials() {
  // Dev: needs VITE_* in .env.local. Prod: relies on the WP REST proxy, which
  // we trust to have credentials configured server-side.
  if (DEV) {
    return !!(import.meta.env.VITE_DATAFORSEO_LOGIN && import.meta.env.VITE_DATAFORSEO_PASSWORD);
  }
  return !!window.AKT_REST_BASE;
}
