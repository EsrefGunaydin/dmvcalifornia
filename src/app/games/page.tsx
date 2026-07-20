import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const SITE_URL = 'https://dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'DMV Games — Learn California Traffic Rules by Playing',
  description: 'Free games that teach California DMV rules: Right-of-Way Puzzle, DMVordle, Road Sign Memory Match, and a Brake Reaction Test.',
  alternates: { canonical: `${SITE_URL}/games` },
  openGraph: {
    title: 'DMV Games — Learn California Traffic Rules by Playing',
    description: 'Free games that teach California DMV rules: Right-of-Way Puzzle, DMVordle, Road Sign Memory Match, and a Brake Reaction Test.',
    url: `${SITE_URL}/games`,
    type: 'website',
    siteName: 'DMV California',
  },
};

const GAMES = [
  {
    href: '/intersection',
    title: 'Right-of-Way Puzzle',
    description: 'Tap cars, cyclists, and pedestrians in the legal order they may proceed through 10 escalating intersections. Get it wrong and you\'ll see exactly which California rule caused the crash.',
    badge: '10 levels',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: 'from-primary to-primary-600',
    cta: 'Play now',
  },
  {
    href: '/games/dmvordle',
    title: 'DMVordle',
    description: 'Guess the 5-letter DMV word in 6 tries. All words are traffic and driving related — YIELD, MERGE, BRAKE and 80+ more. New word every day. Share your results.',
    badge: 'Daily',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <rect x="3" y="3" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="10" y="3" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="17" y="3" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="3" y="10" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="10" y="10" width="4" height="4" rx="0.5" className="text-yellow-400" fill="currentColor" stroke="none" />
        <rect x="17" y="10" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="3" y="17" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="10" y="17" width="4" height="4" rx="0.5" className="text-green-400" fill="currentColor" stroke="none" />
        <rect x="17" y="17" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: 'from-orange-500 to-orange-600',
    cta: 'Play today\'s word',
  },
  {
    href: '/games/sign-match',
    title: 'Road Sign Memory Match',
    description: 'Flip cards to match each California road sign with its meaning. Same 8 signs for everyone today, pulled straight from the real DMV sign test. New board daily.',
    badge: 'Daily',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
    cta: "Play today's board",
  },
  {
    href: '/games/reaction-test',
    title: 'Brake Reaction Test',
    description: 'Five rounds. Tap the instant it turns green, and see what your reaction time actually costs you in stopping distance at real driving speeds.',
    badge: 'Daily',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: 'from-green-500 to-green-600',
    cta: 'Test your reflexes',
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">DMV Games</h1>
          <p className="text-xl text-white/85 max-w-xl mx-auto">
            Learn California traffic rules without reading a textbook. Free games, no signup.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid sm:grid-cols-2 gap-6">
          {GAMES.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className={`bg-gradient-to-br ${game.color} p-8 flex items-center justify-center`}>
                {game.icon}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{game.title}</h2>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{game.badge}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{game.description}</p>
                <div className="mt-5">
                  <span className="inline-block bg-primary group-hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                    {game.cta} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
}
