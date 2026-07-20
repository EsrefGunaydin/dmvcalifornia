import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { quizId, name, email, marketingConsent, percentage, points, secondaryPoints, completedAt, idempotencyKey } = body;

    // Validate input
    if (!quizId || !name || percentage === undefined || points === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    const trimmedEmail = email ? email.trim().substring(0, 100) : '';

    // Create new leaderboard entry
    const newEntry = {
      quizId: quizId,
      date: new Date().toISOString().split('T')[0],
      name: name.trim().substring(0, 50),
      email: trimmedEmail,
      // Only store consent when an email was actually provided
      marketingConsent: trimmedEmail ? marketingConsent === true : false,
      points: Math.round(points),
      percentage: Math.round(percentage * 10) / 10,
      completedAt: completedAt || new Date().toISOString(),
      createdAt: new Date(),
      ...(idempotencyKey ? { idempotencyKey: String(idempotencyKey).substring(0, 64) } : {}),
      // Optional secondary stat, display-only (never used for ranking/sort).
      // Meaning is game-defined — e.g. the Reaction Test stores average ms
      // here while `points` holds the best ms. Absent for games that don't
      // need a second number; existing callers are unaffected.
      ...(secondaryPoints !== undefined ? { secondaryPoints: Math.round(secondaryPoints) } : {}),
    };

    // Use idempotency key to make retries safe: $setOnInsert is a no-op if the
    // document already exists, so a retry with the same key won't create duplicates.
    const filter = idempotencyKey
      ? { idempotencyKey: String(idempotencyKey).substring(0, 64) }
      : { quizId, name: newEntry.name, completedAt: newEntry.completedAt };

    const result = await collection.updateOne(
      filter,
      { $setOnInsert: newEntry },
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: result.upsertedCount > 0
          ? 'Score added to leaderboard successfully!'
          : 'Score already recorded.',
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
    // Optional: aggregate across every daily bucket for a game instead of one
    // day, e.g. quizIdPrefix=reaction-test- matches reaction-test-2026-07-20,
    // reaction-test-2026-07-21, etc. Read-only — the write path is unchanged,
    // so this is purely a different way of querying documents that already
    // exist from ordinary daily submissions.
    const quizIdPrefix = searchParams.get('quizIdPrefix');

    // Connect to MongoDB
    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    if (quizIdPrefix) {
      // Escape regex metacharacters — quizIdPrefix is caller-controlled input.
      const escaped = quizIdPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const entries = await collection
        .find({ quizId: { $regex: `^${escaped}` } })
        .sort({ percentage: -1 })
        .limit(2000)
        .toArray();

      // All-time board = each player's personal best across every day.
      // Ranked by `percentage`, the same higher-is-better normalized field
      // every game's leaderboard already sorts by (see percentageFromMoves /
      // percentageFromReaction / percentageFromAttempts) — not raw `points`,
      // whose "better" direction varies per game (lower ms vs. higher score).
      // "name" is freeform (no accounts), so two different people using the
      // same name will merge into one entry here — an accepted tradeoff for
      // a no-signup casual leaderboard.
      const bestByName = new Map<string, (typeof entries)[number]>();
      for (const entry of entries) {
        const existing = bestByName.get(entry.name);
        if (!existing || entry.percentage > existing.percentage) {
          bestByName.set(entry.name, entry);
        }
      }
      const leaderboard = Array.from(bestByName.values())
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 50)
        .map((entry: any) => ({
          id: entry._id.toString(),
          quizId: entry.quizId,
          date: entry.date,
          name: entry.name,
          points: entry.points,
          percentage: entry.percentage,
          secondaryPoints: entry.secondaryPoints,
          completedAt: entry.completedAt,
        }));

      return NextResponse.json({ leaderboard }, { status: 200 });
    }

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

    // Convert MongoDB documents to plain objects.
    // Email is intentionally omitted — it is PII and callers only need the
    // public fields (name, score, date) to render the leaderboard.
    const leaderboard = entries.map((entry: any) => ({
      id: entry._id.toString(),
      quizId: entry.quizId,
      date: entry.date,
      name: entry.name,
      points: entry.points,
      percentage: entry.percentage,
      secondaryPoints: entry.secondaryPoints,
      completedAt: entry.completedAt,
    }));

    return NextResponse.json(
      { leaderboard },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Leaderboard GET error:', error?.message);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
