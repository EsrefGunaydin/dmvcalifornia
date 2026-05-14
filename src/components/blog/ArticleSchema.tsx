import { stripHtml } from '@/lib/strip-html';

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
}

const SITE_URL = 'https://www.dmvcalifornia.us';

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
}: ArticleSchemaProps) {
  const url = `${SITE_URL}/${slug}`;
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

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
    inLanguage: 'en-US',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
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
