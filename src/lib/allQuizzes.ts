import type { Quiz } from '@/types/quiz';

import quizzesData from '@/data/quizzes.json';
import chineseQuizzesData from '@/data/chinese-quizzes.json';
import turkishQuizzesData from '@/data/turkish-quizzes.json';
import turkishSignTestData from '@/data/turkish-sign-test.json';
import spanishSignTestData from '@/data/spanish-sign-test.json';
import arabicQuizzesData from '@/data/arabic-quizzes.json';
import armenianQuizzesData from '@/data/armenian-quizzes.json';
import farsiQuizzesData from '@/data/farsi-quizzes.json';
import punjabiQuizzesData from '@/data/punjabi-quizzes.json';
import russianQuizzesData from '@/data/russian-quizzes.json';
import tagalogQuizzesData from '@/data/tagalog-quizzes.json';
import vietnameseQuizzesData from '@/data/vietnamese-quizzes.json';
import koreanQuizzesData from '@/data/ko-quizzes.json';
import hindiQuizzesData from '@/data/hi-quizzes.json';
import motorcycleQuizzesData from '@/data/motorcycle-quizzes.json';
import commercialQuizzesData from '@/data/commercial-quizzes.json';
import nyQuizzesData from '@/data/ny-quizzes.json';

/** Every fixed, pre-authored quiz across all languages, used by the practice-test
 * hub, individual quiz pages, and wrong-answers review. */
export function getAllFixedQuizzes(): Quiz[] {
  return [
    ...quizzesData.quizzes,
    ...chineseQuizzesData.quizzes,
    ...turkishQuizzesData.quizzes,
    turkishSignTestData.quiz,
    spanishSignTestData.quiz,
    ...arabicQuizzesData.quizzes,
    ...armenianQuizzesData.quizzes,
    ...farsiQuizzesData.quizzes,
    ...punjabiQuizzesData.quizzes,
    ...russianQuizzesData.quizzes,
    ...tagalogQuizzesData.quizzes,
    ...vietnameseQuizzesData.quizzes,
    ...koreanQuizzesData.quizzes,
    ...hindiQuizzesData.quizzes,
    ...motorcycleQuizzesData.quizzes,
    ...commercialQuizzesData.quizzes,
    ...nyQuizzesData.quizzes,
  ] as Quiz[];
}
