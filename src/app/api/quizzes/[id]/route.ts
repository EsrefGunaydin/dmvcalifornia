import { NextResponse } from 'next/server';
import quizzesData from '@/data/quizzes.json';
import turkishQuizzesData from '@/data/turkish-quizzes.json';
import spanishSignTestData from '@/data/spanish-sign-test.json';
import chineseQuizzesData from '@/data/chinese-quizzes.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Combine all quizzes (English, Turkish, Spanish, Chinese)
    // Note: Spanish quiz data has different structure (single quiz object vs array)
    const spanishQuiz = spanishSignTestData.quiz ? [spanishSignTestData.quiz] : [];
    const allQuizzes = [
      ...quizzesData.quizzes,
      ...turkishQuizzesData.quizzes,
      ...spanishQuiz,
      ...chineseQuizzesData.quizzes,
    ];

    // Find the quiz by ID
    const quiz = allQuizzes.find(q => q.id === id);

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
