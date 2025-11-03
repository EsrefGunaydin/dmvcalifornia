import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import flashcardsData from '@/data/flashcards-5.json';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DMV California Practice Flashcards - Set 5 | DMV California',
  description: '15 essential DMV questions covering intersections, pedestrians, emergency situations, and safe driving practices for California driving test preparation.',
  keywords: ['DMV flashcards', 'California driving test', 'DMV practice', 'study flashcards', 'intersections', 'pedestrians', 'emergency vehicles'],
  openGraph: {
    title: 'DMV California Practice Flashcards - Set 5',
    description: '15 essential DMV questions covering intersections, pedestrians, emergency situations, and safe driving practices',
    type: 'website',
  }
};

export default function FlashcardsSet5Page() {
  const flashcards = flashcardsData.flashcards;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link
                href="/practice-test/flashcards"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Flashcards
              </Link>
              <h1 className="text-4xl font-bold mb-4">
                {flashcards.title}
              </h1>
              <p className="text-xl text-white/90 mb-2">
                {flashcards.description}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {flashcards.cards.length} Cards
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  Questions 31-45
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Flashcard Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <FlashcardDeck
              cards={flashcards.cards}
              title={flashcards.title}
            />
          </div>
        </section>

        {/* Navigation to Other Sets */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Other Flashcard Sets
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  href="/practice-test/flashcards/set-1"
                  className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition-colors border-2 border-blue-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-blue-900">Set 1</h3>
                    <span className="bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-sm">
                      15 Cards
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Questions 1-15: BAC limits, DMV notifications, turning signals
                  </p>
                </Link>

                <Link
                  href="/practice-test/flashcards/set-2"
                  className="bg-green-50 hover:bg-green-100 rounded-lg p-6 transition-colors border-2 border-green-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-green-900">Set 2</h3>
                    <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm">
                      15 Cards
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Questions 16-30: Right-of-way, safety rules, emergency vehicles
                  </p>
                </Link>

                <Link
                  href="/practice-test/flashcards/set-3"
                  className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition-colors border-2 border-purple-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-purple-900">Set 3</h3>
                    <span className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm">
                      15 Cards
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Questions 46-60: Lane changes, U-turns, cargo rules
                  </p>
                </Link>

                <Link
                  href="/practice-test/flashcards/set-4"
                  className="bg-orange-50 hover:bg-orange-100 rounded-lg p-6 transition-colors border-2 border-orange-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-orange-900">Set 4</h3>
                    <span className="bg-orange-200 text-orange-900 px-3 py-1 rounded-full text-sm">
                      12 Cards
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Questions 61-72: Peace officers, medications, parking
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Study Tips */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Study Tips
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-teal-50 rounded-lg p-6">
                  <div className="text-3xl mb-3">🔄</div>
                  <h3 className="font-bold text-lg mb-2">Repeat & Review</h3>
                  <p className="text-gray-700 text-sm">
                    Go through the deck multiple times until you can answer each question confidently.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-3xl mb-3">⏱️</div>
                  <h3 className="font-bold text-lg mb-2">Time Yourself</h3>
                  <p className="text-gray-700 text-sm">
                    Try to answer each question quickly to simulate real test conditions.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-3xl mb-3">📝</div>
                  <h3 className="font-bold text-lg mb-2">Write It Down</h3>
                  <p className="text-gray-700 text-sm">
                    Write down answers you struggle with to reinforce your memory.
                  </p>
                </div>
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
