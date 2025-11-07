import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AppPromotionIOS from '@/components/AppPromotionIOS';
import quizzesData from '@/data/quizzes.json';

export const metadata = {
  title: 'California DMV Practice Tests | DMV California',
  description: 'Free California DMV practice tests. Test your knowledge with real DMV questions and prepare for your permit test.',
};

export default function PracticeTestsPage() {
  const quizzes = quizzesData.quizzes;

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
              <p className="text-xl text-white/90 mb-6">
                Test your knowledge with real DMV questions. Practice as many times as you need to pass your permit test with confidence.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold">28+</div>
                  <div className="text-sm text-white/90">Practice Tests</div>
                </div>
                <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold">700+</div>
                  <div className="text-sm text-white/90">Total Questions</div>
                </div>
                <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-white/90">Languages 🇺🇸 🇪🇸 🇹🇷</div>
                </div>
                <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-white/90">Free Forever</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Promotion Banner - iOS Only */}
        <div className="container mx-auto px-4 pt-6">
          <AppPromotionIOS variant="banner" />
        </div>

        {/* Quiz Cards */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/practice-test/${quiz.slug}`}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {quiz.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {quiz.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{quiz.questions.length} Questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{quiz.passingScore}% to Pass</span>
                    </div>
                    {quiz.timeLimit && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{quiz.timeLimit} Minutes</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-primary font-semibold group-hover:underline">
                      Start Practice Test
                    </span>
                    <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
                {/* Category Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    Study Tool
                  </span>
                  <span className="text-2xl">🎴</span>
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

            {/* Spanish Test Card */}
            <Link
              href="/muestra-del-examen-escrito-para-licencia-de-manejar"
              className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Spanish / Español
                  </span>
                  <span className="text-2xl">🇪🇸</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Examen del DMV en Español
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Exámenes de práctica del DMV de California en español. 4 exámenes completos con 112 preguntas en total.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>4 Exámenes Completos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>En Español</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                  <span className="text-blue-600 font-semibold group-hover:underline">
                    Comenzar Exámenes
                  </span>
                  <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Turkish Test Card */}
            <Link
              href="/dmv-turkish-test"
              className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Turkish / Türkçe
                  </span>
                  <span className="text-2xl">🇹🇷</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  California DMV Türkçe Test
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  California DMV sınav soruları Türkçe. Kaliforniya ehliyet sınavına hazırlanmak için Türkçe pratik testleri.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Multiple Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>In Turkish Language</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center justify-between pt-4 border-t border-red-200">
                  <span className="text-red-600 font-semibold group-hover:underline">
                    Teste Başla
                  </span>
                  <svg className="w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
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
