import Link from 'next/link';
import { Metadata } from 'next';
import { Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import LanguageFlashcardCTA from '@/components/flashcards/LanguageFlashcardCTA';
import punjabiQuizzesData from '@/data/punjabi-quizzes.json';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata: Metadata = {
  alternates: languageAlternates('pa'),
  title: 'DMV California ਪੰਜਾਬੀ ਟੈਸਟ | DMV California',
  description:
    'ਮੁਫ਼ਤ ਕੈਲੀਫੋਰਨੀਆ DMV ਅਭਿਆਸ ਟੈਸਟ ਪੰਜਾਬੀ ਵਿੱਚ। ਡਰਾਈਵਿੰਗ ਲਾਇਸੈਂਸ ਦੀ ਤਿਆਰੀ ਲਈ ਅਸਲ ਪ੍ਰਸ਼ਨ। California DMV practice test in Punjabi.',
  keywords: [
    'DMV ਪੰਜਾਬੀ',
    'ਪੰਜਾਬੀ ਡਰਾਈਵਿੰਗ ਟੈਸਟ',
    'ਕੈਲੀਫੋਰਨੀਆ ਡਰਾਈਵਰ ਲਾਇਸੈਂਸ',
    'California DMV Punjabi test',
    'Punjabi driving test California',
    'DMV practice test in Punjabi',
  ],
  openGraph: {
    title: 'DMV California ਪੰਜਾਬੀ ਟੈਸਟ',
    description: 'ਮੁਫ਼ਤ ਕੈਲੀਫੋਰਨੀਆ DMV ਅਭਿਆਸ ਟੈਸਟ ਪੰਜਾਬੀ ਵਿੱਚ।',
    type: 'website',
  },
};

export default function PunjabiTestPage() {
  const quizzes = punjabiQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">DMV ਪੰਜਾਬੀ ਅਭਿਆਸ ਟੈਸਟ</h1>
              <p className="text-xl text-white/90 mb-2">
                ਕੈਲੀਫੋਰਨੀਆ DMV ਅਭਿਆਸ ਟੈਸਟ — ਅਸਲ ਪ੍ਰਸ਼ਨਾਂ ਨਾਲ ਅਭਿਆਸ ਕਰੋ।
              </p>
              <p className="text-base text-white/80">California DMV practice test in Punjabi.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">DMV ਪੰਜਾਬੀ ਟੈਸਟ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-orange-100"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        ਟੈਸਟ
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} ਪ੍ਰਸ਼ਨ</span>
                      <span className="text-orange-600 font-semibold group-hover:underline">ਸ਼ੁਰੂ ਕਰੋ →</span>
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
            <LanguageFlashcardCTA lang="pa" />
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
