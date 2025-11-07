import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Check if MongoDB URI is configured
    console.log('Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV
    });

    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { quizId, name, email, percentage, points, completedAt } = body;

    // Validate input
    if (!quizId || !name || percentage === undefined || points === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    // Create new leaderboard entry
    const newEntry = {
      quizId: quizId, // Store the quizId as-is (can be string or number)
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      name: name.trim().substring(0, 50), // Limit name length
      email: email ? email.trim().substring(0, 100) : '',
      points: Math.round(points),
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      completedAt: completedAt || new Date().toISOString(),
      createdAt: new Date(),
    };

    // Insert into MongoDB
    const result = await collection.insertOne(newEntry);

    return NextResponse.json(
      {
        success: true,
        entry: { ...newEntry, _id: result.insertedId },
        message: 'Score added to leaderboard successfully!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to add score to leaderboard' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    // Get quizId from query params if provided
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    // Build query - try to match quizId as either string or number
    let query = {};
    if (quizId) {
      // Try to parse as number, but also support string IDs
      const numericQuizId = parseInt(quizId);
      if (!isNaN(numericQuizId)) {
        // If it's a valid number, match either number or string form
        query = { $or: [{ quizId: numericQuizId }, { quizId: quizId }] };
      } else {
        // If it's a string ID, just match the string
        query = { quizId: quizId };
      }
    }

    // Fetch leaderboard entries, sorted by percentage (desc) then by date (asc)
    const entries = await collection
      .find(query)
      .sort({ percentage: -1, completedAt: 1 })
      .toArray();

    // Convert MongoDB documents to plain objects
    const leaderboard = entries.map((entry: any) => ({
      id: entry._id.toString(),
      quizId: entry.quizId,
      date: entry.date,
      name: entry.name,
      email: entry.email || '',
      points: entry.points,
      percentage: entry.percentage,
      completedAt: entry.completedAt,
    }));

    return NextResponse.json(
      { leaderboard },
      { status: 200 }
    );
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
