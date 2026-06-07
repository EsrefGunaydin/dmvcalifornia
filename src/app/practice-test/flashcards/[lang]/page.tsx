import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import {
  FLASHCARD_LANG_CODES,
  FLASHCARD_LANGUAGES,
  getFlashcardLang,
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

  const set = config.data.flashcards;
  return {
    title: `${set.title} | DMV California`,
    description: set.description,
    openGraph: {
      title: set.title,
      description: set.description,
      type: 'website',
    },
  };
}

export default async function LanguageFlashcardsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const config = getFlashcardLang(lang);
  if (!config) notFound();

  const set = config.data.flashcards;
  const { labels, dir, gradient, hubHref, flag } = config;

  // Other languages to suggest below the deck
  const otherLangs = FLASHCARD_LANG_CODES.filter((code) => code !== config.code).map(
    (code) => FLASHCARD_LANGUAGES[code]
  );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className={`bg-gradient-to-r ${gradient} text-white py-12`}>
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4" dir={dir}>
                {set.title}
              </h1>
              <p className="text-lg text-white/90 mb-2" dir={dir}>
                {set.description}
              </p>
              <div className="flex items-center justify-center gap-3 text-sm mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full">{labels.cardsCount}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{config.nativeName} + English</span>
              </div>
            </div>
          </div>
        </section>

        {/* Flashcard Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <FlashcardDeck cards={set.cards} title={set.title} dir={dir} labels={labels} />
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
