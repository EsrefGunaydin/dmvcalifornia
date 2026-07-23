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
        bottom: 60,
        left: 160,
        right: 160,
        height: 14,
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
        top: 50,
        right: 70,
        fontSize: 32,
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

  return (
    <Canvas>
      {question.category && (
        <div
          style={{
            fontSize: 26,
            color: GOLD,
            letterSpacing: 2,
            marginBottom: 30,
            textTransform: 'uppercase',
          }}
        >
          {question.category}
        </div>
      )}
      <div
        style={{
          fontSize: 48,
          textAlign: 'center',
          maxWidth: 1500,
          lineHeight: 1.35,
          marginBottom: 60,
          fontWeight: 400,
        }}
      >
        {question.question}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 1300 }}>
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctAnswer;
          const dim = showReveal && !isCorrect;
          return (
            <div
              key={i}
              style={{
                fontSize: 34,
                padding: '22px 36px',
                borderRadius: 16,
                border: `3px solid ${showReveal && isCorrect ? GREEN : 'rgba(255,255,255,0.25)'}`,
                background: showReveal && isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                opacity: dim ? 0.35 : 1,
                fontWeight: 400,
              }}
            >
              <span style={{ color: GOLD, marginRight: 20 }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </div>
          );
        })}
      </div>
      <QCounter current={qIndex + 1} total={total} label={t.qCounter} />
      <ProgressBar pct={((qIndex + (showReveal ? 1 : 0.5)) / total) * 100} />
    </Canvas>
  );
}
