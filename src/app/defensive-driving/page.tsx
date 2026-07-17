import Link from 'next/link';
import { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Shield, CloudRain, AlertCircle, Ban, User, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import MultiplexAd from '@/components/MultiplexAd';
import { AFFILIATE_CREATIVES } from '@/config/affiliate-creatives';
import InlineQuiz, { type InlineQuizConfig } from '@/components/blog/InlineQuiz';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';

const SITE_URL = 'https://dmvcalifornia.us';

export const metadata: Metadata = {
  title: 'Defensive Driving: 5 Rules Every Driver Should Know (2026)',
  description:
    'The 5 rules of defensive driving — scan ahead, know your surroundings, keep your eyes moving, plan for the worst, and stay visible. Free practice test to prepare for the California DMV exam.',
  keywords: [
    'defensive driving',
    'defensive driving techniques',
    '5 rules of defensive driving',
    'california defensive driving',
    'defensive driving test',
    'what is defensive driving',
  ],
  alternates: { canonical: `${SITE_URL}/defensive-driving` },
  openGraph: {
    title: 'Defensive Driving: 5 Rules Every Driver Should Know (2026)',
    description:
      'The 5 rules of defensive driving with a free California DMV practice test. Based on official DMV guidelines.',
    type: 'article',
    url: `${SITE_URL}/defensive-driving`,
  },
};

const CHALLENGE_QUIZ: InlineQuizConfig = {
  header: 'Only 1% of California drivers answer all 3 correctly',
  subheader: '79% of drivers rate themselves as above average. Prove you actually are.',
  questions: [
    {
      question: 'At 60 mph on a dry California freeway, what is the recommended minimum following distance?',
      options: ['3 seconds', '4 seconds', '6 seconds'],
      correctAnswer: 2,
      explanation: 'At 60 mph you need at least 6 seconds: 4 seconds baseline, plus 1 extra second per 10 mph above 40. Most drivers use 2-3 seconds — less than half what is safe. On wet roads, double it.',
    },
    {
      question: 'At what speed can hydroplaning begin on tires with worn tread?',
      options: ['35 mph', '50 mph', '65 mph'],
      correctAnswer: 0,
      explanation: 'Worn tires can lose road contact at 35 mph. Most drivers assume hydroplaning only happens at highway speeds. New tires resist it much longer — worn tires lose grip at speeds most people consider completely normal.',
    },
    {
      question: 'How often should a defensive driver check mirrors while cruising at highway speed?',
      options: ['Only before changing lanes', 'Every 5-8 seconds', 'Every 15-20 seconds'],
      correctAnswer: 1,
      explanation: 'Mirror checks every 5-8 seconds mean you always know what is around you before you need to move. Checking only before lane changes means you are already reacting — defensive driving is about anticipating, not reacting.',
    },
  ],
  ctaCards: [
    {
      href: '/practice-test/practice-test-safe-driving-and-defensive-techniques',
      title: 'Defensive driver test',
      description: '22 questions on following distance, hazard awareness, and road safety. Most licensed drivers fail at least 5.',
      label: 'Take the challenge',
      icon: 'shield',
    },
    {
      href: '/practice-test/practice-test-safe-driving-and-defensive-techniques',
      title: 'Good driver test',
      description: 'Think your driving habits are above average? These scenario questions will tell you the truth.',
      label: 'Find out now',
      icon: 'trophy',
    },
    {
      href: '/practice-test/california-dmv-practice-test-2026',
      title: 'Full practice test',
      description: '46 questions covering all California DMV topics — the same format as the real written exam.',
      label: 'Start free',
      icon: 'clipboard',
    },
  ],
};

const STATS = [
  { value: '94%', label: 'of crashes involve human error (NHTSA)' },
  { value: '79%', label: 'of drivers rate themselves as above average' },
  { value: '35 mph', label: 'speed at which hydroplaning starts on worn tires' },
  { value: '6 sec', label: 'recommended following distance at 60 mph' },
];

const RULES = [
  {
    n: 1,
    title: 'Scan High Ahead',
    key: '15-second eye lead time',
    body: 'Look ahead a minimum of 15 seconds — that\'s about a city block at 30 mph or a quarter-mile on the highway. Most drivers only look 2–3 seconds ahead, which gives them almost no time to react if something goes wrong. A longer eye lead time lets you spot trouble early, change lanes calmly, and avoid the panic stop that causes rear-end collisions.',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" className="w-28 h-24 mx-auto mb-4" aria-hidden="true">
        <path d="M5 55 L40 22 L75 55" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
        <path d="M22 55 L40 32 L58 55" stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="4 3" />
        <ellipse cx="40" cy="14" rx="13" ry="8" stroke="#4e80c4" strokeWidth="2.5" fill="#eef3fa" />
        <circle cx="40" cy="14" r="4" fill="#4e80c4" />
        <circle cx="41.5" cy="12.5" r="1.5" fill="white" />
        <path d="M40 9 L40 4" stroke="#4e80c4" strokeWidth="2" strokeLinecap="round" />
        <path d="M37 6.5 L40 4 L43 6.5" stroke="#4e80c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="55" y="11" fontSize="9" fill="#4e80c4" fontWeight="bold">15s</text>
        <line x1="15" y1="40" x2="65" y2="40" stroke="#b9cfe9" strokeWidth="1" strokeDasharray="3 3" />
        <text x="7" y="43" fontSize="7" fill="#94a3b8">road ahead</text>
      </svg>
    ),
  },
  {
    n: 2,
    title: "Know What's Around You",
    key: '4-second following distance · mirrors every 5–8 seconds',
    body: 'Tailgating is one of the most common causes of accidents in California. Keep at least 4 seconds of following distance at speeds up to 40 mph, then add a second for every 10 mph over that — so 5 seconds at 50, 6 seconds at 60. On wet roads, double it. And do a quick mirror check every 5–8 seconds; you should always know who\'s next to you and behind you before you need to make a move.',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" className="w-28 h-24 mx-auto mb-4" aria-hidden="true">
        <rect x="4" y="24" width="24" height="13" rx="3" fill="#94a3b8" />
        <rect x="7" y="19" width="18" height="7" rx="2" fill="#cbd5e1" />
        <circle cx="9" cy="38.5" r="3.5" fill="#475569" />
        <circle cx="23" cy="38.5" r="3.5" fill="#475569" />
        <path d="M30 30.5 L50 30.5" stroke="#4e80c4" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M47 27 L50 30.5 L47 34" stroke="#4e80c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="35" y="27" fontSize="9" fill="#4e80c4" fontWeight="bold">4s</text>
        <rect x="50" y="24" width="24" height="13" rx="3" fill="#4e80c4" />
        <rect x="53" y="19" width="18" height="7" rx="2" fill="#6a94cd" />
        <circle cx="55" cy="38.5" r="3.5" fill="#2f4870" />
        <circle cx="69" cy="38.5" r="3.5" fill="#2f4870" />
        <ellipse cx="75" cy="12" rx="5" ry="4" stroke="#4e80c4" strokeWidth="2" fill="#eef3fa" />
        <path d="M70 16 L72 14" stroke="#4e80c4" strokeWidth="1.5" strokeLinecap="round" />
        <text x="64" y="10" fontSize="7" fill="#94a3b8">mirror</text>
      </svg>
    ),
  },
  {
    n: 3,
    title: 'Maintain Eye Movement',
    key: 'Never fix your gaze on one spot for more than 2 seconds',
    body: 'Staring at the bumper ahead — or at a phone, a billboard, anything — causes a condition called highway hypnosis. Your peripheral vision narrows and your reaction time slows dramatically. Good defensive drivers constantly shift their gaze: check the road ahead, glance at the mirrors, scan sidewalks and side streets, then repeat. Short, regular eye movements keep your brain engaged and your reaction time sharp.',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" className="w-28 h-24 mx-auto mb-4" aria-hidden="true">
        <ellipse cx="40" cy="30" rx="18" ry="11" stroke="#4e80c4" strokeWidth="2.5" fill="#eef3fa" />
        <circle cx="40" cy="30" r="6" fill="#4e80c4" />
        <circle cx="42" cy="28" r="2" fill="white" />
        <path d="M12 30 Q20 18 32 24" stroke="#6a94cd" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M10 27 L12 30 L15 27" stroke="#6a94cd" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 30 Q60 18 48 24" stroke="#6a94cd" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M70 27 L68 30 L65 27" stroke="#6a94cd" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="28" y="48" fontSize="8.5" fill="#4e80c4" fontWeight="bold">max 2s</text>
      </svg>
    ),
  },
  {
    n: 4,
    title: 'Plan for the Worst',
    key: 'Always have an escape route ready',
    body: 'The best defensive drivers are always running a quiet what-if in the background: What if that car drifts into my lane? What if the truck ahead brakes hard? You protect yourself by managing the space around your vehicle — never ride in another driver\'s blind spot, avoid sandwiching yourself between two large trucks, and always leave yourself somewhere to go. When you\'ve thought it through in advance, you can react without panic.',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" className="w-28 h-24 mx-auto mb-4" aria-hidden="true">
        <ellipse cx="40" cy="30" rx="34" ry="24" stroke="#b9cfe9" strokeWidth="2" strokeDasharray="4 3" fill="#f0f6ff" />
        <ellipse cx="40" cy="30" rx="22" ry="15" stroke="#4e80c4" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
        <rect x="28" y="24" width="24" height="13" rx="3" fill="#4e80c4" />
        <rect x="31" y="19" width="18" height="7" rx="2" fill="#6a94cd" />
        <circle cx="33" cy="38.5" r="3" fill="#2f4870" />
        <circle cx="47" cy="38.5" r="3" fill="#2f4870" />
        <path d="M62 30 L72 30" stroke="#4e80c4" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M69 26 L73 30 L69 34" stroke="#4e80c4" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="8" y="13" fontSize="7.5" fill="#6a94cd">space buffer</text>
      </svg>
    ),
  },
  {
    n: 5,
    title: 'Make Sure Others See You',
    key: 'Lights, signals, and eye contact',
    body: 'Being a good driver isn\'t just about what you see — it\'s about being seen. Use your headlights in rain, fog, or low-light situations even when it\'s technically daytime. Signal early — at least 100 feet before a turn. Make eye contact with pedestrians before yielding. Avoid backing up unless there\'s no other option. And above all, be patient: a driver who stays calm and visible is one other road users can predict and work around safely.',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" className="w-28 h-24 mx-auto mb-4" aria-hidden="true">
        <rect x="22" y="24" width="24" height="13" rx="3" fill="#4e80c4" />
        <rect x="25" y="19" width="18" height="7" rx="2" fill="#6a94cd" />
        <circle cx="27" cy="38.5" r="3.5" fill="#2f4870" />
        <circle cx="41" cy="38.5" r="3.5" fill="#2f4870" />
        <path d="M22 26 L6 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
        <path d="M22 30.5 L3 30" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M22 35 L6 42" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
        <path d="M46 26 L60 21" stroke="#4e80c4" strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" />
        <path d="M46 30.5 L63 30" stroke="#4e80c4" strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" />
        <path d="M46 35 L60 40" stroke="#4e80c4" strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" />
        <text x="64" y="32" fontSize="7.5" fill="#6a94cd">visible</text>
      </svg>
    ),
  },
];

