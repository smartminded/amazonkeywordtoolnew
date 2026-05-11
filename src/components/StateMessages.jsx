import { useTranslation } from 'react-i18next';
import { AlertCircle, AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export function LoadingState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white py-16 px-6 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      <p className="max-w-md text-base text-gray-700">{t('tool.loading')}</p>
    </div>
  );
}

export function EmptyState({ onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white py-16 px-6 text-center">
      <Inbox className="h-10 w-10 text-gray-400" />
      <p className="text-lg font-semibold text-gray-900">{t('tool.empty.title')}</p>
      <p className="max-w-md text-sm text-gray-600">{t('tool.empty.body')}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t('tool.empty.retry')}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ kind = 'generic', message, onRetry }) {
  const { t } = useTranslation();
  const isRateLimit = kind === 'rate_limit';
  const Icon = isRateLimit ? AlertTriangle : AlertCircle;
  const color = isRateLimit ? 'text-amber-600' : 'text-red-600';

  return (
    <div role="alert" className="rounded-2xl border border-red-100 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-900">
            {t(`tool.error.${kind}.title`)}
          </p>
          <p className="mt-1 text-sm text-red-800">
            {t(`tool.error.${kind}.body`)}
          </p>
          {message && (
            <p className="mt-2 break-words font-mono text-xs text-red-700/80">{message}</p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              {t('tool.empty.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PartialWarning({ kind }) {
  const { t } = useTranslation();
  return (
    <div role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-amber-900">{t('tool.warning.title')}</p>
          <p className="mt-1 text-sm text-amber-800">{t(`tool.warning.${kind}`)}</p>
        </div>
      </div>
    </div>
  );
}
