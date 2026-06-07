import es1 from './flashcards-es-1.json';
import es2 from './flashcards-es-2.json';
import tr1 from './flashcards-tr-1.json';
import tr2 from './flashcards-tr-2.json';
import zh1 from './flashcards-zh-1.json';
import zh2 from './flashcards-zh-2.json';
import ar1 from './flashcards-ar-1.json';
import ar2 from './flashcards-ar-2.json';
import hy1 from './flashcards-hy-1.json';
import hy2 from './flashcards-hy-2.json';
import fa1 from './flashcards-fa-1.json';
import fa2 from './flashcards-fa-2.json';
import pa1 from './flashcards-pa-1.json';
import pa2 from './flashcards-pa-2.json';
import ru1 from './flashcards-ru-1.json';
import ru2 from './flashcards-ru-2.json';
import tl1 from './flashcards-tl-1.json';
import tl2 from './flashcards-tl-2.json';
import vi1 from './flashcards-vi-1.json';
import vi2 from './flashcards-vi-2.json';

export type FlashcardLang =
  | 'es'
  | 'tr'
  | 'zh'
  | 'ar'
  | 'hy'
  | 'fa'
  | 'pa'
  | 'ru'
  | 'tl'
  | 'vi';

export interface FlashcardCard {
  id: number;
  question: string;
  answer: string;
  questionEn?: string;
  answerEn?: string;
}

export interface FlashcardSet {
  flashcards: {
    id: string;
    language: string;
    title: string;
    description: string;
    category: string;
    slug: string;
    cards: FlashcardCard[];
  };
}

/** UI strings used by the flashcard deck, the set index, and the CTAs. */
export interface FlashcardLabels {
  question: string;
  answer: string;
  flipToAnswer: string;
  flipToQuestion: string;
  card: string;
  of: string;
  complete: string;
  previous: string;
  next: string;
  reset: string;
  startOver: string;
  backToTests: string;
  ctaHeading: string;
  ctaSubtext: string;
  ctaButton: string;
  chooseSet: string;
  cards: string;
}

export interface FlashcardLangConfig {
  code: FlashcardLang;
  nativeName: string;
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  /** Localized hub page these flashcards belong to (e.g. /dmv-punjabi-test). */
  hubHref: string;
  gradient: string;
  /** All flashcard sets for this language, in order (set 1, set 2, ...). */
  sets: FlashcardSet[];
  labels: FlashcardLabels;
}

