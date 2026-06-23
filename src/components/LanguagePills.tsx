import Link from 'next/link';
import { roadSignPills } from '@/data/road-signs-i18n';

/**
 * Row of language pills shown at the top of every road-signs test page.
 * Designed to sit on a colored hero background.
 */
export default function LanguagePills({ active }: { active: string }) {
  const pills = roadSignPills();
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
      {pills.map((p) => {
        const isActive = p.code === active;
        return (
          <Link
            key={p.code}
            href={p.href}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              isActive
                ? 'bg-white text-gray-900 border-white'
                : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
            }`}
          >
            <span>{p.flag}</span>
            <span>{p.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
