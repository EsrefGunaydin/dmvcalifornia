import Link from 'next/link';
import BlogList from './BlogList';

// Import the extracted blog posts
import blogPostsData from '../../data/blog_posts.json';

export const metadata = {
  title: 'Blog - DMV California',
  description: 'Read our latest articles about California DMV, driving tests, traffic laws, and driving tips.',
};

export default function BlogPage() {
  const posts = blogPostsData.posts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-600">
            DMV California
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DMV California Blog
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Expert guides, tips, and advice for California drivers. Learn everything about DMV procedures, driving tests, and traffic laws.
          </p>
          <div className="mt-6">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              {posts.length} Articles
            </span>
          </div>
        </div>
      </section>

      {/* Blog List with Filters */}
      <BlogList posts={posts} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} DMV California. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Not affiliated with the California Department of Motor Vehicles
          </p>
        </div>
      </footer>
    </div>
  );
}
