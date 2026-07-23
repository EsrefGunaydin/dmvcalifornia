import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import blogPostsData from '../../data/blog_posts.json';
import officesData from '../../data/dmv_offices.json';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import OfficePage from './OfficePage';
import ShareButtons from './ShareButtons';
import AdSense from '@/components/AdSense';
import ADSENSE_CONFIG from '@/config/adsense';
import QuizPromotionPopup from '@/components/QuizPromotionPopup';
import BlogViewTracker from '@/components/BlogViewTracker';
import BlogPostContent from '@/components/BlogPostContent';
import BlogImageLightbox from '@/components/BlogImageLightbox';
import MultiplexAd from '@/components/MultiplexAd';
import { inlineAppPromotionHtml } from '@/components/InlineAppPromotion';
import ArticleSchema from '@/components/blog/ArticleSchema';
import UpNextBar from '@/components/blog/UpNextBar';
import PracticeTestCTA from '@/components/blog/PracticeTestCTA';
import InlineQuiz, { type InlineQuizConfig } from '@/components/blog/InlineQuiz';
import { AFFILIATE_CREATIVES } from '@/config/affiliate-creatives';
import { countWords, readingTimeMinutes } from '@/lib/strip-html';
import { tagToSlug } from '@/lib/blogTags';

// Type for blog post
type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags?: string[];
  views?: number;
  hero_image?: string;
  faq?: { question: string; answer: string }[];
  lang?: string;
  // Map of hreflang code -> slug of the same article in another language.
  translations?: { [lang: string]: string };
  // Optional SEO overrides (decouple the SERP title/description from the H1/excerpt).
  metaTitle?: string;
  metaDescription?: string;
  // Optional in-content practice-test CTA (blog → tests funnel).
  testCta?: import('@/components/blog/PracticeTestCTA').PracticeTestCtaConfig;
  // Optional YouTube video embed shown after article body, before FAQ.
  youtubeId?: string;
  // Copy for the video section — defaults to the English CA test copy if omitted.
  youtubeHeading?: string;
  youtubeSubtitle?: string;
  youtubeTitle?: string;
  // Optional 3-question inline quiz shown before the testCta.
  inlineQuiz?: InlineQuizConfig;
};

const SITE_URL = 'https://dmvcalifornia.us';

// JSON imports infer a heterogeneous union once posts carry optional fields
// (lang/translations) on only some entries. Cast once to the canonical type.
const blogPosts = blogPostsData.posts as unknown as BlogPost[];

// Default quiz used for posts that have the <!-- inline-quiz --> marker but
// no custom inlineQuiz field. Questions are chosen to trip up even experienced
// drivers — the "only 1% pass all 3" challenge angle.
const DEFAULT_INLINE_QUIZ: InlineQuizConfig = {
  header: 'Only 1% of California drivers answer all 3 correctly',
  subheader: 'Think you know the rules? Most licensed drivers miss at least one.',
  questions: [
    {
      question: 'At 60 mph on a dry California freeway, what is the recommended minimum following distance?',
      options: ['3 seconds', '4 seconds', '6 seconds'],
      correctAnswer: 2,
      explanation: 'At 60 mph you need at least 6 seconds: 4 seconds baseline, plus 1 extra second per 10 mph above 40. Most drivers use 2-3 seconds — less than half what is safe.',
    },
    {
      question: 'At what speed can hydroplaning begin on tires with worn tread?',
      options: ['35 mph', '50 mph', '65 mph'],
      correctAnswer: 0,
      explanation: 'Worn tires can lose road contact at 35 mph. Most drivers assume hydroplaning only happens at highway speeds. Worn tires lose grip at speeds most people consider completely normal.',
    },
    {
      question: 'How often should a defensive driver check mirrors while cruising at highway speed?',
      options: ['Only before changing lanes', 'Every 5-8 seconds', 'Every 15-20 seconds'],
      correctAnswer: 1,
      explanation: 'Mirror checks every 5-8 seconds mean you always know what is around you before you need to move. Waiting until a lane change means you are already reacting — defensive driving is about anticipating.',
    },
  ],
  ctaCards: [
    {
      href: '/defensive-driving',
      title: 'Defensive driving guide',
      description: 'The 5 habits that prevent accidents. Most licensed drivers skip all of them.',
      label: 'Read the guide',
      icon: 'shield',
    },
    {
      href: '/practice-test/practice-test-safe-driving-and-defensive-techniques',
      title: 'Good driver test',
      description: '22 questions on defensive driving and hazard awareness. Can you pass?',
      label: 'Take the challenge',
      icon: 'trophy',
    },
    {
      href: '/practice-test/california-dmv-practice-test-2026',
      title: 'Full practice test',
      description: '46 questions covering all California DMV topics. Same format as the real exam.',
      label: 'Start free',
      icon: 'clipboard',
    },
  ],
};

