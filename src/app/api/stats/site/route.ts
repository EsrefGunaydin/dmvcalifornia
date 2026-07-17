import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import { getAllFixedQuizzes } from '@/lib/allQuizzes';
import { getBaseViews } from '@/lib/quiz-base-views';
import { PRACTICE_TEST_HUBS } from '@/lib/language-alternates';
import type { QuizLanguage } from '@/types/quiz';

// Real, site-wide activity number for the homepage social-proof badge. No
// synthetic or randomized number — derived the same way the per-quiz
// "X people have practiced this test" badge is (base view estimate + live
// tracked views), just summed across every quiz. Deliberately NOT based on
// the `leaderboard` collection: leaderboard submission is an opt-in form
// (see Results.tsx) that most people who finish a test skip, so a
// leaderboard-derived count would undercount real completions. Cached
// in-memory for a few minutes per warm serverless instance to avoid
// recomputing on every homepage render.

interface SiteStats {
  peoplePracticed: number;
}

let cached: { data: SiteStats; expiresAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function GET() {
  try {
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.data, { status: 200 });
    }

    if (!process.env.MONGODB_URI && !process.env.DMVCALI_MONGODB_URI) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    // Every quiz id that gets a QuizViewTracker badge somewhere on the site:
    // the fixed quizzes plus one simulator pool per language.
    const quizIds = [
      ...getAllFixedQuizzes().map((q) => q.id),
      ...(Object.keys(PRACTICE_TEST_HUBS) as QuizLanguage[]).map((lang) => `simulator-${lang}`),
    ];
    const baseViewsTotal = quizIds.reduce((sum, id) => sum + getBaseViews(id), 0);

    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');

    const liveViewsAgg = await db
      .collection('quiz_views')
      .aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }])
      .toArray();
    const liveViewsTotal = liveViewsAgg[0]?.total || 0;

    const data: SiteStats = { peoplePracticed: baseViewsTotal + liveViewsTotal };
    cached = { data, expiresAt: Date.now() + CACHE_TTL_MS };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Site stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch site stats' }, { status: 500 });
  }
}
