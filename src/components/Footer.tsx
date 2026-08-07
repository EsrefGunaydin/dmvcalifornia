import Link from 'next/link';
import { BookMarked, ShieldCheck, Users, LucideIcon } from 'lucide-react';
import YouTubeCTA from './YouTubeCTA';
import { YOUTUBE_CHANNEL_URL } from '@/lib/constants';

const SHIELD_CLIP_PATH = 'polygon(50% 0%, 100% 20%, 100% 58%, 50% 100%, 0% 58%, 0% 20%)';

function TrustBadge({
  icon: Icon,
  gradient,
  caption,
  captionColor,
  title,
}: {
  icon: LucideIcon;
  gradient: string;
  caption: string;
  captionColor: string;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center text-center w-40 bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-5">
      <div
        className={`w-14 h-16 bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 shadow-md`}
        style={{ clipPath: SHIELD_CLIP_PATH }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${captionColor} mb-1`}>{caption}</p>
      <p className="text-sm font-semibold text-white leading-tight">{title}</p>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Mission Section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
                DMV California
              </h2>
              <p className="text-sm text-gray-400 mt-1">Your DMV Success Partner</p>
            </Link>
            <p className="text-gray-300 leading-relaxed mt-4 max-w-2xl">
              Our mission is to help California drivers navigate DMV procedures confidently.
              We provide clear, simplified guides and resources to make your DMV experience as smooth as possible.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-6">
              <TrustBadge
                icon={BookMarked}
                gradient="from-sky-400 to-primary"
                caption="2026 Edition"
                captionColor="text-sky-400"
                title="CA Driver Handbook"
              />
              <TrustBadge
                icon={ShieldCheck}
                gradient="from-amber-300 to-amber-600"
                caption="Transparency"
                captionColor="text-amber-400"
                title="Not DMV Affiliated"
              />
              <TrustBadge
                icon={Users}
                gradient="from-emerald-300 to-green-600"
                caption="Trusted By"
                captionColor="text-green-400"
                title="180,000+ CA Drivers"
              />
            </div>

            <div className="mt-6">
              <YouTubeCTA variant="subscribe" source="footer" className="max-w-xs" />
            </div>
          </div>

          {/* Study Tools */}
          <div>
            <h3 className="text-xl font-bold mb-4">Study Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/california-dmv-practice-test" className="text-gray-300 hover:text-white transition-colors">
                  California DMV Practice Test
                </Link>
              </li>
              <li>
                <Link href="/practice-test" className="text-gray-300 hover:text-white transition-colors">
                  All Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/practice-test/simulator/en" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                  Practice Test Simulator
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
                </Link>
              </li>
              <li>
                <Link href="/practice-test/flashcards" className="text-gray-300 hover:text-white transition-colors">
                  Flashcards
                </Link>
              </li>
              <li>
                <Link href="/practice-test/wrong-answers" className="text-gray-300 hover:text-white transition-colors">
                  Review Your Mistakes
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-road-signs-test" className="text-gray-300 hover:text-white transition-colors">
                  Road Signs Test
                </Link>
              </li>
              <li>
                <Link href="/california-driver-handbook" className="text-gray-300 hover:text-white transition-colors">
                  Driver Handbook
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-cheat-sheet" className="text-gray-300 hover:text-white transition-colors">
                  DMV Cheat Sheet
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-test-study-guide" className="text-gray-300 hover:text-white transition-colors">
                  Study Guide
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-marathon-test" className="text-gray-300 hover:text-white transition-colors">
                  Marathon Test
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-blitz-test" className="text-gray-300 hover:text-white transition-colors">
                  Blitz Test
                </Link>
              </li>
              <li>
                <Link href="/20-hardest-dmv-written-test-questions" className="text-gray-300 hover:text-white transition-colors">
                  20 Hardest Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics & More */}
          <div>
            <h3 className="text-xl font-bold mb-4">Topics &amp; More</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/california-dmv-drug-and-alcohol-test" className="text-gray-300 hover:text-white transition-colors">
                  Drug &amp; Alcohol Test
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-parking-test" className="text-gray-300 hover:text-white transition-colors">
                  Parking Test
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-speed-limit-test" className="text-gray-300 hover:text-white transition-colors">
                  Speed Limit Test
                </Link>
              </li>
              <li>
                <Link href="/defensive-driving" className="text-gray-300 hover:text-white transition-colors">
                  Defensive Driving
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-fees" className="text-gray-300 hover:text-white transition-colors">
                  DMV Fees
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-fee-calculator" className="text-gray-300 hover:text-white transition-colors">
                  DMV Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-vehicle-registration" className="text-gray-300 hover:text-white transition-colors">
                  Vehicle Registration
                </Link>
              </li>
              <li>
                <Link href="/mydmv-california-account-guide" className="text-gray-300 hover:text-white transition-colors">
                  MyDMV Account Guide
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-bill-of-sale-release-of-liability" className="text-gray-300 hover:text-white transition-colors">
                  Bill of Sale &amp; Release of Liability
                </Link>
              </li>
              <li>
                <Link href="/dmv-offices" className="text-gray-300 hover:text-white transition-colors">
                  DMV Offices
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-gray-300 hover:text-white transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-300 hover:text-white transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} DMVCalifornia.us. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
