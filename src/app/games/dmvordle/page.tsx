import { Metadata } from 'next';
import DMVordleContent from './DMVordleContent';

const SITE_URL = 'https://dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'DMVordle — Free Daily DMV Word Game',
  description:
    'Guess the 5-letter DMV word in 6 tries. All words are traffic and driving related. New word every day, free, no signup.',
  alternates: { canonical: `${SITE_URL}/games/dmvordle` },
  openGraph: {
    title: 'DMVordle — Free Daily DMV Word Game',
    description: 'Guess the 5-letter DMV word in 6 tries. New word every day.',
    url: `${SITE_URL}/games/dmvordle`,
    type: 'website',
    siteName: 'DMV California',
  },
};

export default function DMVordlePage() {
  return <DMVordleContent />;
}
