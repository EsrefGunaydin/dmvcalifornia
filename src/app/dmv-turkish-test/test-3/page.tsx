import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: 'DMV Türkçe Sorular #3 | DMV California',
  description: 'California DMV Türkçe Test #3. Kapsamlı pratik testi - Park etme, kavşaklar ve özel durumlar.',
};

export default function TurkishTest3Page() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                DMV Turkish Test #3 / DMV Türkçe Test #3
              </h1>
              <p className="text-xl text-white/90">
                Comprehensive Practice Test - Parking, Intersections & Special Situations / Kapsamlı Pratik Testi - Park, Kavşaklar ve Özel Durumlar
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Test Hazırlanıyor
            </h2>
            <p className="text-gray-600 mb-6">
              Bu test şu anda hazırlık aşamasındadır. Sorular yakında eklenecektir.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Kaynak: mebehliyetsinavsorulari.com/dmv-turkce-sorulari-3.html
            </p>
            <Link
              href="/dmv-turkish-test"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Türkçe Testler Sayfasına Dön
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
