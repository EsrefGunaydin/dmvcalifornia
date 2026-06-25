import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const SITE = 'https://www.dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'California Regulatory Signs Test 2026 — Free Practice with Images',
  description:
    'Free California regulatory road signs practice test. Learn what stop, yield, speed limit, no-turn, and other regulatory signs mean — with real images and instant answers.',
  keywords: [
    'california regulatory signs test',
    'regulatory signs california dmv',
    'regulatory road signs practice test',
    'california traffic regulatory signs',
    'dmv regulatory signs 2026',
  ],
  alternates: { canonical: `${SITE}/california-regulatory-signs-test` },
  openGraph: {
    title: 'California Regulatory Signs Test 2026 — Free Practice with Images',
    description: 'Practice California regulatory road signs — stop, yield, speed limit, no-turn, and more. Real images, instant answers.',
    type: 'website',
  },
};

const REGULATORY_SIGNS = [
  {
    name: 'Stop Sign',
    color: 'Red octagon',
    meaning: 'Come to a complete stop before the stop line or crosswalk. Yield to all cross traffic and pedestrians before proceeding.',
    tip: 'A rolling stop is not a complete stop and is a primary reason people fail the behind-the-wheel test.',
  },
  {
    name: 'Yield Sign',
    color: 'Red and white downward-pointing triangle',
    meaning: 'Slow down and give the right-of-way to traffic in the intersection or roadway you are entering. Stop if necessary.',
    tip: 'Unlike a stop sign, you are not required to stop at a yield — but you must be ready to.',
  },
  {
    name: 'Speed Limit Sign',
    color: 'White rectangle with black text',
    meaning: 'The maximum legal speed for normal conditions on that road. You must drive at or below this speed.',
    tip: 'California also has basic speed laws — you must slow below the posted limit if conditions (weather, traffic, visibility) make it unsafe to drive at that speed.',
  },
  {
    name: 'Do Not Enter',
    color: 'Red circle with white horizontal bar',
    meaning: 'You may not enter this road from your current direction. Usually seen at freeway off-ramps and divided highway exits.',
    tip: 'Entering past this sign puts you in oncoming traffic. If you see one, do not proceed.',
  },
  {
    name: 'Wrong Way',
    color: 'Red rectangle with white text',
    meaning: 'You are traveling the wrong direction on a divided highway or one-way road. Reverse course immediately.',
    tip: 'Often paired with Do Not Enter. If you see both, pull over safely and turn around.',
  },
  {
    name: 'No U-Turn',
    color: 'White circle with red border and slash over U-turn arrow',
    meaning: 'U-turns are prohibited at this location.',
    tip: 'California law prohibits U-turns in front of fire stations, on divided highways where the opening is marked, and where visibility is less than 200 feet.',
  },
  {
    name: 'No Left Turn / No Right Turn',
    color: 'White circle with red border and slash over turn arrow',
    meaning: 'The indicated turn is prohibited at this intersection.',
    tip: 'Turning signs apply to the current road segment. Look for the sign on or just before the intersection it governs.',
  },
  {
    name: 'One Way',
    color: 'Black rectangle with white arrow',
    meaning: 'Traffic flows only in the direction of the arrow on this road.',
    tip: 'On one-way streets, you may turn left onto another one-way street going left if the lane is clear.',
  },
  {
    name: 'Keep Right',
    color: 'White with black arrow',
    meaning: 'Stay to the right of a traffic island, median, or obstruction ahead.',
    tip: 'Common at freeway entrances and around center medians.',
  },
  {
    name: 'Lane Control Signs',
    color: 'Black with green arrows or red X',
    meaning: 'Green downward arrow means the lane is open. Red X means the lane is closed to traffic. Used in tunnels and on busy urban roads.',
    tip: 'Move out of an X lane immediately — it may be closing for oncoming traffic or emergency access.',
  },
];

