'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InArticleAd from './InArticleAd';

type BlogPostContentProps = {
  content: string;
  paragraphsToShow?: number; // Number of paragraphs to show before "Read More"
};

export default function BlogPostContent({
  content,
  paragraphsToShow = 2 // Default: show first 2 paragraphs
}: BlogPostContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFullArticle, setShowFullArticle] = useState(false);
  const [adRefreshKey, setAdRefreshKey] = useState(0);
  const readMoreButtonRef = useRef<HTMLDivElement>(null);

  // Check if we should show full article based on URL parameter
  useEffect(() => {
    const full = searchParams.get('full');
    if (full === 'true') {
      setShowFullArticle(true);
    }
  }, [searchParams]);

  // Function to inject ads every N paragraphs
  const injectAdsIntoContent = (html: string, adInterval: number = 2): string => {
    const paragraphRegex = /<p[^>]*>.*?<\/p>/gis;
    let result = '';
    let lastIndex = 0;
    let paragraphCount = 0;
    let match;
    const regex = /<p[^>]*>.*?<\/p>/gis;

    // Ad placeholder that we'll replace with actual component
    const adPlaceholder = '<div class="ad-placeholder" data-ad-index="{{INDEX}}"></div>';
    let adIndex = 0;

    while ((match = regex.exec(html)) !== null) {
      paragraphCount++;

      // Add everything from last position up to and including this paragraph
      result += html.substring(lastIndex, match.index + match[0].length);
      lastIndex = match.index + match[0].length;

      // Insert ad after every N paragraphs
      if (paragraphCount % adInterval === 0) {
        result += adPlaceholder.replace('{{INDEX}}', String(adIndex));
        adIndex++;
      }
    }

    // Add any remaining content after the last paragraph
    result += html.substring(lastIndex);

    return result;
  };

  // Function to truncate HTML content after N paragraphs
  const truncateAfterParagraphs = (html: string, numParagraphs: number): string => {
    const paragraphRegex = /<p[^>]*>.*?<\/p>/gis;
    const paragraphs = html.match(paragraphRegex);

    if (!paragraphs || paragraphs.length <= numParagraphs) {
      return html;
    }

    let paragraphCount = 0;
    let position = 0;
    let match;
    const regex = /<p[^>]*>.*?<\/p>/gis;

    while ((match = regex.exec(html)) !== null) {
      paragraphCount++;
      if (paragraphCount === numParagraphs) {
        position = match.index + match[0].length;
        break;
      }
    }

    return html.substring(0, position);
  };

  const handleReadMore = () => {
    // Store current scroll position relative to the button
    const buttonPosition = readMoreButtonRef.current?.offsetTop || 0;

    // Show full article without page refresh
    setShowFullArticle(true);

    // Refresh ads by changing key
    setAdRefreshKey(prev => prev + 1);

    // Update URL without reload
    const currentPath = window.location.pathname;
    window.history.pushState({}, '', `${currentPath}?full=true`);

    // Keep user at the same position (don't scroll)
    // Small delay to let content render
    setTimeout(() => {
      if (readMoreButtonRef.current) {
        window.scrollTo({
          top: buttonPosition - 100, // Scroll to just above where button was
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Process content based on whether we're showing full article or not
  let processedContent = content;

  if (showFullArticle) {
    // Full article: inject ads every 2 paragraphs
    processedContent = injectAdsIntoContent(content, 2);
  } else {
    // Truncated: just show first N paragraphs
    processedContent = truncateAfterParagraphs(content, paragraphsToShow);
  }

  const paragraphRegex = /<p[^>]*>.*?<\/p>/gis;
  const totalParagraphs = (content.match(paragraphRegex) || []).length;
  const shouldShowButton = !showFullArticle && totalParagraphs > paragraphsToShow;

  // Count how many ads we need to render
  const adPlaceholderRegex = /<div class="ad-placeholder" data-ad-index="(\d+)"><\/div>/g;
  const adMatches = [...processedContent.matchAll(adPlaceholderRegex)];

  return (
    <>
      {/* Render content with ads injected */}
      {showFullArticle ? (
        // For full article, we need to split by ad placeholders and render ads as components
        <>
          {processedContent.split(/<div class="ad-placeholder" data-ad-index="\d+"><\/div>/).map((section, index) => (
            <div key={`section-${index}-${adRefreshKey}`}>
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
                dangerouslySetInnerHTML={{ __html: section }}
              />
              {/* Render ad after each section except the last one */}
              {index < adMatches.length && <InArticleAd key={`ad-${index}-${adRefreshKey}`} />}
            </div>
          ))}
        </>
      ) : (
        // For truncated article, just render the content normally
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
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      )}

      {/* Show ad and Read More button after truncated content */}
      {shouldShowButton && (
        <div ref={readMoreButtonRef}>
          <InArticleAd key={`truncated-ad-${adRefreshKey}`} />

          <div className="my-8 text-center border-t border-gray-200 pt-8">
            <div className="relative">
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none -mt-32" />

              <button
                onClick={handleReadMore}
                className="relative z-10 inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Read Full Article
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Click to continue reading and see the complete article
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
