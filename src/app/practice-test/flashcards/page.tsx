import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DMV California Practice Flashcards | Study for Your Driving Test',
  description: 'Master California DMV test questions with interactive flashcards. Study at your own pace with 72 essential questions covering traffic laws, signs, and safety.',
  keywords: ['DMV flashcards', 'California driving test', 'DMV practice', 'study flashcards', 'DMV questions', 'driving test prep'],
  openGraph: {
    title: 'DMV California Practice Flashcards',
    description: 'Master California DMV test questions with interactive flashcards',
    type: 'website',
  }
};

const flashcardSets = [
  {
    id: 1,
    title: 'Set 1: Essential Rules',
    description: 'Questions 1-15: BAC limits, DMV notifications, turning signals, traffic lights, and cell phone laws',
    href: '/practice-test/flashcards/set-1',
    color: 'blue',
    cards: 15,
    topics: ['BAC Limits', 'DMV Notifications', 'Turn Signals', 'Traffic Lights', 'Cell Phone Laws']
  },
  {
    id: 2,
    title: 'Set 2: Right-of-Way & Safety',
    description: 'Questions 16-30: Right-of-way rules, pedestrian safety, emergency vehicles, and intersection laws',
    href: '/practice-test/flashcards/set-2',
    color: 'green',
    cards: 15,
    topics: ['Right-of-Way', 'Pedestrian Safety', 'Emergency Vehicles', 'Safety Belts', 'Road Conditions']
  },
  {
    id: 3,
    title: 'Set 3: Advanced Driving',
    description: 'Questions 46-60: Lane changes, U-turns, cargo rules, school zones, and blind spot awareness',
    href: '/practice-test/flashcards/set-3',
    color: 'purple',
    cards: 15,
    topics: ['Lane Changes', 'U-Turns', 'Cargo Rules', 'School Zones', 'Blind Spots']
  },
  {
    id: 4,
    title: 'Set 4: Laws & Regulations',
    description: 'Questions 61-72: Peace officers, medications, crossing guards, parking rules, and speed limits',
    href: '/practice-test/flashcards/set-4',
    color: 'orange',
    cards: 12,
    topics: ['Peace Officers', 'Medications', 'Crossing Guards', 'Parking Rules', 'Speed Limits']
  },
  {
    id: 5,
    title: 'Set 5: Intersections & Safety',
    description: 'Questions 31-45: Crosswalks, intersections, blind pedestrians, emergency vehicles, and work zones',
    href: '/practice-test/flashcards/set-5',
    color: 'teal',
    cards: 15,
    topics: ['Crosswalks', 'Intersections', 'Blind Pedestrians', 'Emergency Vehicles', 'Work Zones']
  }
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    border: 'border-blue-200',
    badge: 'bg-blue-200 text-blue-900',
    topic: 'bg-blue-100 text-blue-800'
  },
  green: {
    bg: 'bg-green-50',
    hoverBg: 'hover:bg-green-100',
    border: 'border-green-200',
    badge: 'bg-green-200 text-green-900',
    topic: 'bg-green-100 text-green-800'
  },
  purple: {
    bg: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-100',
    border: 'border-purple-200',
    badge: 'bg-purple-200 text-purple-900',
    topic: 'bg-purple-100 text-purple-800'
  },
  orange: {
    bg: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-100',
    border: 'border-orange-200',
    badge: 'bg-orange-200 text-orange-900',
    topic: 'bg-orange-100 text-orange-800'
  },
  teal: {
    bg: 'bg-teal-50',
    hoverBg: 'hover:bg-teal-100',
    border: 'border-teal-200',
    badge: 'bg-teal-200 text-teal-900',
    topic: 'bg-teal-100 text-teal-800'
  }
};

export default function FlashcardsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link
                href="/practice-test"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Practice Tests
              </Link>
              <h1 className="text-5xl font-bold mb-6">
                DMV California Practice Flashcards
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Master your California DMV test with interactive flashcards. Study 72 essential questions covering traffic laws, road signs, and safety rules.
              </p>
              <div className="flex items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>72 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>5 Study Sets</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Interactive</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flashcard Sets */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Choose a Flashcard Set
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {flashcardSets.map((set) => {
                  const colors = colorClasses[set.color as keyof typeof colorClasses];
                  return (
                    <Link
                      key={set.id}
                      href={set.href}
                      className={`${colors.bg} ${colors.hoverBg} rounded-xl p-6 transition-all border-2 ${colors.border} hover:shadow-lg transform hover:-translate-y-1`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl text-gray-900">{set.title}</h3>
                        <span className={`${colors.badge} px-3 py-1 rounded-full text-sm font-medium`}>
                          {set.cards} Cards
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                        {set.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {set.topics.slice(0, 3).map((topic, index) => (
                          <span
                            key={index}
                            className={`${colors.topic} px-2 py-1 rounded text-xs font-medium`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        Start Studying
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                How Flashcards Work
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Choose a Set</h3>
                  <p className="text-gray-600 text-sm">
                    Pick from 3 comprehensive flashcard sets covering different topics
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Read Question</h3>
                  <p className="text-gray-600 text-sm">
                    Read the DMV question carefully and think about the answer
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Flip Card</h3>
                  <p className="text-gray-600 text-sm">
                    Click the card to flip and reveal the correct answer
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">4</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Track Progress</h3>
                  <p className="text-gray-600 text-sm">
                    See your progress and navigate through all cards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Why Use Flashcards?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="font-bold text-xl mb-3">Better Retention</h3>
                  <p className="text-gray-600">
                    Active recall through flashcards helps you remember information longer and perform better on the actual test.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-bold text-xl mb-3">Study Anywhere</h3>
                  <p className="text-gray-600">
                    Quick study sessions perfect for learning on-the-go. Review cards during breaks, commutes, or whenever you have time.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-bold text-xl mb-3">Focus on Weak Areas</h3>
                  <p className="text-gray-600">
                    Identify questions you struggle with and focus your study time where it matters most.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Study Tips */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Effective Study Tips
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🔄</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Spaced Repetition</h3>
                      <p className="text-gray-700 text-sm">
                        Review flashcards multiple times over several days. This helps move information into long-term memory.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">✍️</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Write It Down</h3>
                      <p className="text-gray-700 text-sm">
                        Write out answers you struggle with. The physical act of writing reinforces memory.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🎲</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Shuffle & Mix</h3>
                      <p className="text-gray-700 text-sm">
                        Study cards in random order to ensure you're learning the content, not the sequence.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">⏰</div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Daily Practice</h3>
                      <p className="text-gray-700 text-sm">
                        Study for 15-20 minutes daily rather than cramming. Consistent practice yields better results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Studying?
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Choose a flashcard set above and start mastering California DMV questions today!
              </p>
              <Link
                href="/practice-test"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse All Practice Tests
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
