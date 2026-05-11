import { useTranslation } from 'react-i18next';
import { getMarketSize } from '@/lib/keyword';

const STYLES = {
  huge:   { bars: 4, color: 'bg-primary-500' },
  large:  { bars: 3, color: 'bg-primary-500' },
  medium: { bars: 2, color: 'bg-primary-400' },
  small:  { bars: 1, color: 'bg-primary-300' },
};

export default function MarketSizeCell({ searchVolume }) {
  const { t } = useTranslation();
  const bucket = getMarketSize(searchVolume);
  if (!bucket) return <span className="text-sm text-gray-400">—</span>;

  const cfg = STYLES[bucket.key];
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`w-1.5 rounded-sm ${n <= cfg.bars ? cfg.color : 'bg-gray-200'}`}
            style={{ height: `${4 + n * 3}px` }}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-700">
        {t(`tool.marketSize.${bucket.key}`)}
      </span>
    </div>
  );
}
