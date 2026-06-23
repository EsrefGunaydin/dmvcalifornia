import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import hindiQuizzesData from '@/data/hi-quizzes.json';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata: Metadata = {
  alternates: languageAlternates('hi'),
  title: 'DMV California हिन्दी टेस्ट | DMV California',
  description:
    'मुफ़्त कैलिफोर्निया DMV हिन्दी अभ्यास परीक्षा। ड्राइविंग लाइसेंस की तैयारी के लिए असली प्रश्न। California DMV practice test in Hindi.',
  keywords: [
    'DMV हिन्दी',
    'हिन्दी ड्राइविंग टेस्ट',
    'कैलिफोर्निया ड्राइवर लाइसेंस',
    'California DMV Hindi test',
    'Hindi driving test California',
    'DMV practice test in Hindi',
  ],
  openGraph: {
    title: 'DMV California हिन्दी टेस्ट',
    description: 'मुफ़्त कैलिफोर्निया DMV हिन्दी अभ्यास परीक्षा।',
    type: 'website',
  },
};

export default function HindiTestPage() {
  const quizzes = hindiQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-4">🇮🇳</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">DMV हिन्दी अभ्यास परीक्षा</h1>
              <p className="text-xl text-white/90 mb-2">
                कैलिफोर्निया DMV अभ्यास परीक्षा — असली प्रश्नों के साथ अभ्यास करें।
              </p>
              <p className="text-base text-white/80">California DMV practice test in Hindi.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">DMV हिन्दी टेस्ट</h2>

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
                        टेस्ट
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length} प्रश्न</span>
                      <span className="text-orange-600 font-semibold group-hover:underline">शुरू करें →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Road signs CTA */}
            <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-sm p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🚦 हिन्दी रोड साइन टेस्ट</h3>
              <p className="text-gray-600 mb-4">
                38 असली चिह्न तस्वीरों के साथ कैलिफोर्निया के ट्रैफिक चिह्नों का अभ्यास करें।
              </p>
              <Link
                href="/california-dmv-road-signs-test/hi"
                className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                रोड साइन टेस्ट शुरू करें →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
