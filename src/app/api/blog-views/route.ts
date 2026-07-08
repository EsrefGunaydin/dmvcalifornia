import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

// GET: Retrieve view count for a specific blog post
export async function GET(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slug = String(searchParams.get('slug') || '');

    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const collection = db.collection('blog_views');

    // $eq prevents NoSQL operator injection via crafted slug values
    const viewRecord = await collection.findOne({ slug: { $eq: slug } });

    return NextResponse.json(
      {
        slug,
        views: viewRecord?.views || 0
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blog views GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch view count' },
      { status: 500 }
    );
  }
}

// POST: Increment view count for a blog post
export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const slug = typeof body?.slug === 'string' ? body.slug : '';

    if (!slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const collection = db.collection('blog_views');

    const result = await collection.findOneAndUpdate(
      { slug: { $eq: slug } },
      {
        $inc: { views: 1 },
        $set: { lastViewed: new Date() },
        $setOnInsert: {
          slug,
          createdAt: new Date()
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    return NextResponse.json(
      {
        success: true,
        slug,
        views: result?.views || 1
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blog views POST error:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}
