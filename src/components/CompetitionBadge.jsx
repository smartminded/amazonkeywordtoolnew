import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

const STYLES = {
  LOW: 'bg-green-100 text-green-700 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  HIGH: 'bg-red-100 text-red-700 border-red-200',
};

export default function CompetitionBadge({ value }) {
  const { t } = useTranslation();
  if (!value) {
    return <span className="text-sm text-gray-400">—</span>;
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STYLES[value]
      )}
    >
      {t(`tool.competition.${value.toLowerCase()}`)}
    </span>
  );
}
