import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';
import { allFlashcardSetParams, getFlashcardSet } from '@/data/flashcards-i18n';

// Only the (lang, set) pairs in the registry are valid; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return allFlashcardSetParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; set: string }>;
}): Promise<Metadata> {
  const { lang, set } = await params;
  const found = getFlashcardSet(lang, set);
  if (!found) return {};

  const data = found.set.flashcards;
  return {
    title: `${data.title} | DMV California`,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: 'website',
    },
  };
}

export default async function FlashcardDeckPage({
  params,
}: {
  params: Promise<{ lang: string; set: string }>;
}) {
  const { lang, set } = await params;
  const found = getFlashcardSet(lang, set);
  if (!found) notFound();

  const { config, set: flashcardSet } = found;
  const { labels, dir, gradient, flag, code } = config;
  const data = flashcardSet.flashcards;

  // Sibling sets for quick navigation
  const otherSets = config.sets
    .map((s, i) => ({ s, slug: `set-${i + 1}` }))
    .filter(({ slug }) => slug !== set);

  // Next set in sequence for the finished-screen CTA
  const setIndex = parseInt(set.replace('set-', ''), 10) - 1;
  const nextSetData = config.sets[setIndex + 1];
  const nextSet = nextSetData
    ? {
        href: `/practice-test/flashcards/${code}/set-${setIndex + 2}`,
        title: nextSetData.flashcards.title,
      }
    : undefined;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className={`bg-gradient-to-r ${gradient} text-white py-12`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link
                href={`/practice-test/flashcards/${code}`}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {config.nativeName} {flag}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" dir={dir}>
                {data.title}
              </h1>
              <p className="text-lg text-white/90 mb-2" dir={dir}>
                {data.description}
              </p>
              <div className="flex items-center justify-center gap-3 text-sm mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {data.cards.length} {labels.cards}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{config.nativeName} + English</span>
              </div>
              <div className="flex justify-center mt-5">
                <QuizViewTracker
                  quizId={`flashcards-${code}-${set}`}
                  baseViews={getBaseViews(`flashcards-${code}-${set}`)}
                  variant="prominent"
                  label="people have studied with these flashcards"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Flashcard Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <FlashcardDeck
              cards={data.cards}
              title={data.title}
              dir={dir}
              labels={labels}
              deckId={`${code}-${set}`}
              nextSet={nextSet}
            />
          </div>
        </section>

        {/* Other Sets */}
        {otherSets.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" dir={dir}>
                  {labels.chooseSet}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {otherSets.map(({ s, slug }) => (
                    <Link
                      key={s.flashcards.id}
                      href={`/practice-test/flashcards/${code}/${slug}`}
                      dir={dir}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-5 border border-gray-200 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-bold text-gray-900">{s.flashcards.title}</h3>
                        <span className="flex-shrink-0 bg-white text-gray-800 px-3 py-1 rounded-full text-sm border">
                          {s.flashcards.cards.length} {labels.cards}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
