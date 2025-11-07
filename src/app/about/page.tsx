import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import blogPostsData from '@/data/blog_posts.json';
import quizzesData from '@/data/quizzes.json';

export const metadata = {
  title: 'About Us - DMV California',
  description: 'Learn about DMV California, your trusted resource for DMV practice tests, study guides, and helpful articles. We help California drivers pass their DMV tests with confidence.',
};

export default function AboutPage() {
  // Select 4 featured quizzes (mix of simulation and practice tests)
  const featuredQuizzes = quizzesData.quizzes.slice(0, 4);

  // Select 4 featured blog posts (sorted by views)
  const featuredPosts = blogPostsData.posts
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About DMV California
              </h1>
              <p className="text-xl text-white/90 mb-4">
                Your trusted resource for passing the California DMV test on your first try
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Our Mission
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 mb-4">
                  DMV California is dedicated to helping aspiring drivers in California pass their DMV knowledge tests with confidence. We provide comprehensive, free resources including practice tests, study guides, and informative blog articles to ensure you're fully prepared for your DMV exam.
                </p>

                <p className="text-gray-700 mb-4">
                  Our platform offers over 700 practice questions across 28+ comprehensive practice tests in 3 languages (English, Spanish, and Turkish), plus 50+ detailed blog articles covering everything from road signs to driving laws. Whether you're a first-time driver, renewing your license, or need to refresh your knowledge, we're here to help you succeed.
                </p>

                <div className="bg-blue-50 border-l-4 border-primary p-6 my-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    What We Offer
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Practice Tests:</strong> Full-length simulation tests and topic-specific quizzes that mirror the actual DMV exam</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Interactive Flashcards:</strong> Study at your own pace with our comprehensive flashcard system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Educational Blog:</strong> Expert articles on DMV procedures, driving tips, and traffic laws</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Multilingual Support:</strong> Practice tests available in Spanish and Turkish</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Mobile App:</strong> Study on-the-go with our iOS mobile application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>100% Free:</strong> All our resources are completely free with no hidden fees</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Practice Tests */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Practice Tests
                </h2>
                <p className="text-lg text-gray-600">
                  Test your knowledge with our comprehensive practice exams
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {featuredQuizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/practice-test/${quiz.slug}`}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
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
                          Start Test →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/practice-test"
                  className="inline-block bg-primary hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  View All Practice Tests
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Popular Blog Articles
                </h2>
                <p className="text-lg text-gray-600">
                  Learn from our comprehensive guides and helpful tips
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{post.views.toLocaleString()} views</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.author}</span>
                        <span className="text-primary font-medium text-sm group-hover:underline">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/blog"
                  className="inline-block bg-primary hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  View All Blog Posts
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Disclaimer
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>DMV California (dmvcalifornia.us) is an independent educational resource and is not affiliated with, endorsed by, or connected to the California Department of Motor Vehicles (DMV) or any other government agency.</strong>
                </p>
                <p className="text-gray-700 mb-4">
                  We are a private educational platform designed to help individuals prepare for their California DMV knowledge tests. All practice tests, study materials, and information on this website are created for educational purposes only.
                </p>
                <p className="text-gray-700">
                  For official DMV services, forms, and information, please visit the official California DMV website at <a href="https://www.dmv.ca.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">dmv.ca.gov</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact/Support Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of successful California drivers who have passed their DMV tests using our free resources.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/practice-test"
                  className="inline-block bg-primary hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg"
                >
                  Start Practice Test
                </Link>
                <Link
                  href="/blog"
                  className="inline-block bg-white hover:bg-gray-50 text-primary border-2 border-primary font-bold py-4 px-8 rounded-lg transition-colors"
                >
                  Browse Blog Articles
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
