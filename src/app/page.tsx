import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import blogPostsData from '../data/blog_posts.json';
import quizzesData from '../data/quizzes.json';
import AdSense from '@/components/AdSense';
import ADSENSE_CONFIG from '@/config/adsense';

export default function Home() {
  const totalQuestions = quizzesData.quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

  // Select 6 featured items (2 simulation + 2 practice + flashcards + sign quiz)
  const simulationTests = quizzesData.quizzes.filter(q => q.category === 'Full Simulation Tests').slice(0, 2);
  const practiceTests = quizzesData.quizzes.filter(q => q.category === 'Practice Tests').slice(0, 2);
  const featuredTests = [...simulationTests, ...practiceTests];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Hero Section - Full Width */}
      <div
        className="text-center relative w-full"
        style={{
          backgroundImage: 'url(/images/hero-image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/70"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
            {/* Seal of Success - Left side on desktop */}
            <div className="flex-shrink-0 hidden md:block">
              <Image
                src="/images/seal-of-success.png"
                alt="Seal of Success"
                width={240}
                height={240}
                className="drop-shadow-2xl"
                priority
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Pass Your California DMV Test
                <span className="block text-primary mt-2">First Try</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Master your California driving knowledge with interactive quizzes, practice tests, and comprehensive study guides.
              </p>
              <Link
                href="/practice-test"
                className="inline-block bg-primary hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
              >
                Start Practice Test
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-primary mb-3">500+</div>
            <div className="text-gray-700 font-semibold text-lg">Practice Questions</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-primary mb-3">50+</div>
            <div className="text-gray-700 font-semibold text-lg">
              <Link href="/blog" className="hover:text-primary">
                Blog Articles
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-primary mb-3">20+</div>
            <div className="text-gray-700 font-semibold text-lg">
              <Link href="/practice-test" className="hover:text-primary">
                Practice Tests
              </Link>
            </div>
          </div>
        </div>

        {/* All Practice Tests */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              California DMV Practice Tests
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The most comprehensive collection of California DMV practice tests. Test your knowledge with real DMV questions and get instant feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredTests.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/practice-test/${quiz.slug}`}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <div className="mb-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                      {quiz.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{quiz.questions.length} Questions</span>
                    <span className="text-primary font-medium group-hover:underline">
                      Start →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Flashcards Card */}
            <Link
              href="/practice-test/flashcards"
              className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    Study Tool
                  </span>
                  <span className="text-2xl">🎴</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Interactive Flashcards
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Master 72 essential DMV questions with interactive flashcards. Study at your own pace across 5 comprehensive sets.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>72 Cards • 5 Sets</span>
                  <span className="text-purple-600 font-medium group-hover:underline">
                    Start Studying →
                  </span>
                </div>
              </div>
            </Link>

            {/* Traffic Sign Test Card */}
            <Link
              href="/dmv-turkish-test/dmv-california-turkce-trafik-isareti-testi"
              className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                    Turkish / Türkçe
                  </span>
                  <span className="text-2xl">🚦</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  Traffic Sign Test (Turkish)
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Kaliforniya trafik işaretleri testi - Türkçe. California traffic signs test in Turkish language.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>11 Questions</span>
                  <span className="text-yellow-600 font-medium group-hover:underline">
                    Teste Başla →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/practice-test"
              className="inline-block text-primary hover:text-primary-600 font-semibold text-lg"
            >
              View All Practice Tests →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}
