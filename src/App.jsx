import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Package, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KeywordIdeasTab from '@/components/KeywordIdeasTab';
import ProductKeywordsTab from '@/components/ProductKeywordsTab';
import LearnMoreCta from '@/components/LearnMoreCta';
import UsageGateProvider from '@/components/UsageGateProvider';
import './App.css';

// The page is split into TWO React mount points so the 7-section marketing
// content can be server-rendered as HTML between them (for Google to crawl
// without executing JavaScript). The H1 stays in TopApp — still rendered
// by React — so visual design / behaviour is unchanged.

const TABS = [
  { id: 'ideas',    icon: Search,  labelKey: 'tabs.ideas' },
  { id: 'product',  icon: Package, labelKey: 'tabs.product' },
];

export function TopApp() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ideas');

  return (
    <UsageGateProvider>
      <div className="bg-gray-50">
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <section className="flex flex-1 items-center bg-gray-50 px-6 pb-32 pt-8 sm:px-10 md:px-12 md:pb-40 md:pt-12 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <div className="mx-auto mb-14 max-w-3xl text-center">
                <span className="mb-4 inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-700">
                  <Sparkles className="h-3 w-3" />
                  {t('hero.eyebrow')}
                </span>
                <h1 className="text-balance text-3xl leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
                  <span className="bg-gradient-to-br from-gray-900 via-gray-900 to-primary-700 bg-clip-text text-transparent">
                    {t('hero.title')}
                  </span>
                </h1>
              </div>

              <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex justify-center">
                  <div className="inline-flex rounded-xl bg-white p-1 shadow-sm">
                    {TABS.map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={
                            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ' +
                            (active
                              ? 'bg-primary-500 text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50')
                          }
                          aria-pressed={active}
                        >
                          <Icon className="h-4 w-4" />
                          {t(tab.labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeTab === 'ideas' && <KeywordIdeasTab />}
                {activeTab === 'product' && <ProductKeywordsTab />}
              </div>
            </div>
          </section>
        </div>
      </div>
    </UsageGateProvider>
  );
}

export function BottomApp() {
  return (
    <>
      <LearnMoreCta />
      <Footer />
    </>
  );
}
