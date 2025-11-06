import Link from 'next/link';
import Image from 'next/image';

interface AppPromotionProps {
  variant?: 'banner' | 'sidebar' | 'compact';
  className?: string;
}

export default function AppPromotion({ variant = 'sidebar', className = '' }: AppPromotionProps) {
  const appStoreUrl = 'https://apps.apple.com/app/dmv-practice-exams/id6754900213';

  // Banner variant - Full width promotional banner
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-lg overflow-hidden ${className}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-white rounded-2xl p-3 shadow-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📱</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold mb-1">
                Download Our iOS App!
              </h3>
              <p className="text-white/90 text-sm md:text-base">
                Practice anytime, anywhere with 500+ questions, flashcards, and offline access
              </p>
            </div>
          </div>
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/app-store-badge.svg"
              alt="Download on the App Store"
              width={200}
              height={60}
              className="drop-shadow-lg w-[160px] md:w-[200px]"
            />
          </a>
        </div>
      </div>
    );
  }

  // Compact variant - Small inline promotion
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xl">📱</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm">Try Our Mobile App</h4>
            <p className="text-xs text-gray-600">Practice on the go!</p>
          </div>
        </div>
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/app-store-badge.svg"
            alt="Download on the App Store"
            width={160}
            height={48}
            className="w-full max-w-[140px]"
          />
        </a>
      </div>
    );
  }

  // Default sidebar variant - Card-style promotion
  return (
    <div className={`bg-gradient-to-br from-orange-50 to-white border-2 border-primary-200 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">📱</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Mobile App</h3>
            <p className="text-xs text-primary-600">Now Available on iOS</p>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          Take your DMV practice anywhere! Download our app for offline access, flashcards, and 500+ practice questions.
        </p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>20+ Practice Tests</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Interactive Flashcards</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Offline Access</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>English & Turkish</span>
          </div>
        </div>

        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/app-store-badge.svg"
            alt="Download on the App Store"
            width={200}
            height={60}
            className="w-full max-w-[180px] mx-auto"
          />
        </a>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/mobileapp" className="text-primary hover:text-primary-600 text-sm font-semibold flex items-center justify-center gap-1">
            Learn More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
