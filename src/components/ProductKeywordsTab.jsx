import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Package } from 'lucide-react';
import MarketplaceSelect from './MarketplaceSelect';
import KeywordFilters from './KeywordFilters';
import KeywordTable from './KeywordTable';
import HeliumPartnerBanner from './HeliumPartnerBanner';
import { LoadingState, EmptyState, ErrorState } from './StateMessages';
import { REVERSE_ASIN_MARKETPLACES, getMarketplace } from '@/lib/marketplaces';
import { fetchKeywordsForProduct } from '@/lib/dataforseo';
import { isValidAsin, DEFAULT_FILTERS } from '@/lib/keyword';
import { useUsageGateContext } from '@/lib/usageGateContext';

export default function ProductKeywordsTab() {
  const { t } = useTranslation();
  const gate = useUsageGateContext();

  const [marketplaceCode, setMarketplaceCode] = useState('US');
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const marketplace = getMarketplace(marketplaceCode);
  const trimmedAsin = asin.trim().toUpperCase();
  const asinValid = isValidAsin(trimmedAsin);
  const canSearch = asinValid && !loading;

  const handleSearch = async () => {
    if (!canSearch) return;
    if (!gate.requestUse()) return; // gate opens modal when locked
    setLoading(true);
    setError(null);
    setRows(null);
    try {
      const result = await fetchKeywordsForProduct({
        asin: trimmedAsin,
        locationCode: marketplace.dataforseo.location_code,
        languageCode: marketplace.dataforseo.language_code,
      });
      setRows(result);
      gate.recordUse();
    } catch (err) {
      setError({ kind: errorKind(err), message: err.message });
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
            options={REVERSE_ASIN_MARKETPLACES}
            label={t('tool.marketplace')}
          />
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
              <Package className="mr-2 h-4 w-4" />
              {t('tool.asin.label')}
            </label>
            <input
              type="text"
              value={asin}
              onChange={(e) => setAsin(e.target.value.toUpperCase())}
              onKeyDown={onKeyDown}
              placeholder={t('tool.asin.placeholder')}
              maxLength={10}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-mono text-sm uppercase tracking-wider text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            {asin && !asinValid && (
              <p className="mt-1 text-xs text-red-600">{t('tool.asin.invalid')}</p>
            )}
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

      {(loading || error || rows !== null) && <HeliumPartnerBanner />}

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
  if (err?.message === 'DATAFORSEO_CREDENTIALS_MISSING') return 'credentials';
  return 'generic';
}
