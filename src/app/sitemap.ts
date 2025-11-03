import { MetadataRoute } from 'next';
import blogPostsData from '@/data/blog_posts.json';
import quizzesData from '@/data/quizzes.json';

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
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = blogPostsData.posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
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
  ];

  return [...staticPages, ...blogPages, ...quizPages, ...turkishPages];
}
