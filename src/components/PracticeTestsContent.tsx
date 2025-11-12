'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

interface Quiz {
  id: string | number;
  title: string;
  description: string;
  category: string;
  slug: string;
  passingScore: number;
  timeLimit?: number;
  questions: any[];
}

interface PracticeTestsContentProps {
  quizzes: Quiz[];
}

export default function PracticeTestsContent({ quizzes }: PracticeTestsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(quizzes.map(q => q.category));
    return ['all', ...Array.from(cats)];
  }, [quizzes]);

  // Filter and sort quizzes
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory;
      return matchesSearch && matchesCategory;
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
  }, [quizzes, searchQuery, sortBy, filterCategory]);

  return (
    <>
      {/* Filter and Search Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left side: Sort, Filter, View Mode */}
        <div className="flex flex-wrap gap-3 items-center">
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

        {/* Right side: Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredQuizzes.length} of {quizzes.length} tests
      </div>

      {/* Quiz Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/practice-test/${quiz.slug}`}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
            >
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {quiz.category}
                  </span>
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
                {/* Category Badge */}
                <div className="flex-shrink-0">
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    {quiz.category}
                  </span>
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
