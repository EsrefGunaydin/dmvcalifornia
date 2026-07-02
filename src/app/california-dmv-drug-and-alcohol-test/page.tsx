import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import TopicTestLanding from '@/components/TopicTestLanding';
import { Wine } from 'lucide-react';

export const metadata: Metadata = {
  title: 'California DMV Drug & Alcohol Test 2026 (Free Practice) | DMV California',
  description:
    'Free California DMV drug & alcohol practice test. BAC limits, zero tolerance, implied consent, and DUI penalties — the alcohol-and-drug questions the written test always asks.',
  keywords: [
    'california dmv drug and alcohol test',
    'dmv alcohol test california',
    'california dui practice test',
    'bac limit california',
    'dmv drug and alcohol questions',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-drug-and-alcohol-test' },
  openGraph: { title: 'California DMV Drug & Alcohol Test 2026 (Free Practice)', type: 'website' },
};

export default function Page() {
  return (
    <>
      <Header />
      <TopicTestLanding
        icon={<Wine className="w-10 h-10 text-white" />}
        h1="California DMV Drug & Alcohol Test"
        intro="Alcohol and drug questions are guaranteed on the California written test. Learn the limits and penalties, then practice the exact questions."
        quizSlug="practice-test-dui-laws-and-safety-requirements"
        quizLabel="Start the Drug & Alcohol practice test"
        gradient="from-rose-600 via-red-600 to-orange-600"
        factsTitle="Key alcohol & drug facts to know"
        facts={[
          { term: 'Legal BAC limit, age 21+', detail: '0.08%' },
          { term: 'Commercial drivers', detail: '0.04%' },
          { term: 'Under 21 (zero tolerance)', detail: '0.01%' },
          { term: 'Refusing a chemical test', detail: 'Automatic license suspension (implied consent)' },
          { term: 'Open container', detail: 'Illegal anywhere in the passenger area' },
          { term: 'Prescription / OTC drugs', detail: 'Can impair you — driving while impaired is still a DUI' },
          { term: 'First DUI conviction', detail: 'Fines, license suspension, possible jail, and a DUI program' },
        ]}
        faq={[
          {
            q: 'What is the legal blood alcohol limit in California?',
            a: 'It is 0.08% for drivers 21 and older, 0.04% for commercial drivers, and 0.01% for anyone under 21 (zero tolerance). You can still be arrested below these limits if you are impaired.',
          },
          {
            q: 'What is implied consent?',
            a: 'By driving in California you agree to take a breath or blood test if lawfully arrested for DUI. Refusing triggers an automatic license suspension and can add penalties on top of the DUI itself.',
          },
          {
            q: 'Do alcohol and drug questions really appear on the DMV test?',
            a: 'Yes — DUI, BAC limits, and how alcohol and drugs affect driving are a standard part of the California knowledge test. Expect a few of these questions every time.',
          },
        ]}
      />
      <Footer />
      <CookieBanner />
    </>
  );
}
