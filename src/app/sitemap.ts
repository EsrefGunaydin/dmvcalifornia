import { MetadataRoute } from 'next';
import blogPostsData from '@/data/blog_posts.json';
import authorsData from '@/data/blog_authors.json';
import quizzesData from '@/data/quizzes.json';
import chineseQuizzesData from '@/data/chinese-quizzes.json';
import arabicQuizzesData from '@/data/arabic-quizzes.json';
import armenianQuizzesData from '@/data/armenian-quizzes.json';
import farsiQuizzesData from '@/data/farsi-quizzes.json';
import punjabiQuizzesData from '@/data/punjabi-quizzes.json';
import russianQuizzesData from '@/data/russian-quizzes.json';
import tagalogQuizzesData from '@/data/tagalog-quizzes.json';
import vietnameseQuizzesData from '@/data/vietnamese-quizzes.json';
import motorcycleQuizzesData from '@/data/motorcycle-quizzes.json';
import commercialQuizzesData from '@/data/commercial-quizzes.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.dmvcalifornia.us';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/practice-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dmv-offices`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dmv-turkish-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-chinese-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-arabic-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-armenian-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-farsi-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-punjabi-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-russian-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-tagalog-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-vietnamese-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/motorcycle-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/commercial-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Blog posts — dynamic changeFrequency + priority based on recency and views.
  // Newer/high-traffic posts signal freshness more aggressively.
  const now = Date.now();
  const DAY = 86_400_000;
  const blogPages: MetadataRoute.Sitemap = blogPostsData.posts.map((post: any) => {
    const ageDays = (now - new Date(post.publishedAt).getTime()) / DAY;
    let changeFrequency: 'weekly' | 'monthly' | 'yearly';
    let priority: number;

    if (ageDays < 30) {
      changeFrequency = 'weekly';
      priority = 0.9;
    } else if (ageDays < 365) {
      changeFrequency = 'monthly';
      priority = 0.8;
    } else {
      changeFrequency = 'yearly';
      priority = 0.6;
    }

    // High-traffic posts bump priority by 0.1 (capped at 0.95)
    if ((post.views || 0) > 15000) {
      priority = Math.min(0.95, priority + 0.1);
    }

    return {
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency,
      priority,
    };
  });

  // Blog category landing pages — one per unique tag
  const allTags = new Set<string>();
  for (const post of blogPostsData.posts) {
    for (const tag of (post.tags as string[] | undefined) || []) {
      allTags.add(tag);
    }
  }
  const categoryPages: MetadataRoute.Sitemap = Array.from(allTags).map((tag) => {
    const slug = tag
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return {
      url: `${baseUrl}/blog/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  // Author bio pages
  const authorPages: MetadataRoute.Sitemap = authorsData.authors.map((author) => ({
    url: `${baseUrl}/blog/author/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Quiz pages (English)
  const quizPages: MetadataRoute.Sitemap = quizzesData.quizzes.map((quiz) => ({
    url: `${baseUrl}/practice-test/${quiz.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Turkish test pages
  const turkishPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/dmv-turkish-test/test-1`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-turkish-test/test-2`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-turkish-test/test-3`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-turkish-test/dmv-california-turkce-trafik-isareti-testi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Chinese quiz pages (dynamically generated from data)
  const chinesePages: MetadataRoute.Sitemap = chineseQuizzesData.quizzes.map((quiz) => ({
    url: `${baseUrl}/practice-test/${quiz.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Newly added languages + license-class quizzes
  const newLanguageQuizzes = [
    ...arabicQuizzesData.quizzes,
    ...armenianQuizzesData.quizzes,
    ...farsiQuizzesData.quizzes,
    ...punjabiQuizzesData.quizzes,
    ...russianQuizzesData.quizzes,
    ...tagalogQuizzesData.quizzes,
    ...vietnameseQuizzesData.quizzes,
    ...motorcycleQuizzesData.quizzes,
    ...commercialQuizzesData.quizzes,
  ];
  const newLanguagePages: MetadataRoute.Sitemap = newLanguageQuizzes.map((quiz) => ({
    url: `${baseUrl}/practice-test/${quiz.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...categoryPages,
    ...authorPages,
    ...quizPages,
    ...turkishPages,
    ...chinesePages,
    ...newLanguagePages,
  ];
}
