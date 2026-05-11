import { useTranslation } from 'react-i18next';
import logo from '@/assets/smartminded_black_logo_no_background-768x173.webp';

const languageLinks = [
  { label: 'English',    href: 'https://www.smart-minded.com/en/amazon-keyword-tool/' },
  { label: 'German',     href: 'https://www.smart-minded.com/amazon-keyword-tool/' },
  { label: 'French',     href: 'https://www.smart-minded.com/fr/amazon-keyword-tool/' },
  { label: 'Italian',    href: 'https://www.smart-minded.com/it/amazon-keyword-tool/' },
  { label: 'Spanish',    href: 'https://www.smart-minded.com/es/amazon-keyword-tool/' },
  { label: 'Portuguese', href: 'https://www.smart-minded.com/pt/amazon-keyword-tool/' },
];

export default function Footer() {
  const { t } = useTranslation();

  const companyLinks = [
    { label: t('footer.blog'), href: t('links.blog') },
    { label: t('footer.about'), href: t('links.about') },
    { label: t('footer.contact'), href: t('links.contact') },
  ];

  const legalLinks = [
    { label: t('footer.terms'), href: t('links.terms') },
    { label: t('footer.privacy'), href: t('links.privacy') },
    { label: t('footer.affiliate'), href: t('links.affiliate') },
  ];
  return (
    <footer className="bg-white pt-28">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-12 lg:px-8 xl:px-0">
        {/* <!-- Main Footer --> */}
        <div className="py-18">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
            {/* <!-- Logo and Description --> */}
            <div className="lg:col-span-2 lg:pr-30">
              <a href={t('links.home')} className="mb-5 block">
                <img
                  src={logo}
                  alt="SMARTMINDED Logo"
                  className="h-10 w-auto"
                />
              </a>
              <p className="text-base text-gray-500">
                {t('footer.tagline')}
              </p>
            </div>

            {/* <!-- Company Links --> */}
            <div>
              <h3 className="mb-4 text-xl font-medium text-gray-800">
                {t('footer.company')}
              </h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-primary-500 text-base text-gray-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* <!-- Legal Links --> */}
            <div>
              <h3 className="mb-4 text-xl font-medium text-gray-800">
                {t('footer.legal')}
              </h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-primary-500 text-base text-gray-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* <!-- Connect Links --> */}
            <div>
              <h3 className="mb-4 text-xl font-medium text-gray-800">
                {t('footer.connect')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.youtube.com/@smartmindedcom"
                    className="hover:text-primary-500 font-medium text-gray-500"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/smartmindedcom"
                    className="hover:text-primary-500 font-medium text-gray-500"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/smartmindedcom/"
                    className="hover:text-primary-500 font-medium text-gray-500"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            {/* <!-- Language Links --> */}
            <div>
              <h3 className="mb-4 text-xl font-medium text-gray-800">
                {t('footer.language')}
              </h3>
              <ul className="space-y-2">
                {languageLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-primary-500 text-base text-gray-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* <!-- Bottom Bar --> */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-base text-gray-500">
              &copy; {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-4">
              <a
                href={t('links.terms')}
                className="hover:text-primary-500 font-medium text-gray-500"
              >
                {t('footer.terms')}
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={t('links.privacy')}
                className="hover:text-primary-500 font-medium text-gray-500"
              >
                {t('footer.privacy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
