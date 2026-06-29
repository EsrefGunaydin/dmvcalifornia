import Link from 'next/link';
import { Metadata } from 'next';
import { Bike } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import motorcycleQuizzesData from '@/data/motorcycle-quizzes.json';

export const metadata: Metadata = {
  title: 'California Motorcycle (Class M) Practice Test | DMV California',
  description:
    'Free California Motorcycle Class M license practice test. Real DMV questions covering helmets, lane position, braking, cornering, and group riding to prepare for the official motorcycle written test.',
  keywords: [
    'California motorcycle test',
    'Class M license California',
    'DMV motorcycle practice test',
    'California motorcycle handbook practice',
    'Class M written test',
    'motorcycle permit California',
  ],
  openGraph: {
    title: 'California Motorcycle (Class M) Practice Test',
    description: 'Free California Class M motorcycle license practice test with real DMV questions.',
    type: 'website',
  },
};

export default function MotorcycleTestPage() {
  const quizzes = motorcycleQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Bike className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">California Motorcycle Practice Test</h1>
              <p className="text-xl text-white/90 mb-2">
                Class M license practice test — covers helmets, lane position, braking, cornering & group riding.
              </p>
              <p className="text-base text-white/80">
                Free, no signup, real questions from the California Motorcycle Handbook.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Motorcycle (Class M) Tests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-gray-200"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Class M
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} questions</span>
                      <span className="text-gray-900 font-semibold group-hover:underline">Start →</span>
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