// High-intent posts that get a contextual IMPROV affiliate banner after the
// article body. Keep this small and topical — random placement doesn't convert.
const AFFILIATE_BANNER_BY_SLUG: Record<string, string> = {
  'california-online-traffic-school': 'ts-300x250',
  'dui-california-limits': 'ts-300x250',
  'new-traffic-laws-for-california-drivers-in-2025': 'ts-300x250',
  'california-new-traffic-laws-2026-every-change-explained': 'ts-300x250',
  'auto-insurance': 'mature-300x250',
};

// Build the in-content affiliate banner HTML (label + AWIN creative). Injected
// into the article body so it sits in the reading flow, not bolted to the page.
function affiliateBannerHtml(creativeKey: string): string {
  const c = AFFILIATE_CREATIVES[creativeKey];
  if (!c || !c.code) return '';
  const lazyCode = c.code.replace('<img ', '<img loading="lazy" ');
  return `<div class="not-prose" style="margin:1.75rem auto;max-width:${c.width}px;text-align:center;"><div style="font-size:0.625rem;letter-spacing:0.05em;text-transform:uppercase;color:#9ca3af;margin-bottom:6px;">Sponsored</div>${lazyCode}</div>`;
}

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

// Resolve the card/preview image for a post — prefer the explicit
// hero_image, fall back to the first <img> embedded in legacy content.
function resolvePostImage(post: { hero_image?: string | null; content: string }): string | null {
  return post.hero_image || extractFirstImageFromHtml(post.content);
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
      const referencedPost = blogPosts.find((p: BlogPost) => p.slug === slug);

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

  // Promo `<figure><div><a>NAKED URL</a></div></figure>` blocks — these are
  // the most common "see this article" callouts the old WordPress export
  // produced. Convert each one into the same internal-post card.
  processedHtml = processedHtml.replace(
    /<figure[^>]*>\s*<div[^>]*>\s*<a[^>]*href=["'](https?:\/\/(?:www\.)?dmvcalifornia\.us\/([a-z0-9-]+)\/?)["'][^>]*>([^<]*)<\/a>\s*<\/div>\s*<\/figure>/gi,
    (match, url, slug, linkText) => {
      // Only transform when the link text is the URL itself (naked link).
      // If someone wrote real anchor text, leave it alone.
      const text = (linkText || '').trim();
      const isNaked = !text || text === url || text === url.replace(/\/$/, '') || text.replace(/\/$/, '') === url.replace(/\/$/, '');
      if (!isNaked) return match;

      const referencedPost = blogPosts.find((p: BlogPost) => p.slug === slug);
      if (!referencedPost) {
        // Internal page that isn't a blog post (e.g. /dmv-offices). Render a
        // simple styled call-out instead of leaking the bare URL.
        const humanLabel = slug
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return `<p class="not-prose my-6"><a href="/${slug}" class="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold px-4 py-2 rounded-lg transition-colors">→ ${humanLabel}</a></p>`;
      }

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
    },
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
      const referencedPost = blogPosts.find((p: BlogPost) => p.slug === slug);

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

  // Performance: the FIRST content image is almost always the LCP candidate
  // (especially on legacy articles where a figure appears right after the
  // intro paragraph). Lazy-loading it hurts the LCP score. We mark the first
  // image as eager + fetchpriority=high; every subsequent image gets
  // loading=lazy and decoding=async to avoid blocking render.
  let imgIndex = 0;
  processedHtml = processedHtml.replace(
    /<img([^>]*?)>/gi,
    (_, attrs) => {
      const isFirst = imgIndex === 0;
      imgIndex += 1;
      const hasLoading = /\bloading\s*=/.test(attrs);
      const hasDecoding = /\bdecoding\s*=/.test(attrs);
      const hasFetchPriority = /\bfetchpriority\s*=/.test(attrs);

      let next = attrs;
      if (!hasDecoding) next = ` decoding="async"${next}`;
      if (isFirst) {
        if (!hasFetchPriority) next = ` fetchpriority="high"${next}`;
        if (!hasLoading) next = ` loading="eager"${next}`;
      } else if (!hasLoading) {
        next = ` loading="lazy"${next}`;
      }
      return `<img${next}>`;
    },
  );

  return processedHtml;
}

// Slugs that have their own dedicated route under src/app/. A blog post must
// never be prerendered at one of these paths by this catch-all route, or it
// shadows the purpose-built page (e.g. the Spanish test hub was being
// overwritten by a same-slug blog article). Keep in sync with src/app/.
const RESERVED_SLUGS = new Set<string>([
  'muestra-del-examen-escrito-para-licencia-de-manejar',
  'practice-test',
  'blog',
  'about',
  'privacy-policy',
  'dmv-offices',
  'mobileapp',
  'intersection',
  'eyes-on-the-road',
  'motorcycle-test',
  'commercial-test',
  'dmv-turkish-test',
  'dmv-chinese-test',
  'dmv-arabic-test',
  'dmv-armenian-test',
  'dmv-farsi-test',
  'dmv-punjabi-test',
  'dmv-russian-test',
  'dmv-tagalog-test',
  'dmv-vietnamese-test',
]);

// Generate static params for all blog posts and office pages (for static generation)
export async function generateStaticParams() {
  const blogSlugs = blogPosts
    .filter((post: BlogPost) => !RESERVED_SLUGS.has(post.slug))
    .map((post: BlogPost) => ({
      slug: post.slug,
    }));

  const officeSlugs = officesData.offices
    .filter((office: Office) => !RESERVED_SLUGS.has(office.slug))
    .map((office: Office) => ({
      slug: office.slug,
    }));

  return [...blogSlugs, ...officeSlugs];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Check if it's a blog post
  const post = blogPosts.find((p: BlogPost) => p.slug === slug);

  if (post) {
    const typedPost = post as BlogPost;
    const canonicalUrl = `${SITE_URL}/${typedPost.slug}`;
    const heroImage = typedPost.hero_image
      || extractFirstImageFromHtml(typedPost.content)
      || '/images/hero-image.png';
    const absoluteImage = heroImage.startsWith('http') ? heroImage : `${SITE_URL}${heroImage}`;

    // Build a reciprocal hreflang cluster for translated articles. Each post
    // declares its own language plus every translation listed in `translations`,
    // with the English version as x-default.
    const selfLang = typedPost.lang || 'en';
    const languageAlternates =
      typedPost.translations && Object.keys(typedPost.translations).length > 0
        ? {
            [selfLang]: canonicalUrl,
            ...Object.fromEntries(
              Object.entries(typedPost.translations).map(([lang, s]) => [
                lang,
                `${SITE_URL}/${s}`,
              ])
            ),
          }
        : undefined;
    if (languageAlternates) {
      // x-default points at the English version (self if this post is English).
      languageAlternates['x-default'] = languageAlternates['en'] || canonicalUrl;
    }

    // SEO title/description can be overridden per-post to optimize the SERP
    // snippet without changing the on-page H1/excerpt.
    const seoTitle = typedPost.metaTitle || typedPost.title;
    const seoDescription = typedPost.metaDescription || typedPost.excerpt;

    return {
      // Return just the post title — the root layout's title template
      // automatically appends " | DMV California". Doing it again here
      // caused the double-suffix you see in search results.
      title: seoTitle,
      description: seoDescription,
      authors: [{ name: typedPost.author }],
      keywords: typedPost.tags,
      alternates: {
        canonical: canonicalUrl,
        ...(languageAlternates ? { languages: languageAlternates } : {}),
      },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        siteName: 'DMV California',
        type: 'article',
        publishedTime: typedPost.publishedAt,
        modifiedTime: typedPost.updatedAt || typedPost.publishedAt,
        authors: [typedPost.author],
        tags: typedPost.tags,
        images: [{ url: absoluteImage, alt: typedPost.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [absoluteImage],
      },
    };
  }

  // Check if it's an office page
  const office = officesData.offices.find((o: Office) => o.slug === slug);

  if (office) {
    const canonicalUrl = `${SITE_URL}/${office.slug}`;
    return {
      // Root layout template adds " | DMV California" automatically.
      title: `${office.name} DMV Office — Hours, Location & Phone`,
      description: `Find ${office.name} DMV office hours, location, phone number, and services. Call ${office.phone} or visit for driver license, vehicle registration, and REAL ID services.`,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: `${office.name} DMV Office`,
        description: `Hours, location, phone, and services for ${office.name} DMV. ${office.address}`,
        url: canonicalUrl,
        type: 'website',
      },
    };
  }

  return {
    title: 'Page Not Found - DMV California',
  };
}

// Page component that handles both blog posts and office pages
export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Check if it's a blog post first
  const post = blogPosts.find((p: BlogPost) => p.slug === slug);

  if (post) {
    // Render blog post page (rest of the existing code)
    return renderBlogPost(post);
  }

  // Check if it's an office page
  const office = officesData.offices.find((o: Office) => o.slug === slug);

  if (office) {
    return <OfficePage office={office} />;
  }

  // If neither found, show 404
  notFound();
}

// Render blog post (extracted to keep code organized)
function renderBlogPost(postIn: BlogPost) {
  // Cast to our extended type so optional fields (updatedAt, hero_image, faq)
  // are visible even though they may be absent on legacy posts in blog_posts.json.
  const post = postIn as BlogPost;

  // Format date
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const wasUpdated = post.updatedAt && post.updatedAt !== post.publishedAt;
  const formattedUpdatedDate = wasUpdated
    ? new Date(post.updatedAt!).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Process content for better image SEO
  let processedContent = processContentImages(post.content, post.title);

  // Reading time + word count for schema and UI badge
  const totalWords = countWords(post.content);
  const readMinutes = readingTimeMinutes(post.content);

  // Resolve hero image: explicit hero_image > first image in content > site default
  const heroImage = post.hero_image
    || extractFirstImageFromHtml(post.content)
    || '/images/hero-image.png';

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

  // Insert inline app promotion after 3rd paragraph (for articles with 3+ paragraphs)
  const paragraphMatches = processedContent.matchAll(/<p[^>]*>.*?<\/p>/gis);
  const paragraphs = Array.from(paragraphMatches);
  if (paragraphs.length >= 3) {
    const thirdParagraphEnd = paragraphs[2].index! + paragraphs[2][0].length;
    processedContent =
      processedContent.slice(0, thirdParagraphEnd) +
      '\n' + inlineAppPromotionHtml + '\n' +
      processedContent.slice(thirdParagraphEnd);
  }

  // Contextual affiliate banner after the first paragraph (high-intent posts only)
  const affiliateBannerKey = AFFILIATE_BANNER_BY_SLUG[post.slug];
  if (affiliateBannerKey) {
    const bannerHtml = affiliateBannerHtml(affiliateBannerKey);
    const firstP = processedContent.match(/<p[^>]*>.*?<\/p>/is);
    if (bannerHtml && firstP && firstP.index !== undefined) {
      const pos = firstP.index + firstP[0].length;
      processedContent =
        processedContent.slice(0, pos) + '\n' + bannerHtml + '\n' + processedContent.slice(pos);
    }
  }

  // Split content at inline-quiz marker. The marker is present in every
  // English post (injected after the 2nd paragraph). Posts with a custom
  // inlineQuiz field use their own questions; all others use DEFAULT_INLINE_QUIZ.
  const INLINE_QUIZ_MARKER = '<!-- inline-quiz -->';
  const quizMarkerIndex = processedContent.indexOf(INLINE_QUIZ_MARKER);
  const hasMidContentQuiz = quizMarkerIndex !== -1;
  const activeQuiz = post.inlineQuiz ?? DEFAULT_INLINE_QUIZ;
  const contentPartOne = hasMidContentQuiz
    ? processedContent.slice(0, quizMarkerIndex)
    : processedContent;
  const contentPartTwo = hasMidContentQuiz
    ? processedContent.slice(quizMarkerIndex + INLINE_QUIZ_MARKER.length)
    : '';

  // Get all posts sorted by date for prev/next navigation
  const sortedPosts = [...blogPosts].sort((a, b) =>
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
      related = blogPosts.filter(p =>
        p.id !== post.id &&
        p.tags?.some(tag => post.tags?.includes(tag))
      );
    }

    // If not enough related posts, add random posts
    if (related.length < 3) {
      const remaining = blogPosts
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

      {/* Structured data — Article + Breadcrumb (+ FAQPage if FAQ present) */}
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        slug={post.slug}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={post.author}
        image={heroImage}
        keywords={post.tags}
        wordCount={totalWords}
        faq={post.faq}
        lang={post.lang}
        category={post.tags?.[0]}
      />

      {/* Article */}
      <article lang={post.lang || 'en'} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Breadcrumb">
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
                {post.tags && post.tags.length > 0 && (
                  <>
                    <li>
                      <Link href={`/blog/category/${tagToSlug(post.tags[0])}`} className="hover:text-primary">
                        {post.tags[0]}
                      </Link>
                    </li>
                    <li>/</li>
                  </>
                )}
                <li className="text-gray-900 font-medium">{post.title}</li>
              </ol>
            </nav>

            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm">
                  <time dateTime={post.publishedAt}>Published {formattedDate}</time>
                  {wasUpdated && formattedUpdatedDate && (
                    <>
                      <span aria-hidden>•</span>
                      <time dateTime={post.updatedAt} className="text-primary font-medium">
                        Updated {formattedUpdatedDate}
                      </time>
                    </>
                  )}
                  <span aria-hidden>•</span>
                  <Link
                    href={`/blog/author/${post.author.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`}
                    className="hover:text-primary"
                  >
                    By {post.author}
                  </Link>
                  <span aria-hidden>•</span>
                  <span>{readMinutes} min read</span>
                </div>

                {/* Share Buttons */}
                <ShareButtons postSlug={post.slug} postTitle={post.title} />
              </div>
            </header>

            {/* Post Content - Centered */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-8">
          {/* Blog post content with read more functionality */}
          <Suspense fallback={
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary hover:prose-a:text-primary-600 prose-a:underline
                prose-ul:my-6 prose-ol:my-6 prose-li:mb-2
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto prose-img:w-full prose-img:h-auto prose-img:max-w-full
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6
                prose-strong:text-gray-900 prose-strong:font-semibold
                [&_img]:!max-w-full [&_img]:!w-full [&_img]:!h-auto [&_img]:object-contain"
              dangerouslySetInnerHTML={{ __html: contentPartOne }}
            />
          }>
            <BlogPostContent
              content={contentPartOne}
              adInterval={AFFILIATE_BANNER_BY_SLUG[post.slug] ? 5 : 4}
              relatedPost={!contentPartTwo && relatedPosts[1] ? { slug: relatedPosts[1].slug, title: relatedPosts[1].title } : undefined}
            />
          </Suspense>

          {/* Mid-content quiz — injected at marker position */}
          {hasMidContentQuiz && (
            <InlineQuiz
              questions={activeQuiz.questions}
              ctaCards={activeQuiz.ctaCards}
              header={activeQuiz.header}
              subheader={activeQuiz.subheader}
            />
          )}

          {/* Second half of article content (after quiz marker) */}
          {contentPartTwo && (
            <BlogPostContent
              content={contentPartTwo}
              adInterval={AFFILIATE_BANNER_BY_SLUG[post.slug] ? 5 : 4}
              relatedPost={relatedPosts[1] ? { slug: relatedPosts[1].slug, title: relatedPosts[1].title } : undefined}
            />
          )}

          {/* Post Views Counter - Dynamic */}
          <BlogViewTracker slug={post.slug} initialViews={post.views || 0} />
        </div>

        {/* Sentinel for UpNextBar: once this scrolls into view the reader has
            reached the end-of-article zone (multiplex ad, related stories,
            prev/next, footer) and the bar hides itself to avoid covering ads
            and duplicating the links below. */}
        <div id="article-end-sentinel" aria-hidden="true" />

        {/* Multiplex Ad — placed right after article body so readers who
            finish the content see it before scrolling to FAQ/related */}
        <MultiplexAd />


        {/* Practice-test funnel CTA (blog → tests): turns informational
            readers into engaged, returning users. Opt-in per post. */}
        {post.testCta && <PracticeTestCTA config={post.testCta} />}

        {/* YouTube video embed — opt-in per post via youtubeId field */}
        {post.youtubeId && (
          <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {post.youtubeHeading || 'Watch: California DMV Practice Test 2026'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {post.youtubeSubtitle || '46 real questions with answers and explanations — follow along or use it to study on the go.'}
            </p>
            <div className="relative w-full rounded-xl overflow-hidden shadow border border-gray-200" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${post.youtubeId}?rel=0&modestbranding=1&autoplay=1&mute=1`}
                title={post.youtubeTitle || 'California DMV Practice Test 2026 — 46 Questions with Answers'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* FAQ Section (visible content; backs the FAQPage JSON-LD above) */}
        {post.faq && post.faq.length > 0 && (
          <section
            className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8"
            aria-labelledby="faq-heading"
          >
            <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faq.map((item, index) => (
                <details
                  key={index}
                  className="group border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-primary flex items-start justify-between gap-3">
                    <span>{item.question}</span>
                    <span
                      className="text-primary text-2xl leading-none flex-shrink-0 group-open:rotate-45 transition-transform"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <div
                    className="mt-3 text-gray-700 leading-relaxed prose prose-sm max-w-none prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-wider mb-6">
              Related Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => {
                const postImage = resolvePostImage(relatedPost);
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
                    {resolvePostImage(prevPost) && (
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={resolvePostImage(prevPost) || ''}
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
                    {resolvePostImage(nextPost) && (
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img
                          src={resolvePostImage(nextPost) || ''}
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
      <QuizPromotionPopup />
      {relatedPosts.length > 0 && (
        <UpNextBar post={{ slug: relatedPosts[0].slug, title: relatedPosts[0].title }} />
      )}
      <BlogImageLightbox />
    </div>
  );
}
