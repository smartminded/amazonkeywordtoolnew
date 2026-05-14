import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

// Question IDs are stable so the i18n keys + the FAQPage JSON-LD in PHP can
// reference the same set. Order matches the JSON-LD output for consistency.
const QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

export default function Faq() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);

  return (
    <section className="bg-white px-6 py-16 sm:px-10 md:px-12 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-10 text-balance text-center text-2xl tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
          {t('faq.heading')}
        </h2>

        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {QUESTIONS.map((id) => {
            const isOpen = openId === id;
            return (
              <div key={id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${id}-panel`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:text-lg"
                >
                  <span>{t(`faq.${id}.q`)}</span>
                  <ChevronDown
                    className={
                      'h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ' +
                      (isOpen ? 'rotate-180' : '')
                    }
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-${id}-panel`}
                    className="px-6 pb-5 text-base leading-relaxed text-gray-700"
                  >
                    <Trans i18nKey={`faq.${id}.a`} components={{ b: <strong /> }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
