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

              {/* Test 3 */}
              <Link
                href="/dmv-turkish-test/test-3"
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-red-100"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      Test 3
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    DMV Türkçe Sorular #3
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Kapsamlı DMV pratik testi. Park etme, kavşaklar ve özel durumlar.
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
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="container mx-auto px-4 py-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Türkçe Testler Hazırlanıyor
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  California DMV Türkçe test sorularımız yakında yayınlanacak.
                  Şu anda içerik hazırlama aşamasındayız.
                </p>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Neler Sunacağız?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Tam Simülasyon Testleri:</strong> Gerçek DMV testine benzer 46 soruluk testler
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Konu Bazlı Testler:</strong> Trafik işaretleri, park etme, hız limitleri ve daha fazlası
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Detaylı Açıklamalar:</strong> Her soru için Türkçe açıklamalar ve doğru cevap nedenleri
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Görsel İçerik:</strong> Trafik işaretleri ve yol durumları için resimler
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">
                      <strong>Ücretsiz Erişim:</strong> Tüm testler tamamen ücretsiz olacak
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Şu An İçin
                </h3>
                <p className="text-gray-700 mb-4">
                  Türkçe testler hazırlanırken, İngilizce pratik testlerimizi kullanabilirsiniz.
                  California DMV resmi olarak testleri birçok dilde sunmaktadır.
                </p>
                <Link
                  href="/practice-test"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  İngilizce Testlere Git
                </Link>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bildirim Almak İster misiniz?
                </h3>
                <p className="text-gray-600 mb-4">
                  Türkçe testler yayınlandığında haberdar olmak için sayfamızı takipte kalın.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                >
                  Ana Sayfaya Dön
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Resmi Kaynaklar</h3>
                <p className="text-gray-600 text-sm">
                  California DMV resmi el kitabından alınan gerçek sorular
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">2025 Güncel</h3>
                <p className="text-gray-600 text-sm">
                  En son California trafik kuralları ve güncellemeler
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Tamamen Ücretsiz</h3>
                <p className="text-gray-600 text-sm">
                  Sınırsız pratik, gizli ücret yok
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
