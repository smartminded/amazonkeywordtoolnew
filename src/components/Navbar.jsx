import {
  MenuHamburger1,
  Xmark2x,
  Layout22,
} from '@tailgrids/icons';
import { Search, TrendingUp, Filter, Shuffle, FileText } from 'lucide-react';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/smartminded_black_logo_no_background-768x173.webp';

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [freeToolsOpen, setFreeToolsOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [couponsOpen, setCouponsOpen] = useState(false);
  const [mobileFreeToolsOpen, setMobileFreeToolsOpen] = useState(false);
  const [mobileGuidesOpen, setMobileGuidesOpen] = useState(false);
  const [mobileReviewsOpen, setMobileReviewsOpen] = useState(false);
  const [mobileCouponsOpen, setMobileCouponsOpen] = useState(false);

  return (
    <nav className="bg-white py-6 shadow-sm lg:py-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href={t('links.home')}>
              <img
                src={logo}
                alt="SMARTMINDED"
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 focus:outline-none lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <Xmark2x /> : <MenuHamburger1 />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center lg:flex">
            <div className="flex items-center space-x-1">

              {/* Free Tools Mega Menu */}
              <div
                className="relative px-3.5 py-8"
                onMouseEnter={() => setFreeToolsOpen(true)}
                onMouseLeave={() => setFreeToolsOpen(false)}
              >
                <button className="hover:text-primary-500 flex items-center text-sm font-medium text-gray-800 transition-colors">
                  {t('navbar.freeTools')}
                  <svg
                    className="ml-1.5 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 12 7"
                  >
                    <path
                      d="M0.75 0.75L5.95833 5.95833L11.1667 0.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Mega Menu Dropdown */}
                {freeToolsOpen && (
                  <div className="absolute left-1/2 z-50 mt-8 w-screen max-w-4xl -translate-x-1/2 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2">
                      {/* Left Column - Amazon Seller Tools */}
                      <div className="space-y-4 border-b border-gray-100 pb-6 lg:border-r lg:border-b-0 lg:pr-6 lg:pb-0">
                        <p className="px-3 py-1 text-xs font-semibold text-gray-500">{t('navbar.amazonSellerTools')}</p>
                        {[
                          {
                            icon: <Search />,
                            title: t('navbar.keywordTool'),
                            desc: t('navbar.keywordToolDesc'),
                            href: t('links.keywordTool'),
                          },
                          {
                            icon: <Layout22 />,
                            title: t('navbar.salesEstimator'),
                            desc: t('navbar.salesEstimatorDesc'),
                            href: t('links.salesEstimator'),
                          },
                          {
                            icon: <TrendingUp />,
                            title: t('navbar.trendingProducts'),
                            desc: t('navbar.trendingProductsDesc'),
                            href: t('links.trendingProducts'),
                          },
                          {
                            icon: <Filter />,
                            title: t('navbar.searchFunnelAnalyzer'),
                            desc: t('navbar.searchFunnelAnalyzerDesc'),
                            href: t('links.searchFunnelAnalyzer'),
                          },
                          {
                            icon: <Shuffle />,
                            title: t('navbar.randomProductFinder'),
                            desc: t('navbar.randomProductFinderDesc'),
                            href: t('links.randomProductFinder'),
                          },
                          {
                            icon: <FileText />,
                            title: t('navbar.productDescriptionEditor'),
                            desc: t('navbar.productDescriptionEditorDesc'),
                            href: t('links.productDescriptionEditor'),
                          },
                        ].map((item) => (
                          <a
                            key={item.title}
                            href={item.href}
                            className="group flex items-start rounded-lg p-4 transition hover:bg-gray-50"
                          >
                            <div className="group-hover:text-primary-500">
                              {item.icon}
                            </div>
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-900">
                                {item.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>

                      {/* Right Column - Name Generators */}
                      <div className="space-y-4">
                        <p className="px-3 py-1 text-xs font-semibold text-gray-500">{t('navbar.nameGenerators')}</p>
                        {[
                          { label: t('navbar.businessNameGenerator'), href: t('links.businessNameGenerator') },
                          { label: t('navbar.amazonNameGenerator'), href: t('links.amazonNameGenerator') },
                          { label: t('navbar.productNameGenerator'), href: t('links.productNameGenerator') },
                          { label: t('navbar.etsyNameGenerator'), href: t('links.etsyNameGenerator') },
                          { label: t('navbar.shopifyNameGenerator'), href: t('links.shopifyNameGenerator') },
                          { label: t('navbar.domainNameGenerator'), href: t('links.domainNameGenerator') },
                        ].map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guides Dropdown */}
              <div
                className="relative px-3.5 py-8"
                onMouseEnter={() => setGuidesOpen(true)}
                onMouseLeave={() => setGuidesOpen(false)}
              >
                <button className="hover:text-primary-500 flex items-center text-sm font-medium text-gray-800 transition-colors">
                  {t('navbar.guides')}
                  <svg
                    className="ml-1.5 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 12 7"
                  >
                    <path
                      d="M0.75 0.75L5.95833 5.95833L11.1667 0.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {guidesOpen && (
                  <div className="absolute left-0 z-50 mt-8 w-64 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="p-4 space-y-2">
                      <a href={t('links.amazonFbaExplanation')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.amazonFbaExplanation')}
                      </a>
                      <a href={t('links.becomeAmazonSeller')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.becomeAmazonSeller')}
                      </a>
                      <a href={t('links.whatToSell')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.whatToSell')}
                      </a>
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <a href={t('links.allGuides')} className="text-primary-500 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 whitespace-nowrap">
                          {t('navbar.allArticles')}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews Dropdown */}
              <div
                className="relative px-3.5 py-8"
                onMouseEnter={() => setReviewsOpen(true)}
                onMouseLeave={() => setReviewsOpen(false)}
              >
                <button className="hover:text-primary-500 flex items-center text-sm font-medium text-gray-800 transition-colors">
                  {t('navbar.reviews')}
                  <svg
                    className="ml-1.5 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 12 7"
                  >
                    <path
                      d="M0.75 0.75L5.95833 5.95833L11.1667 0.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {reviewsOpen && (
                  <div className="absolute left-0 z-50 mt-8 w-64 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="p-4 space-y-2">
                      <a href={t('links.bestAmazonTools')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.bestAmazonTools')}
                      </a>
                      <a href={t('links.jungleScoutReview')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.jungleScoutReview')}
                      </a>
                      <a href={t('links.helium10Review')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.helium10Review')}
                      </a>
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <a href={t('links.allReviews')} className="text-primary-500 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 whitespace-nowrap">
                          {t('navbar.allArticles')}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupons Dropdown */}
              <div
                className="relative px-3.5 py-8"
                onMouseEnter={() => setCouponsOpen(true)}
                onMouseLeave={() => setCouponsOpen(false)}
              >
                <button className="hover:text-primary-500 flex items-center text-sm font-medium text-gray-800 transition-colors">
                  {t('navbar.coupons')}
                  <svg
                    className="ml-1.5 h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 12 7"
                  >
                    <path
                      d="M0.75 0.75L5.95833 5.95833L11.1667 0.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {couponsOpen && (
                  <div className="absolute left-0 z-50 mt-8 w-56 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="p-4 space-y-2">
                      <a href={t('links.jungleScoutDiscount')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.jungleScoutCoupons')}
                      </a>
                      <a href={t('links.helium10Coupon')} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 whitespace-nowrap">
                        {t('navbar.helium10Coupons')}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Blog Link */}
              <a
                href={t('links.blog')}
                className="hover:text-primary-500 px-3.5 py-8 text-sm font-medium text-gray-800 transition-colors"
              >
                {t('navbar.blog')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mt-4 lg:hidden">
          <div className="space-y-1 rounded-xl bg-white px-4 pt-2 pb-4">

            {/* Mobile Free Tools Dropdown */}
            <button
              onClick={() => setMobileFreeToolsOpen(!mobileFreeToolsOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base font-medium text-gray-800 hover:bg-gray-100"
            >
              {t('navbar.freeTools')}
              <svg
                className={`h-5 w-5 transition-transform ${mobileFreeToolsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Mobile Free Tools Content */}
            {mobileFreeToolsOpen && (
              <div className="border-t border-gray-200 px-4 py-4">
                <div className="space-y-6">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-500">{t('navbar.amazonSellerTools')}</p>
                  {[
                    {
                      icon: <Search />,
                      title: t('navbar.keywordTool'),
                      desc: t('navbar.keywordToolDesc'),
                      href: t('links.keywordTool'),
                    },
                    {
                      icon: <Layout22 />,
                      title: t('navbar.salesEstimator'),
                      desc: t('navbar.salesEstimatorDesc'),
                      href: t('links.salesEstimator'),
                    },
                    {
                      icon: <TrendingUp />,
                      title: t('navbar.trendingProducts'),
                      desc: t('navbar.trendingProductsDesc'),
                      href: t('links.trendingProducts'),
                    },
                    {
                      icon: <Filter />,
                      title: t('navbar.searchFunnelAnalyzer'),
                      desc: t('navbar.searchFunnelAnalyzerDesc'),
                      href: t('links.searchFunnelAnalyzer'),
                    },
                    {
                      icon: <Shuffle />,
                      title: t('navbar.randomProductFinder'),
                      desc: t('navbar.randomProductFinderDesc'),
                      href: t('links.randomProductFinder'),
                    },
                    {
                      icon: <FileText />,
                      title: t('navbar.productDescriptionEditor'),
                      desc: t('navbar.productDescriptionEditorDesc'),
                      href: t('links.productDescriptionEditor'),
                    },
                  ].map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="group flex items-start rounded-lg p-4 transition hover:bg-gray-50"
                    >
                      <div className="group-hover:text-primary-500">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <p className="text-base font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </a>
                  ))}

                  <div className="border-t border-gray-200 pt-4">
                    <p className="px-3 py-1 text-xs font-semibold text-gray-500">{t('navbar.nameGenerators')}</p>
                    {[
                      { label: t('navbar.businessNameGenerator'), href: t('links.businessNameGenerator') },
                      { label: t('navbar.amazonNameGenerator'), href: t('links.amazonNameGenerator') },
                      { label: t('navbar.productNameGenerator'), href: t('links.productNameGenerator') },
                      { label: t('navbar.etsyNameGenerator'), href: t('links.etsyNameGenerator') },
                      { label: t('navbar.shopifyNameGenerator'), href: t('links.shopifyNameGenerator') },
                      { label: t('navbar.domainNameGenerator'), href: t('links.domainNameGenerator') },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Guides Dropdown */}
            <div>
              <button
                onClick={() => setMobileGuidesOpen(!mobileGuidesOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                {t('navbar.guides')}
                <svg
                  className={`h-5 w-5 transition-transform ${mobileGuidesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {mobileGuidesOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <a href={t('links.amazonFbaExplanation')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.amazonFbaExplanation')}
                  </a>
                  <a href={t('links.becomeAmazonSeller')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.becomeAmazonSeller')}
                  </a>
                  <a href={t('links.whatToSell')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.whatToSell')}
                  </a>
                  <a href={t('links.allGuides')} className="text-primary-500 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.allArticles')}
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Reviews Dropdown */}
            <div>
              <button
                onClick={() => setMobileReviewsOpen(!mobileReviewsOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                {t('navbar.reviews')}
                <svg
                  className={`h-5 w-5 transition-transform ${mobileReviewsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {mobileReviewsOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <a href={t('links.bestAmazonTools')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.bestAmazonTools')}
                  </a>
                  <a href={t('links.jungleScoutReview')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.jungleScoutReview')}
                  </a>
                  <a href={t('links.helium10Review')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.helium10Review')}
                  </a>
                  <a href={t('links.allReviews')} className="text-primary-500 block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.allArticles')}
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Coupons Dropdown */}
            <div>
              <button
                onClick={() => setMobileCouponsOpen(!mobileCouponsOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                {t('navbar.coupons')}
                <svg
                  className={`h-5 w-5 transition-transform ${mobileCouponsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {mobileCouponsOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <a href={t('links.jungleScoutDiscount')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.jungleScoutCoupons')}
                  </a>
                  <a href={t('links.helium10Coupon')} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    {t('navbar.helium10Coupons')}
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Blog Link */}
            <a
              href={t('links.blog')}
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100"
            >
              {t('navbar.blog')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