const FAQ = [
  {
    q: 'What are regulatory signs?',
    a: 'Regulatory signs are traffic signs that communicate the rules of the road — what you must or must not do. They carry the force of law; ignoring them is a traffic violation. Common examples are stop signs, yield signs, speed limit signs, no-turn signs, and one-way signs. Most are white or red.',
  },
  {
    q: 'What is the difference between regulatory signs and warning signs?',
    a: 'Regulatory signs (white or red) tell you what is legally required — you must obey them. Warning signs (yellow diamond shape) alert you to hazards or changing conditions ahead but do not legally require a specific action. Guide signs (green or brown) give directions and information.',
  },
  {
    q: 'How many regulatory sign questions are on the California DMV test?',
    a: 'Road signs and signals make up roughly a quarter of the 46-question California DMV written test. Regulatory signs are the most heavily tested category — knowing them by sight is one of the fastest ways to raise your score.',
  },
  {
    q: 'What shape and color are most regulatory signs?',
    a: 'Most regulatory signs are white rectangles with black text or symbols. Prohibition signs (stop, do not enter, no turn) use red. The stop sign is uniquely octagonal. Yield signs are downward-pointing red and white triangles.',
  },
  {
    q: 'Is this regulatory signs practice test free?',
    a: 'Yes. The road signs test linked on this page is 100% free, uses real sign images, and gives you instant answers — retake it as many times as you like.',
  },
];

export default function RegulatorySignsTestPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                Free · Real images · Instant answers
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                California Regulatory Signs Test 2026
              </h1>
              <p className="text-xl text-white/90">
                Learn every California regulatory road sign — stop, yield, speed limits, no-turn, one-way, and more — with real images and explanations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/california-dmv-road-signs-test"
                  className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-50 transition-colors shadow-lg"
                >
                  Start the Signs Test →
                </Link>
                <Link
                  href="/practice-test/practice-test-traffic-signs-and-signals"
                  className="bg-white/20 text-white border border-white/40 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition-colors"
                >
                  Traffic Signs Quiz (20 Q)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What are regulatory signs */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What are regulatory signs?</h2>
              <p className="text-gray-700 leading-relaxed">
                Regulatory signs communicate the rules of the road that drivers must obey by law. Unlike warning signs (which alert you to hazards) or guide signs (which give directions), regulatory signs carry legal weight — ignoring one is a traffic violation and can result in a ticket, accident, or failed DMV test.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Most California regulatory signs are <strong>white rectangles with black text or symbols</strong>. Prohibition signs — stop, do not enter, no U-turn, no-turn arrows — use <strong>red</strong>. The stop sign is a unique red octagon. Speed limit signs are white with black numbers and the word SPEED LIMIT.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Regulatory signs make up the majority of sign-related questions on the California DMV knowledge test. Knowing them by sight is the single fastest way to lock in points on the exam.
              </p>
            </div>
          </div>
        </section>

        {/* Sign reference cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">California Regulatory Signs — Quick Reference</h2>
              <p className="text-gray-600 text-center mb-8">The signs most likely to appear on the California DMV knowledge test.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REGULATORY_SIGNS.map((sign) => (
                  <div key={sign.name} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold text-lg">R</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{sign.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{sign.color}</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{sign.meaning}</p>
                        <p className="text-blue-700 text-xs mt-2 font-medium">💡 {sign.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA to tests */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice with real sign images</h2>
              <p className="text-gray-600 mb-8">Reading about signs helps. Seeing them is what makes them stick. Take the visual signs test — 38 real California signs with instant feedback.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/california-dmv-road-signs-test"
                  className="bg-primary text-white px-6 py-4 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-sm"
                >
                  Road Signs Test<br /><span className="text-sm font-normal opacity-90">38 real sign images</span>
                </Link>
                <Link
                  href="/practice-test/practice-test-traffic-signs-and-signals"
                  className="bg-gray-100 text-gray-800 px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Traffic Signs Quiz<br /><span className="text-sm font-normal text-gray-600">20 questions</span>
                </Link>
                <Link
                  href="/practice-test/practice-test-road-signs-and-markings"
                  className="bg-gray-100 text-gray-800 px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Signs & Markings Quiz<br /><span className="text-sm font-normal text-gray-600">20 questions</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Regulatory Signs — FAQ
              </h2>
              <div className="space-y-3">
                {FAQ.map((f, i) => (
                  <details key={i} className="group bg-white rounded-lg border border-gray-200 p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                      {f.q}
                      <span className="text-primary group-open:rotate-180 transition-transform ml-2">▾</span>
                    </summary>
                    <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Internal links */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Keep studying</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/california-dmv-practice-test" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  Full Practice Test →
                </Link>
                <Link href="/california-dmv-cheat-sheet" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  DMV Cheat Sheet
                </Link>
                <Link href="/20-hardest-dmv-written-test-questions" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  20 Hardest Questions
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
