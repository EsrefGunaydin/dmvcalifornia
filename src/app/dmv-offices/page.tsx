import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import officesData from '../../data/dmv_offices.json';
import { REGIONS, officesInRegion } from '../../data/dmv-regions';

const SITE_URL = 'https://www.dmvcalifornia.us';
const DMV_PHONE = '1-800-777-0133';
const APPOINTMENTS_URL = 'https://www.dmv.ca.gov/portal/appointments/';
const ONLINE_SERVICES_URL = 'https://www.dmv.ca.gov/portal/';

export const metadata = {
  title: 'California DMV Phone Number, Hours & Office Locations',
  description:
    'California DMV phone number: 1-800-777-0133. Find DMV hours (Mon–Fri, 8 AM–5 PM), how to make an appointment, online services, and all 200+ DMV office locations.',
  alternates: { canonical: `${SITE_URL}/dmv-offices` },
  openGraph: {
    title: 'California DMV Phone Number, Hours & Office Locations',
    description:
      'California DMV phone number 1-800-777-0133, hours, appointments, online services, and every DMV office location statewide.',
    url: `${SITE_URL}/dmv-offices`,
    type: 'website',
    siteName: 'DMV California',
  },
};

// Single source of truth for the FAQ — rendered visibly AND as FAQPage JSON-LD.
const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is the California DMV phone number?',
    a: `The main California DMV customer service phone number is ${DMV_PHONE}. Live phone support is available Monday through Friday, 8:00 AM to 5:00 PM. If you use a TTY, call the California Relay Service at 711.`,
  },
  {
    q: 'What are California DMV hours?',
    a: 'Most California DMV field offices are open Monday, Tuesday, Thursday, and Friday from 8:00 AM to 5:00 PM, and open at 9:00 AM on Wednesdays. Offices are closed on weekends and state holidays. Check your specific office page below for exact hours.',
  },
  {
    q: 'How do I make a California DMV appointment?',
    a: `You can book a DMV appointment online at dmv.ca.gov or by calling ${DMV_PHONE}. Appointments dramatically reduce your wait time. Walk-ins are accepted at most offices but typically wait much longer.`,
  },
  {
    q: 'Is the California DMV open on weekends?',
    a: 'No. DMV field offices are closed on Saturdays, Sundays, and state holidays. However, many services — including license and registration renewals — are available online 24/7.',
  },
  {
    q: 'What DMV tasks can I do online without visiting an office?',
    a: 'Many tasks can be completed online at dmv.ca.gov, including driver license and vehicle registration renewals, change of address, REAL ID pre-application, and requesting a driver record — no office visit required.',
  },
  {
    q: 'How do I reach a live person at the California DMV?',
    a: `Call ${DMV_PHONE} during business hours (Monday–Friday, 8:00 AM–5:00 PM) and follow the automated prompts, or stay on the line to be connected with a representative.`,
  },
];

export default function DMVOfficesPage() {
  const offices = officesData.offices;

  // Group offices by first letter
  const groupedOffices = offices.reduce((acc, office) => {
    const firstLetter = office.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(office);
    return acc;
  }, {} as Record<string, typeof offices>);

  const letters = Object.keys(groupedOffices).sort();

  // FAQPage + GovernmentOrganization structured data → eligible for rich
  // results and "DMV phone number / hours" answer snippets.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'California Department of Motor Vehicles (DMV)',
    url: `${SITE_URL}/dmv-offices`,
    telephone: DMV_PHONE,
    areaServed: 'California',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: DMV_PHONE,
      contactType: 'customer service',
      areaServed: 'US-CA',
      availableLanguage: ['English', 'Spanish'],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            California DMV Phone Number, Hours &amp; Locations
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Call the California DMV at{' '}
            <a href={`tel:${DMV_PHONE.replace(/-/g, '')}`} className="font-bold underline">
              {DMV_PHONE}
            </a>
            . Find DMV hours, how to make an appointment, online services, and every office location statewide.
          </p>
          <div className="mt-6">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              {offices.length} Locations Statewide
            </span>
          </div>
        </div>
      </section>

      {/* Contact & Quick Info — directly answers the high-volume
          "dmv phone number / hours / appointment" searches. */}
      <section className="container mx-auto px-4 -mt-8 mb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Phone */}
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Phone Number
            </div>
            <a
              href={`tel:${DMV_PHONE.replace(/-/g, '')}`}
              className="text-2xl font-bold text-primary hover:text-primary-600"
            >
              {DMV_PHONE}
            </a>
            <p className="text-sm text-gray-600 mt-1">
              Customer service. TTY: dial 711.
            </p>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Hours
            </div>
            <div className="text-gray-900 font-medium">Mon–Fri: 8 AM – 5 PM</div>
            <p className="text-sm text-gray-600 mt-1">
              Wed opens 9 AM. Closed weekends &amp; state holidays.
            </p>
          </div>

          {/* Appointment */}
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Appointments
            </div>
            <a
              href={APPOINTMENTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:text-primary-600 inline-flex items-center gap-1"
            >
              Book an appointment →
            </a>
            <p className="text-sm text-gray-600 mt-1">
              Skip the line — appointments cut wait times.
            </p>
          </div>

          {/* Online services */}
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Online Services
            </div>
            <a
              href={ONLINE_SERVICES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:text-primary-600 inline-flex items-center gap-1"
            >
              Renew &amp; more online →
            </a>
            <p className="text-sm text-gray-600 mt-1">
              Renewals, REAL ID, address change — 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Browse by region — internal-links the regional hub pages and helps
          users find "[region] DMV offices" without scrolling the A–Z list. */}
      <section className="container mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse DMV offices by region</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REGIONS.map((r) => (
            <Link
              key={r.slug}
              href={`/dmv-offices/${r.slug}`}
              className="block p-4 bg-white rounded-lg shadow border border-gray-200 hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                {r.name}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {officesInRegion(r.key).length} offices →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white border-b py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-primary hover:text-white text-sm font-medium transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Offices List */}
      <section className="container mx-auto px-4 py-12">
        {letters.map(letter => (
          <div key={letter} id={`letter-${letter}`} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-primary pb-2">
              {letter}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedOffices[letter].map(office => (
                <Link
                  key={office.id}
                  href={`/${office.slug}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary group"
                >
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                    {office.name} DMV
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {office.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {office.hours}
                  </div>
                  <div className="mt-3 text-primary font-semibold text-sm flex items-center">
                    View Details
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* FAQ — targets "dmv phone number / hours / appointment / open weekends"
          question searches and feeds the FAQPage structured data above. */}
      <section className="bg-white border-t">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            California DMV: Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group bg-gray-50 rounded-lg border border-gray-200 p-4"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {item.q}
                  <span className="text-primary group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="text-gray-700 mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
}
