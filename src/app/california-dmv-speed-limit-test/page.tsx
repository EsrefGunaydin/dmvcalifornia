import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import TopicTestLanding from '@/components/TopicTestLanding';
import { Timer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'California DMV Speed Limits Test 2026 (Free Practice) | DMV California',
  description:
    'Free California DMV speed limits practice test. Residential, school zone, blind intersection, and freeway limits plus the Basic Speed Law — the speed questions on the written test.',
  keywords: [
    'california dmv speed limit test',
    'california speed limits',
    'basic speed law california',
    'residential speed limit california',
    'dmv speed limit practice test',
  ],
  alternates: { canonical: 'https://www.dmvcalifornia.us/california-dmv-speed-limit-test' },
  openGraph: { title: 'California DMV Speed Limits Test 2026 (Free Practice)', type: 'website' },
};

export default function Page() {
  return (
    <>
      <Header />
      <TopicTestLanding
        icon={<Timer className="w-10 h-10 text-white" />}
        h1="California DMV Speed Limits Test"
        intro="From blind intersections to freeways, California has a speed limit for every situation. Learn them all, then practice the exact questions."
        quizSlug="practice-test-speed-limits-and-traffic-laws"
        quizLabel="Start the Speed Limits practice test"
        gradient="from-amber-500 via-orange-600 to-red-600"
        factsTitle="California speed limits (unless posted otherwise)"
        facts={[
          { term: 'Residential / business district', detail: '25 mph' },
          { term: 'Near a school (children present)', detail: '25 mph or less' },
          { term: 'Blind / uncontrolled intersection', detail: '15 mph' },
          { term: 'Alley', detail: '15 mph' },
          { term: 'Within 100 ft of a railroad crossing (no clear view)', detail: '15 mph' },
          { term: 'Most freeways (maximum)', detail: '65 mph (70 where posted)' },
          { term: 'Basic Speed Law', detail: 'Never drive faster than is safe for current conditions' },
        ]}
        faq={[
          {
            q: 'What is the speed limit in a California residential area?',
            a: 'Unless a sign says otherwise, the limit in a residential or business district is 25 mph. Near a school with children present it is 25 mph or lower.',
          },
          {
            q: 'What is the Basic Speed Law?',
            a: 'It means you may never drive faster than is safe for current conditions — rain, fog, traffic, or a curve can make even the posted limit too fast. You can be cited for unsafe speed even when under the posted limit.',
          },
          {
            q: 'What is the speed limit at a blind intersection?',
            a: '15 mph. A blind intersection is one where you cannot see 100 feet in either direction during the last 100 feet before crossing. The same 15 mph limit applies in alleys and near uncontrolled railroad crossings.',
          },
        ]}
      />
      <Footer />
      <CookieBanner />
    </>
  );
}
