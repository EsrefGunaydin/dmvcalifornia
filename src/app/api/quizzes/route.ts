import { NextResponse } from 'next/server';
import quizzesData from '@/data/quizzes.json';

export async function GET() {
  try {
    // Transform quizzes data to include questionsCount without exposing all questions
    const quizzes = quizzesData.quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      slug: quiz.slug,
      questionsCount: quiz.questions.length,
      category: quiz.category,
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
    }));

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
