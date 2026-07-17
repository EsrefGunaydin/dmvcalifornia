import { Metadata } from 'next';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

export const metadata: Metadata = {
  title: 'California DMV Fees 2026: License, ID, REAL ID & Registration | DMV California',
  description:
    'Current California DMV fees for 2026 — driver license, renewal, REAL ID, ID card, motorcycle, commercial license, and vehicle registration, with a link to the official fee schedule.',
  keywords: [
    'california dmv fees',
    'how much is a california drivers license',
    'california license renewal fee',
    'california real id cost',
    'california dmv registration fees',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-fees' },
  openGraph: { title: 'California DMV Fees 2026', type: 'article' },
};

type Row = { item: string; fee: string };
type Group = { title: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    title: 'Driver license & ID',
    rows: [
      { item: 'Original driver license (Class C)', fee: '$45' },
      { item: 'Driver license renewal (Class C)', fee: '$45' },
      { item: 'Original or renewal ID card', fee: '$39' },
      { item: 'REAL ID (driver license or ID)', fee: 'No extra cost — same as standard' },
      { item: 'Duplicate / replacement license', fee: '$40' },
      { item: 'Behind-the-wheel drive test retake', fee: '$8' },
    ],
  },
  {
    title: 'Motorcycle & commercial',
    rows: [
      { item: 'Original motorcycle license (Class M)', fee: '$45' },
      { item: 'Original commercial license (Class A/B)', fee: '$90' },
      { item: 'Commercial renewal', fee: '$45' },
    ],
  },
  {
    title: 'Vehicle registration',
    rows: [
      { item: 'Base registration fee', fee: '~$65' },
      { item: 'California Highway Patrol (CHP) fee', fee: '~$32' },
      { item: 'Vehicle License Fee (VLF)', fee: '0.65% of vehicle value' },
      { item: 'Transfer of title', fee: '~$15' },
      { item: 'Total registration', fee: 'Varies by vehicle value & county' },
    ],
  },
];

const FAQ = [
  {
    q: 'How much does it cost to renew a California driver’s license?',
    a: 'The standard Class C renewal fee is about $45. Upgrading to a REAL ID at renewal costs nothing extra — you just need to apply in person with the required documents.',
  },
  {
    q: 'Does a REAL ID cost more than a regular license?',
    a: 'No. A REAL ID driver license or ID card costs the same as the standard version. The difference is the documents you must bring (proof of identity, SSN, and two proofs of California residency).',
  },
  {
    q: 'Why is my vehicle registration so much more than the base fee?',
    a: 'Registration stacks several charges: the base fee, the CHP fee, the Vehicle License Fee (a percentage of your car’s value), plus county and district fees. Newer or more valuable cars pay a higher VLF.',
  },
];

export default function FeesPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">California DMV Fees (2026)</h1>
              <p className="text-xl text-white/90 mb-5">
                What it costs to get a license, renew, upgrade to a REAL ID, or register a vehicle.
              </p>
              <div className="flex justify-center">
                <QuizViewTracker
                  quizId="dmv-fees"
                  baseViews={getBaseViews('dmv-fees')}
                  variant="prominent"
                  label="people have checked these fees"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-8">
              {GROUPS.map((g) => (
                <div key={g.title} className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">
                  <h2 className="text-xl font-bold text-gray-900 px-6 pt-6 pb-2">{g.title}</h2>
                  <table className="w-full">
                    <tbody>
                      {g.rows.map((r) => (
                        <tr key={r.item} className="border-t border-gray-100">
                          <td className="px-6 py-3 text-gray-700">{r.item}</td>
                          <td className="px-6 py-3 font-semibold text-gray-900 text-right whitespace-nowrap">{r.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
                <strong>Note:</strong> Fees are approximate and change periodically. Confirm current
                license and ID amounts on the official{' '}
                <a href="https://www.dmv.ca.gov/portal/driver-licenses-identification-cards/licensing-fees/" target="_blank" rel="noopener noreferrer" className="underline">
                  California DMV licensing fees page
                </a>{' '}
                or run an exact vehicle registration quote on the official{' '}
                <a href="https://www.dmv.ca.gov/portal/vehicle-registration/registration-fees/vehicle-registration-fee-calculator/" target="_blank" rel="noopener noreferrer" className="underline">
                  DMV registration fee calculator
                </a>{' '}
                before you pay.
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Fees — FAQ</h2>
              <div className="space-y-3">
                {FAQ.map((f, i) => (
                  <details key={i} className="group bg-white rounded-lg border border-gray-200 p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                      {f.q}
                      <span className="text-primary group-open:rotate-180 transition-transform ml-2">▾</span>
                    </summary>
                    <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-center">
                <Link href="/california-drivers-license-renewal-2026" className="text-primary font-semibold hover:underline">
                  → How to renew your California driver&apos;s license
                </Link>
                <Link href="/california-dmv-fee-calculator" className="text-primary font-semibold hover:underline">
                  → Estimate your fee with our calculator
                </Link>
                <Link href="/california-dmv-vehicle-registration" className="text-primary font-semibold hover:underline">
                  → Full vehicle registration guide
                </Link>
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
