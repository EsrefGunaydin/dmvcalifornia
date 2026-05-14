'use client';

import InArticleAd from './InArticleAd';

type BlogPostContentProps = {
  content: string;
  /** Insert an InArticleAd after every N paragraphs. Default: 2. */
  adInterval?: number;
};

// Insert an ad placeholder after every `adInterval` paragraphs.
// The placeholder is later replaced with an <InArticleAd> React component
// at render time so AdSense actually mounts (you can't put React components
// inside dangerouslySetInnerHTML directly).
function injectAdPlaceholders(html: string, adInterval: number): string {
  const paragraphRegex = /<p[^>]*>.*?<\/p>/gis;
  let result = '';
  let lastIndex = 0;
  let paragraphCount = 0;
  let adIndex = 0;
  let match;

  while ((match = paragraphRegex.exec(html)) !== null) {
    paragraphCount++;
    result += html.substring(lastIndex, match.index + match[0].length);
    lastIndex = match.index + match[0].length;

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

export default function BlogPostContent({ content, adInterval = 2 }: BlogPostContentProps) {
  // Always render the full article with in-article ads every `adInterval`
  // paragraphs. Previously the Read More button gated ad inventory behind a
  // click — only ~25% of readers expanded, so 75% of pageviews rendered just
  // one ad instead of N. Removing the gate restores full ad inventory for
  // every visitor.
  const processedContent = injectAdPlaceholders(content, adInterval);
  const sections = processedContent.split(/<div class="ad-placeholder" data-ad-index="\d+"><\/div>/);
  const adCount = sections.length - 1; // ads sit between sections

  return (
    <>
      {sections.map((section, index) => (
        <div key={`section-${index}`}>
          <div
            className={PROSE_CLASS}
            dangerouslySetInnerHTML={{ __html: section }}
          />
          {index < adCount && <InArticleAd key={`ad-${index}`} />}
        </div>
      ))}
    </>
  );
}
