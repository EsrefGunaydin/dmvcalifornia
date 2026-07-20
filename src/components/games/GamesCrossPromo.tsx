'use client';

import Link from 'next/link';
import { Grid3x3, Zap, ClipboardCheck, ArrowRight } from 'lucide-react';

// The three daily games that should always cross-link to each other. This is
// deliberately a closed set of 3 (not "every game on the site") so excluding
// the current page always leaves exactly the other 2 — plus the practice
// test box below always makes 3 total. Intersection isn't part of this
// rotation: it's an older, already self-contained game with its own hub
// listing, and folding it in here would crowd out the cross-linking between
// these three that this component exists for.
export type GameSlug = 'dmvordle' | 'sign-match' | 'reaction-test';

interface PromoEntry {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const GAME_ENTRIES: Record<GameSlug, PromoEntry> = {
  dmvordle: {
    href: '/games/dmvordle',
    title: 'DMVordle',
    description: 'Guess today\'s 5-letter DMV word in 6 tries. New word every day.',
    icon: <Grid3x3 className="w-6 h-6 text-white" />,
    color: 'from-orange-500 to-orange-600',
  },
  'sign-match': {
    href: '/games/sign-match',
    title: 'Road Sign Memory Match',
    description: 'Match today\'s 8 real DMV signs to their meanings. New board daily.',
    icon: <Grid3x3 className="w-6 h-6 text-white" />,
    color: 'from-blue-500 to-blue-600',
  },
  'reaction-test': {
    href: '/games/reaction-test',
    title: 'Brake Reaction Test',
    description: 'Five rounds. See what your reflexes mean for real stopping distance.',
    icon: <Zap className="w-6 h-6 text-white" />,
    color: 'from-green-500 to-green-600',
  },
};

const PRACTICE_TEST_ENTRY: PromoEntry = {
  href: '/practice-test',
  title: 'Free DMV Practice Test',
  description: 'Real questions, instant feedback. See where you stand before test day.',
  icon: <ClipboardCheck className="w-6 h-6 text-white" />,
  color: 'from-primary to-primary-600',
};

interface Props {
  currentSlug: GameSlug;
  className?: string;
}

export default function GamesCrossPromo({ currentSlug, className = '' }: Props) {
  const otherGames = (Object.keys(GAME_ENTRIES) as GameSlug[])
    .filter((slug) => slug !== currentSlug)
    .map((slug) => GAME_ENTRIES[slug]);

  // Always exactly 3: the other 2 daily games + the practice-test funnel box.
  const boxes = [...otherGames, PRACTICE_TEST_ENTRY];

  return (
    <section className={`w-full max-w-4xl mx-auto px-4 pb-12 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Keep going</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {boxes.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
          >
            <div className={`bg-gradient-to-br ${game.color} p-5 flex items-center justify-center`}>
              {game.icon}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-1">{game.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed flex-1">{game.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-1.5 transition-all">
                {game.href === '/practice-test' ? 'Start now' : 'Play now'} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
