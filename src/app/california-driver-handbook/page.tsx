import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import MultiplexAd from '@/components/MultiplexAd';
import { HANDBOOK_EDITIONS } from '@/data/handbook-editions';

const SITE_URL = 'https://dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'California Driver Handbook 2026 — Free PDF in Multiple Languages',
  description:
    'The official California Driver Handbook (2025 edition), free. Read a summary and download the PDF in English, Spanish, Chinese, Korean, Arabic, and Farsi — plus free DMV practice tests to pass your written exam.',
  alternates: { canonical: `${SITE_URL}/california-driver-handbook` },
  openGraph: { title: 'California Driver Handbook 2026 — Free PDF & Study Guide', type: 'website' },
};

const FAQ = [
  {
    q: 'Where can I download the California Driver Handbook?',
    a: 'You can download the official California Driver Handbook PDF for free below in several languages. English, Spanish, and Chinese are the current 2025 edition from the California DMV.',
  },
  {
    q: 'Is the California Driver Handbook free?',
    a: 'Yes. The California DMV publishes the handbook free of charge. This page lets you read a summary and download the official PDF at no cost, and practice with free DMV tests.',
  },
  {
    q: 'What is the latest edition of the California Driver Handbook?',
    a: 'The current edition is the 2025 California Driver Handbook. It is the official study source for the DMV written knowledge test.',
  },
];

export default function CaliforniaDriverHandbookHub() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'California Driver Handbook', item: `${SITE_URL}/california-driver-handbook` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <nav className="text-sm text-white/80 mb-4">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5">›</span> California Driver Handbook
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">California Driver Handbook 2026</h1>
            <p className="text-xl text-white/90">
              The official DMV study guide for the California written test — free to read and download. Choose your
              language below, then practice with our free tests to pass the first time.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 max-w-3xl">
          {/* Language cards */}
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Read &amp; download by language</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {HANDBOOK_EDITIONS.map((e) => (
              <Link
                key={e.editionSlug}
                href={`/california-driver-handbook/${e.editionSlug}`}
                className="group bg-white rounded-xl border-2 border-gray-100 hover:border-primary hover:shadow-lg transition-all p-5 flex items-center gap-4"
              >
                <span className="text-4xl flex-shrink-0" aria-hidden="true">{e.flag}</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {e.nativeName} <span className="text-gray-400 font-normal text-sm">({e.englishName})</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {e.pdfCurrent ? '2025 edition · PDF + study guide' : 'Reference PDF + free practice test'}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <MultiplexAd />

          {/* Funnel to tests */}
          <section className="bg-gradient-to-br from-dmv-50 to-white rounded-2xl border-2 border-dmv-200 p-6 my-8 text-center">
            <h2 className="text-xl font-bold text-dmv-800 mb-2">Read it — then practice</h2>
            <p className="text-gray-700 mb-4">
              The fastest way to pass is to study the handbook, then take practice tests until the rules are automatic.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/california-dmv-practice-test" className="bg-dmv-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-dmv-700 transition-colors">
                Free practice test →
              </Link>
              <Link href="/california-dmv-road-signs-test" className="bg-white text-dmv-700 border border-dmv-200 px-5 py-3 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors">
                Road signs test
              </Link>
              <Link href="/california-dmv-test-study-guide" className="bg-white text-dmv-700 border border-dmv-200 px-5 py-3 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors">
                Study guide
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="group bg-white rounded-lg border border-gray-200 p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {f.q}
                    <span className="text-primary group-open:rotate-180 transition-transform ml-2">▾</span>
                  </summary>
                  <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="text-xs text-gray-400 mt-8">
            Source: California Department of Motor Vehicles (DMV). Provided here as a free study aid.{' '}
            <a href="https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/" target="_blank" rel="noopener noreferrer" className="underline">
              Official handbook ↗
            </a>
          </p>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
