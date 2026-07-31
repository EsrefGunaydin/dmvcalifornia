// Plain HTML string for injection into blog post content. Deliberately kept
// out of InlineAppPromotion.tsx: that file is 'use client', and Next's RSC
// module boundary replaces every export from a client file (even a plain
// string constant) with a client-reference proxy when imported into a server
// component, so page.tsx was rendering the proxy's stringified guard
// function instead of the actual HTML.
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
          Download our free iOS app — 1,164+ practice questions in 11 languages, flashcards, and offline study!
        </p>
        <a
          href="https://apps.apple.com/app/dmv-california/id6754900213"
          target="_blank"
          rel="noopener noreferrer"
          onclick="if(window.gtag)window.gtag('event','app_promo_click',{variant:'inline_html'})"
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
