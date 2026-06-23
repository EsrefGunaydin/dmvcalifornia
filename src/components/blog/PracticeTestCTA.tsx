import Link from 'next/link';

export interface PracticeTestCtaConfig {
  /** Bold heading, intent-matched to the article */
  heading: string;
  /** One- or two-sentence pitch */
  blurb: string;
  /** Primary destination (usually a practice-test hub/test) */
  href: string;
  /** Primary button label */
  label: string;
  /** Optional contextual internal links shown as chips below the CTA */
  relatedLinks?: { href: string; label: string }[];
}

/**
 * In-content call-to-action that funnels high-traffic informational blog
 * readers into our practice tests (engagement + return visits + ad RPM), and
 * spreads internal links to related DMV guides. DMV-blue themed to match the
 * keyword hubs. Render it from a blog post that defines `testCta`.
 */
export default function PracticeTestCTA({ config }: { config: PracticeTestCtaConfig }) {
  return (
    <aside className="my-8 rounded-2xl border-2 border-dmv-200 bg-gradient-to-br from-dmv-50 to-white p-6 md:p-7 not-prose">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-dmv-600 text-white text-2xl" aria-hidden="true">
          📝
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-dmv-800 mb-1.5">{config.heading}</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">{config.blurb}</p>
          <Link
            href={config.href}
            className="inline-block bg-dmv-600 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-dmv-700 transition-colors"
          >
            {config.label}
          </Link>

          {config.relatedLinks && config.relatedLinks.length > 0 && (
            <div className="mt-5 pt-4 border-t border-dmv-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Related DMV guides
              </p>
              <div className="flex flex-wrap gap-2">
                {config.relatedLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="bg-white text-dmv-700 border border-dmv-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-dmv-600 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
