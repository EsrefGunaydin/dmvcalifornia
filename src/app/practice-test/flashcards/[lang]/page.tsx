import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import {
  FLASHCARD_LANG_CODES,
  FLASHCARD_LANGUAGES,
  getFlashcardLang,
  totalCards,
} from '@/data/flashcards-i18n';

// Only the languages defined in the registry are valid; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return FLASHCARD_LANG_CODES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const config = getFlashcardLang(lang);
  if (!config) return {};

  const title = `${config.nativeName} DMV Flashcards (${config.englishName}) | DMV California`;
  return {
    title,
    description: config.labels.ctaSubtext,
    openGraph: {
      title,
      description: config.labels.ctaSubtext,
      type: 'website',
    },
  };
}

export default async function LanguageFlashcardIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const config = getFlashcardLang(lang);
  if (!config) notFound();

  const { labels, dir, gradient, hubHref, flag, sets } = config;

  const otherLangs = FLASHCARD_LANG_CODES.filter((code) => code !== config.code).map(
    (code) => FLASHCARD_LANGUAGES[code]
  );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className={`bg-gradient-to-r ${gradient} text-white py-14`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link
                href={hubHref}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {labels.backToTests}
              </Link>
              <div className="text-5xl mb-3">{flag}</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" dir={dir}>
                {labels.ctaHeading}
              </h1>
              <p className="text-lg text-white/90 mb-4 max-w-2xl mx-auto" dir={dir}>
                {labels.ctaSubtext}
              </p>
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {totalCards(config)} {labels.cards}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{config.nativeName} + English</span>
              </div>
            </div>
          </div>
        </section>

        {/* Set list */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center" dir={dir}>
                {labels.chooseSet}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {sets.map((set, i) => {
                  const data = set.flashcards;
                  return (
                    <Link
                      key={data.id}
                      href={`/practice-test/flashcards/${config.code}/set-${i + 1}`}
                      dir={dir}
                      className="bg-white hover:bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-3 gap-3">
                        <h3 className="font-bold text-lg text-gray-900">{data.title}</h3>
                        <span className="flex-shrink-0 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          {data.cards.length} {labels.cards}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{data.description}</p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                        {labels.ctaButton}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Other Languages */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Flashcards in Other Languages
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {otherLangs.map((other) => (
                  <Link
                    key={other.code}
                    href={`/practice-test/flashcards/${other.code}`}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 transition-colors"
                  >
                    <span className="text-2xl">{other.flag}</span>
                    <span className="text-sm font-medium text-gray-800">{other.nativeName}</span>
                  </Link>
                ))}
                <Link
                  href="/practice-test/flashcards"
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 transition-colors"
                >
                  <span className="text-2xl">🇺🇸</span>
                  <span className="text-sm font-medium text-gray-800">English</span>
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
