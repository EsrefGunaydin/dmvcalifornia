import Link from 'next/link';
import { Metadata } from 'next';
import { Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import commercialQuizzesData from '@/data/commercial-quizzes.json';

export const metadata: Metadata = {
  title: 'California Commercial Driver (Class A/B) Practice Test | DMV California',
  description:
    'Free California Commercial Driver License (CDL) Class A/B practice test. Real DMV questions covering general knowledge, air brakes, combination vehicles, pre-trip inspection, hazmat, and tank vehicles.',
  keywords: [
    'California CDL test',
    'Class A license California',
    'Class B license California',
    'commercial driver practice test',
    'CDL practice test',
    'California commercial driver handbook',
    'CDL general knowledge',
  ],
  openGraph: {
    title: 'California Commercial Driver (Class A/B) Practice Test',
    description: 'Free California CDL Class A/B practice test with real DMV questions.',
    type: 'website',
  },
};

export default function CommercialTestPage() {
  const quizzes = commercialQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-amber-700 to-amber-500 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">California CDL Practice Test</h1>
              <p className="text-xl text-white/90 mb-2">
                Class A/B Commercial Driver License practice — general knowledge, air brakes, combination vehicles & pre-trip inspection.
              </p>
              <p className="text-base text-white/80">
                Free, no signup, real questions for the California CDL written exam.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Commercial (Class A/B) Tests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-amber-100"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                        Class A/B
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} questions</span>
                      <span className="text-amber-700 font-semibold group-hover:underline">Start →</span>
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
