import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import type { KeywordHub as Hub, HubCard, HubSection } from '@/data/seo-hubs';

const SITE_URL = 'https://www.dmvcalifornia.us';

function ClockIcon() {
  return (
    <svg className="w-4 h-4 text-dmv-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FreePill() {
  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
      ★ FREE
    </span>
  );
}

function FullCard({ card }: { card: HubCard }) {
  return (
    <Link
      href={card.href}
      className="group bg-white rounded-xl border-2 border-gray-100 hover:border-dmv-400 hover:shadow-lg transition-all p-5 flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-dmv-700 transition-colors">
          {card.label}
        </h3>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <FreePill />
          {card.badge && (
            <span className="bg-dmv-100 text-dmv-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {card.badge}
            </span>
          )}
        </div>
      </div>
      {card.description && <p className="text-sm text-gray-600 mb-3">{card.description}</p>}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        {typeof card.questions === 'number' ? (
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <ClockIcon /> {card.questions} questions
          </span>
        ) : (
          <span className="text-sm text-gray-400">Free tool</span>
        )}
        <span className="text-dmv-600 font-semibold text-sm group-hover:translate-x-0.5 transition-transform">
          Start →
        </span>
      </div>
    </Link>
  );
}

function CompactCard({ card }: { card: HubCard }) {
  return (
    <Link
      href={card.href}
      className="group bg-white rounded-lg border border-gray-200 hover:border-dmv-400 hover:shadow-md transition-all p-3.5 flex items-center justify-between gap-2"
    >
      <span className="text-sm font-semibold text-gray-800 group-hover:text-dmv-700 transition-colors">
        {card.label}
      </span>
      {typeof card.questions === 'number' && (
        <span className="text-xs text-gray-400 flex-shrink-0">{card.questions} Q</span>
      )}
    </Link>
  );
}

function Section({ section }: { section: HubSection }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h2>
      {section.subtitle && <p className="text-gray-600 mb-5">{section.subtitle}</p>}
      {section.variant === 'compact' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {section.cards.map((c) => (
            <CompactCard key={c.href} card={c} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {section.cards.map((c) => (
            <FullCard key={c.href} card={c} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function KeywordHub({ config }: { config: Hub }) {
  const url = `${SITE_URL}/${config.slug}`;
  const fullTests = config.sections.find((s) => s.variant === 'cards')?.cards ?? [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: config.breadcrumbLabel, item: url },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.metaTitle,
    numberOfItems: fullTests.length,
    itemListElement: fullTests.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LearningResource',
        name: c.label,
        url: `${SITE_URL}${c.href}`,
        learningResourceType: 'Practice Test',
        educationalLevel: 'Learner’s Permit',
        isAccessibleForFree: true,
      },
    })),
  };
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.metaTitle,
    url,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD', url },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Blue hero band */}
        <section className="bg-gradient-to-br from-dmv-600 via-dmv-500 to-dmv-700 text-white">
          <div className="container mx-auto px-4 py-10">
            <nav className="text-sm text-white/80 mb-5">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">{config.breadcrumbLabel}</span>
            </nav>

            {/* Vehicle tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {config.vehicleTabs.map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    t.active ? 'bg-white text-dmv-700 shadow' : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  <span aria-hidden="true">{t.icon}</span> {t.label}
                </Link>
              ))}
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">{config.h1}</h1>
              <p className="text-lg text-white/90 mb-4">{config.heroSubtitle}</p>
              <p className="text-sm text-white/80 font-medium">{config.trustLine}</p>
              <a
                href="#tests"
                className="inline-block mt-6 bg-white text-dmv-700 font-bold px-6 py-3 rounded-lg shadow hover:bg-dmv-50 transition-colors"
              >
                Start a free practice test →
              </a>
            </div>
          </div>
        </section>

        {/* Two-column layout */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-xl border-2 border-dmv-100 p-5">
                <h2 className="text-lg font-bold text-dmv-800 mb-4">California License Requirements</h2>
                {config.sidebarRequirements.map((block) => (
                  <div key={block.title} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{block.title}</h3>
                    <ul className="space-y-1.5">
                      {block.items.map((it) => (
                        <li key={it} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-dmv-400 flex-shrink-0">•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border-2 border-dmv-100 p-5">
                <h2 className="text-lg font-bold text-dmv-800 mb-3">Helpful Resources</h2>
                <ul className="space-y-2">
                  {config.helpfulResources.map((r) =>
                    r.external ? (
                      <li key={r.href}>
                        <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-dmv-600 hover:text-dmv-800 hover:underline text-sm font-medium">
                          {r.label} ↗
                        </a>
                      </li>
                    ) : (
                      <li key={r.href}>
                        <Link href={r.href} className="text-dmv-600 hover:text-dmv-800 hover:underline text-sm font-medium">
                          {r.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </aside>

            {/* Main content */}
            <div id="tests">
              {config.sections.map((s) => (
                <Section key={s.title} section={s} />
              ))}

              {/* YouTube embed */}
              {config.youtubeId && (
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Watch: California DMV Practice Test 2026</h2>
                  <p className="text-gray-600 mb-4 text-sm">46 real questions with answers and explanations — follow along or use it to study on the go.</p>
                  <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${config.youtubeId}?rel=0&modestbranding=1`}
                      title="California DMV Practice Test 2026 — 46 Questions with Answers"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              {/* FAQ */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {config.faq.map((f) => (
                    <details key={f.q} className="group bg-white rounded-lg border border-gray-200 p-4">
                      <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                        {f.q}
                        <span className="text-dmv-500 group-open:rotate-180 transition-transform ml-2">▾</span>
                      </summary>
                      <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Related */}
              <section className="bg-dmv-50 rounded-xl border border-dmv-100 p-6">
                <h2 className="text-lg font-bold text-dmv-800 mb-3">Keep exploring</h2>
                <div className="flex flex-wrap gap-2">
                  {config.related.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      className="bg-white text-dmv-700 border border-dmv-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-dmv-600 hover:text-white transition-colors"
                    >
                      {r.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
