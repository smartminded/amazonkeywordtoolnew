import { useTranslation } from 'react-i18next';
import { Button } from '@/components/core/button';

export default function LearnMoreCta() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12 lg:px-8 xl:px-0">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-5 py-10 sm:px-0 sm:py-16">
          <div className="relative z-20 mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.2em] text-white sm:text-5xl sm:leading-13">
              {t('cta.title')}
            </h2>
            <p className="px-5 text-center text-base font-normal text-white/80">
              {t('cta.subtitle')}
            </p>

            <div className="mt-8 flex justify-center">
              <Button className="w-full sm:w-auto">
                <a href={t('links.business')}>{t('cta.button')}</a>
              </Button>
            </div>
          </div>

          {/* Top-right blurred gradient blob */}
          <svg
            className="absolute right-0 top-0"
            width="488"
            height="352"
            viewBox="0 0 488 352"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <g filter="url(#akt_cta_tr_a)">
              <path d="M272.647 200.912L535.988 -143.586L649.613 -143.586L272.647 200.912Z" fill="#A855F7" />
            </g>
            <g filter="url(#akt_cta_tr_b)">
              <path d="M120.613 231.908L412.65 -150.129L538.656 -150.129L120.613 231.908Z" fill="#5E84FC" />
            </g>
            <defs>
              <filter id="akt_cta_tr_a" x="152.647" y="-263.586" width="616.966" height="584.498" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
              </filter>
              <filter id="akt_cta_tr_b" x="0.613281" y="-270.129" width="658.043" height="622.037" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
              </filter>
            </defs>
          </svg>

          {/* Bottom-left blurred gradient blob */}
          <svg
            className="absolute bottom-0 left-0"
            width="490"
            height="315"
            viewBox="0 0 490 315"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <g filter="url(#akt_cta_bl_a)">
              <path d="M217.158 151.071L-46.1813 495.568L-159.806 495.568L217.158 151.071Z" fill="#A855F7" />
            </g>
            <g filter="url(#akt_cta_bl_b)">
              <path d="M369.194 120.074L77.1588 502.111L-48.8476 502.111L369.194 120.074Z" fill="#5E84FC" />
            </g>
            <defs>
              <filter id="akt_cta_bl_a" x="-279.806" y="31.0708" width="616.964" height="584.498" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
              </filter>
              <filter id="akt_cta_bl_b" x="-168.848" y="0.0742188" width="658.042" height="622.037" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
