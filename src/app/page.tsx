import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieBanner from '../components/CookieBanner';
import blogPostsData from '../data/blog_posts.json';
import quizzesData from '../data/quizzes.json';

export default function Home() {
  const totalQuestions = quizzesData.quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

  // Select 6 featured tests (2 simulation + 4 practice)
  const simulationTests = quizzesData.quizzes.filter(q => q.category === 'Full Simulation Tests').slice(0, 2);
  const practiceTests = quizzesData.quizzes.filter(q => q.category === 'Practice Tests').slice(0, 4);
  const featuredTests = [...simulationTests, ...practiceTests];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-primary mb-2">{totalQuestions}</div>
            <div className="text-gray-600">Practice Questions</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-primary mb-2">{blogPostsData.posts.length}</div>
            <div className="text-gray-600">
              <Link href="/blog" className="hover:text-primary">
                Blog Articles
              </Link>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-primary mb-2">{quizzesData.quizzes.length}</div>
            <div className="text-gray-600">
              <Link href="/practice-test" className="hover:text-primary">
                Practice Tests
              </Link>
            </div>
          </div>
        </div>

        {/* All Practice Tests */}
        <div className="mb-16">
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
