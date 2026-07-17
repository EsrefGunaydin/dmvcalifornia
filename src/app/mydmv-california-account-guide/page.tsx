import { Metadata } from 'next';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

export const metadata: Metadata = {
  title: 'MyDMV California: What It Is & How to Use It (2026) | DMV California',
  description:
    'MyDMV is the California DMV\'s online account portal. What you can do with it, how to sign up, and what to try if you cannot log in.',
  keywords: [
    'mydmv california',
    'mydmv login',
    'california dmv online account',
    'mydmv account',
    'dmv.ca.gov login',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/mydmv-california-account-guide' },
  openGraph: { title: 'MyDMV California: What It Is & How to Use It', type: 'article' },
};

const FAQ = [
  {
    q: 'What is MyDMV?',
    a: 'MyDMV is the California DMV\'s free online account portal. Once registered, it lets you renew registration, update your address, check your driver license or vehicle status, and access some services without visiting an office.',
  },
  {
    q: 'Is MyDMV the same as dmv.ca.gov?',
    a: 'dmv.ca.gov is the DMV\'s main website, MyDMV is the logged-in account area within it. Many DMV online services (like registration renewal) can be done as a guest without an account, but a MyDMV account saves your information and gives you access to more features in one place.',
  },
  {
    q: 'How do I create a MyDMV account?',
    a: 'Go to the official DMV website and look for the MyDMV or account sign-in option, then follow the identity verification steps using your driver license or ID number and personal details on file with the DMV.',
  },
  {
    q: 'Why can\'t I log into MyDMV?',
    a: 'Common causes are a mismatched name or address on file, a typo in your driver license number, or a temporary DMV system outage. If your information recently changed (new address, name change), update it with the DMV first, since MyDMV verifies against your official record.',
  },
  {
    q: 'Do I need a MyDMV account to renew my registration?',
    a: 'No. California lets most people renew vehicle registration as a guest using their license plate and last 5 digits of their VIN, no account required. An account just saves you from re-entering information each time.',
  },
];

export default function MyDmvGuidePage() {
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
        <section className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <UserCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                What Is MyDMV?
              </h1>
              <p className="text-xl text-white/90 mb-5">
                A quick guide to California&apos;s DMV account portal: what it does, how to sign up,
                and what to check if you can&apos;t log in.
              </p>
              <div className="flex justify-center">
                <QuizViewTracker
                  quizId="mydmv-guide"
                  baseViews={getBaseViews('mydmv-guide')}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-3">What MyDMV actually is</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  MyDMV is the account layer on top of the California DMV&apos;s website. Instead of
                  entering your license plate or driver license number every time, a MyDMV account
                  keeps your vehicles and license on file so services load faster and some features
                  become available only when logged in.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You do not need an account for everything. Registration renewal, for example, works
                  as a{' '}
                  <a
                    href="https://www.dmv.ca.gov/wasapp/vrir/start.do"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    guest renewal
                  </a>{' '}
                  with just your plate number and the last 5 digits of your VIN. An account is mainly
                  a convenience layer, not a requirement to use the DMV&apos;s online tools, which are
                  collected on the{' '}
                  <a
                    href="https://www.dmv.ca.gov/portal/dmv-online/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    Online Services Portal
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">What you can do with an account</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Renew vehicle registration and pay online</li>
                  <li>Update your mailing address</li>
                  <li>Check the status of a driver license or vehicle record</li>
                  <li>Access some renewal and appointment features tied to your record</li>
                  <li>Add multiple vehicles to a &quot;garage&quot; and see each one&apos;s status in one place</li>
                  <li>Opt into email renewal notices instead of paper mail</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  Exact features depend on your license and vehicle type. If something you expect to
                  see is missing, it may require an in-person visit instead, see our{' '}
                  <Link href="/dmv-offices" className="text-primary font-semibold hover:underline">
                    DMV office and appointment guide
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Signing up</h2>
                <p className="text-gray-700 leading-relaxed">
                  Account creation happens on the official DMV website and verifies your identity
                  against your driver license or ID number and the personal details already on file
                  with the DMV, so the name and address you enter need to match your official record
                  exactly. If you moved recently, update your address with the DMV first, mismatches
                  are the most common reason signup or login fails.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <h3 className="font-bold text-gray-900 mb-2">Can&apos;t log in?</h3>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1.5">
                  <li>Double-check your driver license or ID number for typos</li>
                  <li>Confirm your name and address match what the DMV has on file</li>
                  <li>Try again later if the DMV site is showing a system message, outages happen periodically</li>
                  <li>If your address recently changed, update it with the DMV before trying again</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <strong>Note:</strong> This site is an independent study resource and is not
                affiliated with the California DMV. Create or manage your MyDMV account directly on
                the official{' '}
                <a
                  href="https://www.dmv.ca.gov/portal/mydmv-account/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  MyDMV account page
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
                MyDMV — FAQ
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
