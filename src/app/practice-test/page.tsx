import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import PracticeTestsContent from '@/components/PracticeTestsContent';
import {
  TriangleAlert, ClipboardList, Wine, SquareParking, Gauge,
  Flame, BookOpen, CreditCard, Layers, Navigation, Globe, Zap, RotateCcw, Shuffle,
  UserCheck, MapPin, GraduationCap, Accessibility, Shield, Anchor, Bike,
} from 'lucide-react';
import DailyChallengeBanner from '@/components/DailyChallengeBanner';
import { getAllFixedQuizzes } from '@/lib/allQuizzes';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata = {
  alternates: languageAlternates('en'),
  title: 'California DMV Practice Tests | DMV California',
  description: 'Free California DMV practice tests in English, Spanish, Turkish and Chinese. Test your knowledge with real DMV questions and prepare for your permit test.',
};

export default function PracticeTestsPage() {
  // New York (and any future non-California state) quizzes live in the same
  // pool but don't belong under this California-branded index/category list.
  const quizzes = getAllFixedQuizzes().filter((q) => !q.category.startsWith('New York DMV'));

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                California DMV Practice Tests
              </h1>
              <p className="text-xl text-white/90">
                Test your knowledge with real DMV questions. Practice as many times as you need to pass your permit test with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Daily challenge */}
        <div className="container mx-auto px-4 pt-6 max-w-6xl">
          <DailyChallengeBanner />
        </div>

        {/* Featured: 20 Hardest Questions */}
        <div className="container mx-auto px-4 pt-4">
          <Link
            href="/20-hardest-dmv-written-test-questions"
            className="block rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 md:p-7 shadow-lg hover:shadow-xl transition-shadow group max-w-6xl mx-auto"
          >
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold mb-1">
                  The 20 Hardest Questions on the DMV Written Test
                </h2>
                <p className="text-white/90 text-sm md:text-base">
                  Ranked easiest to hardest — tap an answer, see if you got it right, and learn why teens always miss it.
                </p>
              </div>
              <span className="hidden sm:inline-block bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap group-hover:bg-gray-100 transition-colors">
                Try it →
              </span>
            </div>
          </Link>
        </div>

        {/* Study tools + topic tests */}
        <div className="container mx-auto px-4 pt-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/practice-test/simulator/en', Icon: Shuffle, title: 'Practice Test Simulator', desc: 'A fresh random question set every time, drawn from the full pool.', isNew: true },
              { href: '/california-dmv-road-signs-test', Icon: TriangleAlert, title: 'Road Signs Test', desc: 'Identify real California signs with instant answers.' },
              { href: '/california-dmv-cheat-sheet', Icon: ClipboardList, title: 'DMV Cheat Sheet', desc: 'Every fact the written test asks, on one page.' },
              { href: '/california-dmv-drug-and-alcohol-test', Icon: Wine, title: 'Drug & Alcohol Test', desc: 'BAC limits, implied consent, and DUI penalties.' },
              { href: '/california-dmv-parking-test', Icon: SquareParking, title: 'Parking Test', desc: 'Curb colors and parking on hills, made simple.' },
              { href: '/california-dmv-speed-limit-test', Icon: Gauge, title: 'Speed Limits Test', desc: 'Every California limit and the Basic Speed Law.' },
              { href: '/california-dmv-marathon-test', Icon: Flame, title: 'Marathon Test', desc: 'Every question in one run until you master them all.' },
              { href: '/california-dmv-blitz-test', Icon: Zap, title: 'Blitz Test', desc: '20 questions, 15 seconds each. Answer fast for bonus points.' },
              { href: '/california-dmv-test-study-guide', Icon: BookOpen, title: 'Study Guide', desc: 'A 7-step plan from handbook to full marathon.' },
              { href: '/california-dmv-fees', Icon: CreditCard, title: 'DMV Fees', desc: 'License, REAL ID, and registration costs for 2026.' },
              { href: '/practice-test/wrong-answers', Icon: RotateCcw, title: 'Review Your Mistakes', desc: 'Retry every question you got wrong across all tests.' },
              { href: '/california-dmv-practice-test-for-seniors', Icon: UserCheck, title: 'Senior Drivers', desc: 'Renewal rules, vision tests, and re-examination for drivers 70+.' },
            ].map(({ href, Icon: CardIcon, title, desc, isNew }) => (
              <Link key={href} href={href} className="flex items-center gap-4 bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-primary/40 hover:shadow-md transition-all group">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <CardIcon className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                </div>
                <span>
                  <span className="flex items-center gap-2 font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {title}
                    {isNew && (
                      <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
                    )}
                  </span>
                  <span className="block text-sm text-gray-600">{desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Special Interest Driver Guides */}
        <div className="container mx-auto px-4 pt-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Special interest driver guides</h2>
            <p className="text-gray-600 mb-6">Practice tests and DMV rules for specific situations and drivers.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: '/new-to-california-dmv-guide', Icon: MapPin, title: 'New to California', desc: '10-day license transfer and 20-day registration rules.' },
                { href: '/california-teen-driver-test', Icon: GraduationCap, title: 'Teen Drivers', desc: 'Provisional license rules, from permit to full license.' },
                { href: '/california-disabled-driver-guide', Icon: Accessibility, title: 'People With Disabilities', desc: 'DP placards, plates, and adaptive driving rules.' },
                { href: '/california-veterans-military-dmv-guide', Icon: Shield, title: 'Veterans & Active Military', desc: 'Veteran designation, SCRA extensions, and DV plates.' },
                { href: '/california-boater-card-test', Icon: Anchor, title: 'Boat & Vessel Owners', desc: 'California Boater Card, registration, and BUI law.' },
                { href: '/california-bicyclist-pedestrian-guide', Icon: Bike, title: 'Bicyclists & Pedestrians', desc: 'E-bike classes, the Daylighting Law, and right-of-way.' },
              ].map(({ href, Icon: CardIcon, title, desc }) => (
                <Link key={href} href={href} className="flex items-center gap-4 bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-primary/40 hover:shadow-md transition-all group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                    <CardIcon className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                  </div>
                  <span>
                    <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</span>
                    <span className="block text-sm text-gray-600">{desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Cards */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <PracticeTestsContent quizzes={quizzes} />

            {/* Special Features */}
            <div className="mt-16 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Special Study Tools
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Additional ways to study beyond the practice tests
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            {/* Flashcards Card */}
            <Link
              href="/practice-test/flashcards"
              className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    Study Tool
                  </span>
                  <Layers className="w-5 h-5 text-purple-500" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  Interactive Flashcards
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Study with interactive flashcards. Master 72 essential DMV questions at your own pace.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>72 Cards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>5 Study Sets</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                  <span className="text-purple-600 font-semibold group-hover:underline">
                    Start Studying
                  </span>
                  <svg className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Intersection puzzle game card */}
            <Link
              href="/intersection"
              className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    New Game
                  </span>
                  <Navigation className="w-5 h-5 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  Intersection Puzzle
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  Tap cars, cyclists and pedestrians in the legal order they may go. Learn right-of-way — the most-missed DMV topic — by solving it.
                </p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>10 Levels</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>Earn Stars</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-red-200">
                  <span className="text-red-600 font-semibold group-hover:underline">
                    Play Now
                  </span>
                  <svg className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Multi-language hub card — anchors back up to the Language filter */}
            <Link
              href="#language-filter-anchor"
              className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    Other Languages
                  </span>
                  <Globe className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  Tests in 10 More Languages
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Practice the California DMV test in Spanish, Turkish, Chinese, Arabic, Armenian, Farsi, Punjabi, Russian, Tagalog and Vietnamese — use the language filter above to find your language.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-orange-200">
                  <span className="text-orange-600 font-semibold group-hover:underline">
                    Browse by language
                  </span>
                  <svg className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                How to Use Our Practice Tests
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Choose a Test</h3>
                  <p className="text-gray-600">
                    Select from our collection of California DMV practice tests covering different topics.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Answer Questions</h3>
                  <p className="text-gray-600">
                    Work through real DMV questions and get instant feedback on your answers.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Review & Learn</h3>
                  <p className="text-gray-600">
                    Review detailed explanations and see how you compare on the leaderboard.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Tips for Success
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Take each practice test multiple times until you consistently score above 90%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Read the explanations carefully to understand why each answer is correct</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Study the California Driver Handbook alongside these practice tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Your progress is saved automatically, so you can continue where you left off</span>
                  </li>
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
