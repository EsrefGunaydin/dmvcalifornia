import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import MultiplexAd from '@/components/MultiplexAd';
import { Check } from 'lucide-react';
import type { HandbookEdition } from '@/data/handbook-editions';

const SITE_URL = 'https://dmvcalifornia.us';

export default function HandbookEditionView({ edition: e }: { edition: HandbookEdition }) {
  const url = `${SITE_URL}/california-driver-handbook/${e.editionSlug}`;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: e.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'California Driver Handbook', item: `${SITE_URL}/california-driver-handbook` },
      { '@type': 'ListItem', position: 3, name: e.h1, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <article dir={e.dir} className="container mx-auto px-4 py-10 max-w-3xl">
          {/* Breadcrumb (always LTR for consistency) */}
          <nav dir="ltr" className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-1.5">›</span>
            <Link href="/california-driver-handbook" className="hover:text-primary">California Driver Handbook</Link>
            <span className="mx-1.5">›</span>
            <span className="text-gray-800">{e.englishName}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl" aria-hidden="true">{e.flag}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{e.h1}</h1>
          </div>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">{e.intro}</p>

          {/* Download */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6 mb-6">
            <a
              href={e.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              ⬇ {e.downloadLabel}
            </a>
            {!e.pdfCurrent && e.pdfNote && (
              <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">{e.pdfNote}</p>
            )}
            {e.archives && e.archives.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                <p className="font-semibold text-gray-600 mb-2">Older editions (compare versions)</p>
                <ul className="space-y-1.5">
                  {e.archives.map((a) => (
                    <li key={a.path}>
                      <a href={a.path} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        ⬇ {a.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* In-content ad (monetizes the handbook traffic that PDFs never could) */}
          <MultiplexAd />

          {/* What's inside */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 my-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{e.sectionsHeading}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {e.sections.map((s) => (
                <li key={s} className="flex items-start gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Practice-test funnel */}
          <section className="bg-gradient-to-br from-dmv-50 to-white rounded-2xl border-2 border-dmv-200 p-6 my-6 text-center">
            <h2 className="text-xl font-bold text-dmv-800 mb-2">{e.practiceHeading}</h2>
            <p className="text-gray-700 mb-4">{e.practiceText}</p>
            <Link
              href={e.testHref}
              className="inline-block bg-dmv-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-dmv-700 transition-colors"
            >
              {e.practiceLabel}
            </Link>
          </section>

          {/* FAQ */}
          <section className="my-6">
            <div className="space-y-3">
              {e.faq.map((f) => (
                <details key={f.q} className="group bg-white rounded-lg border border-gray-200 p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center gap-3">
                    {f.q}
                    <span className="text-primary group-open:rotate-180 transition-transform flex-shrink-0">▾</span>
                  </summary>
                  <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Other languages */}
          <section className="my-6">
            <p className="text-sm text-gray-500">
              <Link href="/california-driver-handbook" className="text-primary hover:underline" dir="ltr">
                ← All California Driver Handbook languages
              </Link>
            </p>
          </section>

          {/* Source */}
          <p className="text-xs text-gray-400 mt-8">
            {e.sourceNote}{' '}
            <a href={e.officialUrl} target="_blank" rel="noopener noreferrer" className="underline" dir="ltr">
              dmv.ca.gov ↗
            </a>
          </p>
        </article>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
