import Link from 'next/link';
import { notFound } from 'next/navigation';
import blogPostsData from '../../data/blog_posts.json';
import officesData from '../../data/dmv_offices.json';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import OfficePage from './OfficePage';
import ShareButtons from './ShareButtons';

// Type for blog post
type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  tags?: string[];
  views?: number;
};

// Type for DMV office
type Office = {
  id: number;
  name: string;
  slug: string;
  phone: string;
  hours: string;
  address: string;
  services: string[];
};

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// Extract first image from HTML content
function extractFirstImageFromHtml(htmlContent: string): string | null {
  const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

// Generate Table of Contents from H2 headings
function generateTableOfContents(htmlContent: string): { toc: string; processedHtml: string } {
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const headings: { text: string; id: string }[] = [];
  let match;

  // Extract all H2 headings
  while ((match = h2Regex.exec(htmlContent)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, ''); // Remove any HTML tags from heading text
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    headings.push({ text, id });
  }

  // Add IDs to H2 headings in the content
  let processedHtml = htmlContent;
  headings.forEach(({ text, id }) => {
    const h2Pattern = new RegExp(`<h2([^>]*)>${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h2>`, 'i');
    processedHtml = processedHtml.replace(h2Pattern, `<h2$1 id="${id}">${text}</h2>`);
  });

  // Generate TOC HTML
  if (headings.length === 0) {
    return { toc: '', processedHtml };
  }

  const tocHtml = `
<div class="table-of-contents bg-white border-2 border-gray-200 rounded-lg p-6 mb-8 not-prose">
  <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
    Table Of Contents
  </h2>
  <ol class="space-y-2">
    ${headings.map((heading, index) => `
    <li class="text-gray-700">
      <a href="#${heading.id}" class="hover:text-primary transition-colors flex items-start gap-2 group">
        <span class="text-gray-400 font-medium min-w-[1.5rem]">${index + 1}.</span>
        <span class="group-hover:underline">${heading.text}</span>
      </a>
    </li>
    `).join('')}
  </ol>
</div>
  `;

  return { toc: tocHtml, processedHtml };
}

// Process HTML content to improve image attributes and embed YouTube videos
function processContentImages(htmlContent: string, postTitle: string): string {
  let processedHtml = htmlContent;

  // Replace internal blog post links with cards
  processedHtml = processedHtml.replace(
    /<figure[^>]*wp-block-embed[^>]*>.*?<div[^>]*wp-block-embed__wrapper[^>]*>\s*(https?:\/\/(?:www\.)?dmvcalifornia\.us\/([^\/\s<]+)\/?)\s*<\/div><\/figure>/gis,
    (match, url, slug) => {
      // Find the referenced post
      const referencedPost = blogPostsData.posts.find((p: BlogPost) => p.slug === slug);

      if (!referencedPost) {
        // If post not found, return a simple link
        return `<p><a href="/${slug}" class="text-primary hover:text-primary-600 underline">${url}</a></p>`;
      }

      // Get the first image from the referenced post
      const postImage = extractFirstImageFromHtml(referencedPost.content);

      return `<div class="my-8 not-prose">
  <a href="/${referencedPost.slug}" class="block group">
    <div class="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div class="flex flex-col md:flex-row">
        ${postImage ? `
        <div class="md:w-2/5 h-48 md:h-auto overflow-hidden bg-gray-100">
          <img
            src="${postImage}"
            alt="${referencedPost.title}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>` : ''}
        <div class="flex-1 p-6">
          <div class="flex items-start gap-3 mb-3">
            <svg class="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <div>
              <h3 class="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                ${referencedPost.title}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2">
                ${referencedPost.excerpt}
              </p>
            </div>
          </div>
          <div class="flex items-center text-primary font-semibold text-sm mt-4">
            Read More
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>`;
    }
  );

  // Also handle plain <a> links to internal blog posts (not in embed blocks)
  processedHtml = processedHtml.replace(
    /<p>\s*<a[^>]*href=["'](https?:\/\/(?:www\.)?dmvcalifornia\.us\/([a-z0-9-]+)\/)["'][^>]*>.*?<\/a>\s*<\/p>/gi,
    (match, url, slug) => {
      // Skip if it's a resource link (images, PDFs, etc)
      if (url.includes('wp-content') || url.includes('.pdf') || url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') || slug === 'sr1') {
        return match;
      }

      // Find the referenced post
      const referencedPost = blogPostsData.posts.find((p: BlogPost) => p.slug === slug);

      if (!referencedPost) {
        // If post not found, keep the original link
        return match;
      }

      // Get the first image from the referenced post
      const postImage = extractFirstImageFromHtml(referencedPost.content);

      return `<div class="my-8 not-prose">
  <a href="/${referencedPost.slug}" class="block group">
    <div class="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div class="flex flex-col md:flex-row">
        ${postImage ? `
        <div class="md:w-2/5 h-48 md:h-auto overflow-hidden bg-gray-100">
          <img
            src="${postImage}"
            alt="${referencedPost.title}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>` : ''}
        <div class="flex-1 p-6">
          <div class="flex items-start gap-3 mb-3">
            <svg class="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <div>
              <h3 class="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                ${referencedPost.title}
              </h3>
              <p class="text-gray-600 text-sm line-clamp-2">
                ${referencedPost.excerpt}
              </p>
            </div>
          </div>
          <div class="flex items-center text-primary font-semibold text-sm mt-4">
            Read More
            <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </a>
</div>`;
    }
  );

  // Replace WordPress YouTube embed blocks with responsive iframe embeds
  processedHtml = processedHtml.replace(
    /<figure class="wp-block-embed[^"]*is-provider-youtube[^"]*">.*?<div class="wp-block-embed__wrapper">\s*(https?:\/\/[^\s<]+)\s*<\/div><\/figure>/gi,
    (match, url) => {
      const videoId = extractYouTubeId(url);
      if (!videoId) return match;

      return `<div class="my-8">
  <div class="relative w-full rounded-lg overflow-hidden shadow-lg" style="padding-bottom: 56.25%;">
    <iframe
      class="absolute top-0 left-0 w-full h-full"
      src="https://www.youtube.com/embed/${videoId}"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</div>`;
    }
  );

  // Also handle plain YouTube links that might not be in WordPress embed blocks
  processedHtml = processedHtml.replace(
    /<a[^>]*href="(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)[^"]*)"[^>]*>.*?<\/a>/gi,
    (match, url, videoId) => {
      return `<div class="my-8">
  <div class="relative w-full rounded-lg overflow-hidden shadow-lg" style="padding-bottom: 56.25%;">
    <iframe
      class="absolute top-0 left-0 w-full h-full"
      src="https://www.youtube.com/embed/${videoId}"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</div>`;
    }
  );

  // Replace empty or missing alt attributes with meaningful text
  processedHtml = processedHtml.replace(
    /<img([^>]*?)>/gi,
    (match, attributes) => {
      // Check if alt exists and is empty or missing
      const hasEmptyAlt = /alt=[""']\s*[""]/.test(attributes);
      const hasNoAlt = !/alt=/.test(attributes);

      if (hasEmptyAlt || hasNoAlt) {
        // Remove empty alt if it exists
        let newAttributes = attributes.replace(/\s*alt=[""'][""']/, '');
        // Add meaningful alt text
        return `<img${newAttributes} alt="${postTitle} - DMV California Guide">`;
      }

      return match;
    }
  );

  // Ensure images have loading="lazy" for performance
  processedHtml = processedHtml.replace(
    /<img(?![^>]*loading=)([^>]*?)>/gi,
    '<img loading="lazy"$1>'
  );

  return processedHtml;
}

// Generate static params for all blog posts and office pages (for static generation)
export async function generateStaticParams() {
  const blogSlugs = blogPostsData.posts.map((post: BlogPost) => ({
    slug: post.slug,
  }));

  const officeSlugs = officesData.offices.map((office: Office) => ({
    slug: office.slug,
  }));

  return [...blogSlugs, ...officeSlugs];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Check if it's a blog post
  const post = blogPostsData.posts.find((p: BlogPost) => p.slug === params.slug);

  if (post) {
    return {
      title: `${post.title} - DMV California`,
      description: post.excerpt,
    };
  }

  // Check if it's an office page
  const office = officesData.offices.find((o: Office) => o.slug === params.slug);

  if (office) {
    return {
      title: `${office.name} DMV Office - Hours, Location & Phone | DMV California`,
      description: `Find ${office.name} DMV office hours, location, phone number, and services. Call ${office.phone} or visit for driver license, vehicle registration, and REAL ID services.`,
    };
  }

  return {
    title: 'Page Not Found - DMV California',
  };
}

// Page component that handles both blog posts and office pages
export default function SlugPage({ params }: { params: { slug: string } }) {
  // Check if it's a blog post first
  const post = blogPostsData.posts.find((p: BlogPost) => p.slug === params.slug);

  if (post) {
    // Render blog post page (rest of the existing code)
    return renderBlogPost(post);
  }

  // Check if it's an office page
  const office = officesData.offices.find((o: Office) => o.slug === params.slug);

  if (office) {
    return <OfficePage office={office} />;
  }

  // If neither found, show 404
  notFound();
}

// Render blog post (extracted to keep code organized)
function renderBlogPost(post: BlogPost) {

  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Process content for better image SEO
  let processedContent = processContentImages(post.content, post.title);

  // Generate Table of Contents for long articles (>1000 words)
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  let tocHtml = '';

  if (wordCount > 1000) {
    const { toc, processedHtml } = generateTableOfContents(processedContent);
    tocHtml = toc;
    processedContent = processedHtml;

    // Insert TOC after first paragraph
    const firstParagraphMatch = processedContent.match(/<p[^>]*>.*?<\/p>/i);
    if (firstParagraphMatch && tocHtml) {
      const insertPosition = firstParagraphMatch.index! + firstParagraphMatch[0].length;
      processedContent =
        processedContent.slice(0, insertPosition) +
        '\n' + tocHtml + '\n' +
        processedContent.slice(insertPosition);
    }
  }

  // Get all posts sorted by date for prev/next navigation
  const sortedPosts = [...blogPostsData.posts].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const currentIndex = sortedPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  // Get related posts (by matching tags, or random if no tags)
  const getRelatedPosts = () => {
    let related: BlogPost[] = [];

    // First, try to find posts with matching tags
    if (post.tags && post.tags.length > 0) {
      related = blogPostsData.posts.filter(p =>
        p.id !== post.id &&
        p.tags?.some(tag => post.tags?.includes(tag))
      );
    }

    // If not enough related posts, add random posts
    if (related.length < 3) {
      const remaining = blogPostsData.posts
        .filter(p => p.id !== post.id && !related.includes(p))
        .sort(() => Math.random() - 0.5);
      related = [...related, ...remaining];
    }

    return related.slice(0, 3);
  };

  const relatedPosts = getRelatedPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{post.title}</li>
          </ol>
        </nav>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-600">
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              <span>•</span>
              <span>By {post.author}</span>
            </div>

            {/* Share Buttons */}
            <ShareButtons postSlug={post.slug} postTitle={post.title} />
          </div>
        </header>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary hover:prose-a:text-primary-600 prose-a:underline
              prose-ul:my-6 prose-ol:my-6 prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto prose-img:w-full prose-img:max-w-3xl
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6
              prose-strong:text-gray-900 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Post Views Counter */}
          {post.views && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Post Views: {post.views.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-wider mb-6">
              Related Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => {
                const postImage = extractFirstImageFromHtml(relatedPost.content);
                return (
                  <Link
                    key={relatedPost.id}
                    href={`/${relatedPost.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    {postImage ? (
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={postImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Prev/Next Navigation */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary hover:text-primary-600 font-semibold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>

          {(prevPost || nextPost) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous Article */}
              {prevPost ? (
                <Link
                  href={`/${prevPost.slug}`}
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
                >
                  <div className="flex h-full">
                    {extractFirstImageFromHtml(prevPost.content) && (
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={extractFirstImageFromHtml(prevPost.content) || ''}
                          alt={prevPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <div className="text-xs text-gray-500 mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous Article
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {prevPost.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {/* Next Article */}
              {nextPost && (
                <Link
                  href={`/${nextPost.slug}`}
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
                >
                  <div className="flex h-full">
                    <div className="flex-1 p-4 flex flex-col justify-center text-right">
                      <div className="text-xs text-gray-500 mb-1 flex items-center justify-end">
                        Next Article
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {nextPost.title}
                      </h3>
                    </div>
                    {extractFirstImageFromHtml(nextPost.content) && (
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={extractFirstImageFromHtml(nextPost.content) || ''}
                          alt={nextPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </article>

      <Footer />
      <CookieBanner />
    </div>
  );
}
