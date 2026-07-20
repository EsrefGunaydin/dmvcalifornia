import { Metadata } from 'next';
import ReactionTestContent from './ReactionTestContent';

const SITE_URL = 'https://dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'Brake Reaction Test — Free Driver Reflex Game',
  description:
    'Five rounds. Tap the instant it turns green and see what your reaction time actually costs you in stopping distance at real driving speeds. Free, daily leaderboard.',
  alternates: { canonical: `${SITE_URL}/games/reaction-test` },
  openGraph: {
    title: 'Brake Reaction Test — Free Driver Reflex Game',
    description: 'Test your reaction time and see what it means for real stopping distance.',
    url: `${SITE_URL}/games/reaction-test`,
    type: 'website',
    siteName: 'DMV California',
  },
};

export default function ReactionTestPage() {
  return <ReactionTestContent />;
}
