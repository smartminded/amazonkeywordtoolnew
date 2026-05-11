import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { summarizeTrend } from '@/lib/keyword';

export default function TrendCell({ monthlySearches }) {
  const trend = summarizeTrend(monthlySearches);
  if (!trend) {
    return <span className="text-sm text-gray-400">—</span>;
  }

  const Icon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const color =
    trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-gray-500';
  const stroke =
    trend.direction === 'up' ? '#16a34a' : trend.direction === 'down' ? '#dc2626' : '#6b7280';

  // Render a tiny inline sparkline (no recharts overhead — pure SVG path).
  const w = 64;
  const h = 18;
  const pts = trend.normalized;
  const step = pts.length > 1 ? w / (pts.length - 1) : w;
  const path = pts
    .map((v, i) => {
      const x = i * step;
      const y = h - v * (h - 2) - 1;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <div className="flex items-center gap-2">
      <svg width={w} height={h} className="overflow-visible" aria-hidden>
        <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <Icon className={`h-4 w-4 ${color}`} aria-hidden />
    </div>
  );
}