export const FLASHCARD_LANGUAGES: Record<FlashcardLang, FlashcardLangConfig> = {
  es: {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish',
    flag: '🇪🇸',
    dir: 'ltr',
    hubHref: '/muestra-del-examen-escrito-para-licencia-de-manejar',
    gradient: 'from-red-600 to-yellow-500',
    sets: [es1 as FlashcardSet, es2 as FlashcardSet],
    labels: {
      question: 'Pregunta',
      answer: 'Respuesta',
      flipToAnswer: 'Haz clic para ver la respuesta',
      flipToQuestion: 'Haz clic para ver la pregunta',
      card: 'Tarjeta',
      of: 'de',
      complete: 'Completado',
      previous: 'Anterior',
      next: 'Siguiente',
      reset: 'Reiniciar',
      startOver: 'Empezar de nuevo',
      backToTests: 'Volver a los exámenes de práctica',
      ctaHeading: 'Estudia con tarjetas didácticas',
      ctaSubtext: 'Domina preguntas esenciales del DMV a tu propio ritmo, en español e inglés.',
      ctaButton: 'Estudiar tarjetas',
      chooseSet: 'Elige un conjunto de tarjetas',
      cards: 'tarjetas',
    },
  },
  tr: {
    code: 'tr',
    nativeName: 'Türkçe',
    englishName: 'Turkish',
    flag: '🇹🇷',
    dir: 'ltr',
    hubHref: '/dmv-turkish-test',
    gradient: 'from-red-600 to-rose-500',
    sets: [tr1 as FlashcardSet, tr2 as FlashcardSet],
    labels: {
      question: 'Soru',
      answer: 'Cevap',
      flipToAnswer: 'Cevabı görmek için tıklayın',
      flipToQuestion: 'Soruyu görmek için tıklayın',
      card: 'Kart',
      of: '/',
      complete: 'Tamamlandı',
      previous: 'Önceki',
      next: 'Sonraki',
      reset: 'Sıfırla',
      startOver: 'Baştan başla',
      backToTests: 'Pratik testlere geri dön',
      ctaHeading: 'Bilgi kartlarıyla çalış',
      ctaSubtext: 'Temel DMV sorularını Türkçe ve İngilizce olarak kendi hızında öğren.',
      ctaButton: 'Kartlarla çalış',
      chooseSet: 'Bir kart seti seç',
      cards: 'kart',
    },
  },
  zh: {
    code: 'zh',
    nativeName: '中文',
    englishName: 'Chinese',
    flag: '🇨🇳',
    dir: 'ltr',
    hubHref: '/dmv-chinese-test',
    gradient: 'from-red-600 to-red-700',
    sets: [zh1 as FlashcardSet, zh2 as FlashcardSet],
    labels: {
      question: '问题',
      answer: '答案',
      flipToAnswer: '点击查看答案',
      flipToQuestion: '点击查看问题',
      card: '卡片',
      of: '/',
      complete: '完成',
      previous: '上一个',
      next: '下一个',
      reset: '重置',
      startOver: '重新开始',
      backToTests: '返回练习测试',
      ctaHeading: '用学习卡复习',
      ctaSubtext: '用中文和英文，按自己的节奏掌握核心 DMV 题目。',
      ctaButton: '开始学习',
      chooseSet: '选择一组学习卡',
      cards: '张卡片',
    },
  },
  ar: {
    code: 'ar',
    nativeName: 'العربية',
    englishName: 'Arabic',
    flag: '🇸🇦',
    dir: 'rtl',
    hubHref: '/dmv-arabic-test',
    gradient: 'from-green-600 to-emerald-600',
    sets: [ar1 as FlashcardSet, ar2 as FlashcardSet],
    labels: {
      question: 'سؤال',
      answer: 'إجابة',
      flipToAnswer: 'انقر لرؤية الإجابة',
      flipToQuestion: 'انقر لرؤية السؤال',
      card: 'البطاقة',
      of: 'من',
      complete: 'مكتمل',
      previous: 'السابق',
      next: 'التالي',
      reset: 'إعادة',
      startOver: 'ابدأ من جديد',
      backToTests: 'العودة إلى اختبارات التدريب',
      ctaHeading: 'ادرس بالبطاقات التعليمية',
      ctaSubtext: 'أتقن أسئلة DMV الأساسية بالعربية والإنجليزية بالوتيرة التي تناسبك.',
      ctaButton: 'ابدأ الدراسة',
      chooseSet: 'اختر مجموعة بطاقات',
      cards: 'بطاقة',
    },
  },
  hy: {
    code: 'hy',
    nativeName: 'Հայերեն',
    englishName: 'Armenian',
    flag: '🇦🇲',
    dir: 'ltr',
    hubHref: '/dmv-armenian-test',
    gradient: 'from-blue-600 to-orange-500',
    sets: [hy1 as FlashcardSet, hy2 as FlashcardSet],
    labels: {
      question: 'Հարց',
      answer: 'Պատասխան',
      flipToAnswer: 'Սեղմեք պատասխանը տեսնելու համար',
      flipToQuestion: 'Սեղմեք հարցը տեսնելու համար',
      card: 'Քարտ',
      of: '/',
      complete: 'ավարտված',
      previous: 'Նախորդ',
      next: 'Հաջորդ',
      reset: 'Վերականգնել',
      startOver: 'Սկսել նորից',
      backToTests: 'Վերադառնալ պրակտիկ թեստերին',
      ctaHeading: 'Սովորիր քարտերով',
      ctaSubtext: 'Յուրացրու DMV-ի հիմնական հարցերը հայերեն և անգլերեն՝ քո տեմպով։',
      ctaButton: 'Սկսել',
      chooseSet: 'Ընտրիր քարտերի հավաքածու',
      cards: 'քարտ',
    },
  },
  fa: {
    code: 'fa',
    nativeName: 'فارسی',
    englishName: 'Farsi',
    flag: '🇮🇷',
    dir: 'rtl',
    hubHref: '/dmv-farsi-test',
    gradient: 'from-emerald-600 to-teal-600',
    sets: [fa1 as FlashcardSet, fa2 as FlashcardSet],
    labels: {
      question: 'سؤال',
      answer: 'پاسخ',
      flipToAnswer: 'برای دیدن پاسخ کلیک کنید',
      flipToQuestion: 'برای دیدن سؤال کلیک کنید',
      card: 'کارت',
      of: 'از',
      complete: 'تکمیل شده',
      previous: 'قبلی',
      next: 'بعدی',
      reset: 'بازنشانی',
      startOver: 'شروع دوباره',
      backToTests: 'بازگشت به آزمون‌های تمرینی',
      ctaHeading: 'با کارت‌های آموزشی مطالعه کنید',
      ctaSubtext: 'سؤالات اساسی DMV را به فارسی و انگلیسی با سرعت خودتان یاد بگیرید.',
      ctaButton: 'شروع مطالعه',
      chooseSet: 'یک مجموعه کارت انتخاب کنید',
      cards: 'کارت',
    },
  },
  pa: {
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    flag: '🇮🇳',
    dir: 'ltr',
    hubHref: '/dmv-punjabi-test',
    gradient: 'from-orange-500 to-yellow-500',
    sets: [pa1 as FlashcardSet, pa2 as FlashcardSet],
    labels: {
      question: 'ਪ੍ਰਸ਼ਨ',
      answer: 'ਜਵਾਬ',
      flipToAnswer: 'ਜਵਾਬ ਦੇਖਣ ਲਈ ਕਲਿੱਕ ਕਰੋ',
      flipToQuestion: 'ਪ੍ਰਸ਼ਨ ਦੇਖਣ ਲਈ ਕਲਿੱਕ ਕਰੋ',
      card: 'ਕਾਰਡ',
      of: '/',
      complete: 'ਪੂਰਾ',
      previous: 'ਪਿਛਲਾ',
      next: 'ਅਗਲਾ',
      reset: 'ਰੀਸੈੱਟ',
      startOver: 'ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ',
      backToTests: 'ਅਭਿਆਸ ਟੈਸਟਾਂ ਵੱਲ ਵਾਪਸ ਜਾਓ',
      ctaHeading: 'ਫਲੈਸ਼ਕਾਰਡ ਨਾਲ ਪੜ੍ਹੋ',
      ctaSubtext: 'ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਾਲ ਜ਼ਰੂਰੀ DMV ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਮੁਹਾਰਤ ਹਾਸਲ ਕਰੋ — ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ।',
      ctaButton: 'ਪੜ੍ਹਨਾ ਸ਼ੁਰੂ ਕਰੋ',
      chooseSet: 'ਇੱਕ ਫਲੈਸ਼ਕਾਰਡ ਸੈੱਟ ਚੁਣੋ',
      cards: 'ਕਾਰਡ',
    },
  },
  ru: {
    code: 'ru',
    nativeName: 'Русский',
    englishName: 'Russian',
    flag: '🇷🇺',
    dir: 'ltr',
    hubHref: '/dmv-russian-test',
    gradient: 'from-blue-600 to-indigo-600',
    sets: [ru1 as FlashcardSet, ru2 as FlashcardSet],
    labels: {
      question: 'Вопрос',
      answer: 'Ответ',
      flipToAnswer: 'Нажмите, чтобы увидеть ответ',
      flipToQuestion: 'Нажмите, чтобы увидеть вопрос',
      card: 'Карточка',
      of: 'из',
      complete: 'выполнено',
      previous: 'Назад',
      next: 'Вперёд',
      reset: 'Сбросить',
      startOver: 'Начать заново',
      backToTests: 'Вернуться к пробным тестам',
      ctaHeading: 'Учитесь по карточкам',
      ctaSubtext: 'Освойте основные вопросы DMV на русском и английском в своём темпе.',
      ctaButton: 'Начать',
      chooseSet: 'Выберите набор карточек',
      cards: 'карточек',
    },
  },
  tl: {
    code: 'tl',
    nativeName: 'Tagalog',
    englishName: 'Tagalog',
    flag: '🇵🇭',
    dir: 'ltr',
    hubHref: '/dmv-tagalog-test',
    gradient: 'from-blue-700 to-sky-500',
    sets: [tl1 as FlashcardSet, tl2 as FlashcardSet],
    labels: {
      question: 'Tanong',
      answer: 'Sagot',
      flipToAnswer: 'I-click para makita ang sagot',
      flipToQuestion: 'I-click para makita ang tanong',
      card: 'Kard',
      of: 'ng',
      complete: 'Tapos na',
      previous: 'Nakaraan',
      next: 'Susunod',
      reset: 'I-reset',
      startOver: 'Magsimula muli',
      backToTests: 'Bumalik sa mga practice test',
      ctaHeading: 'Mag-aral gamit ang flashcards',
      ctaSubtext: 'Masteryn ang mahahalagang tanong sa DMV sa Tagalog at Ingles sa sarili mong bilis.',
      ctaButton: 'Mag-aral na',
      chooseSet: 'Pumili ng set ng flashcard',
      cards: 'kard',
    },
  },
  vi: {
    code: 'vi',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    flag: '🇻🇳',
    dir: 'ltr',
    hubHref: '/dmv-vietnamese-test',
    gradient: 'from-red-700 to-amber-500',
    sets: [vi1 as FlashcardSet, vi2 as FlashcardSet],
    labels: {
      question: 'Câu hỏi',
      answer: 'Đáp án',
      flipToAnswer: 'Nhấp để xem đáp án',
      flipToQuestion: 'Nhấp để xem câu hỏi',
      card: 'Thẻ',
      of: '/',
      complete: 'Hoàn thành',
      previous: 'Trước',
      next: 'Tiếp',
      reset: 'Đặt lại',
      startOver: 'Bắt đầu lại',
      backToTests: 'Quay lại các bài thi thử',
      ctaHeading: 'Học với thẻ ghi nhớ',
      ctaSubtext: 'Nắm vững các câu hỏi DMV thiết yếu bằng tiếng Việt và tiếng Anh theo tốc độ của bạn.',
      ctaButton: 'Bắt đầu học',
      chooseSet: 'Chọn một bộ thẻ',
      cards: 'thẻ',
    },
  },
};

