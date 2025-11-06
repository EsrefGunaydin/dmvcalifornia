import BlogList from './BlogList';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import AppPromotionIOS from '../../components/AppPromotionIOS';

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
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              DMV California Blog
            </h1>
            <p className="text-base text-white/90 mb-4">
              Expert guides, tips, and advice for California drivers. Learn everything about DMV procedures, driving tests, and traffic laws.
            </p>
            <div>
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                50+ Articles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* App Promotion Banner - iOS Only */}
      <div className="container mx-auto px-4 py-6">
        <AppPromotionIOS variant="banner" />
      </div>

      {/* Blog List with Filters */}
      <BlogList posts={posts} />

      <Footer />
      <CookieBanner />
    </div>
  );
}
