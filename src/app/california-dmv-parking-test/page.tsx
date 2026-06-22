import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import TopicTestLanding from '@/components/TopicTestLanding';

export const metadata: Metadata = {
  title: 'California DMV Parking Test 2026 (Free Practice) | DMV California',
  description:
    'Free California DMV parking practice test. Curb colors, parking on hills, no-parking zones, and disabled parking — the parking rules the written test loves to ask.',
  keywords: [
    'california dmv parking test',
    'curb colors california',
    'parking on a hill california',
    'dmv parking rules practice test',
    'california parking laws',
  ],
  alternates: { canonical: 'https://www.dmvcalifornia.us/california-dmv-parking-test' },
  openGraph: { title: 'California DMV Parking Test 2026 (Free Practice)', type: 'website' },
};

export default function Page() {
  return (
    <>
      <Header />
      <TopicTestLanding
        emoji="🅿️"
        h1="California DMV Parking Test"
        intro="Curb colors and parking-on-a-hill questions trip up a lot of test-takers. Learn the rules, then practice the exact questions."
        quizSlug="practice-test-parking-and-vehicle-control"
        quizLabel="Start the Parking practice test"
        gradient="from-sky-600 via-blue-600 to-indigo-600"
        factsTitle="Key parking rules to know"
        facts={[
          { term: 'White curb', detail: 'Quick stop to load/unload passengers or mail' },
          { term: 'Green curb', detail: 'Limited-time parking (time posted)' },
          { term: 'Yellow curb', detail: 'Loading zone — load/unload only' },
          { term: 'Red curb', detail: 'No stopping, standing, or parking' },
          { term: 'Blue curb', detail: 'Disabled parking — placard or plate required' },
          { term: 'Downhill (curb or none)', detail: 'Turn wheels toward the curb/edge' },
          { term: 'Uphill with a curb', detail: 'Turn wheels away from the curb' },
          { term: 'Never park', detail: 'In a crosswalk, on a sidewalk, or in a crosshatched space' },
        ]}
        faq={[
          {
            q: 'Which way do I turn my wheels when parking on a hill?',
            a: 'Downhill (with or without a curb): turn your wheels toward the curb or edge of the road. Uphill with a curb: turn your wheels away from the curb. Always set the parking brake.',
          },
          {
            q: 'What do the curb colors mean in California?',
            a: 'White = quick passenger/mail loading; green = limited-time parking; yellow = loading zone; red = no parking at all; blue = disabled parking with a placard or plate.',
          },
          {
            q: 'Where is parking never allowed?',
            a: 'In a crosswalk, on a sidewalk, in front of a driveway, within 15 feet of a fire hydrant, in a crosshatched (diagonal) space, or anywhere a sign or red curb prohibits it.',
          },
        ]}
      />
      <Footer />
      <CookieBanner />
    </>
  );
}
