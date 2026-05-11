// Marketplace catalog used by Tab 1 and Tab 2.
// Each entry holds:
//   - code: short marketplace code
//   - label: display label "Amazon.<tld> (CODE)"
//   - domain: rainforest amazon_domain
//   - currency: ISO + display symbol (used for CPC formatting)
//   - dataforseo: { location_code, language_code } for Google Ads / Trends endpoints
// location_code/language_code values follow the DataForSEO public location/language list.

export const MARKETPLACES = [
  { code: 'US', label: 'Amazon.com (US)',     domain: 'amazon.com',    currency: 'USD', symbol: '$',    dataforseo: { location_code: 2840, language_code: 'en' } },
  { code: 'AU', label: 'Amazon.com.au (AU)',  domain: 'amazon.com.au', currency: 'AUD', symbol: 'A$',   dataforseo: { location_code: 2036, language_code: 'en' } },
  { code: 'BE', label: 'Amazon.com.be (BE)',  domain: 'amazon.com.be', currency: 'EUR', symbol: '€',    dataforseo: { location_code: 2056, language_code: 'nl' } },
  { code: 'BR', label: 'Amazon.com.br (BR)',  domain: 'amazon.com.br', currency: 'BRL', symbol: 'R$',   dataforseo: { location_code: 2076, language_code: 'pt' } },
  { code: 'MX', label: 'Amazon.com.mx (MX)',  domain: 'amazon.com.mx', currency: 'MXN', symbol: 'MX$',  dataforseo: { location_code: 2484, language_code: 'es' } },
  { code: 'TR', label: 'Amazon.com.tr (TR)',  domain: 'amazon.com.tr', currency: 'TRY', symbol: '₺',    dataforseo: { location_code: 2792, language_code: 'tr' } },
  { code: 'AE', label: 'Amazon.ae (AE)',      domain: 'amazon.ae',     currency: 'AED', symbol: 'د.إ',  dataforseo: { location_code: 2784, language_code: 'en' } },
  { code: 'CA', label: 'Amazon.ca (CA)',      domain: 'amazon.ca',     currency: 'CAD', symbol: 'C$',   dataforseo: { location_code: 2124, language_code: 'en' } },
  { code: 'CN', label: 'Amazon.cn (CN)',      domain: 'amazon.cn',     currency: 'CNY', symbol: '¥',    dataforseo: { location_code: 2156, language_code: 'zh_CN' } },
  { code: 'JP', label: 'Amazon.co.jp (JP)',   domain: 'amazon.co.jp',  currency: 'JPY', symbol: '¥',    dataforseo: { location_code: 2392, language_code: 'ja' } },
  { code: 'UK', label: 'Amazon.co.uk (UK)',   domain: 'amazon.co.uk',  currency: 'GBP', symbol: '£',    dataforseo: { location_code: 2826, language_code: 'en' } },
  { code: 'DE', label: 'Amazon.de (DE)',      domain: 'amazon.de',     currency: 'EUR', symbol: '€',    dataforseo: { location_code: 2276, language_code: 'de' } },
  { code: 'EG', label: 'Amazon.eg (EG)',      domain: 'amazon.eg',     currency: 'EGP', symbol: 'E£',   dataforseo: { location_code: 2818, language_code: 'ar' } },
  { code: 'ES', label: 'Amazon.es (ES)',      domain: 'amazon.es',     currency: 'EUR', symbol: '€',    dataforseo: { location_code: 2724, language_code: 'es' } },
  { code: 'FR', label: 'Amazon.fr (FR)',      domain: 'amazon.fr',     currency: 'EUR', symbol: '€',    dataforseo: { location_code: 2250, language_code: 'fr' } },
  { code: 'IN', label: 'Amazon.in (IN)',      domain: 'amazon.in',     currency: 'INR', symbol: '₹',    dataforseo: { location_code: 2356, language_code: 'en' } },
  { code: 'IT', label: 'Amazon.it (IT)',      domain: 'amazon.it',     currency: 'EUR', symbol: '€',    dataforseo: { location_code: 2380, language_code: 'it' } },
  { code: 'NL', label: 'Amazon.nl (NL)',      domain: 'amazon.nl',     currency: 'EUR', symbol: '€',    dataforseo: { location_code: 2528, language_code: 'nl' } },
  { code: 'PL', label: 'Amazon.pl (PL)',      domain: 'amazon.pl',     currency: 'PLN', symbol: 'zł',   dataforseo: { location_code: 2616, language_code: 'pl' } },
  { code: 'SA', label: 'Amazon.sa (SA)',      domain: 'amazon.sa',     currency: 'SAR', symbol: '﷼',    dataforseo: { location_code: 2682, language_code: 'ar' } },
  { code: 'SE', label: 'Amazon.se (SE)',      domain: 'amazon.se',     currency: 'SEK', symbol: 'kr',   dataforseo: { location_code: 2752, language_code: 'sv' } },
  { code: 'SG', label: 'Amazon.sg (SG)',      domain: 'amazon.sg',     currency: 'SGD', symbol: 'S$',   dataforseo: { location_code: 2702, language_code: 'en' } },
];

// Reverse-ASIN lookup is restricted to the marketplaces we have provider coverage for.
export const REVERSE_ASIN_MARKETPLACES = MARKETPLACES.filter((m) =>
  ['US', 'AE', 'EG', 'SA'].includes(m.code)
);

export function getMarketplace(code) {
  return MARKETPLACES.find((m) => m.code === code) || MARKETPLACES[0];
}
