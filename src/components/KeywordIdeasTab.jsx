import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import MarketplaceSelect from './MarketplaceSelect';
import KeywordFilters from './KeywordFilters';
import KeywordTable from './KeywordTable';
import HeliumPartnerBanner from './HeliumPartnerBanner';
import { LoadingState, EmptyState, ErrorState, PartialWarning } from './StateMessages';
import { MARKETPLACES, getMarketplace } from '@/lib/marketplaces';
import { runKeywordIdeasPipeline } from '@/lib/keywordPipeline';
import { DEFAULT_FILTERS } from '@/lib/keyword';
import { useUsageGateContext } from '@/lib/usageGateContext';

export default function KeywordIdeasTab() {
  const { t } = useTranslation();
  const gate = useUsageGateContext();

  const [marketplaceCode, setMarketplaceCode] = useState('US');
  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // { kind, message }
  const [warning, setWarning] = useState(null); // partial-failure warning kind
  const [rows, setRows] = useState(null); // null = never run, [] = ran with no results
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const marketplace = getMarketplace(marketplaceCode);
  const trimmedSeed = seed.trim();
  const canSearch = trimmedSeed.length > 0 && !loading;

  const handleSearch = async () => {
    if (!canSearch) return;
    if (!gate.requestUse()) return; // gate opens modal when locked
    setLoading(true);
    setError(null);
    setWarning(null);
    setRows(null);
    try {
      const result = await runKeywordIdeasPipeline({ seed: trimmedSeed, marketplace });
      setRows(result.keywords);
      if (result.stage2Failed && result.stage2Warning) {
        setWarning(result.stage2Warning);
      }
      gate.recordUse();
    } catch (err) {
      const kind = errorKind(err);
      setError({ kind, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && canSearch) handleSearch();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[260px_1fr_auto]">
          <MarketplaceSelect
            value={marketplaceCode}
            onChange={setMarketplaceCode}
            options={MARKETPLACES}
          />
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
              <Search className="mr-2 h-4 w-4" />
              {t('tool.seed.label')}
            </label>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t('tool.seed.placeholder')}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              disabled={!canSearch}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-300 md:w-44"
            >
              <Search className="h-4 w-4" />
              {t('tool.search')}
            </button>
          </div>
        </div>
      </div>

      {gate.isUnlimited && (loading || error || rows !== null) && <HeliumPartnerBanner />}

      {warning && <PartialWarning kind={warning} />}

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState kind={error.kind} message={error.message} onRetry={handleSearch} />
      )}

      {!loading && !error && rows !== null && rows.length === 0 && (
        <EmptyState onRetry={handleSearch} />
      )}

      {!loading && !error && rows && rows.length > 0 && (
        <>
          <KeywordFilters value={filters} onChange={setFilters} />
          <KeywordTable rows={rows} filters={filters} marketplace={marketplace} />
        </>
      )}
    </div>
  );
}

function errorKind(err) {
  if (err?.code === 'RATE_LIMITED') return 'rate_limit';
  if (err?.message === 'DATAFORSEO_CREDENTIALS_MISSING' || err?.message === 'RAINFOREST_KEY_MISSING') {
    return 'credentials';
  }
  return 'generic';
}
