import { Metadata } from 'next';
import Link from 'next/link';
import { FileSignature } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

export const metadata: Metadata = {
  title: 'CA DMV Bill of Sale & Release of Liability Guide 2026',
  description:
    'What a California bill of sale needs to include, why the Release of Liability protects both buyer and seller, and how to file each one with the DMV.',
  keywords: [
    'california dmv bill of sale',
    'ca dmv release of liability',
    'release of liability online',
    'bill of sale template california',
    'reg 138 california',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-bill-of-sale-release-of-liability' },
  openGraph: { title: 'CA DMV Bill of Sale & Release of Liability Guide', type: 'article' },
};

const FAQ = [
  {
    q: 'Do I need a bill of sale to sell a car in California?',
    a: 'California does not require a standardized bill of sale form for private-party sales, but having one protects both sides: it documents the sale price, date, odometer reading, and that the vehicle changed hands "as is" if that was the agreement. The DMV\'s REG 135 form works as a bill of sale if you want an official template.',
  },
  {
    q: 'What is a Release of Liability and why does it matter?',
    a: 'A Release of Liability tells the DMV you are no longer the registered owner as of the sale date. Filing it protects you from parking tickets, toll violations, or liability the new owner incurs after the sale, since the vehicle stays under your name until you file it.',
  },
  {
    q: 'How do I file a Release of Liability?',
    a: 'California law requires you to notify the DMV within 5 calendar days of the sale, using the Notice of Transfer and Release of Liability (REG 138). File it online through the DMV website using the vehicle\'s license plate or VIN and the sale date, your record updates within 1 business day, and it does not require the buyer\'s cooperation.',
  },
  {
    q: 'What should a California bill of sale include?',
    a: 'Buyer and seller names and signatures, the sale date, sale price, vehicle description (year, make, model, VIN), and the odometer reading. Note clearly whether the vehicle is sold "as is" or with any warranty.',
  },
  {
    q: 'Does the buyer or seller submit the title transfer paperwork?',
    a: 'The buyer submits it to the DMV, since they are the one registering the vehicle. The seller\'s job is to sign the title, hand over a bill of sale if used, and file the Release of Liability, that last step is on the seller regardless of what the buyer does.',
  },
];

export default function BillOfSalePage() {
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
        <section className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <FileSignature className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Bill of Sale &amp; Release of Liability
              </h1>
              <p className="text-xl text-white/90 mb-5">
                Two documents that protect both sides of a private car sale in California, and take
                a few minutes each to get right.
              </p>
              <div className="flex justify-center">
                <QuizViewTracker
                  quizId="bill-of-sale-guide"
                  baseViews={getBaseViews('bill-of-sale-guide')}
                  variant="prominent"
                  label="people have used this guide"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-10">

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">The bill of sale</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A bill of sale is not legally required for a private-party vehicle sale in
                  California, but it is the only record you have if a dispute comes up later about
                  the price, the sale date, or the vehicle&apos;s condition at the time of sale. The
                  DMV&apos;s own REG 135 form works as a ready-made template if you would rather not
                  write one from scratch.
                </p>
                <p className="text-gray-700 leading-relaxed mb-2">A bill of sale should include:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1.5 mb-3">
                  <li>Buyer and seller full names and signatures</li>
                  <li>Sale date and sale price</li>
                  <li>Vehicle year, make, model, and VIN</li>
                  <li>Odometer reading at time of sale</li>
                  <li>Whether the vehicle is sold &quot;as is&quot; or with any stated warranty</li>
                </ul>
                <a
                  href="https://www.dmv.ca.gov/portal/file/bill-of-sale-reg-135-pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  → Download the official REG 135 bill of sale form (PDF)
                </a>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">The Release of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  This one matters more than most sellers realize. Until you file a Release of
                  Liability, the vehicle stays registered to you in the DMV&apos;s system, which means
                  parking tickets, toll violations, or civil liability the new owner incurs after the
                  sale can still land on your record.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  California Vehicle Code §5900 requires you to notify the DMV within 5 calendar days
                  of selling or transferring a vehicle, using the Notice of Transfer and Release of
                  Liability (REG 138). File it online using the vehicle&apos;s license plate or VIN and
                  the sale date, your record updates within 1 business day. It only needs your
                  information, the buyer does not need to do anything for you to file it.
                </p>
                <a
                  href="https://www.dmv.ca.gov/portal/vehicle-registration/titles/title-transfers-and-changes/notice-of-transfer-and-release-of-liability-nrl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  → File your Release of Liability on the official DMV site
                </a>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <h3 className="font-bold text-gray-900 mb-2">What the buyer needs to do next</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The buyer has 10 days to submit the title transfer to the DMV: the signed title, a
                  completed Application for Title or Registration (REG 343), proof of insurance, a
                  smog certificate if required, and payment for registration fees and use tax. See our{' '}
                  <Link href="/california-dmv-vehicle-registration" className="text-primary font-semibold hover:underline">
                    vehicle registration guide
                  </Link>{' '}
                  for the full process and current fees.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <strong>Note:</strong> Requirements and deadlines can change. Confirm current details
                on the official{' '}
                <a
                  href="https://www.dmv.ca.gov/portal/vehicle-registration/titles/title-transfers-and-changes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  California DMV title transfers page
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
                Bill of sale &amp; release of liability — FAQ
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
                <Link href="/california-dmv-fees" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  DMV Fees
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
