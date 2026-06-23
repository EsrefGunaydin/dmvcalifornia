import base from './road-signs-test.json';
import esQ from './road-signs-es.json';
import type { SignQuestion } from '@/components/SignQuiz';

// Languages with a translated road-signs test. Extend this union + the registry
// as each language is added; the routes, pills, and sitemap pick it up.
export type RoadSignLang = 'es';

interface TranslatedQuestion {
  id: number;
  question: string;
  options: string[];
  explanation: string;
}

export interface RoadSignLangConfig {
  code: RoadSignLang;
  nativeName: string;
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  badge: string;
  factsHeading: string;
  keepStudying: string;
  labels: { answered: string; correct: string; pickPrompt: string; correctWord: string; answerWord: string };
  faq: { q: string; a: string }[];
  questions: TranslatedQuestion[];
}

const baseQuestions = base.questions as { id: number; image: string; correctAnswer: number }[];

export const ROAD_SIGN_LANGUAGES: Record<RoadSignLang, RoadSignLangConfig> = {
  es: {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish',
    flag: '🇪🇸',
    dir: 'ltr',
    metaTitle: 'Examen de Señales de Tránsito del DMV de California 2026 (Gratis) | DMV California',
    metaDescription:
      'Examen gratuito de señales de tránsito del DMV de California en español, con imágenes reales. Identifica cada señal y obtén la respuesta y una explicación al instante.',
    h1: 'Examen de Señales de Tránsito del DMV de California',
    intro:
      'Mira cada señal de tránsito real de California, elige lo que significa y obtén la respuesta con una breve explicación al instante.',
    badge: '38 señales reales · gratis',
    factsHeading: 'Practica las señales',
    keepStudying: 'Sigue estudiando',
    labels: {
      answered: 'Respondidas',
      correct: 'correctas',
      pickPrompt: 'Elige una respuesta para ver el significado.',
      correctWord: '¡Correcto!',
      answerWord: 'Respuesta:',
    },
    faq: [
      {
        q: '¿Cuántas preguntas de señales hay en el examen del DMV de California?',
        a: 'Las señales y los semáforos representan aproximadamente una cuarta parte del examen escrito de 46 preguntas del DMV de California. Reconocer las señales de un vistazo es una de las formas más rápidas de subir tu puntaje.',
      },
      {
        q: '¿Cuáles son los tres tipos principales de señales de tránsito?',
        a: 'Señales reglamentarias (lo que debe o no debe hacer, como alto y límites de velocidad), señales de advertencia (rombos amarillos que alertan de peligros más adelante) y señales informativas (direcciones, distancias y servicios).',
      },
      {
        q: '¿Este examen de señales de tránsito es gratuito?',
        a: 'Sí. Este examen es 100% gratuito, usa imágenes de señales reales y te da la respuesta correcta con una breve explicación para cada señal. Puedes repetirlo todas las veces que quieras.',
      },
    ],
    questions: esQ.questions,
  },
};

export const ROAD_SIGN_LANG_CODES = Object.keys(ROAD_SIGN_LANGUAGES) as RoadSignLang[];

export function getRoadSignLang(code: string): RoadSignLangConfig | undefined {
  return ROAD_SIGN_LANGUAGES[code as RoadSignLang];
}

/** Merge translated text with the shared base image + correctAnswer. */
export function getSignQuestions(code: RoadSignLang): SignQuestion[] {
  const cfg = ROAD_SIGN_LANGUAGES[code];
  return cfg.questions.map((q) => {
    const b = baseQuestions.find((x) => x.id === q.id)!;
    return {
      id: q.id,
      image: b.image,
      correctAnswer: b.correctAnswer,
      question: q.question,
      options: q.options,
      explanation: q.explanation,
    };
  });
}

/** Language pills shown on every road-signs page (English + all translated). */
export interface RoadSignPill {
  code: string;
  label: string;
  flag: string;
  href: string;
}
export function roadSignPills(): RoadSignPill[] {
  return [
    { code: 'en', label: 'English', flag: '🇺🇸', href: '/california-dmv-road-signs-test' },
    ...ROAD_SIGN_LANG_CODES.map((code) => {
      const c = ROAD_SIGN_LANGUAGES[code];
      return {
        code,
        label: c.nativeName,
        flag: c.flag,
        href: `/california-dmv-road-signs-test/${code}`,
      };
    }),
  ];
}
