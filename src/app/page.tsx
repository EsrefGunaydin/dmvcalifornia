import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import AppPromotion from '../components/AppPromotion';
import blogPostsData from '../data/blog_posts.json';
import quizzesData from '../data/quizzes.json';
import turkishQuizzesData from '../data/turkish-quizzes.json';
import chineseQuizzesData from '../data/chinese-quizzes.json';
import spanishSignTestData from '../data/spanish-sign-test.json';
import turkishSignTestData from '../data/turkish-sign-test.json';
import arabicQuizzesData from '../data/arabic-quizzes.json';
import armenianQuizzesData from '../data/armenian-quizzes.json';
import farsiQuizzesData from '../data/farsi-quizzes.json';
import punjabiQuizzesData from '../data/punjabi-quizzes.json';
import russianQuizzesData from '../data/russian-quizzes.json';
import tagalogQuizzesData from '../data/tagalog-quizzes.json';
import vietnameseQuizzesData from '../data/vietnamese-quizzes.json';
import motorcycleQuizzesData from '../data/motorcycle-quizzes.json';
import commercialQuizzesData from '../data/commercial-quizzes.json';
import AdSense from '@/components/AdSense';
import ADSENSE_CONFIG from '@/config/adsense';

export default function Home() {
  // Aggregate every quiz source so the homepage stats stay in sync with the grid
  const multiQuizSources = [
    quizzesData,
    chineseQuizzesData,
    turkishQuizzesData,
    arabicQuizzesData,
    armenianQuizzesData,
    farsiQuizzesData,
    punjabiQuizzesData,
    russianQuizzesData,
    tagalogQuizzesData,
    vietnameseQuizzesData,
    motorcycleQuizzesData,
    commercialQuizzesData,
  ];
  const singleQuizSources = [spanishSignTestData, turkishSignTestData];

  const totalQuestions =
    multiQuizSources.reduce(
      (sum, src) => sum + src.quizzes.reduce((s, q) => s + q.questions.length, 0),
      0,
    ) + singleQuizSources.reduce((sum, src) => sum + src.quiz.questions.length, 0);

  const totalTests =
    multiQuizSources.reduce((sum, src) => sum + src.quizzes.length, 0) + singleQuizSources.length;

  const yearsServing = new Date().getFullYear() - 2017;

  // Select 6 featured items (2 simulation tests + interactive flashcards + Spanish + Turkish + Chinese)
  const simulationTests = quizzesData.quizzes.filter(q => q.category === 'Full Simulation Tests').slice(0, 2);
  const featuredTests = [...simulationTests];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Preload the hero background image so the browser starts the
          download immediately rather than discovering it via the inline
          style. Cuts LCP discovery time and is the single biggest LCP fix
          for the homepage. */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-image.webp"
        fetchPriority="high"
      />

      {/* Hero Section - Full Width */}
      <div
        className="text-center relative w-full"
        style={{
          backgroundImage: 'url(/images/hero-image.webp)',
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
            {/* DMV Logo - Left side on desktop */}
            <div className="flex-shrink-0 hidden md:block">
              <Image
                src="/images/dmv-logo.webp"
                alt="DMV California Logo"
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

            {/* Seal of Success - Right side on desktop */}
            <div className="flex-shrink-0 hidden md:block">
              <Image
                src="/images/success-green.webp"
                alt="Seal of Success"
                width={240}
                height={240}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <main id="main-content" className="container mx-auto px-4 py-8">

        {/* Trust Banner */}
        <div className="mb-8 mx-auto max-w-3xl bg-gradient-to-r from-primary/10 via-amber-50 to-primary/10 border-2 border-primary/30 rounded-2xl px-6 py-5 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 text-primary font-bold text-2xl md:text-3xl mb-1">
            <span>⭐</span>
            <span>Trusted by 150,000+ California drivers</span>
            <span>⭐</span>
          </div>
          <p className="text-gray-700 text-sm md:text-base">
            {yearsServing} years helping people pass their California DMV test on the first try
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-primary mb-3">{totalQuestions.toLocaleString()}+</div>
            <div className="text-gray-700 font-semibold text-lg">Practice Questions</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-primary mb-3">{totalTests}+</div>
            <div className="text-gray-700 font-semibold text-lg">
              <Link href="/practice-test" className="hover:text-primary">
                Practice Tests
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-primary mb-3">11</div>
            <div className="text-gray-700 font-semibold text-lg">Languages</div>
            <div className="text-sm text-gray-500 mt-1">🇺🇸 🇪🇸 🇹🇷 🇨🇳 🇸🇦 🇦🇲 🇮🇷 🇮🇳 🇷🇺 🇵🇭 🇻🇳</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl font-bold text-primary mb-3">50+</div>
            <div className="text-gray-700 font-semibold text-lg">
              <Link href="/blog" className="hover:text-primary">
                Blog Articles
              </Link>
            </div>
          </div>
        </div>

        {/* App Promotion Banner */}
        <AppPromotion variant="banner" className="mb-12" />

        {/* Intersection Game Promo */}
        <Link href="/intersection" className="block mb-12 group">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-2 border-slate-600">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-6 md:px-10 py-8">
              <div className="flex-shrink-0 text-6xl md:text-7xl" aria-hidden="true">🚦</div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
                  <span className="text-amber-300 text-xs font-semibold uppercase tracking-wide">Free Interactive Game</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Intersection — Who Goes First?
                </h2>
                <p className="text-slate-300 text-sm md:text-base max-w-2xl">
                  Master right-of-way — the hardest-tested DMV topic — with 10 hand-built puzzles. Tap the cars, pedestrians, and cyclists in the legal order they may proceed, and watch the collision play out when you get it wrong.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-block bg-primary group-hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
                  Play Now →
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Free DMV Study Tools — surfaces the dedicated study pages so they
            get homepage internal links (discovery + SEO authority). */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Free DMV Study Tools
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to pass — road signs, a one-page cheat sheet, a full study plan, and more. All free, no signup.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { href: '/california-dmv-road-signs-test', icon: '🚦', title: 'Road Signs Test', desc: 'Drill all 38 California road signs with real images and instant answers.' },
              { href: '/california-dmv-cheat-sheet', icon: '📋', title: 'DMV Cheat Sheet', desc: 'Every number and rule the test loves — BAC, curb colors, speed limits — on one page.' },
              { href: '/california-dmv-test-study-guide', icon: '📚', title: 'Study Guide', desc: 'A simple 7-step plan from the handbook all the way to test day.' },
              { href: '/california-dmv-marathon-test', icon: '🏁', title: 'Marathon Test', desc: 'Every question in one run — miss one and it comes back until you master it.' },
              { href: '/20-hardest-dmv-written-test-questions', icon: '🔥', title: '20 Hardest Questions', desc: 'The trickiest, most-missed questions, explained so they can’t surprise you.' },
              { href: '/california-dmv-fees', icon: '💲', title: 'DMV Fees', desc: 'License, renewal, REAL ID, and registration costs — what you’ll actually pay.' },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary p-6 flex items-start gap-4"
              >
                <div className="text-4xl flex-shrink-0" aria-hidden="true">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/california-dmv-test-study-guide" className="text-primary font-semibold hover:underline">
              See the full study plan →
            </Link>
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
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    {(quiz as { badge?: string }).badge && (
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {(quiz as { badge?: string }).badge}
                      </span>
                    )}
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

            {/* Spanish Practice Test Card */}
            <Link
              href="/muestra-del-examen-escrito-para-licencia-de-manejar"
              className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
                    Spanish / Español
                  </span>
                  <span className="text-2xl">🇪🇸</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  Examen de Práctica (Español)
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  Examen de práctica del DMV en español. California DMV practice test in Spanish 2025 with complete answers.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{spanishSignTestData.quiz.questions.length} Questions</span>
                  <span className="text-orange-600 font-medium group-hover:underline">
                    Comenzar →
                  </span>
                </div>
              </div>
            </Link>

            {/* Turkish Practice Test Card */}
            <Link
              href="/dmv-turkish-test"
              className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                    Turkish / Türkçe
                  </span>
                  <span className="text-2xl">🇹🇷</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  DMV Türkçe Testler
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  California DMV Türkçe sürücü testleri. Turkish driving knowledge tests with complete explanations.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{turkishQuizzesData.quizzes.reduce((s, q) => s + q.questions.length, 0)} Questions • {turkishQuizzesData.quizzes.length} Tests</span>
                  <span className="text-red-600 font-medium group-hover:underline">
                    Başla →
                  </span>
                </div>
              </div>
            </Link>

            {/* Chinese Practice Test Card */}
            <Link
              href="/dmv-chinese-test"
              className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                    Chinese / 中文
                  </span>
                  <span className="text-2xl">🇨🇳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  DMV 中文考試
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  加州 DMV 中文駕駛考試。California DMV Chinese driving knowledge tests with complete answers.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{chineseQuizzesData.quizzes.reduce((s, q) => s + q.questions.length, 0)} Questions • {chineseQuizzesData.quizzes.length} Tests</span>
                  <span className="text-yellow-600 font-medium group-hover:underline">
                    開始 →
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

        {/* Specialized Driver Guides */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialized Driver Guides
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete 2026 guides for teens, seniors, veterans, commercial drivers, and other groups with unique California DMV requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { href: '/new-to-california-driver-guide-2026', icon: '🏖️', title: 'New to California', desc: '10-day license + 20-day registration rules' },
              { href: '/california-teen-driver-complete-guide-2026', icon: '🎓', title: 'Teen Drivers', desc: 'From learner’s permit to provisional license' },
              { href: '/california-senior-driver-license-guide-2026', icon: '👵', title: 'Senior Drivers', desc: 'In-person renewal at 70+ and re-examination' },
              { href: '/california-disabled-driver-license-guide-2026', icon: '♿', title: 'People With Disabilities', desc: 'DP placards, plates, adaptive equipment' },
              { href: '/california-veterans-active-military-dmv-guide-2026', icon: '🎖️', title: 'Veterans & Active Military', desc: 'Designation, plates, SCRA extensions' },
              { href: '/california-motorcycle-license-class-m-guide-2026', icon: '🏍️', title: 'Motorcyclists', desc: 'Class M1, CMSP, helmet and lane-splitting law' },
              { href: '/california-truck-driver-cdl-guide-2026', icon: '🚛', title: 'Truck Drivers (CDL)', desc: 'Class A/B/C, ELDT, DOT physical, endorsements' },
              { href: '/california-boat-vessel-owner-guide-2026', icon: '⛵', title: 'Boat & Vessel Owners', desc: 'California Boater Card, registration, BUI' },
              { href: '/california-bicyclist-pedestrian-safety-guide-2026', icon: '🚴', title: 'Bicyclists & Pedestrians', desc: 'Bike laws, e-bike classes, Daylighting Law' },
            ].map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex items-start gap-4 bg-white border-2 border-gray-100 hover:border-primary/40 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <span className="text-3xl flex-shrink-0" aria-hidden="true">{guide.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{guide.desc}</p>
                </div>
                <span className="text-primary text-lg flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
