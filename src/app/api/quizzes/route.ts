import { NextResponse } from 'next/server';
import quizzesData from '@/data/quizzes.json';
import turkishQuizzesData from '@/data/turkish-quizzes.json';
import spanishSignTestData from '@/data/spanish-sign-test.json';
import chineseQuizzesData from '@/data/chinese-quizzes.json';

export async function GET(request: Request) {
  try {
    // Get query parameter to optionally include full questions (for mobile app)
    const { searchParams } = new URL(request.url);
    const includeQuestions = searchParams.get('includeQuestions') === 'true';

    // Combine all quizzes (English, Turkish, Spanish, Chinese)
    // Note: Spanish quiz data has different structure (single quiz object vs array)
    const spanishQuiz = spanishSignTestData.quiz ? [spanishSignTestData.quiz] : [];
    const allQuizzes = [
      ...quizzesData.quizzes,
      ...turkishQuizzesData.quizzes,
      ...spanishQuiz,
      ...chineseQuizzesData.quizzes,
    ];

    // Transform quizzes based on query parameter
    const quizzes = allQuizzes.map(quiz => {
      if (includeQuestions) {
        // Return full quiz with questions (for mobile app)
        return quiz;
      } else {
        // Return metadata only (for website)
        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          slug: quiz.slug,
          questionsCount: quiz.questions.length,
          category: quiz.category,
          passingScore: quiz.passingScore,
          timeLimit: quiz.timeLimit,
        };
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
