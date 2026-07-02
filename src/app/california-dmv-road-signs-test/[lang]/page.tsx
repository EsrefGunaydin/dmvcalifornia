import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import SignQuiz from '@/components/SignQuiz';
import LanguagePills from '@/components/LanguagePills';
import {
  ROAD_SIGN_LANG_CODES,
  getRoadSignLang,
  getSignQuestions,
  type RoadSignLang,
} from '@/data/road-signs-i18n';

const SITE = 'https://dmvcalifornia.us';
const BASE_PATH = '/california-dmv-road-signs-test';

export const dynamicParams = false;

export function generateStaticParams() {
  return ROAD_SIGN_LANG_CODES.map((lang) => ({ lang }));
}

function hreflangAlternates() {
  const languages: Record<string, string> = {
    en: `${SITE}${BASE_PATH}`,
    'x-default': `${SITE}${BASE_PATH}`,
  };
  for (const code of ROAD_SIGN_LANG_CODES) languages[code] = `${SITE}${BASE_PATH}/${code}`;
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const cfg = getRoadSignLang(lang);
  if (!cfg) return {};
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: `${SITE}${BASE_PATH}/${lang}`, languages: hreflangAlternates() },
    openGraph: { title: cfg.metaTitle, description: cfg.metaDescription, type: 'website' },
  };
}

export default async function LocalizedRoadSignsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getRoadSignLang(lang);
  if (!cfg) notFound();

  const questions = getSignQuestions(lang as RoadSignLang);
  const allTestsLabel = cfg.allTestsLabel;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <LanguagePills active={lang} />
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {cfg.badge}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight" dir={cfg.dir}>
                {cfg.h1}
              </h1>
              <p className="text-xl text-white/90" dir={cfg.dir}>
                {cfg.intro}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <SignQuiz questions={questions} labels={cfg.labels} dir={cfg.dir} />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-3" dir={cfg.dir}>
                {cfg.faq.map((f, i) => (
                  <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                      {f.q}
                      <span className="text-primary group-open:rotate-180 transition-transform ml-2">▾</span>
                    </summary>
                    <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Keep studying */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{cfg.keepStudying}</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/practice-test" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  {allTestsLabel} →
                </Link>
                <Link href="/california-dmv-road-signs-test" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  English version
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
