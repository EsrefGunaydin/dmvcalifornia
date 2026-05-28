import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import tagalogQuizzesData from '@/data/tagalog-quizzes.json';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata: Metadata = {
  alternates: languageAlternates('tl'),
  title: 'DMV California Tagalog Test | DMV California',
  description:
    'Libreng California DMV practice test sa Tagalog. Mga totoong tanong mula sa opisyal na pagsusulit upang ihanda ka para sa lisensya sa pagmamaneho. California DMV practice test in Tagalog/Filipino.',
  keywords: [
    'DMV Tagalog',
    'pagsusulit sa pagmamaneho Tagalog',
    'lisensya sa pagmamaneho California',
    'California DMV Tagalog test',
    'Filipino driving test California',
    'DMV practice test in Tagalog',
  ],
  openGraph: {
    title: 'DMV California Tagalog Test',
    description: 'Libreng California DMV practice test sa Tagalog na may mga totoong tanong.',
    type: 'website',
  },
};

export default function TagalogTestPage() {
  const quizzes = tagalogQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-yellow-500 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-4">🇵🇭</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">DMV Pagsusulit sa Tagalog</h1>
              <p className="text-xl text-white/90 mb-2">
                Libreng California DMV practice test — magsanay sa mga totoong tanong.
              </p>
              <p className="text-base text-white/80">California DMV practice test in Tagalog/Filipino.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Mga DMV Tagalog Test</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-yellow-100"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                        Pagsusulit
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} tanong</span>
                      <span className="text-yellow-600 font-semibold group-hover:underline">Simulan →</span>
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
