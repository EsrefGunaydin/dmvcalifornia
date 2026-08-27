import { Metadata } from 'next';
import Link from 'next/link';
import { Car } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

export const metadata: Metadata = {
  title: 'California Vehicle Registration Guide 2026: New, Renew, Replace',
  description:
    'Registering a new purchase, renewing online or by mail, replacing a lost registration card, fees, smog rules, and late penalties, all in one California DMV registration guide.',
  keywords: [
    'california vehicle registration',
    'dmv registration renewal',
    'car registration california',
    'dmv registration renewal online',
    'california dmv registration fees',
    'replace registration card california',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-vehicle-registration' },
  openGraph: { title: 'California Vehicle Registration Guide 2026', type: 'article' },
};

const FAQ = [
  {
    q: 'How much does it cost to register a car in California?',
    a: 'Registration stacks several charges: a base fee (~$65), a CHP fee (~$32), the Vehicle License Fee (0.65% of the vehicle\'s value), and a title transfer fee (~$15) if you just bought the car. County and district fees can add more. See the full breakdown on our DMV fees page, or estimate your total with our fee calculator.',
  },
  {
    q: 'How often do I need to renew my California vehicle registration?',
    a: 'Every year. The DMV mails a renewal notice before your current registration expires, and you can renew up to a few months in advance. Driving with expired registration risks a citation, and penalties keep growing the longer you wait past the expiration date.',
  },
  {
    q: 'Can I renew my California vehicle registration online?',
    a: 'Yes, if your vehicle qualifies: no unresolved smog issues, no registration hold from unpaid parking or toll violations, and current insurance on file. Online renewal is the fastest option and avoids DMV office lines entirely.',
  },
  {
    q: 'Do I need a smog check to renew my registration?',
    a: 'Most gasoline vehicles from model year 1976 or newer that are more than 4 years old need a biennial smog check. Electric vehicles, newer vehicles under the initial exemption, and a few other categories are exempt. Your renewal notice will say if one is due this cycle.',
  },
  {
    q: 'What happens if my California registration is expired?',
    a: 'You can be cited for driving with expired registration, and penalty fees accrue the longer you wait to renew. There is no grace period once the sticker expires, so renew as soon as your notice arrives if you plan to keep driving the vehicle.',
  },
  {
    q: 'How do I register a car I just bought in California?',
    a: 'Within 10 days of a private-party purchase, submit the signed title, a completed Application for Title or Registration (REG 343), proof of insurance, a smog certificate if required, and payment for registration fees and use tax. Dealers usually handle this paperwork for you as part of the sale.',
  },
  {
    q: 'I lost my registration card. How do I replace it?',
    a: 'You can request a replacement online for a fee using your license plate number and the last 5 digits of your VIN, or mail in a REG 156 form. It does not change your registration status or expiration date, it is just a reissued copy of the document, and it typically arrives by mail within about 14 days.',
  },
  {
    q: 'Can a registration hold block my renewal?',
    a: 'Yes. Unpaid parking citations, toll violations, or certain other unresolved issues can place a hold on your registration that blocks online and mail renewal until it is cleared. If your renewal keeps failing online, a hold is the most common reason.',
  },
  {
    q: 'What if I never received my renewal notice in the mail?',
    a: 'You do not need the physical notice to renew. You can renew online or at a kiosk using your license plate number and the last 5 digits of your VIN, and your registration is still due by the original expiration date whether or not the notice arrived.',
  },
  {
    q: 'Does buying from a dealer mean I do not have to do anything?',
    a: 'Dealers typically handle the registration paperwork, use tax, and initial fees as part of the sale, but confirm before you drive off that they have filed it. You are the one who will notice if the paperwork does not go through, since it is your name on the record.',
  },
];

export default function VehicleRegistrationPage() {
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
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                California Vehicle Registration Guide
              </h1>
              <p className="text-xl text-white/90 mb-5">
                Registering a new purchase, renewing online or by mail, replacing a lost card, or
                figuring out why the fee went up this year. Here is how each one actually works.
              </p>
              <div className="flex justify-center">
                <QuizViewTracker
                  quizId="vehicle-registration-guide"
                  baseViews={getBaseViews('vehicle-registration-guide')}
                  variant="prominent"
                  label="people have used this guide"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pt-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="dmv-stats">
                <div className="dmv-stat">
                  <span className="dmv-stat-value">10 days</span>
                  <span className="dmv-stat-label">to register a private-party purchase</span>
                </div>
                <div className="dmv-stat">
                  <span className="dmv-stat-value">Annual</span>
                  <span className="dmv-stat-label">renewal cycle for every vehicle</span>
                </div>
                <div className="dmv-stat">
                  <span className="dmv-stat-value">0.65%</span>
                  <span className="dmv-stat-label">Vehicle License Fee, of vehicle value</span>
                </div>
                <div className="dmv-stat">
                  <span className="dmv-stat-value">2 years</span>
                  <span className="dmv-stat-label">between smog checks for most vehicles</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-10">

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Registering a vehicle you just bought</h2>
                <p className="text-gray-700 leading-relaxed">
                  How this works depends entirely on who you bought it from.
                </p>

                <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Bought from a dealership</h3>
                <p className="text-gray-700 leading-relaxed">
                  Dealers typically handle registration, title transfer, and use tax as part of the
                  sale, and roll the fees into your total or financing. That said, it is still your
                  name on the record, so confirm the paperwork actually went through, keep your bill
                  of sale, and follow up if a permanent registration card and plates have not arrived
                  within a few weeks of a temporary tag expiring.
                </p>

                <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">Bought from a private party</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You have 10 days from the purchase date to submit the title transfer paperwork
                  yourself, or a late fee applies and grows the longer you wait. You will need:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1.5 mb-3">
                  <li>The signed title (pink slip) from the seller</li>
                  <li>A completed Application for Title or Registration (REG 343)</li>
                  <li>Proof of current California insurance</li>
                  <li>A valid smog certificate, if the vehicle requires one</li>
                  <li>Payment for registration fees plus California use tax on the purchase price</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  For the seller&apos;s side of the same transaction, including the Release of
                  Liability that protects them after the sale, see our{' '}
                  <Link href="/california-dmv-bill-of-sale-release-of-liability" className="text-primary font-semibold hover:underline">
                    bill of sale and release of liability guide
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Renewing your registration</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  California registration runs on an annual cycle. The DMV mails a renewal notice
                  before your current sticker expires, listing the fees due and whether a smog
                  certificate is required this cycle. You do not need the physical notice in hand to
                  renew, your license plate number and the last 5 digits of your VIN are enough.
                </p>

                <h3 className="text-lg font-bold text-gray-900 mb-2">Every way to renew</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1.5 mb-2">
                  <li><strong>Online</strong>, the fastest option, works as long as there is no hold on the vehicle</li>
                  <li><strong>By mail</strong>, using the payment slip from your renewal notice</li>
                  <li><strong>By phone</strong>, for straightforward renewals with no outstanding issues</li>
                  <li>
                    <strong>At a kiosk</strong>, self-service machines at select locations, see our{' '}
                    <Link href="/can-i-renew-my-license-at-a-dmv-kiosk" className="text-primary font-semibold hover:underline">
                      DMV kiosk guide
                    </Link>{' '}
                    for what a kiosk can and cannot handle
                  </li>
                  <li><strong>In person</strong>, at a DMV field office, for anything the other methods cannot resolve</li>
                </ul>
                <a
                  href="https://www.dmv.ca.gov/wasapp/vrir/start.do"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  → Renew online on the official DMV site
                </a>

                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">What can block your renewal</h3>
                <p className="text-gray-700 leading-relaxed">
                  A few things stop online and mail renewal cold until resolved: a registration hold
                  from unpaid parking citations or toll violations, a smog check that has not been
                  completed for a vehicle that needs one, or a lapse in your insurance on file. If your
                  renewal keeps failing online with no clear reason, one of these is almost always why,
                  and clearing the underlying issue (paying the citation, getting the smog check,
                  updating your insurance) is what unblocks it, not retrying the same renewal again.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <h3 className="font-bold text-gray-900 mb-2">Late renewal penalties</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  There is no grace period once your registration expires. Penalty fees start
                  accruing and increase the longer you wait, and you can be cited for driving on
                  expired registration in the meantime. If your notice already shows a penalty
                  amount, that is specific to how late your renewal is, check the notice rather than
                  assuming a flat rate.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Replacing a lost or damaged registration card</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  If your registration card or sticker is lost, stolen, or damaged, you can request a
                  replacement online for a fee using your license plate number and the last 5 digits of
                  your VIN. It does not affect your actual registration status or expiration date, it
                  is simply a reissued copy, and the DMV mails it to the address on your record within
                  about 14 days. The paper form version is the Application for Replacement Plates,
                  Stickers, Documents (REG 156), for anyone who would rather mail it in or visit a field
                  office.
                </p>
                <a
                  href="https://www.dmv.ca.gov/portal/vehicle-registration/replace-your-registration-card/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  → Request a replacement on the official DMV site
                </a>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Motorcycles, RVs, trailers, and commercial vehicles</h2>
                <p className="text-gray-700 leading-relaxed">
                  The process above covers standard passenger vehicles, which is what most people
                  searching for this guide are dealing with. Motorcycles, trailers, motor homes,
                  commercial vehicles, boats, off-highway vehicles, and salvaged or specially-built
                  vehicles each have their own registration rules and forms that go beyond this guide.
                  Start at the official{' '}
                  <a
                    href="https://www.dmv.ca.gov/portal/vehicle-registration/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    California DMV vehicle registration hub
                  </a>{' '}
                  and select your vehicle type for the exact requirements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">What the fee is actually made of</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A single registration bill bundles several separate charges: a base registration
                  fee, a California Highway Patrol fee, the Vehicle License Fee (a percentage of your
                  vehicle&apos;s value), and sometimes county or district fees on top. That is why the
                  total on your notice rarely matches a single number you can quote from memory.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <Link href="/california-dmv-fees" className="text-primary font-semibold hover:underline">
                    → See the current fee breakdown
                  </Link>
                  <Link href="/california-dmv-fee-calculator" className="text-primary font-semibold hover:underline">
                    → Estimate your total with our calculator
                  </Link>
                </div>
              </div>

              <div className="dmv-dos-donts">
                <div className="dmv-dos-donts-do">
                  <strong>Do this</strong>
                  <ul>
                    <li>Renew as soon as your notice arrives, before the expiration date</li>
                    <li>Check for a registration hold before assuming online renewal is broken</li>
                    <li>Keep your bill of sale and title paperwork until the new registration arrives</li>
                    <li>Complete the smog check first if your renewal notice requires one</li>
                    <li>Confirm a dealer actually filed your paperwork before assuming it is done</li>
                  </ul>
                </div>
                <div className="dmv-dos-donts-dont">
                  <strong>Don&apos;t do this</strong>
                  <ul>
                    <li>Don&apos;t drive on expired registration assuming there is a grace period</li>
                    <li>Don&apos;t wait for the paper notice if it is close to the deadline, renew online instead</li>
                    <li>Don&apos;t ignore a parking or toll citation, it can silently block your renewal later</li>
                    <li>Don&apos;t skip the 10-day private-party deadline, the late fee grows the longer you wait</li>
                    <li>Don&apos;t assume a lost registration card affects your actual registration status</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">New to California?</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you just moved here with an out-of-state vehicle, you have 20 days to register it
                  under California Vehicle Code §6700, and different smog rules apply to out-of-state
                  cars. That process has its own set of steps, covered in our{' '}
                  <Link href="/new-to-california-driver-guide-2026" className="text-primary font-semibold hover:underline">
                    new California resident guide
                  </Link>
                  .
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <strong>Note:</strong> Fees, penalty amounts, and smog rules change periodically.
                Confirm the exact figures for your vehicle on the official{' '}
                <a
                  href="https://www.dmv.ca.gov/portal/vehicle-registration/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  California DMV vehicle registration page
                </a>{' '}
                before you pay.
              </div>

            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Vehicle registration — FAQ
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
                <Link href="/california-dmv-fees" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  DMV Fees
                </Link>
                <Link href="/california-dmv-fee-calculator" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Fee Calculator
                </Link>
                <Link href="/practice-test/california-dmv-practice-test-2026" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  Full 2026 Practice Test
                </Link>
                <Link href="/dmv-offices" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Find a DMV Office
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
