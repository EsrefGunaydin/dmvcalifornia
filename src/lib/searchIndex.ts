import blogPostsData from '@/data/blog_posts.json';
import { HUBS } from '@/data/seo-hubs';
import { HANDBOOK_EDITIONS } from '@/data/handbook-editions';
import { SAFETY_EVENTS } from '@/data/events';
import { GUIDE_PAGES } from '@/data/search-pages';
import { getAllFixedQuizzes } from '@/lib/allQuizzes';

export type SearchCategory = 'blog' | 'quiz' | 'hub' | 'handbook' | 'event' | 'guide';

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  category: SearchCategory;
}

const CATEGORY_LABELS: Record<SearchCategory, string> = {
  blog: 'Blog',
  quiz: 'Practice Test',
  hub: 'State / Language',
  handbook: 'Handbook',
  event: 'Safety Event',
  guide: 'Guide',
};

export function categoryLabel(category: SearchCategory): string {
  return CATEGORY_LABELS[category];
}

function buildIndex(): SearchEntry[] {
  const blogEntries: SearchEntry[] = blogPostsData.posts.map((post) => ({
    title: post.title,
    description: post.excerpt || '',
    href: `/${post.slug}`,
    category: 'blog',
  }));

  const quizEntries: SearchEntry[] = getAllFixedQuizzes().map((quiz) => ({
    title: quiz.title,
    description: quiz.description,
    href: `/practice-test/${quiz.slug}`,
    category: 'quiz',
  }));

  const hubEntries: SearchEntry[] = Object.values(HUBS).map((hub) => ({
    title: hub.h1,
    description: hub.metaDescription,
    href: `/${hub.slug}`,
    category: 'hub',
  }));

  const handbookEntries: SearchEntry[] = HANDBOOK_EDITIONS.map((edition) => ({
    title: edition.metaTitle,
    description: edition.metaDescription,
    href: `/california-driver-handbook/${edition.editionSlug}`,
    category: 'handbook',
  }));

  const eventEntries: SearchEntry[] = SAFETY_EVENTS.map((event) => ({
    title: event.metaTitle,
    description: event.metaDescription,
    href: `/events/${event.slug}`,
    category: 'event',
  }));

  const guideEntries: SearchEntry[] = GUIDE_PAGES.map((page) => ({
    title: page.title,
    description: page.description,
    href: page.href,
    category: 'guide',
  }));

  return [...blogEntries, ...quizEntries, ...hubEntries, ...handbookEntries, ...eventEntries, ...guideEntries];
}

export const SEARCH_INDEX: SearchEntry[] = buildIndex();

function scoreEntry(entry: SearchEntry, words: string[]): number {
  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  const fullQuery = words.join(' ');

  if (title === fullQuery) return 100;
  if (title.startsWith(fullQuery)) return 80;

  const titleHits = words.filter((w) => title.includes(w)).length;
  const descriptionHits = words.filter((w) => description.includes(w)).length;
  if (titleHits === 0 && descriptionHits === 0) return 0;

  return titleHits * 10 + descriptionHits * 2;
}

export function searchEntries(query: string, limit = 8): SearchEntry[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return SEARCH_INDEX
    .map((entry) => ({ entry, score: scoreEntry(entry, words) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
