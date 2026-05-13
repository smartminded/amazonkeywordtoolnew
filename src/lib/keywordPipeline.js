// Two-stage Tab 1 pipeline:
//   Stage 1 — DataForSEO: seed → related keywords with volume / CPC / competition / trend.
//   Stage 2 — Rainforest:  iterate Stage 1 keywords, fetch live Amazon autocomplete,
//                          merge & dedupe new completions back into the keyword list.
//
// Stage 2 runs with bounded concurrency to keep costs predictable. Autosuggest
// completions arrive without metrics; we batch-enrich them with DataForSEO's
// search_volume endpoint so the table renders consistent columns.

import { fetchKeywordsForSeed, fetchSearchVolume } from './dataforseo';
import { fetchAutocomplete } from './rainforest';

const STAGE2_CONCURRENCY = 4;
// Tuned for cost / rate-limit budget: each Stage-2 seed costs one Rainforest
// autocomplete call, and the WP proxy rate-limits at ~300/5min per IP. 10 keeps
// each user search at ~12 upstream calls total (1 Stage 1 + 10 Stage 2 + 1
// enrichment) so an IP gets ~25 searches per window before the limit kicks in.
const STAGE2_MAX_SEEDS = 10;
const STAGE1_LIMIT = 100;

export async function runKeywordIdeasPipeline({ seed, marketplace, signal }) {
  const result = {
    keywords: [],
    stage1Failed: false,
    stage2Failed: false,
    stage2Warning: null,
  };

  // Stage 1 ----------------------------------------------------------------
  const stage1 = await fetchKeywordsForSeed({
    seed,
    locationCode: marketplace.dataforseo.location_code,
    languageCode: marketplace.dataforseo.language_code,
    limit: STAGE1_LIMIT,
  }).catch((err) => {
    result.stage1Failed = true;
    throw err;
  });

  const byKeyword = new Map();
  for (const kw of stage1) byKeyword.set(kw.keyword.toLowerCase(), kw);

  // Stage 2 ----------------------------------------------------------------
  // Pick the top-N Stage 1 keywords (by volume) as autocomplete seeds.
  const seeds = stage1
    .slice()
    .sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0))
    .slice(0, STAGE2_MAX_SEEDS)
    .map((k) => k.keyword);

  let stage2Suggestions = [];
  try {
    stage2Suggestions = await runWithConcurrency(seeds, STAGE2_CONCURRENCY, async (term) => {
      try {
        return await fetchAutocomplete({
          term,
          amazonDomain: marketplace.domain,
          signal,
        });
      } catch (err) {
        // A single failed autocomplete shouldn't kill the whole stage.
        if (err.code === 'RATE_LIMITED') throw err;
        return [];
      }
    });
  } catch (err) {
    result.stage2Failed = true;
    result.stage2Warning = err.code === 'RATE_LIMITED' ? 'RATE_LIMITED' : 'AUTOCOMPLETE_FAILED';
  }

  const newSuggestions = new Set();
  for (const list of stage2Suggestions) {
    for (const s of list) {
      const norm = s.trim().toLowerCase();
      if (!norm) continue;
      if (!byKeyword.has(norm)) newSuggestions.add(s.trim());
    }
  }

  // Enrich autosuggest-only keywords with metrics via DataForSEO search_volume.
  if (newSuggestions.size) {
    const newKeywords = Array.from(newSuggestions);
    let metricsMap = new Map();
    try {
      metricsMap = await fetchSearchVolume({
        keywords: newKeywords,
        locationCode: marketplace.dataforseo.location_code,
        languageCode: marketplace.dataforseo.language_code,
      });
    } catch {
      // Metrics enrichment is best-effort — fall back to bare keywords.
      result.stage2Warning = result.stage2Warning || 'METRICS_PARTIAL';
    }
    for (const kw of newKeywords) {
      const m = metricsMap.get(kw.toLowerCase());
      byKeyword.set(kw.toLowerCase(), {
        keyword: kw,
        searchVolume: m?.searchVolume ?? null,
        competition: m?.competition ?? null,
        cpc: m?.cpc ?? null,
        monthlySearches: m?.monthlySearches ?? null,
        source: 'autosuggest',
      });
    }
  }

  result.keywords = Array.from(byKeyword.values());
  return result;
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let idx = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}
