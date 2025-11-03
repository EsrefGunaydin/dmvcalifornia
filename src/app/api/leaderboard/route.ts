import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, name, email, percentage, points, completedAt } = body;

    // Validate input
    if (!quizId || !name || percentage === undefined || points === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read current leaderboard
    const leaderboardPath = path.join(process.cwd(), 'src/data/leaderboard.json');
    const leaderboardContent = fs.readFileSync(leaderboardPath, 'utf-8');
    const leaderboardData = JSON.parse(leaderboardContent);

    // Find quiz ID by slug
    const quizzesPath = path.join(process.cwd(), 'src/data/quizzes.json');
    const quizzesContent = fs.readFileSync(quizzesPath, 'utf-8');
    const quizzesData = JSON.parse(quizzesContent);

    const quizIndex = quizzesData.quizzes.findIndex((q: any) => q.id === quizId);
    const numericQuizId = quizIndex + 1; // Convert to 1-based index

    // Generate new ID (max existing ID + 1)
    const maxId = leaderboardData.leaderboard.reduce(
      (max: number, entry: any) => Math.max(max, entry.id),
      0
    );

    // Create new leaderboard entry
    const newEntry = {
      id: maxId + 1,
      quizId: numericQuizId,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      name: name.trim().substring(0, 50), // Limit name length
      email: email ? email.trim().substring(0, 100) : '',
      points: Math.round(points),
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      completedAt: completedAt || new Date().toISOString(),
    };

    // Add to leaderboard
    leaderboardData.leaderboard.push(newEntry);

    // Sort leaderboard by percentage (desc), then by date (asc)
    leaderboardData.leaderboard.sort((a: any, b: any) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
    });

    // Write back to file
    fs.writeFileSync(
      leaderboardPath,
      JSON.stringify(leaderboardData, null, 2),
      'utf-8'
    );

    return NextResponse.json(
      {
        success: true,
        entry: newEntry,
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

export async function GET() {
  try {
    const leaderboardPath = path.join(process.cwd(), 'src/data/leaderboard.json');
    const leaderboardContent = fs.readFileSync(leaderboardPath, 'utf-8');
    const leaderboardData = JSON.parse(leaderboardContent);

    return NextResponse.json(leaderboardData, { status: 200 });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
