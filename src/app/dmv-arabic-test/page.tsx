import Link from 'next/link';
import { Metadata } from 'next';
import { Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import LanguageFlashcardCTA from '@/components/flashcards/LanguageFlashcardCTA';
import arabicQuizzesData from '@/data/arabic-quizzes.json';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata: Metadata = {
  alternates: languageAlternates('ar'),
  title: 'DMV California اختبار عربي | DMV California',
  description:
    'اختبار DMV كاليفورنيا مجاناً باللغة العربية. أسئلة حقيقية من الامتحان الرسمي للتحضير لرخصة القيادة في كاليفورنيا. California DMV practice test in Arabic.',
  keywords: [
    'DMV بالعربية',
    'اختبار DMV عربي',
    'رخصة قيادة كاليفورنيا',
    'California DMV Arabic test',
    'Arabic driving test California',
    'DMV practice test in Arabic',
  ],
  openGraph: {
    title: 'DMV California اختبار عربي',
    description: 'اختبار DMV كاليفورنيا مجاناً باللغة العربية مع أسئلة حقيقية.',
    type: 'website',
  },
};

export default function ArabicTestPage() {
  const quizzes = arabicQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50" dir="rtl">
        <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">اختبار DMV باللغة العربية</h1>
              <p className="text-xl text-white/90 mb-2">
                اختبار DMV كاليفورنيا مجاناً — تدرب بأسئلة حقيقية.
              </p>
              <p className="text-base text-white/80" dir="ltr">
                California DMV practice test in Arabic with real questions.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">اختبارات DMV بالعربية</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-green-100"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        اختبار عربي
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} سؤال</span>
                      <span className="text-green-700 font-semibold group-hover:underline">ابدأ ←</span>
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
            <LanguageFlashcardCTA lang="ar" />
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
