'use client';

import { useEffect, useState } from 'react';
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

  // Check if we should show full article based on URL parameter
  useEffect(() => {
    const full = searchParams.get('full');
    if (full === 'true') {
      setShowFullArticle(true);
    }
  }, [searchParams]);

  // Function to truncate HTML content after N paragraphs
  const truncateAfterParagraphs = (html: string, numParagraphs: number): string => {
    // Match all <p> tags and their content
    const paragraphRegex = /<p[^>]*>.*?<\/p>/gis;
    const paragraphs = html.match(paragraphRegex);

    // If no paragraphs found or fewer than desired, return original content
    if (!paragraphs || paragraphs.length <= numParagraphs) {
      return html;
    }

    // Find the position where the Nth paragraph ends
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

    // Get everything up to and including the Nth paragraph
    // Also include any preceding elements (headers, images, etc.)
    const truncated = html.substring(0, position);

    return truncated;
  };

  const handleReadMore = () => {
    // Add URL parameter and scroll to top to trigger page refresh with ads
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?full=true`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayContent = showFullArticle ? content : truncateAfterParagraphs(content, paragraphsToShow);

  // Check if content has more paragraphs than we're showing
  const paragraphRegex = /<p[^>]*>.*?<\/p>/gis;
  const totalParagraphs = (content.match(paragraphRegex) || []).length;
  const shouldShowButton = !showFullArticle && totalParagraphs > paragraphsToShow;

  return (
    <>
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
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />

      {/* Show ad after truncated content */}
      {shouldShowButton && (
        <>
          <InArticleAd />

          <div className="my-8 text-center border-t border-gray-200 pt-8">
            <div className="relative">
              {/* Gradient overlay effect */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none -mt-32" />

              <button
                onClick={handleReadMore}
                className="relative z-10 inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
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
        </>
      )}

      {/* Show ad after full article loads */}
      {showFullArticle && <InArticleAd />}
    </>
  );
}
