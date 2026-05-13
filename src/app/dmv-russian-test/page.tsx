import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import russianQuizzesData from '@/data/russian-quizzes.json';

export const metadata: Metadata = {
  title: 'DMV California Тест на русском | DMV California',
  description:
    'Бесплатный пробный тест DMV Калифорнии на русском языке. Реальные вопросы из официального экзамена для подготовки к водительским правам. California DMV practice test in Russian with real questions.',
  keywords: [
    'DMV на русском',
    'тест ДМВ Калифорния',
    'водительские права Калифорния',
    'California DMV Russian test',
    'Russian driving test California',
    'DMV practice test in Russian',
  ],
  openGraph: {
    title: 'DMV California Тест на русском',
    description: 'Бесплатный пробный тест DMV Калифорнии на русском с реальными вопросами.',
    type: 'website',
  },
};

export default function RussianTestPage() {
  const quizzes = russianQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-red-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-4">🇷🇺</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">DMV Тест на русском языке</h1>
              <p className="text-xl text-white/90 mb-2">
                Пробный тест Калифорнийского DMV — практикуйтесь с реальными вопросами.
              </p>
              <p className="text-base text-white/80">California DMV practice test in Russian.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Русские тесты DMV</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-blue-100"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        Тест
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} вопросов</span>
                      <span className="text-blue-600 font-semibold group-hover:underline">Начать →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
