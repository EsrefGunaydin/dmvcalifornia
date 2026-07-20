import { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { SAFETY_EVENTS } from '@/data/events';

export const metadata: Metadata = {
  title: 'California Traffic Safety Events Calendar 2026',
  description:
    'The recurring traffic safety weeks and enforcement periods that matter to California drivers: Teen Driver Safety Week, Distracted Driving Awareness Month, CHP DUI enforcement, and more.',
  alternates: { canonical: 'https://dmvcalifornia.us/events' },
  openGraph: { title: 'California Traffic Safety Events Calendar 2026', type: 'website' },
};

export default function EventsHubPage() {
  const events = [...SAFETY_EVENTS].sort((a, b) => a.monthIndex - b.monthIndex);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'California traffic safety events',
    itemListElement: events.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.name,
      url: `https://dmvcalifornia.us/events/${e.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-dmv-700 via-dmv-500 to-dmv-700 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <CalendarDays className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                California traffic safety events
              </h1>
              <p className="text-xl text-white/90">
                The awareness weeks and enforcement periods that repeat every year, and what each
                one means for California drivers.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid gap-6">
              {events.map((event) => (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-dmv-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dmv-700 uppercase tracking-wide mb-1">
                        {event.dates}
                      </p>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-dmv-700">
                        {event.shortName}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">{event.heroBlurb}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-dmv-500 flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Getting licensed this year?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Every event above ties back to the same foundation: knowing the rules of the road.
                Our free practice tests mirror the real California knowledge exam.
              </p>
              <Link
                href="/practice-test"
                className="inline-flex items-center gap-2 text-dmv-700 font-semibold text-sm hover:underline"
              >
                Start a free practice test <ArrowRight className="w-4 h-4" />
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
