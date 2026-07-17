import { getMongoClient } from '@/lib/mongodb';

export async function fetchLeaderboard(quizId: string | number) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured');
      return [];
    }

    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    // Build query
    let query: any = {};
    if (quizId) {
      const numericQuizId = typeof quizId === 'string' ? parseInt(quizId) : quizId;
      if (!isNaN(numericQuizId)) {
        query = { $or: [{ quizId: numericQuizId }, { quizId: String(quizId) }] };
      } else {
        query = { quizId: quizId };
      }
    }

    const entries = await collection
      .find(query)
      .sort({ percentage: -1, completedAt: 1 })
      .toArray();

    return entries.map((entry: any) => ({
      id: entry._id.toString(),
      quizId: entry.quizId,
      date: entry.date,
      name: entry.name,
      email: entry.email || '',
      points: entry.points,
      percentage: entry.percentage,
      completedAt: entry.completedAt,
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}
