import Link from 'next/link';
import { Metadata } from 'next';
import { Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import LanguageFlashcardCTA from '@/components/flashcards/LanguageFlashcardCTA';
import vietnameseQuizzesData from '@/data/vietnamese-quizzes.json';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata: Metadata = {
  alternates: languageAlternates('vi'),
  title: 'DMV California Bài Thi Tiếng Việt',
  description:
    'Bài thi thử DMV California miễn phí bằng tiếng Việt. Câu hỏi thực tế từ kỳ thi chính thức để chuẩn bị cho bằng lái xe. California DMV practice test in Vietnamese.',
  keywords: [
    'DMV tiếng Việt',
    'bài thi lái xe DMV',
    'bằng lái xe California',
    'California DMV Vietnamese test',
    'Vietnamese driving test California',
    'DMV practice test in Vietnamese',
  ],
  openGraph: {
    title: 'DMV California Bài Thi Tiếng Việt',
    description: 'Bài thi thử DMV California miễn phí bằng tiếng Việt với câu hỏi thực tế.',
    type: 'website',
  },
};

export default function VietnameseTestPage() {
  const quizzes = vietnameseQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-red-600 to-yellow-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Bài Thi DMV Tiếng Việt</h1>
              <p className="text-xl text-white/90 mb-2">
                Bài thi thử DMV California miễn phí — luyện tập với câu hỏi thực tế.
              </p>
              <p className="text-base text-white/80">California DMV practice test in Vietnamese.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Bài Thi DMV Tiếng Việt</h2>

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
                        Bài thi
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} câu hỏi</span>
                      <span className="text-red-600 font-semibold group-hover:underline">Bắt đầu →</span>
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
            <LanguageFlashcardCTA lang="vi" />
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
