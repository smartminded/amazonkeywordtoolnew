import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 50;
import CompetitionBadge from './CompetitionBadge';
import TrendCell from './TrendCell';
import MarketSizeCell from './MarketSizeCell';
import { exportRowsToCsv, formatCurrency, formatNumber, getMarketSize } from '@/lib/keyword';

function SortIcon({ active, direction }) {
  if (!active) return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-gray-400" />;
  return direction === 'asc'
    ? <ArrowUp className="ml-1 inline h-3.5 w-3.5 text-primary-500" />
    : <ArrowDown className="ml-1 inline h-3.5 w-3.5 text-primary-500" />;
}

const SORT_FIELDS = {
  keyword: (r) => r.keyword.toLowerCase(),
  searchVolume: (r) => r.searchVolume ?? -1,
  competition: (r) => ({ LOW: 0, MEDIUM: 1, HIGH: 2 }[r.competition] ?? -1),
  cpc: (r) => r.cpc ?? -1,
  marketSize: (r) => r.searchVolume ?? -1,
};

export default function KeywordTable({ rows, filters, marketplace }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(() => new Set());
  const [sortBy, setSortBy] = useState('searchVolume');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filters.competition.length && !filters.competition.includes(r.competition)) return false;
      if (filters.minVolume != null && (r.searchVolume ?? 0) < filters.minVolume) return false;
      if (filters.maxVolume != null && (r.searchVolume ?? 0) > filters.maxVolume) return false;
      if (filters.marketSize.length) {
        const ms = getMarketSize(r.searchVolume);
        if (!ms || !filters.marketSize.includes(ms.key)) return false;
      }
      return true;
    });
  }, [rows, filters]);

  const sorted = useMemo(() => {
    const accessor = SORT_FIELDS[sortBy] || SORT_FIELDS.searchVolume;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  // Reset page to 1 when filters / sort / underlying rows change.
  // Using the "store-prev-prop" pattern (React docs) to avoid setState-in-effect.
  const resetKey = `${rows.length}|${sortBy}|${sortDir}|${JSON.stringify(filters)}`;
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey);
    setPage(1);
  }

  // Clamp page if the data shrinks below the current page (e.g. filter tightened).
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paged = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  const toggleRow = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allVisibleKeys = paged.map((r) => r.keyword);
  const allSelected = allVisibleKeys.length > 0 && allVisibleKeys.every((k) => selected.has(k));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        for (const k of allVisibleKeys) next.delete(k);
      } else {
        for (const k of allVisibleKeys) next.add(k);
      }
      return next;
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir(field === 'keyword' ? 'asc' : 'desc');
    }
  };

  const handleExport = () => {
    const exportRows = selected.size
      ? sorted.filter((r) => selected.has(r.keyword))
      : sorted;
    if (!exportRows.length) return;
    exportRowsToCsv(exportRows, marketplace.code);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-3">
        <p className="text-sm text-gray-700">
          {t('tool.table.summary', {
            count: sorted.length,
            total: rows.length,
            selected: selected.size,
          })}
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={!sorted.length}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Download className="h-4 w-4" />
          {selected.size
            ? t('tool.table.exportSelected', { count: selected.size })
            : t('tool.table.exportAll')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  aria-label={t('tool.table.selectAll')}
                />
              </th>
              <Th onClick={() => handleSort('keyword')}>
                {t('tool.table.keyword')} <SortIcon active={sortBy === 'keyword'} direction={sortDir} />
              </Th>
              <Th onClick={() => handleSort('searchVolume')} numeric>
                {t('tool.table.searchVolume')} <SortIcon active={sortBy === 'searchVolume'} direction={sortDir} />
              </Th>
              <Th onClick={() => handleSort('competition')}>
                {t('tool.table.competition')} <SortIcon active={sortBy === 'competition'} direction={sortDir} />
              </Th>
              <Th>{t('tool.table.trend')}</Th>
              <Th onClick={() => handleSort('cpc')} numeric>
                {t('tool.table.cpc')} <SortIcon active={sortBy === 'cpc'} direction={sortDir} />
              </Th>
              <Th onClick={() => handleSort('marketSize')}>
                {t('tool.table.marketSize')} <SortIcon active={sortBy === 'marketSize'} direction={sortDir} />
              </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paged.map((r) => {
              const checked = selected.has(r.keyword);
              return (
                <tr
                  key={r.keyword}
                  className={checked ? 'bg-primary-50/40' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRow(r.keyword)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      aria-label={r.keyword}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {r.keyword}
                    {r.source === 'autosuggest' && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-700">
                        {t('tool.table.fromAutosuggest')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-gray-700">
                    {formatNumber(r.searchVolume)}
                  </td>
                  <td className="px-4 py-3"><CompetitionBadge value={r.competition} /></td>
                  <td className="px-4 py-3"><TrendCell monthlySearches={r.monthlySearches} /></td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-gray-700">
                    {formatCurrency(r.cpc, marketplace.symbol)}
                  </td>
                  <td className="px-4 py-3"><MarketSizeCell searchVolume={r.searchVolume} /></td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                  {t('tool.table.noMatches')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-3">
          <p className="text-sm text-gray-600">
            {t('tool.table.pageRange', {
              from: pageStart + 1,
              to: Math.min(pageStart + PAGE_SIZE, sorted.length),
              total: sorted.length,
            })}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('tool.table.prev')}
            </button>
            {getPageNumbers(safePage, pageCount).map((p, i) =>
              p === '…' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">…</span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === safePage ? 'page' : undefined}
                  className={
                    'min-w-[2.25rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ' +
                    (p === safePage
                      ? 'bg-primary-500 text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50')
                  }
                >
                  {p}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white"
            >
              {t('tool.table.next')}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Build a compact page list: always show first/last; window the current page.
// Returns numbers and '…' separators.
function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push('…');
    out.push(sorted[i]);
  }
  return out;
}

function Th({ children, onClick, numeric }) {
  return (
    <th
      scope="col"
      onClick={onClick}
      className={
        'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 ' +
        (numeric ? 'text-right ' : 'text-left ') +
        (onClick ? 'cursor-pointer select-none hover:text-gray-900' : '')
      }
    >
      {children}
    </th>
  );
}