const TESTS: { href: string; label: string; desc: string; q: number | undefined; icon: ReactNode }[] = [
  {
    href: '/practice-test/practice-test-safe-driving-and-defensive-techniques',
    label: 'Safe Driving & Defensive Techniques',
    desc: 'The core defensive driving questions — exactly what the DMV tests.',
    q: 22,
    icon: <Shield className="w-8 h-8" />,
  },
  {
    href: '/practice-test/practice-test-weather-and-night-driving',
    label: 'Weather & Night Driving',
    desc: 'Rain, fog, ice, low visibility — common DMV test scenarios.',
    q: 14,
    icon: <CloudRain className="w-8 h-8" />,
  },
  {
    href: '/practice-test/practice-test-special-driving-situations',
    label: 'Special Driving Situations',
    desc: 'Emergency vehicles, school zones, construction — tricky spots.',
    q: 15,
    icon: <AlertCircle className="w-8 h-8" />,
  },
  {
    href: '/practice-test/practice-test-dui-laws-and-safety-requirements',
    label: 'DUI Laws & Safety',
    desc: 'BAC limits, checkpoints, and the legal consequences of impaired driving.',
    q: 13,
    icon: <Ban className="w-8 h-8" />,
  },
  {
    href: '/practice-test/practice-test-sharing-the-road',
    label: 'Sharing the Road',
    desc: 'Cyclists, pedestrians, motorcyclists, and large trucks.',
    q: 15,
    icon: <User className="w-8 h-8" />,
  },
  {
    href: '/california-dmv-practice-test',
    label: 'Full CA DMV Practice Test',
    desc: 'All topics in one test — the closest thing to the real exam.',
    q: undefined,
    icon: <FileText className="w-8 h-8" />,
  },
];

