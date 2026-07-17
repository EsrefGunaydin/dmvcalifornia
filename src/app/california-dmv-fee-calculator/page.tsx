import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';
import FeeCalculator from '@/components/tools/FeeCalculator';

export const metadata: Metadata = {
  title: 'California DMV Fee Calculator 2026 (Free Estimate) | DMV California',
  description:
    'Estimate your California DMV registration renewal or new-purchase fees: base fee, CHP fee, Vehicle License Fee, and use tax, in one free calculator.',
  keywords: [
    'california dmv fee calculator',
    'ca dmv calculator',
    'dmv registration fee estimate',
    'california vehicle license fee calculator',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-fee-calculator' },
  openGraph: { title: 'California DMV Fee Calculator 2026', type: 'website' },
};

const FAQ = [
  {
    q: 'How accurate is this DMV fee calculator?',
    a: 'It gives a ballpark estimate using the statewide base rates: the base registration fee, CHP fee, and Vehicle License Fee (0.65% of vehicle value). It does not include county or district add-on fees, the VLF\'s age-based depreciation schedule, or late penalties, so treat it as a starting point rather than an exact quote.',
  },
  {
    q: 'Why is my actual DMV bill different from the estimate?',
    a: 'Your county and local district may add fees this calculator does not include, and the DMV\'s Vehicle License Fee formula depreciates as a vehicle ages rather than staying at a flat rate. For an exact figure, use the official DMV calculator or check your renewal notice.',
  },
  {
    q: 'What is the use tax rate I should enter?',
    a: 'California\'s base state rate is 7.25%, but most counties add a local district tax on top, often bringing the combined rate to somewhere between 7.75% and 10.25% depending on where you live. Check your county\'s current combined rate for an accurate estimate.',
  },
];

export default function FeeCalculatorPage() {
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
                <Calculator className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                California DMV Fee Calculator
              </h1>
              <p className="text-xl text-white/90 mb-5">
                A free, ballpark estimate for a registration renewal or a newly purchased vehicle.
              </p>
              <div className="flex justify-center">
                <QuizViewTracker
                  quizId="dmv-fee-calculator"
                  baseViews={getBaseViews('dmv-fee-calculator')}
                  variant="prominent"
                  label="people have used this calculator"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              <FeeCalculator />
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-2">
              <div>
                <Link href="/california-dmv-fees" className="text-primary font-semibold hover:underline">
                  → See the full fee breakdown table
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                For an exact, official quote for your vehicle, use the{' '}
                <a
                  href="https://www.dmv.ca.gov/portal/vehicle-registration/registration-fees/vehicle-registration-fee-calculator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  California DMV&apos;s own fee calculator
                </a>
                .
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Fee calculator — FAQ
              </h2>
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
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Keep studying</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/california-dmv-vehicle-registration" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Vehicle Registration Guide
                </Link>
                <Link href="/practice-test/california-dmv-practice-test-2026" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  Full 2026 Practice Test
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
