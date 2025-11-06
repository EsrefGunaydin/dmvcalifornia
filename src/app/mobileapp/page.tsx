import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMV Practice Exams - iOS Mobile App',
  description: 'Download the DMV Practice Exams iOS app. Master your California DMV written test 2025 with practice tests, flashcards, and study guides. Pass your permit test on the first try!',
  keywords: [
    'DMV California mobile app',
    'California DMV app',
    'DMV practice test app',
    'DMV test iOS app',
    'California permit test app',
    'DMV flashcards app',
    'driving test app'
  ],
  openGraph: {
    title: 'DMV Practice Exams - iOS Mobile App',
    description: 'Download the DMV Practice Exams iOS app. Master your California DMV written test 2025 with practice tests, flashcards, and study guides.',
    type: 'website',
    url: 'https://www.dmvcalifornia.us/mobileapp',
  },
};

export default function MobileAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Now Available on iOS
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                DMV Practice Exams
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Master your California DMV written test 2025! Practice with official DMV questions, flashcards, and study guides.
              </p>

              {/* App Store Badge */}
              <a
                href="https://apps.apple.com/app/dmv-practice-exams/id6754900213"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={280}
                  height={84}
                  className="drop-shadow-lg w-[240px] md:w-[280px]"
                />
              </a>

              <p className="mt-4 text-sm text-white/70">
                Free to download • iOS 13.0 or later
              </p>
            </div>

            {/* App Screenshot */}
            <div className="flex-shrink-0">
              <div className="relative w-64 md:w-80">
                <Image
                  src="/images/screenshot1.jpg"
                  alt="DMV Practice Exams App Screenshot"
                  width={320}
                  height={640}
                  className="rounded-[2.5rem] shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Pass
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive iOS app provides all the tools you need to ace your California DMV written test.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                20+ Practice Tests
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access comprehensive practice tests with over 500 questions from the official California DMV handbook. Available in English and Turkish.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🎴</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Interactive Flashcards
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Master 72 essential DMV questions with interactive flashcards. Study at your own pace across 5 comprehensive sets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Instant Feedback
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed explanations for every answer. Learn from your mistakes and improve your knowledge with instant feedback.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Track Progress
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your performance and see your improvement over time. Know exactly when you're ready for the real test.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🚦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Traffic Signs Test
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated traffic signs test to help you memorize all California road signs and their meanings.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Offline Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Practice anywhere, anytime. All tests and flashcards are available offline once downloaded.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-2xl p-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Practice Questions</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">20+</div>
              <div className="text-xl opacity-90">Full Practice Tests</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">72</div>
              <div className="text-xl opacity-90">Interactive Flashcards</div>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DMV Practice Exams?
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Official DMV Questions
                </h3>
                <p className="text-gray-600">
                  All questions are based on the official California DMV handbook, ensuring you're studying the right material.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Bilingual Support
                </h3>
                <p className="text-gray-600">
                  Practice in English or Turkish. Perfect for California's diverse community.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Updated for 2025
                </h3>
                <p className="text-gray-600">
                  All content is regularly updated to reflect the latest California DMV requirements and regulations.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pass Guarantee
                </h3>
                <p className="text-gray-600">
                  Practice until you're ready to ace the real test. Most students pass on their first try after using our app.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-primary-200 rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Pass Your DMV Test?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Download the DMV Practice Exams app today and start your journey to getting your California driver's license!
          </p>

          <a
            href="https://apps.apple.com/app/dmv-practice-exams/id6754900213"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/app-store-badge.svg"
              alt="Download on the App Store"
              width={280}
              height={84}
              className="drop-shadow-lg mx-auto w-[240px] md:w-[280px]"
            />
          </a>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              Also available on our website:{' '}
              <Link href="/practice-test" className="text-primary font-semibold hover:underline">
                Try Practice Tests Online
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}
