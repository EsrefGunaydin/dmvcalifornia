import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { EVENT_SLUGS, getEvent } from '@/data/events';

const SITE_URL = 'https://dmvcalifornia.us';

export async function generateStaticParams() {
  return EVENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: event.metaTitle,
    description: event.metaDescription,
    alternates: { canonical: `${SITE_URL}/events/${event.slug}` },
    openGraph: { title: event.metaTitle, description: event.metaDescription, type: 'article' },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: event.name,
    description: event.metaDescription,
    author: { '@type': 'Organization', name: 'DMV California' },
    publisher: { '@type': 'Organization', name: 'DMV California', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/events/${event.slug}`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: event.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Events', item: `${SITE_URL}/events` },
      { '@type': 'ListItem', position: 3, name: event.shortName, item: `${SITE_URL}/events/${event.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema, breadcrumbSchema]) }}
      />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-dmv-700 via-dmv-500 to-dmv-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <nav className="text-sm text-white/80 mb-4 flex items-center gap-1">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/events" className="hover:text-white">Events</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{event.shortName}</span>
              </nav>
              <div className="flex items-center gap-2 text-white/90 text-sm font-semibold uppercase tracking-wide mb-3">
                <CalendarDays className="w-4 h-4" />
                {event.dates} &middot; {event.recurrence}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{event.name}</h1>
              <p className="text-lg text-white/90">{event.heroBlurb}</p>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 max-w-3xl">
            <article
              className="prose prose-lg max-w-none bg-white rounded-xl border border-gray-200 p-6 md:p-10"
              dangerouslySetInnerHTML={{ __html: event.body }}
            />

            {event.faq.length > 0 && (
              <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
                <div className="space-y-3">
                  {event.faq.map((f) => (
                    <details key={f.question} className="group border border-gray-200 rounded-lg">
                      <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-semibold text-gray-900">
                        <span>{f.question}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="px-4 pb-4 text-gray-600 leading-relaxed">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Related guides</h2>
                <ul className="space-y-2">
                  {event.related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="text-dmv-700 text-sm font-medium hover:underline">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Official resources</h2>
                <ul className="space-y-2">
                  {event.official.map((o) => (
                    <li key={o.href}>
                      <a
                        href={o.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dmv-700 text-sm font-medium hover:underline"
                      >
                        {o.label}
                      </a>
                    </li>
                  ))}
                </ul>
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
