import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AppPromotion from '@/components/AppPromotion';
import blogPostsData from '@/data/blog_posts.json';

interface BlogPostLike {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  tags?: string[];
  content: string;
}

const SITE_URL = 'https://www.dmvcalifornia.us';

/**
 * Convert a tag like "Driver License" → "driver-license" for URL slug.
 */
function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getUniqueTags(): string[] {
  const all = new Set<string>();
  for (const post of blogPostsData.posts as BlogPostLike[]) {
    for (const tag of post.tags || []) {
      all.add(tag);
    }
  }
  return Array.from(all);
}

function findTagBySlug(slug: string): string | null {
  return getUniqueTags().find((tag) => tagToSlug(tag) === slug) || null;
}

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export async function generateStaticParams() {
  return getUniqueTags().map((tag) => ({ category: tagToSlug(tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const tag = findTagBySlug(category);

  if (!tag) {
    return { title: 'Category Not Found - DMV California' };
  }

  const description = `Browse all ${tag} articles on DMV California — expert guides, tips, and advice for California drivers.`;
  const canonical = `${SITE_URL}/blog/category/${category}`;

  return {
    title: `${tag} Articles - DMV California Blog`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${tag} — DMV California Blog`,
      description,
      url: canonical,
      type: 'website',
      siteName: 'DMV California',
    },
    twitter: { card: 'summary_large_image', title: tag, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const tag = findTagBySlug(category);

  if (!tag) notFound();

  const posts = (blogPostsData.posts as BlogPostLike[])
    .filter((p) => p.tags?.includes(tag))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-white/80 mb-4">
            <ol className="flex items-center justify-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">{tag}</li>
            </ol>
          </nav>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{tag} Articles</h1>
            <p className="text-base text-white/90">
              {posts.length} {posts.length === 1 ? 'guide' : 'guides'} on {tag.toLowerCase()} for
              California drivers.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <AppPromotion variant="banner" />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No articles in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const image = extractFirstImage(post.content);
              return (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  className="group bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden block"
                >
                  {image ? (
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-primary-50" />
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(post.tags || []).slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="text-xs text-gray-500">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span aria-hidden> • </span>
                      <span>{post.author}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Other categories for internal linking */}
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Other Categories</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {getUniqueTags()
              .filter((t) => t !== tag)
              .map((t) => (
                <Link
                  key={t}
                  href={`/blog/category/${tagToSlug(t)}`}
                  className="bg-white border border-gray-200 hover:border-primary hover:text-primary text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-colors"
                >
                  {t}
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
