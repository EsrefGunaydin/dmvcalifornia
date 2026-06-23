import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import CookieBanner from '../../../components/CookieBanner';
import { REGIONS, getRegion, officesInRegion } from '../../../data/dmv-regions';

const SITE_URL = 'https://www.dmvcalifornia.us';
const DMV_PHONE = '1-800-777-0133';
const APPOINTMENTS_URL = 'https://www.dmv.ca.gov/portal/appointments/';

export const dynamicParams = false;

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const cfg = getRegion(region);
  if (!cfg) return {};
  const count = officesInRegion(cfg.key).length;
  const title = `${cfg.name} DMV Offices: Locations, Hours & Phone Numbers`;
  const description = `All ${count} DMV offices in ${cfg.name}. Find addresses, hours, phone numbers, services, and how to make a DMV appointment near you.`;
  return {
    title: `${title} | DMV California`,
    description,
    alternates: { canonical: `${SITE_URL}/dmv-offices/${cfg.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/dmv-offices/${cfg.slug}`, type: 'website' },
  };
}

export default async function RegionOfficesPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const cfg = getRegion(region);
  if (!cfg) notFound();

  const offices = officesInRegion(cfg.key);

  // ItemList of office pages → helps Google understand the regional cluster.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `DMV Offices in ${cfg.name}`,
    numberOfItems: offices.length,
    itemListElement: offices.map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${o.slug}`,
      name: `${o.name} DMV`,
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'DMV Offices', item: `${SITE_URL}/dmv-offices` },
      { '@type': 'ListItem', position: 2, name: cfg.name, item: `${SITE_URL}/dmv-offices/${cfg.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/80 mb-4">
            <Link href="/dmv-offices" className="hover:underline">
              DMV Offices
            </Link>{' '}
            <span className="mx-1">›</span> {cfg.name}
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{cfg.name} DMV Offices</h1>
          <p className="text-lg text-white/90 max-w-3xl">{cfg.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">{offices.length} offices</span>
            <a href={`tel:${DMV_PHONE.replace(/-/g, '')}`} className="bg-white/20 px-4 py-2 rounded-full hover:bg-white/30">
              ☎ {DMV_PHONE}
            </a>
            <a href={APPOINTMENTS_URL} target="_blank" rel="noopener noreferrer" className="bg-white text-primary font-semibold px-4 py-2 rounded-full hover:bg-gray-100">
              Book an appointment →
            </a>
          </div>
        </div>
      </section>

      {/* Region nav chips */}
      <section className="bg-white border-b py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/dmv-offices" className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-primary hover:text-white text-sm font-medium transition-colors">
              All offices
            </Link>
            {REGIONS.map((r) => (
              <Link
                key={r.slug}
                href={`/dmv-offices/${r.slug}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  r.slug === cfg.slug ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-primary hover:text-white'
                }`}
              >
                {r.shortName}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Offices grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All {offices.length} DMV offices in {cfg.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offices.map((office) => (
            <Link
              key={office.id}
              href={`/${office.slug}`}
              className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary group"
            >
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                {office.name} DMV
              </h3>
              <div className="text-sm text-gray-600 mb-1">{office.address}</div>
              <div className="text-sm text-gray-600">{office.phone}</div>
              <div className="mt-3 text-primary font-semibold text-sm flex items-center">
                View details, hours &amp; appointment
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-white border-t">
        <div className="container mx-auto px-4 py-10 max-w-3xl text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Getting ready for the DMV?</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/practice-test" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Free Practice Tests</Link>
            <Link href="/california-dmv-test-study-guide" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Study Guide</Link>
            <Link href="/california-dmv-cheat-sheet" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cheat Sheet</Link>
            <Link href="/dmv-offices" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">All DMV Offices</Link>
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
}
