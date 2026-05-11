import { useTranslation, Trans } from 'react-i18next';

const SECTIONS = [
  {
    id: 's1',
    img: 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool-2.png',
    pre: ['p1', 'p2'],
    post: ['p3'],
  },
  {
    id: 's2',
    img: 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_Competition_Levels-1.png',
    pre: ['p1', 'p2', 'p3'],
  },
  {
    id: 's3',
    img: 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_keyword_tools_search_volume_market_size-1.png',
    pre: ['p1', 'p2'],
  },
  {
    id: 's4',
    img: 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_Get_Product_Keywords-1.png',
    pre: ['p1'],
  },
  {
    id: 's5',
    img: 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_marketplaces-1.png',
    pre: ['p1', 'p2'],
  },
  {
    id: 's6',
    img: 'https://www.smart-minded.com/wp-content/uploads/2026/01/Amazon_Keyword_Tool_Export_Results_max.png',
    pre: ['p1', 'p2'],
  },
  {
    id: 's7',
    img: 'https://www.smart-minded.com/wp-content/uploads/2025/10/smartminded_Amazon_Keyword_Tool_Create_a_Listing-2.png',
    pre: ['p1'],
    post: ['p2'],
  },
];

const PARA_CLASS = 'space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg';

export default function KeywordToolContent() {
  const { t } = useTranslation();
  return (
    <section className="bg-white px-6 py-16 sm:px-10 md:px-12 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-20 md:space-y-28">
        {SECTIONS.map((s) => (
          <article key={s.id}>
            <h2 className="mb-6 text-2xl tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              {t(`content.${s.id}.h`)}
            </h2>

            <div className={PARA_CLASS}>
              {s.pre.map((p) => (
                <p key={p}>
                  <Trans i18nKey={`content.${s.id}.${p}`} components={{ b: <strong /> }} />
                </p>
              ))}
            </div>

            <div className="my-10 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
              <img
                src={s.img}
                alt={t(`content.${s.id}.imgAlt`)}
                loading="lazy"
                className="block w-full"
              />
            </div>

            {s.post && (
              <div className={PARA_CLASS}>
                {s.post.map((p) => (
                  <p key={p}>
                    <Trans i18nKey={`content.${s.id}.${p}`} components={{ b: <strong /> }} />
                  </p>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
