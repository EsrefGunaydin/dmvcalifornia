'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import MultiplexAd from '@/components/MultiplexAd';

type FilterSection = 'sort' | 'tags' | null;

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  tags?: string[];
};

// Helper to extract first image from HTML content
function extractFirstImage(htmlContent: string): string | null {
  const imgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [expandedSection, setExpandedSection] = useState<FilterSection>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const searchableText = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags?.includes(selectedTag));
    }

    // Sort by date
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [posts, selectedTag, sortBy, searchQuery]);

  return (
    <>
      {/* Compact Filters */}
      <section className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Results count */}
              <div className="text-sm font-medium text-gray-900">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              </div>

              <div className="h-4 w-px bg-gray-300"></div>

            {/* Sort Toggle */}
            <button
              onClick={() => setExpandedSection(expandedSection === 'sort' ? null : 'sort')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'}
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'sort' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Tag Filter Toggle */}
            <button
              onClick={() => setExpandedSection(expandedSection === 'tags' ? null : 'tags')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTag !== 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {selectedTag === 'all' ? 'All Tags' : selectedTag}
              <svg className={`w-4 h-4 transition-transform ${expandedSection === 'tags' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Clear filters if any active */}
            {(selectedTag !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTag('all');
                  setSearchQuery('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear All
              </button>
            )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100 text-sm w-64"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Expandable Sort Options */}
          {expandedSection === 'sort' && (
            <div className="mt-3 pt-3 border-t animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setExpandedSection(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'newest'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setSortBy('oldest');
                    setExpandedSection(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'oldest'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Oldest First
                </button>
              </div>
            </div>
          )}

          {/* Expandable Tag Filter */}
          {expandedSection === 'tags' && (
            <div className="mt-3 pt-3 border-t animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedTag('all');
                    setExpandedSection(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({posts.length})
                </button>
                {allTags.map(tag => {
                  const count = posts.filter(p => p.tags?.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(tag);
                        setExpandedSection(null);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found with the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => {
              const firstImage = extractFirstImage(post.content);

              return (
                <>
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                  {/* Post Hero Image */}
                  {firstImage ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={firstImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Date */}
                    <time className="text-sm text-gray-500 block mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Author and Read More */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">By {post.author}</span>
                      <Link
                        href={`/${post.slug}`}
                        className="inline-flex items-center text-primary font-semibold hover:text-primary-600 transition-colors"
                      >
                        Read
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>

                {/* Insert Multiplex Ad after 6th card */}
                {index === 5 && (
                  <div className="lg:col-span-3 md:col-span-2">
                    <MultiplexAd />
                  </div>
                )}
              </>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
