import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeliumPartnerBanner() {
  const { t } = useTranslation();
  return (
    <aside className="flex flex-col items-start gap-4 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-lg font-bold text-gray-900">Helium 10</p>
          <p className="mt-1 text-sm font-semibold text-gray-700">{t('partner.copy')}</p>
        </div>
      </div>
      <a
        href="https://helium10.pxf.io/jeLWqP"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group relative inline-flex w-full flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 sm:w-44"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
        <span className="relative">{t('partner.cta')}</span>
        <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </aside>
  );
}