const FAQ = [
  {
    q: 'What is defensive driving?',
    a: 'Defensive driving is an approach to driving that goes beyond just following traffic laws. It means actively scanning for hazards, managing space around your vehicle, and planning your next move before a problem forces you to react. Think of it as driving for yourself and everyone else on the road at the same time.',
  },
  {
    q: 'What are the 5 rules of defensive driving?',
    a: '(1) Scan High Ahead — look at least 15 seconds down the road, not at the bumper in front of you. (2) Know What\'s Around You — keep a 4-second following distance and check your mirrors every 5–8 seconds. (3) Maintain Eye Movement — never stare at one spot for more than 2 seconds. (4) Plan for the Worst — always have an exit planned and protect the space around your vehicle. (5) Make Sure Others See You — use lights, signal early, and make eye contact at crosswalks and intersections.',
  },
  {
    q: 'Does defensive driving lower car insurance in California?',
    a: 'Yes, in many cases. Completing a state-approved defensive driving course can qualify you for a discount of 5–10% from many California insurers. The discount is separate from any point reduction. Check with your insurer before signing up to confirm they accept the course.',
  },
  {
    q: 'Is defensive driving tested on the California DMV written exam?',
    a: 'Yes. The California DMV knowledge test regularly includes questions about following distance, scanning techniques, hazard awareness, and safe driving habits — all core defensive driving concepts. Our free practice test covers these topics with the same question style and difficulty as the real exam.',
  },
  {
    q: 'Where can I take a defensive driving course in California?',
    a: 'California has both in-person and online DMV-approved options. Online courses (like IMPROV) let you work at your own pace and are accepted for ticket dismissal and insurance discounts statewide. In-person courses are also available through local driving schools and court-approved providers.',
  },
  {
    q: 'How does following distance work in California?',
    a: 'California uses the "3-second rule" as a minimum, but most driving instructors recommend 4 seconds at speeds below 40 mph, adding 1 second for every 10 mph above that. On wet, icy, or foggy roads, double your normal following distance. To measure: pick a fixed object on the road, watch the car ahead pass it, then count the seconds until your front bumper reaches the same spot.',
  },
];

