import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: 'California DMV Türkçe Test | DMV California',
  description: 'California DMV sınav soruları Türkçe. Kaliforniya ehliyet sınavına hazırlanmak için ücretsiz Türkçe pratik testleri.',
};

export default function TurkishTestPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-4">🇹🇷</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                DMV Driving Test in Turkish / DMV Türkçe Test
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Kaliforniya DMV sürücü belgesi sınavı için Türkçe pratik testleri.
                Gerçek DMV sorularıyla pratik yapın ve sınavınıza hazırlanın.
              </p>
            </div>
          </div>
        </section>

        {/* Turkish Tests Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Turkish DMV Tests / Türkçe DMV Testleri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Test 1 */}
              <Link
                href="/dmv-turkish-test/test-1"
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-red-100"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Test 1
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    DMV Türkçe Sorular #1
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Kaliforniya DMV sınavı için Türkçe pratik soruları. Temel trafik kuralları ve işaretler.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-red-600 font-semibold group-hover:underline">
                      Teste Başla
                    </span>
                    <svg className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Test 2 */}
              <Link
                href="/dmv-turkish-test/test-2"
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-red-100"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Test 2
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    DMV Türkçe Sorular #2
                  </h3>
                  <p className="text-gray-600 mb-4">
                    İleri seviye trafik kuralları ve güvenli sürüş teknikleri için Türkçe sorular.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-red-600 font-semibold group-hover:underline">
                      Teste Başla
                    </span>
                    <svg className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Turkish Sign Test */}
              <Link
                href="/dmv-turkish-test/dmv-california-turkce-trafik-isareti-testi"
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-red-100"
              >
                <div className="p-6">
                  <div className="mb-4 flex gap-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      İşaret Testi
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Popüler
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    Trafik İşareti Testi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    24 soruluk görsel trafik işareti tanıma testi. Tüm sorular resimli!
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-red-600 font-semibold group-hover:underline">
                      Teste Başla →
                    </span>
                    <svg className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
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
