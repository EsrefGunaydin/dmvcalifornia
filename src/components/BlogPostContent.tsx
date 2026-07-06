'use client';

import InArticleAd from './InArticleAd';
import AlsoReadCard from './blog/AlsoReadCard';

type BlogPostContentProps = {
  content: string;
  /** Insert an InArticleAd after every N paragraphs. Default: 2. */
  adInterval?: number;
  /** When set (and the content is long enough), a compact "Also read" card
   *  is injected at the midpoint of the content. */
  relatedPost?: { slug: string; title: string };
};

// Minimum paragraphs before a mid-content related card is worth the
// interruption.
const RELATED_MIN_PARAGRAPHS = 6;

// Insert an ad placeholder after every `adInterval` paragraphs, plus an
// optional related-post placeholder at the paragraph midpoint.
// Placeholders are later replaced with React components at render time so
// AdSense actually mounts (you can't put React components inside
// dangerouslySetInnerHTML directly).
function injectPlaceholders(html: string, adInterval: number, withRelated: boolean): string {
  const paragraphRegex = /<p[^>]*>.*?<\/p>/gis;
  const totalParagraphs = (html.match(paragraphRegex) || []).length;
  const relatedAfter =
    withRelated && totalParagraphs >= RELATED_MIN_PARAGRAPHS
      ? Math.ceil(totalParagraphs / 2)
      : 0;

  let result = '';
  let lastIndex = 0;
  let paragraphCount = 0;
  let adIndex = 0;
  let match;

  while ((match = paragraphRegex.exec(html)) !== null) {
    paragraphCount++;
    result += html.substring(lastIndex, match.index + match[0].length);
    lastIndex = match.index + match[0].length;

    if (paragraphCount === relatedAfter) {
      result += '<div class="related-placeholder"></div>';
    }
    if (paragraphCount % adInterval === 0) {
      result += `<div class="ad-placeholder" data-ad-index="${adIndex}"></div>`;
      adIndex++;
    }
  }

  // Tail content after the last paragraph
  result += html.substring(lastIndex);
  return result;
}

const PROSE_CLASS =
  'prose prose-lg max-w-none ' +
  'prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8 ' +
  'prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 ' +
  'prose-a:text-primary hover:prose-a:text-primary-600 prose-a:underline ' +
  'prose-ul:my-6 prose-ol:my-6 prose-li:mb-2 ' +
  'prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto prose-img:w-full prose-img:h-auto prose-img:max-w-full ' +
  'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6 ' +
  'prose-strong:text-gray-900 prose-strong:font-semibold ' +
  '[&_img]:!max-w-full [&_img]:!w-full [&_img]:!h-auto [&_img]:object-contain';

export default function BlogPostContent({ content, adInterval = 2, relatedPost }: BlogPostContentProps) {
  // Always render the full article with in-article ads every `adInterval`
  // paragraphs. Previously the Read More button gated ad inventory behind a
  // click — only ~25% of readers expanded, so 75% of pageviews rendered just
  // one ad instead of N. Removing the gate restores full ad inventory for
  // every visitor.
  const processedContent = injectPlaceholders(content, adInterval, Boolean(relatedPost));

  // Split keeping the placeholder tokens so each can be swapped for its
  // component without disturbing the others' positions.
  const tokens = processedContent.split(
    /(<div class="(?:ad|related)-placeholder"[^>]*><\/div>)/
  );

  return (
    <>
      {tokens.map((token, index) => {
        if (token.startsWith('<div class="ad-placeholder"')) {
          return <InArticleAd key={`ad-${index}`} />;
        }
        if (token.startsWith('<div class="related-placeholder"')) {
          return relatedPost ? <AlsoReadCard key={`related-${index}`} post={relatedPost} /> : null;
        }
        if (!token) return null;
        return (
          <div
            key={`section-${index}`}
            className={PROSE_CLASS}
            dangerouslySetInnerHTML={{ __html: token }}
          />
        );
      })}
    </>
  );
}
