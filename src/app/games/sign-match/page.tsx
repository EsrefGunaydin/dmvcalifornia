import { Metadata } from 'next';
import SignMatchContent from './SignMatchContent';

const SITE_URL = 'https://dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'Road Sign Memory Match — Free Daily DMV Game',
  description:
    'Flip cards to match California road signs with their meanings. Same 8 signs for everyone today, pulled from the real DMV sign test. Free, new board every day.',
  alternates: { canonical: `${SITE_URL}/games/sign-match` },
  openGraph: {
    title: 'Road Sign Memory Match — Free Daily DMV Game',
    description: 'Match California road signs to their meanings. New board every day, free, no signup.',
    url: `${SITE_URL}/games/sign-match`,
    type: 'website',
    siteName: 'DMV California',
  },
};

export default function SignMatchPage() {
  return <SignMatchContent />;
}
