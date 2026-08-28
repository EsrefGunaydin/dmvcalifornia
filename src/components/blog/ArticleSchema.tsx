import { stripHtml } from '@/lib/strip-html';
import { tagToSlug } from '@/lib/blogTags';
import { videoMetadata, secondsToIso8601Duration } from '@/data/video-metadata';

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  image: string;
  keywords?: string[];
  wordCount?: number;
  faq?: { question: string; answer: string }[];
  lang?: string;
  /** Category (first tag) inserted between Blog and the post in the breadcrumb. */
  category?: string;
  /** YouTube video ID embedded on this post, if any — emits VideoObject schema so
   *  Google recognizes the page as a "watch page" for the video. Needs a matching
   *  entry in video-metadata.ts to actually render. */
  youtubeId?: string;
}

const SITE_URL = 'https://dmvcalifornia.us';

/**
 * Injects Article + Breadcrumb (+ optional FAQPage) JSON-LD into the page.
 * Google parses these for rich snippets and article carousels.
 *
 * This is a Server Component — the script tags are rendered server-side
 * and ship with the initial HTML, so crawlers see them immediately.
 */
export default function ArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  author,
  image,
  keywords,
  wordCount,
  faq,
  lang,
  category,
  youtubeId,
}: ArticleSchemaProps) {
  const url = `${SITE_URL}/${slug}`;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const video = youtubeId ? videoMetadata[youtubeId] : undefined;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: [absoluteImage],
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: author,
      url: `${SITE_URL}/blog/author/${slugify(author)}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DMV California',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/dmv-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    keywords: keywords?.join(', '),
    wordCount,
    inLanguage: lang === 'es' ? 'es' : 'en-US',
  };

  const breadcrumbItems = [
    { name: 'Home', item: SITE_URL },
    { name: 'Blog', item: `${SITE_URL}/blog` },
    ...(category ? [{ name: category, item: `${SITE_URL}/blog/category/${tagToSlug(category)}` }] : []),
    { name: title, item: url },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      ...entry,
    })),
  };

  const faqSchema = faq && faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: stripHtml(item.answer),
          },
        })),
      }
    : null;

  const videoSchema = youtubeId && video
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: [
          `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
          `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
        ],
        uploadDate: video.uploadDate,
        duration: secondsToIso8601Duration(video.durationSeconds),
        embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
