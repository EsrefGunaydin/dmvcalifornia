import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

// GET: Retrieve the view count for a specific blog post (?slug=...),
// or, with no slug, every tracked post's live view count in one round trip
// (used by the blog list to sort by real-time views instead of the static
// snapshot baked into blog_posts.json).
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

    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const collection = db.collection('blog_views');

    if (!slug) {
      const records = await collection
        .find({}, { projection: { _id: 0, slug: 1, views: 1 } })
        .toArray();
      const views = Object.fromEntries(
        records.map(r => [r.slug, r.views || 0])
      );
      return NextResponse.json({ views }, { status: 200 });
    }

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
