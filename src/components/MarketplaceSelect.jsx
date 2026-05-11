import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MarketplaceSelect({ value, onChange, options, label }) {
  const { t } = useTranslation();
  return (
    <div>
      <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
        <Globe className="mr-2 h-4 w-4" />
        {label || t('tool.marketplace')}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
      >
        {options.map((m) => (
          <option key={m.code} value={m.code}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
