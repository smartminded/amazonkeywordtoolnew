import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KeywordIdeasTab from '@/components/KeywordIdeasTab';
import ProductKeywordsTab from '@/components/ProductKeywordsTab';
import LearnMoreCta from '@/components/LearnMoreCta';
import UsageGateProvider from '@/components/UsageGateProvider';
import './App.css';

// The page is split into three React mount points to allow PHP to server-
// render the hero (H1) and the long-form marketing content between them:
//
//   #akt-navbar  → <NavbarApp />          (React)
//   <header>      ← server-rendered hero  (PHP)
//   #akt-tool    → <ToolApp />            (React, wrapped in UsageGateProvider)
//   <section>     ← server-rendered content (PHP)
//   #akt-bottom  → <BottomApp />          (React)
//
// SEO benefit: Googlebot's first-pass HTML now contains the H1 and all
// seven content-section headings + paragraphs without needing JS execution.

const TABS = [
  { id: 'ideas',   icon: Search,  labelKey: 'tabs.ideas' },
  { id: 'product', icon: Package, labelKey: 'tabs.product' },
];

export function NavbarApp() {
  return <Navbar />;
}

export function ToolApp() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ideas');

  return (
    <UsageGateProvider>
      <section className="bg-gray-50 px-6 pt-6 pb-0 sm:px-10 md:px-12 md:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
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
