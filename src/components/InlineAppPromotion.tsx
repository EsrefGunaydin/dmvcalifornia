import Image from 'next/image';

const APP_STORE_URL = 'https://apps.apple.com/app/dmv-california/id6754900213';

export default function InlineAppPromotion() {
  return (
    <div className="my-8 not-prose">
      <div className="bg-gradient-to-r from-primary-50 to-orange-50 border-2 border-primary-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📱</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Preparing for your DMV test?
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Download our free iOS app for 500+ practice questions, flashcards, and offline study!
            </p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                width={140}
                height={42}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// HTML string version for injection into blog content
export const inlineAppPromotionHtml = `
<div class="my-8 not-prose">
  <div class="bg-gradient-to-r from-primary-50 to-orange-50 border-2 border-primary-200 rounded-xl p-6 shadow-sm">
    <div class="flex flex-col sm:flex-row items-center gap-4">
      <div class="flex-shrink-0">
        <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
          <span class="text-3xl">📱</span>
        </div>
      </div>
      <div class="flex-1 text-center sm:text-left">
        <h3 class="text-lg font-bold text-gray-900 mb-1">
          Preparing for your DMV test?
        </h3>
        <p class="text-gray-600 text-sm mb-3">
          Download our free iOS app for 500+ practice questions, flashcards, and offline study!
        </p>
        <a
          href="https://apps.apple.com/app/dmv-california/id6754900213"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block hover:opacity-80 transition-opacity"
        >
          <img
            src="/images/app-store-badge.svg"
            alt="Download on the App Store"
            width="140"
            height="42"
          />
        </a>
      </div>
    </div>
  </div>
</div>
`;
