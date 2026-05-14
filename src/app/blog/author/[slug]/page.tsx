import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import blogPostsData from '@/data/blog_posts.json';
import authorsData from '@/data/blog_authors.json';

interface BlogPostLike {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  tags?: string[];
  content: string;
  hero_image?: string | null;
}

interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
}

const SITE_URL = 'https://www.dmvcalifornia.us';

function findAuthorBySlug(slug: string): Author | null {
  return (authorsData.authors as Author[]).find((a) => a.slug === slug) || null;
}

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export async function generateStaticParams() {
  return (authorsData.authors as Author[]).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = findAuthorBySlug(slug);

  if (!author) {
    return { title: 'Author Not Found - DMV California' };
  }

  const canonical = `${SITE_URL}/blog/author/${slug}`;
  const description = `${author.name} — ${author.role}. ${author.bio.slice(0, 130)}`;

  return {
    title: `${author.name} - DMV California Author`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${author.name} — ${author.role}`,
      description,
      url: canonical,
      type: 'profile',
      siteName: 'DMV California',
    },
    twitter: { card: 'summary', title: author.name, description },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = findAuthorBySlug(slug);

  if (!author) notFound();

  const posts = (blogPostsData.posts as BlogPostLike[])
    .filter((p) => p.author === author.name)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Person JSON-LD for E-A-T signals
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `${SITE_URL}/blog/author/${slug}`,
    knowsAbout: author.expertise,
    worksFor: { '@type': 'Organization', name: 'DMV California', url: SITE_URL },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-white/80 mb-4">
            <ol className="flex items-center justify-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-white">Blog</Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">{author.name}</li>
            </ol>
          </nav>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{author.name}</h1>
            <p className="text-white/90 text-base md:text-lg mb-4">{author.role}</p>
            <p className="text-white/80 max-w-2xl mx-auto">{author.bio}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {author.expertise.map((topic) => (
                <span
                  key={topic}
                  className="bg-white/20 text-white text-sm px-3 py-1 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Articles by {author.name}{' '}
          <span className="text-gray-500 text-base font-normal">({posts.length})</span>
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">No articles by this author yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const image = post.hero_image || extractFirstImage(post.content);
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                    <time className="text-xs text-gray-500" dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
