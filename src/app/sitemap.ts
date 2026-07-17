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
import koreanQuizzesData from '@/data/ko-quizzes.json';
import hindiQuizzesData from '@/data/hi-quizzes.json';
import turkishQuizzesData from '@/data/turkish-quizzes.json';
import motorcycleQuizzesData from '@/data/motorcycle-quizzes.json';
import commercialQuizzesData from '@/data/commercial-quizzes.json';
import intersectionLevelsData from '@/data/intersection-levels.json';
import officesData from '@/data/dmv_offices.json';
import { FLASHCARD_LANG_CODES, allFlashcardSetParams } from '@/data/flashcards-i18n';
import { ROAD_SIGN_LANG_CODES } from '@/data/road-signs-i18n';
import { REGIONS } from '@/data/dmv-regions';
import { HUB_SLUGS } from '@/data/seo-hubs';
import { HANDBOOK_EDITION_SLUGS } from '@/data/handbook-editions';
import { PRACTICE_TEST_HUBS } from '@/lib/language-alternates';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dmvcalifornia.us';

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
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/intersection`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/practice-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/20-hardest-dmv-written-test-questions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/california-dmv-road-signs-test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/california-dmv-cheat-sheet`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/california-dmv-drug-and-alcohol-test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/defensive-driving`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/california-dmv-parking-test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/california-dmv-speed-limit-test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/california-dmv-fees`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/california-dmv-fee-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/california-dmv-vehicle-registration`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mydmv-california-account-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/california-dmv-bill-of-sale-release-of-liability`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/california-dmv-marathon-test`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/examen-maraton-dmv-espanol`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/california-dmv-test-study-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
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
      url: `${baseUrl}/dmv-korean-test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dmv-hindi-test`,
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
    ...koreanQuizzesData.quizzes,
    ...hindiQuizzesData.quizzes,
    ...turkishQuizzesData.quizzes,
    ...motorcycleQuizzesData.quizzes,
    ...commercialQuizzesData.quizzes,
  ];
  const newLanguagePages: MetadataRoute.Sitemap = newLanguageQuizzes.map((quiz) => ({
    url: `${baseUrl}/practice-test/${quiz.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Intersection puzzle game levels
  const intersectionPages: MetadataRoute.Sitemap = intersectionLevelsData.levels.map((lvl) => ({
    url: `${baseUrl}/intersection/${lvl.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Flashcards — English index + 5 sets, each language's set index, and every
  // localized deck (lang × set)
  const flashcardPages: MetadataRoute.Sitemap = [
    `${baseUrl}/practice-test/flashcards`,
    `${baseUrl}/practice-test/flashcards/set-1`,
    `${baseUrl}/practice-test/flashcards/set-2`,
    `${baseUrl}/practice-test/flashcards/set-3`,
    `${baseUrl}/practice-test/flashcards/set-4`,
    `${baseUrl}/practice-test/flashcards/set-5`,
    ...FLASHCARD_LANG_CODES.map((code) => `${baseUrl}/practice-test/flashcards/${code}`),
    ...allFlashcardSetParams().map(
      ({ lang, set }) => `${baseUrl}/practice-test/flashcards/${lang}/${set}`
    ),
  ].map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Practice Test Simulator — one random-draw page per supported language.
  const simulatorPages: MetadataRoute.Sitemap = Object.keys(PRACTICE_TEST_HUBS).map((lang) => ({
    url: `${baseUrl}/practice-test/simulator/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // DMV field office pages (e.g. /california-dmv-alturas-office). These are
  // generated from dmv_offices.json via the [slug] route but were missing from
  // the sitemap — high-intent local pages that need to be discoverable.
  const officePages: MetadataRoute.Sitemap = officesData.offices.map((office: { slug: string }) => ({
    url: `${baseUrl}/${office.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Localized road-signs test pages (e.g. /california-dmv-road-signs-test/es)
  const roadSignLangPages: MetadataRoute.Sitemap = ROAD_SIGN_LANG_CODES.map((code) => ({
    url: `${baseUrl}/california-dmv-road-signs-test/${code}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Regional DMV office hub pages (e.g. /dmv-offices/los-angeles)
  const regionPages: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${baseUrl}/dmv-offices/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Keyword SEO hub pages (e.g. /california-dmv-practice-test)
  const hubPages: MetadataRoute.Sitemap = HUB_SLUGS.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // California Driver Handbook hub + per-language pages
  const handbookPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/california-driver-handbook`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    ...HANDBOOK_EDITION_SLUGS.map((slug) => ({
      url: `${baseUrl}/california-driver-handbook/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return [
    ...staticPages,
    ...hubPages,
    ...handbookPages,
    ...roadSignLangPages,
    ...regionPages,
    ...blogPages,
    ...categoryPages,
    ...authorPages,
    ...quizPages,
    ...turkishPages,
    ...chinesePages,
    ...newLanguagePages,
    ...intersectionPages,
    ...flashcardPages,
    ...simulatorPages,
    ...officePages,
  ];
}