const affiliateCreative = AFFILIATE_CREATIVES['ts-300x250'];

export default function DefensiveDrivingPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Defensive Driving', item: `${SITE_URL}/defensive-driving` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-dmv-600 via-dmv-500 to-dmv-700 text-white py-14">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="text-sm text-white/80 mb-5">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">Defensive Driving</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Defensive Driving:<br />The 5 Rules Every California Driver Needs
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mb-2">
              Defensive driving means thinking ahead, managing space, and making sure other drivers can see you coming. These five rules are the foundation of every state-approved driving course — and they show up on the California DMV written test.
            </p>
            <p className="text-sm text-white/70 mb-4">
              Based on California DMV guidelines · free · no signup required
            </p>
            <QuizViewTracker
              quizId="defensive-driving"
              baseViews={getBaseViews('defensive-driving')}
              variant="prominent"
              label="people have read this guide"
            />
            <div className="mt-6">
              <Link
                href="/practice-test/practice-test-safe-driving-and-defensive-techniques"
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <span>Only 1 in 5 drivers passes this test. Are you one of them?</span>
                <span className="text-2xl leading-none">→</span>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">

          {/* Intro */}
          <section className="mb-8 prose prose-lg max-w-none prose-p:text-gray-700 prose-h2:text-gray-900">
            <h2>What is defensive driving?</h2>
            <p>
              Most drivers think they&apos;re driving defensively. In reality, most people are just following along — reacting to what&apos;s immediately in front of them and hoping nothing unexpected happens. Defensive driving is something different: it&apos;s an active mindset where you&apos;re constantly reading the road ahead, managing the space around your car, and making sure you&apos;re never in a position where another driver&apos;s mistake becomes your emergency.
            </p>
            <p>
              California roads have some of the highest traffic density in the country. A defensive driver thinks ahead, stays calm, and always has somewhere to go — whether it&apos;s rush hour on the 405 or an empty two-lane highway in the Central Valley. The five rules below are the framework that professional drivers, driving instructors, and the California DMV all use.
            </p>
          </section>

          {/* Stat box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {STATS.map((s) => (
              <div key={s.value} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-dmv-600 mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Challenge quiz */}
          <section className="mb-12">
            <InlineQuiz
              questions={CHALLENGE_QUIZ.questions}
              ctaCards={CHALLENGE_QUIZ.ctaCards}
              header={CHALLENGE_QUIZ.header}
              subheader={CHALLENGE_QUIZ.subheader}
            />
          </section>

          {/* 5 Rules */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              The 5 Rules of Defensive Driving
            </h2>
            <p className="text-gray-600 mb-8">
              These are the same rules taught in every DMV-approved course in California. Learn them and you&apos;ll be ahead of most drivers on the road — and well-prepared for the written test.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {RULES.map((rule) => (
                <div
                  key={rule.n}
                  className="bg-white rounded-2xl border-2 border-gray-100 hover:border-dmv-300 transition-colors p-6 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full bg-dmv-600 text-white font-extrabold flex items-center justify-center text-xl">
                      {rule.n}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-0.5">Rule {rule.n}: {rule.title}</h3>
                      <p className="text-xs font-semibold text-dmv-600 uppercase tracking-wide">{rule.key}</p>
                    </div>
                  </div>
                  <div className="py-2">{rule.svg}</div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-2">{rule.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Extra depth — weather, fatigue, preparation */}
          <section className="mb-12 prose prose-lg max-w-none prose-p:text-gray-700 prose-h2:text-gray-900 prose-h3:text-gray-800 prose-li:text-gray-700">
            <h2>Defensive driving in the real world</h2>

            <h3>Be prepared before you leave</h3>
            <p>
              Defensive driving starts before you turn the key. On any longer drive, check your route in advance — know where construction zones or slow-downs are likely, and have an alternative route ready. If you&apos;re heading somewhere unfamiliar, sort out your navigation before you pull out of the driveway. Fumbling with a phone at a merge ramp is the opposite of defensive driving.
            </p>
            <p>
              On California freeways, traffic radio (KFWB, KNX, or even Google Maps real-time alerts) can warn you about slow-downs miles ahead. That advance notice is exactly the kind of information a defensive driver uses to pick a different road rather than sitting in a queue.
            </p>

            <h3>Following distance in different conditions</h3>
            <p>
              The 4-second rule is a minimum in good conditions. Here&apos;s how it scales:
            </p>
            <ul>
              <li><strong>Up to 40 mph:</strong> 4 seconds</li>
              <li><strong>50 mph:</strong> 5 seconds</li>
              <li><strong>60 mph:</strong> 6 seconds</li>
              <li><strong>Rain or wet roads:</strong> double your normal distance</li>
              <li><strong>Fog or low visibility:</strong> slow down until you can stop within your visible range</li>
              <li><strong>Towing a trailer or hauling a load:</strong> add at least 2 extra seconds — your stopping distance increases significantly</li>
            </ul>
            <p>
              To measure your following distance, watch the car ahead pass a fixed point — a sign, a shadow line — then count the seconds until your own car reaches the same spot. If you get there in less than 4 seconds, ease off.
            </p>

            <h3>Wind, rain, and adverse conditions</h3>
            <p>
              California weather varies wildly — from Santa Ana winds in Southern California to tule fog in the Central Valley to black ice on mountain passes. When conditions are bad, the single best thing you can do is slow down. Crosswinds are particularly dangerous on exposed stretches of I-5 and US-101; they can push a vehicle sideways without warning. Headlights on, grip light on the wheel, and give yourself extra room.
            </p>
            <p>
              In heavy rain, your tires can lose contact with the road surface — hydroplaning — at speeds as low as 35 mph on worn treads. If you feel the steering go light, ease off the throttle gradually and don&apos;t brake hard until you feel the tires grip again.
            </p>

            <h3>Driver fatigue — the hidden danger</h3>
            <p>
              Fatigue impairs your reactions almost as much as alcohol. On long drives, take a real break — get out of the car and walk around — every two hours or so. A few minutes of movement wakes up your muscles and resets your focus. Night driving is especially risky because your body naturally wants to sleep after midnight, even if you don&apos;t feel tired. If you&apos;re drowsy, the only safe fix is to pull over and rest. Cracking a window or turning up the radio doesn&apos;t work well enough to matter.
            </p>

            <h3>Freeway merging and lane discipline</h3>
            <p>
              Merging onto a California freeway requires matching the speed of traffic — not inching into a gap at 40 mph when everyone else is doing 65. Look for a gap large enough for your vehicle, accelerate to match traffic speed on the on-ramp, and signal early so drivers already on the freeway can see your intention. When exiting, check your mirror and blind spot before moving right, and start slowing only after you&apos;ve entered the off-ramp — not while you&apos;re still in the through lane.
            </p>
            <p>
              California Vehicle Code §22406 requires vehicles towing trailers to stay in the right-hand lane or as close to the right curb as possible on multi-lane roads. Even for regular vehicles, the right lane is where slower traffic belongs — the left lane is for passing, not cruising.
            </p>
          </section>

          {/* Do / Don't */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Defensive driving: do this, not that</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="text-sm font-bold text-green-700 uppercase tracking-wide mb-4">Do this</p>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">✓</span> Check mirrors every 5-8 seconds so you always know what is around you</li>
                  <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">✓</span> Keep at least 4 seconds of following distance — 6 seconds at 60 mph</li>
                  <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">✓</span> Signal at least 100 feet before turns and lane changes</li>
                  <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">✓</span> Use headlights in rain, fog, or any low-visibility condition — even during the day</li>
                  <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">✓</span> Scan intersections before entering even when you have a green light</li>
                  <li className="flex gap-2"><span className="text-green-500 font-bold flex-shrink-0">✓</span> Double your following distance on wet or slick roads</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <p className="text-sm font-bold text-red-600 uppercase tracking-wide mb-4">Not this</p>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">✗</span> Tailgate — it cuts your reaction time to near zero and is a point on your record</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">✗</span> Fix your gaze on one spot for more than 2 seconds (highway hypnosis starts fast)</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">✗</span> Trust another driver&apos;s signal or headlamp flash without seeing the actual movement</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">✗</span> Cruise in another vehicle&apos;s blind spot — either pass or drop back</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">✗</span> Drive while drowsy — fatigue impairs reaction time as much as alcohol does</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">✗</span> Use a handheld phone while driving — $162+ fine in California, and it goes on your record</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Callout */}
          <div className="mb-12 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5">
            <p className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-1">California law</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Tailgating is illegal under <strong>California Vehicle Code §21703</strong>. A first offense can carry a fine of $100-$250 and adds 1 point to your driving record. Three points in 12 months triggers a negligent operator warning from the DMV; four points can result in a suspended license.
            </p>
          </div>

          {/* Internal links to related blog posts */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/top-28-defensive-driving-tips" className="group bg-white rounded-xl border border-gray-200 hover:border-dmv-300 hover:shadow-md transition-all p-5 flex flex-col">
                <p className="font-bold text-gray-900 group-hover:text-dmv-700 transition-colors mb-1 text-sm">28 defensive driving tips that could save your life</p>
                <p className="text-xs text-gray-500 leading-snug flex-1">Practical techniques for California roads — from scanning habits to handling freeway merges safely.</p>
                <span className="text-dmv-600 text-xs font-semibold mt-3">Read more →</span>
              </Link>
              <Link href="/real-defensive-driving" className="group bg-white rounded-xl border border-gray-200 hover:border-dmv-300 hover:shadow-md transition-all p-5 flex flex-col">
                <p className="font-bold text-gray-900 group-hover:text-dmv-700 transition-colors mb-1 text-sm">Are you really a defensive driver?</p>
                <p className="text-xs text-gray-500 leading-snug flex-1">A self-assessment covering the habits most drivers think they have — but don&apos;t.</p>
                <span className="text-dmv-600 text-xs font-semibold mt-3">Take the assessment →</span>
              </Link>
            </div>
          </section>

          <MultiplexAd />

          {/* Practice tests — big square cards */}
          <section className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test your defensive driving knowledge</h2>
            <p className="text-gray-600 mb-6">
              These free practice tests cover defensive driving, weather conditions, hazard awareness, and more — the same topics the California DMV tests on the knowledge exam.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TESTS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-dmv-400 hover:shadow-lg transition-all p-6 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-dmv-100 text-dmv-600 flex items-center justify-center mb-3" aria-hidden="true">{t.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-dmv-700 transition-colors mb-2">
                    {t.label}
                  </h3>
                  <p className="text-sm text-gray-500 leading-snug flex-1">{t.desc}</p>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    {t.q ? (
                      <span className="text-xs text-gray-400">{t.q} questions</span>
                    ) : (
                      <span className="text-xs text-gray-400">Full test</span>
                    )}
                    <span className="text-dmv-600 font-semibold text-sm group-hover:translate-x-0.5 transition-transform">Start →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* IMPROV affiliate CTA */}
          {affiliateCreative && affiliateCreative.code && (
            <section className="my-12 bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Sponsored</p>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Need a defensive driving course in California?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                IMPROV is a DMV-approved, fully online traffic school — complete the course at your own pace for ticket dismissal or an auto insurance discount.
              </p>
              <div
                dangerouslySetInnerHTML={{ __html: affiliateCreative.code }}
                className="max-w-sm"
              />
            </section>
          )}

          {/* FAQ */}
          <section className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="group bg-white rounded-lg border border-gray-200 p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {f.q}
                    <span className="text-dmv-500 group-open:rotate-180 transition-transform ml-2 flex-shrink-0">▾</span>
                  </summary>
                  <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Cross-links */}
          <section className="my-10 bg-dmv-50 border border-dmv-100 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold text-dmv-800 mb-3">Keep studying</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/california-dmv-practice-test" className="bg-dmv-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-dmv-700 transition-colors text-sm">
                Full Practice Test →
              </Link>
              <Link href="/california-dmv-road-signs-test" className="bg-white text-dmv-700 border border-dmv-200 px-4 py-2.5 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors text-sm">
                Road Signs Test
              </Link>
              <Link href="/california-dmv-cheat-sheet" className="bg-white text-dmv-700 border border-dmv-200 px-4 py-2.5 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors text-sm">
                DMV Cheat Sheet
              </Link>
              <Link href="/california-dmv-test-study-guide" className="bg-white text-dmv-700 border border-dmv-200 px-4 py-2.5 rounded-lg font-medium hover:bg-dmv-600 hover:text-white transition-colors text-sm">
                Study Guide
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
