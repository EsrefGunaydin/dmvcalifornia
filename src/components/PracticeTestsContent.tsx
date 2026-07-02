'use client';

import { useState, useMemo, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { Search, LayoutGrid, List, SlidersHorizontal, Globe } from 'lucide-react';
import MultiplexAd from './MultiplexAd';

type QuizLanguage =
  | 'en'
  | 'es'
  | 'tr'
  | 'zh'
  | 'ar'
  | 'hy'
  | 'fa'
  | 'pa'
  | 'ru'
  | 'tl'
  | 'vi'
  | 'ko'
  | 'hi';

interface Quiz {
  id: string | number;
  title: string;
  description: string;
  category: string;
  slug: string;
  passingScore: number;
  timeLimit?: number;
  language?: QuizLanguage;
  questions: any[];
  badge?: string;
}

interface PracticeTestsContentProps {
  quizzes: Quiz[];
}

const LANGUAGE_OPTIONS: { value: 'all' | QuizLanguage; label: string }[] = [
  { value: 'all', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish - Español' },
  { value: 'tr', label: 'Turkish - Türkçe' },
  { value: 'zh', label: 'Chinese - 中文' },
  { value: 'ar', label: 'Arabic - العربية' },
  { value: 'hy', label: 'Armenian - Հայերեն' },
  { value: 'fa', label: 'Farsi - فارسی' },
  { value: 'pa', label: 'Punjabi - ਪੰਜਾਬੀ' },
  { value: 'ru', label: 'Russian - Русский' },
  { value: 'tl', label: 'Tagalog' },
  { value: 'vi', label: 'Vietnamese - Tiếng Việt' },
  { value: 'ko', label: 'Korean - 한국어' },
  { value: 'hi', label: 'Hindi - हिन्दी' },
];

const LANGUAGE_PILLS: { value: 'all' | QuizLanguage; flag: string; short: string }[] = [
  { value: 'all',  flag: '🌐', short: 'All' },
  { value: 'en',   flag: '🇺🇸', short: 'EN' },
  { value: 'es',   flag: '🇲🇽', short: 'ES' },
  { value: 'tr',   flag: '🇹🇷', short: 'TR' },
  { value: 'zh',   flag: '🇨🇳', short: 'ZH' },
  { value: 'ar',   flag: '🇸🇦', short: 'AR' },
  { value: 'hy',   flag: '🇦🇲', short: 'HY' },
  { value: 'fa',   flag: '🇮🇷', short: 'FA' },
  { value: 'pa',   flag: '🇮🇳', short: 'PA' },
  { value: 'ru',   flag: '🇷🇺', short: 'RU' },
  { value: 'tl',   flag: '🇵🇭', short: 'TL' },
  { value: 'vi',   flag: '🇻🇳', short: 'VI' },
  { value: 'ko',   flag: '🇰🇷', short: 'KO' },
  { value: 'hi',   flag: '🇮🇳', short: 'HI' },
];


export default function PracticeTestsContent({ quizzes }: PracticeTestsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState<'all' | QuizLanguage>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories, narrowed to the selected language so categories from
  // hidden languages don't clutter the dropdown
  // Always show all categories regardless of the active language pill
  const categories = useMemo(() => {
    const cats = new Set(quizzes.map(q => q.category));
    return ['all', ...Array.from(cats)];
  }, [quizzes]);

  // Quiz count per language for the pills
  const langCounts = useMemo(() => {
    const counts: Record<string, number> = { all: quizzes.length };
    for (const q of quizzes) {
      const lang = q.language ?? 'en';
      counts[lang] = (counts[lang] ?? 0) + 1;
    }
    return counts;
  }, [quizzes]);

  // Filter and sort quizzes
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
      const quizLang = quiz.language ?? 'en';
      const matchesLanguage = filterLanguage === 'all' || quizLang === filterLanguage;
      return matchesSearch && matchesCategory && matchesLanguage;
    });

    // Sort
    if (sortBy === 'title') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'questions') {
      filtered = filtered.sort((a, b) => b.questions.length - a.questions.length);
    } else if (sortBy === 'category') {
      filtered = filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    return filtered;
  }, [quizzes, searchQuery, sortBy, filterCategory, filterLanguage]);

  return (
    <>
      <div id="language-filter-anchor" className="scroll-mt-24" />

      {/* Language flag pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {LANGUAGE_PILLS.filter(pill => langCounts[pill.value] !== undefined).map(pill => (
          <button
            key={pill.value}
            onClick={() => setFilterLanguage(pill.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterLanguage === pill.value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary/60 hover:bg-primary/5'
            }`}
            aria-pressed={filterLanguage === pill.value}
          >
            <span className="text-base leading-none">{pill.flag}</span>
            <span>{pill.short}</span>
            <span className={`text-xs font-normal ${filterLanguage === pill.value ? 'text-white/80' : 'text-gray-400'}`}>
              {langCounts[pill.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Controls — all on one row */}
      <div className="mb-8 flex flex-wrap gap-3 items-center">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="title">Sort by Title</option>
            <option value="questions">Sort by Questions</option>
            <option value="category">Sort by Category</option>
          </select>
          <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Search — grows to fill remaining space */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredQuizzes.length} of {quizzes.length} tests
      </div>

      {/* Flashcards callout — shown when a single language is selected so the
          page stays useful even when that language has only a few tests */}
      {filterLanguage !== 'all' && (
        <Link
          href={filterLanguage === 'en'
            ? '/practice-test/flashcards'
            : `/practice-test/flashcards/${filterLanguage}`}
          className="mb-6 flex items-center justify-between gap-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <Globe className="w-7 h-7 text-gray-600" />
            <div>
              <p className="font-bold text-gray-900">
                {LANGUAGE_OPTIONS.find(o => o.value === filterLanguage)?.label} — Flashcards
              </p>
              <p className="text-sm text-gray-600">
                Study essential DMV questions with interactive flashcards in your language.
              </p>
            </div>
          </div>
          <span className="text-primary font-semibold whitespace-nowrap group-hover:underline">
            Study now →
          </span>
        </Link>
      )}

      {/* Quiz Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz, index) => (
            <Fragment key={quiz.id}>
              <Link
                href={`/practice-test/${quiz.slug}`}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
                dir={quiz.language === 'ar' || quiz.language === 'fa' ? 'rtl' : 'auto'}
              >
              <div className="p-6">
                {/* Category Badge + Language Flag */}
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                  {quiz.badge && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                      {quiz.badge}
                    </span>
                  )}
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {quiz.category}
                  </span>
                  {quiz.language && quiz.language !== 'en' && (
                    <Globe className="w-5 h-5 text-gray-500" aria-label={`Language: ${quiz.language}`} />
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {quiz.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {quiz.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{quiz.questions.length} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{quiz.passingScore}% to Pass</span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{quiz.timeLimit} Minutes</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-primary font-semibold group-hover:underline">
                    Start Practice Test
                  </span>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Insert Multiplex Ad after 6th card */}
            {index === 5 && (
              <div className="md:col-span-3">
                <MultiplexAd />
              </div>
            )}
          </Fragment>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/practice-test/${quiz.slug}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group flex items-center"
            >
              <div className="p-6 flex-1 flex items-center gap-6">
                {/* Category Badge + Language Flag */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {quiz.badge && (
                    <span className="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                      {quiz.badge}
                    </span>
                  )}
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    {quiz.category}
                  </span>
                  {quiz.language && quiz.language !== 'en' && (
                    <Globe className="w-5 h-5 text-gray-500" aria-label={`Language: ${quiz.language}`} />
                  )}
                </div>

                {/* Title and Description */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors truncate">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {quiz.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{quiz.questions.length} Q</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{quiz.passingScore}%</span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{quiz.timeLimit}m</span>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tests found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setFilterLanguage('all');
              setSortBy('default');
            }}
            className="mt-4 text-primary hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );
}