export const FLASHCARD_LANG_CODES = Object.keys(FLASHCARD_LANGUAGES) as FlashcardLang[];

export function getFlashcardLang(code: string): FlashcardLangConfig | undefined {
  return FLASHCARD_LANGUAGES[code as FlashcardLang];
}

/** Parse a set slug like "set-2" into a 1-based number, or null if invalid. */
export function parseSetSlug(setSlug: string): number | null {
  const match = /^set-(\d+)$/.exec(setSlug);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return Number.isNaN(n) ? null : n;
}

/** Get a specific set for a language by its slug (e.g. "set-1"). */
export function getFlashcardSet(
  code: string,
  setSlug: string
): { config: FlashcardLangConfig; set: FlashcardSet; setNumber: number } | undefined {
  const config = getFlashcardLang(code);
  if (!config) return undefined;
  const setNumber = parseSetSlug(setSlug);
  if (setNumber === null) return undefined;
  const set = config.sets[setNumber - 1];
  if (!set) return undefined;
  return { config, set, setNumber };
}

/** Total card count across all sets for a language. */
export function totalCards(config: FlashcardLangConfig): number {
  return config.sets.reduce((sum, s) => sum + s.flashcards.cards.length, 0);
}

/** Every (lang, set-slug) pair, for generateStaticParams. */
export function allFlashcardSetParams(): { lang: FlashcardLang; set: string }[] {
  const params: { lang: FlashcardLang; set: string }[] = [];
  for (const code of FLASHCARD_LANG_CODES) {
    FLASHCARD_LANGUAGES[code].sets.forEach((_, i) => {
      params.push({ lang: code, set: `set-${i + 1}` });
    });
  }
  return params;
}
