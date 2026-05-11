import { useTranslation } from 'react-i18next';
import { MARKET_SIZE_BUCKETS } from '@/lib/keyword';

const COMPETITION_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];

export default function KeywordFilters({ value, onChange }) {
  const { t } = useTranslation();

  const competitionValue = value.competition[0] || '';
  const marketSizeValue = value.marketSize[0] || '';

  const setCompetition = (level) => {
    onChange({ ...value, competition: level ? [level] : [] });
  };

  const setMarketSize = (key) => {
    onChange({ ...value, marketSize: key ? [key] : [] });
  };

  const selectClass =
    'w-full appearance-none rounded-lg border border-gray-200 bg-white bg-no-repeat px-3 py-1.5 pr-9 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';
  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%236b7280' stroke-width='2' viewBox='0 0 24 24'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e\")",
    backgroundPosition: 'right 0.6rem center',
    backgroundSize: '1rem 1rem',
  };

  return (
    <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3">
      {/* Competition */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('tool.filters.competition')}
        </p>
        <select
          value={competitionValue}
          onChange={(e) => setCompetition(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">{t('tool.filters.all')}</option>
          {COMPETITION_LEVELS.map((level) => (
            <option key={level} value={level}>
              {t(`tool.competition.${level.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Search volume range */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('tool.filters.searchVolume')}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={value.minVolume ?? ''}
            onChange={(e) => onChange({ ...value, minVolume: parseIntOrNull(e.target.value) })}
            placeholder={t('tool.filters.min')}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={value.maxVolume ?? ''}
            onChange={(e) => onChange({ ...value, maxVolume: parseIntOrNull(e.target.value) })}
            placeholder={t('tool.filters.max')}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      {/* Market size */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t('tool.filters.marketSize')}
        </p>
        <select
          value={marketSizeValue}
          onChange={(e) => setMarketSize(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="">{t('tool.filters.all')}</option>
          {MARKET_SIZE_BUCKETS.map((b) => (
            <option key={b.key} value={b.key}>
              {t(`tool.marketSize.${b.key}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function parseIntOrNull(v) {
  if (v === '' || v == null) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}
