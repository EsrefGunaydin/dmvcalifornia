import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import farsiQuizzesData from '@/data/farsi-quizzes.json';

export const metadata: Metadata = {
  title: 'DMV California آزمون فارسی | DMV California',
  description:
    'آزمون شبیه‌ساز کالیفرنیا DMV به زبان فارسی. سوالات تمرینی رسمی برای آمادگی برای امتحان گواهینامه رانندگی کالیفرنیا. California DMV practice test in Farsi/Persian with real questions.',
  keywords: [
    'DMV فارسی',
    'آزمون فارسی DMV',
    'گواهینامه رانندگی کالیفرنیا',
    'California DMV Farsi test',
    'Persian driving test California',
    'DMV practice test in Farsi',
  ],
  openGraph: {
    title: 'DMV California آزمون فارسی',
    description: 'آزمون شبیه‌ساز کالیفرنیا DMV به زبان فارسی با سوالات واقعی.',
    type: 'website',
  },
};

export default function FarsiTestPage() {
  const quizzes = farsiQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50" dir="rtl">
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-4">🇮🇷</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">آزمون DMV به زبان فارسی</h1>
              <p className="text-xl text-white/90 mb-2">
                آزمون شبیه‌ساز کالیفرنیا DMV - تمرین با سوالات رسمی.
              </p>
              <p className="text-base text-white/80" dir="ltr">
                California DMV practice test in Farsi/Persian.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">آزمون‌های DMV فارسی</h2>

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
                        آزمون فارسی
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} سوال</span>
                      <span className="text-green-600 font-semibold group-hover:underline">شروع ←</span>
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
