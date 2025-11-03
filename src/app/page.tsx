import Link from 'next/link';
import blogPostsData from '../data/blog_posts.json';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">DMV California</h1>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary font-medium">
              Blog
            </Link>
          </div>
        </div>
      </nav>

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
          <button className="bg-primary hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg">
            Start Practice Test
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl font-bold text-primary mb-2">113</div>
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
            <div className="text-4xl font-bold text-primary mb-2">4</div>
            <div className="text-gray-600">Practice Quizzes</div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="text-center text-gray-500">
          <p className="text-lg">🚧 Under Construction - New Quiz Platform Coming Soon! 🚧</p>
        </div>
      </div>
    </main>
  );
}
