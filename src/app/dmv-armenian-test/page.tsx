import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import LanguageFlashcardCTA from '@/components/flashcards/LanguageFlashcardCTA';
import armenianQuizzesData from '@/data/armenian-quizzes.json';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata: Metadata = {
  alternates: languageAlternates('hy'),
  title: 'DMV California Հայերեն Թեստ | DMV California',
  description:
    'Անվճար Կալիֆորնիայի DMV փորձնական թեստ հայերենով։ Իրական հարցեր պաշտոնական քննությունից վարորդական իրավունքի համար նախապատրաստվելու համար։ California DMV practice test in Armenian.',
  keywords: [
    'DMV հայերեն',
    'Հայերեն վարորդական թեստ',
    'Կալիֆորնիա վարորդական իրավունք',
    'California DMV Armenian test',
    'Armenian driving test California',
    'DMV practice test in Armenian',
  ],
  openGraph: {
    title: 'DMV California Հայերեն Թեստ',
    description: 'Անվճար Կալիֆորնիայի DMV փորձնական թեստ հայերենով իրական հարցերով։',
    type: 'website',
  },
};

export default function ArmenianTestPage() {
  const quizzes = armenianQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-red-700 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-4">🇦🇲</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">DMV Թեստ Հայերենով</h1>
              <p className="text-xl text-white/90 mb-2">
                Կալիֆորնիայի DMV փորձնական թեստ — մարզվեք իրական հարցերով։
              </p>
              <p className="text-base text-white/80">California DMV practice test in Armenian.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">DMV Հայերեն Թեստեր</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-red-100"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Թեստ
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} հարց</span>
                      <span className="text-red-700 font-semibold group-hover:underline">Սկսել →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        {/* Flashcards CTA */}
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <LanguageFlashcardCTA lang="hy" />
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
