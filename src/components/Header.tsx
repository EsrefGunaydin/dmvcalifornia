'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Gamepad2, Flame } from 'lucide-react';
import { useStreak } from '@/hooks/useStreak';

const STUDY_TOOLS: { href: string; label: string; isNew?: boolean }[] = [
  { href: '/practice-test/simulator/en', label: 'Practice Test Simulator', isNew: true },
  { href: '/california-dmv-road-signs-test', label: 'Road Signs Test' },
  { href: '/california-driver-handbook', label: 'Driver Handbook' },
  { href: '/california-dmv-cheat-sheet', label: 'DMV Cheat Sheet' },
  { href: '/california-dmv-test-study-guide', label: 'Study Guide' },
  { href: '/california-dmv-marathon-test', label: 'Marathon Test' },
  { href: '/20-hardest-dmv-written-test-questions', label: '20 Hardest Questions' },
  { href: '/california-dmv-drug-and-alcohol-test', label: 'Drug & Alcohol Test' },
  { href: '/california-dmv-parking-test', label: 'Parking Test' },
  { href: '/california-dmv-speed-limit-test', label: 'Speed Limit Test' },
  { href: '/california-dmv-fees', label: 'DMV Fees' },
  { href: '/defensive-driving', label: 'Defensive Driving' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { streak } = useStreak();

  return (
    <header className="bg-gradient-to-r from-white via-orange-100 via-50% to-white shadow-sm border-b-4 border-primary sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Tagline */}
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary hover:text-primary-600">
              DMV California
            </h1>
            <p className="text-sm text-gray-600 mt-1">Your DMV Success Partner</p>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/practice-test" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Practice Tests
            </Link>

            {/* Study Tools dropdown (hover) */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 text-gray-700 hover:text-primary font-medium transition-colors"
                aria-haspopup="true"
              >
                Study Tools
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* invisible bridge + panel keep hover alive across the gap */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block z-50">
                <div className="w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  {STUDY_TOOLS.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors"
                    >
                      {t.label}
                      {t.isNew && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/games" className="flex items-center gap-1.5 text-gray-700 hover:text-primary font-medium transition-colors">
              Games <Gamepad2 className="w-4 h-4" />
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Blog
            </Link>
            <Link href="/videos" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Videos
            </Link>
            <Link href="/dmv-offices" className="text-gray-700 hover:text-primary font-medium transition-colors">
              DMV Offices
            </Link>
            {streak >= 1 && (
              <Link
                href="/practice-test/daily-challenge"
                className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-orange-100 transition-colors"
                title="Keep your streak alive"
              >
                <Flame className="w-4 h-4" /> {streak}
              </Link>
            )}
            <a
              href="https://apps.apple.com/app/dmv-california/id6754900213"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Get the App
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/practice-test"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Practice Tests
              </Link>

              {/* Study Tools accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setToolsOpen(!toolsOpen)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-primary font-medium transition-colors py-2"
                  aria-expanded={toolsOpen}
                >
                  Study Tools
                  <svg className={`w-5 h-5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {toolsOpen && (
                  <div className="flex flex-col gap-1 pl-4 mt-1 border-l-2 border-orange-200">
                    {STUDY_TOOLS.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary text-sm py-2 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t.label}
                        {t.isNew && (
                          <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/games"
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Games <Gamepad2 className="w-4 h-4" />
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/videos"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Videos
              </Link>
              <Link
                href="/dmv-offices"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                DMV Offices
              </Link>
              {streak >= 1 && (
                <Link
                  href="/practice-test/daily-challenge"
                  className="flex items-center gap-1.5 text-orange-700 font-bold transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Flame className="w-4 h-4" /> {streak}-day streak
                </Link>
              )}
              <Link
                href="/privacy-policy"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy
              </Link>
              <a
                href="https://apps.apple.com/app/dmv-california/id6754900213"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Get the App
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
