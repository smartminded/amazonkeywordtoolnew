import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

const SUPPORTED = ['en', 'de', 'fr', 'it', 'es', 'pt'];

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';

  if (window.AKT_LANG && SUPPORTED.includes(window.AKT_LANG)) {
    return window.AKT_LANG;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam && SUPPORTED.includes(langParam)) {
    return langParam;
  }

  const path = window.location.pathname;
  const match = path.match(/^\/([a-z]{2})\//);
  if (match && SUPPORTED.includes(match[1])) {
    return match[1];
  }

  // No language prefix on production = German default; dev server falls through to English
  if (path.includes('/amazon-keyword-tool') && !match) {
    return 'de';
  }

  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      es: { translation: es },
      pt: { translation: pt },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
