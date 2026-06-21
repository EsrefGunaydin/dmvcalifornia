import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

// Live view counts for quizzes. These are ADDED on top of the base estimates in
// src/lib/quiz-base-views.ts. Mirrors the blog_views pattern.

// GET: return the live (incremental) view count for a quiz
export async function GET(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    if (!quizId) {
      return NextResponse.json({ error: 'quizId is required' }, { status: 400 });
    }

    const client = await getMongoClient();
    const collection = client.db('dmvcalifornia').collection('quiz_views');
    const record = await collection.findOne({ quizId });

    return NextResponse.json({ quizId, views: record?.views || 0 }, { status: 200 });
  } catch (error) {
    console.error('Quiz views GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
  }
}

// POST: increment the live view count for a quiz
export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
    }

    const { quizId } = await request.json();
    if (!quizId) {
      return NextResponse.json({ error: 'quizId is required' }, { status: 400 });
    }

    const client = await getMongoClient();
    const collection = client.db('dmvcalifornia').collection('quiz_views');

    const result = await collection.findOneAndUpdate(
      { quizId },
      {
        $inc: { views: 1 },
        $set: { lastViewed: new Date() },
        $setOnInsert: { quizId, createdAt: new Date() },
      },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, quizId, views: result?.views || 1 }, { status: 200 });
  } catch (error) {
    console.error('Quiz views POST error:', error);
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
  }
}
