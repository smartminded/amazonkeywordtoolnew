import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, X, Sparkles } from 'lucide-react';

export default function UsageLockModal({ lockedUntil, onSubmitEmail, onClose }) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError('invalid');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitEmail(email);
      // Google Ads conversion — defined by the PHP plugin shell on the
      // English locale only, so this is a no-op on other languages.
      if (typeof window.gtag_report_conversion === 'function') {
        try { window.gtag_report_conversion(); } catch { /* ignore */ }
      }
      onClose();
    } catch {
      setError('generic');
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = lockedUntil
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long', timeStyle: 'short' }).format(lockedUntil)
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="usage-lock-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('gate.close')}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pt-8 pb-6 sm:px-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Lock className="h-6 w-6" />
          </div>

          <h2 id="usage-lock-title" className="mb-2 text-2xl tracking-tight text-gray-900">
            {t('gate.title')}
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            {t('gate.body')}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700">
              <Mail className="mr-2 h-4 w-4" />
              {t('gate.emailLabel')}
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('gate.emailPlaceholder')}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            {error && (
              <p className="mt-2 text-xs text-red-600">{t(`gate.error.${error}`)}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !email}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <Sparkles className="h-4 w-4" />
              {submitting ? t('gate.submitting') : t('gate.unlockCta')}
            </button>
          </form>

          {formattedDate && (
            <p className="mt-5 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
              {t('gate.waitNote', { date: formattedDate })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function isValidEmail(value) {
  // Pragmatic check, not RFC-compliant — good enough for a marketing gate.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((value || '').trim());
}
