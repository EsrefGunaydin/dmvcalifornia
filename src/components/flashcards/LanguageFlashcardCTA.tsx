import Link from 'next/link';
import { getFlashcardLang, type FlashcardLang } from '@/data/flashcards-i18n';

/**
 * Localized "study with flashcards" call-to-action for a language hub page
 * (e.g. /dmv-punjabi-test). Renders nothing if the language has no deck.
 */
export default function LanguageFlashcardCTA({ lang }: { lang: FlashcardLang }) {
  const config = getFlashcardLang(lang);
  if (!config) return null;

  const { labels, dir, flag, gradient } = config;

  return (
    <Link
      href={`/practice-test/flashcards/${lang}`}
      dir={dir}
      className={`block rounded-2xl bg-gradient-to-r ${gradient} text-white p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow group`}
    >
      <div className="flex items-center gap-5">
        <div className="text-5xl flex-shrink-0">{flag}</div>
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <span>📇</span>
            <span>{config.nativeName} + English</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">{labels.ctaHeading}</h3>
          <p className="text-white/90 text-sm md:text-base">{labels.ctaSubtext}</p>
        </div>
        <span className="hidden sm:inline-block bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap group-hover:bg-gray-100 transition-colors">
          {labels.ctaButton} →
        </span>
      </div>
    </Link>
  );
}
