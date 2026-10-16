import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import quizzesData from '@/data/quizzes.json';

// Internal tool only, screenshotted by the video pipeline's Playwright script
// (scripts/video-pipeline/). Never linked from site nav/sitemap; disabled
// outside local dev so it never becomes a reachable production URL.

const BG = '#080d1f';
const GOLD = '#F4B942';
const GREEN = '#10B981';
const WHITE = '#F5F7FA';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
}

interface Quiz {
  id: string;
  title: string;
  slug: string;
  language?: string;
  questions: QuizQuestion[];
}

function findQuiz(quizId: string): Quiz | undefined {
  const data = quizzesData as unknown as { quizzes: Quiz[] };
  return data.quizzes.find((q) => q.id === quizId || q.slug === quizId);
}

const SLIDE_STRINGS = {
  en: {
    brand: 'CALIFORNIA DMV',
    introSubtitle: (total: number) => `${total} real DMV questions · free practice`,
    outroTitle: 'Take the full practice test free',
    thumbnailSubtitle: (total: number) => `${total} Questions · Pass or Study Free`,
    questionLabel: 'QUESTION',
    qCounter: 'Q',
  },
  es: {
    brand: 'DMV DE CALIFORNIA',
    introSubtitle: (total: number) => `${total} preguntas reales del DMV · practica gratis`,
    outroTitle: 'Haz el examen de practica completo gratis',
    thumbnailSubtitle: (total: number) => `${total} Preguntas · Aprueba o Estudia Gratis`,
    questionLabel: 'PREGUNTA',
    qCounter: 'P',
  },
};

function slideStrings(lang?: string) {
  return SLIDE_STRINGS[lang as keyof typeof SLIDE_STRINGS] ?? SLIDE_STRINGS.en;
}

function Canvas({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: BG,
        color: WHITE,
        fontFamily: '"Arial Black", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 44,
        left: 140,
        right: 140,
        height: 16,
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 999,
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          height: '100%',
          background: GOLD,
          borderRadius: 999,
        }}
      />
    </div>
  );
}

function QCounter({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        right: 70,
        fontSize: 38,
        fontWeight: 700,
        color: GOLD,
        letterSpacing: 1,
      }}
    >
      {label} {current}/{total}
    </div>
  );
}

export default async function VideoRenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ quizId: string }>;
  searchParams: Promise<{ state?: string; q?: string }>;
}) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { quizId } = await params;
  const sp = await searchParams;
  const quiz = findQuiz(quizId);
  if (!quiz) notFound();

  const state = sp.state ?? 'intro';
  const qIndex = sp.q ? parseInt(sp.q, 10) : 0;
  const total = quiz.questions.length;
  const t = slideStrings(quiz.language);

  if (state === 'intro') {
    return (
      <Canvas>
        <div style={{ fontSize: 30, color: GOLD, letterSpacing: 4, marginBottom: 24 }}>
          {t.brand}
        </div>
        <div style={{ fontSize: 64, textAlign: 'center', maxWidth: 1400, lineHeight: 1.2 }}>
          {quiz.title}
        </div>
        <div style={{ marginTop: 40, fontSize: 30, color: 'rgba(255,255,255,0.7)' }}>
          {t.introSubtitle(total)}
        </div>
      </Canvas>
    );
  }

  if (state === 'outro') {
    return (
      <Canvas>
        <div style={{ fontSize: 120, color: GREEN, marginBottom: 30 }}>&#10003;</div>
        <div style={{ fontSize: 56, textAlign: 'center', maxWidth: 1300 }}>
          {t.outroTitle}
        </div>
        <div style={{ marginTop: 30, fontSize: 34, color: GOLD }}>dmvcalifornia.us</div>
      </Canvas>
    );
  }

  if (state === 'thumbnail') {
    return (
      <Canvas>
        <div style={{ fontSize: 34, color: GOLD, letterSpacing: 4, marginBottom: 20 }}>
          {t.brand}
        </div>
        <div style={{ fontSize: 96, textAlign: 'center', maxWidth: 1500, lineHeight: 1.15 }}>
          {quiz.title}
        </div>
        <div style={{ marginTop: 50, fontSize: 44, color: GREEN }}>
          {t.thumbnailSubtitle(total)}
        </div>
      </Canvas>
    );
  }

  const question = quiz.questions[qIndex];
  if (!question) notFound();

  if (state === 'number') {
    return (
      <Canvas>
        <div style={{ fontSize: 40, color: GOLD, marginBottom: 20 }}>{t.questionLabel}</div>
        <div style={{ fontSize: 260, lineHeight: 1 }}>{qIndex + 1}</div>
        <QCounter current={qIndex + 1} total={total} label={t.qCounter} />
        <ProgressBar pct={(qIndex / total) * 100} />
      </Canvas>
    );
  }

  const showReveal = state === 'reveal';

  // Fill the frame: the earlier layout left the top and bottom thirds empty
  // and set the options at 34px, which reads small on a phone. Sizes step
  // down by how many lines the options will wrap to, so long option sets
  // (up to 145 characters each in the data) still clear the progress bar.
  const CARD_TEXT_WIDTH = 1500;
  const linesAt = (text: string, size: number) =>
    Math.max(1, Math.ceil(text.length / (CARD_TEXT_WIDTH / (size * 0.56))));
  const optionLinesAt = (size: number) =>
    question.options.reduce((sum, o) => sum + linesAt(o, size), 0);
  const optionCount = question.options.length;
  let optionSize = 48;
  if (optionCount > 3 || optionLinesAt(48) > 4) optionSize = 42;
  if (optionLinesAt(optionSize) > 6) optionSize = 36;
  const tight = optionSize === 36 || (optionCount > 3 && optionLinesAt(42) > 5);
  const optionPad = tight ? '20px 40px' : optionCount > 3 ? '26px 44px' : '34px 48px';
  const optionGap = tight ? 18 : optionCount > 3 ? 24 : 32;
  const longQuestion = question.question.length > 110;
  const questionSize = tight ? 48 : longQuestion ? 56 : 66;
  const questionMargin = tight ? 36 : 56;

  return (
    <Canvas>
      {question.category && (
        <div
          style={{
            fontSize: 30,
            color: GOLD,
            letterSpacing: 3,
            marginBottom: 28,
            textTransform: 'uppercase',
          }}
        >
          {question.category}
        </div>
      )}
      <div
        style={{
          fontSize: questionSize,
          textAlign: 'center',
          maxWidth: 1640,
          lineHeight: 1.25,
          marginBottom: questionMargin,
          fontWeight: 400,
        }}
      >
        {question.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: optionGap, width: 1640 }}>
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctAnswer;
          const dim = showReveal && !isCorrect;
          return (
            <div
              key={i}
              style={{
                fontSize: optionSize,
                lineHeight: 1.2,
                padding: optionPad,
                borderRadius: 22,
                border: `4px solid ${showReveal && isCorrect ? GREEN : 'rgba(255,255,255,0.25)'}`,
                background: showReveal && isCorrect ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.05)',
                opacity: dim ? 0.35 : 1,
                fontWeight: 400,
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              <span style={{ color: GOLD, marginRight: 28, flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
              <span>{opt}</span>
            </div>
          );
        })}
      </div>
      <QCounter current={qIndex + 1} total={total} label={t.qCounter} />
      <ProgressBar pct={((qIndex + (showReveal ? 1 : 0.5)) / total) * 100} />
    </Canvas>
  );
}
