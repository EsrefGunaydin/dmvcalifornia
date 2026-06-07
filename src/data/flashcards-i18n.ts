import esData from './flashcards-es-1.json';
import trData from './flashcards-tr-1.json';
import zhData from './flashcards-zh-1.json';
import arData from './flashcards-ar-1.json';
import hyData from './flashcards-hy-1.json';
import faData from './flashcards-fa-1.json';
import paData from './flashcards-pa-1.json';
import ruData from './flashcards-ru-1.json';
import tlData from './flashcards-tl-1.json';
import viData from './flashcards-vi-1.json';

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

/** UI strings used by the flashcard deck and the localized CTAs. */
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
  cardsCount: string;
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
  data: FlashcardSet;
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
    data: esData as FlashcardSet,
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
      ctaSubtext: 'Domina 15 preguntas esenciales del DMV a tu propio ritmo, en español e inglés.',
      ctaButton: 'Estudiar tarjetas',
      cardsCount: '15 tarjetas',
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
    data: trData as FlashcardSet,
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
      ctaSubtext: '15 temel DMV sorusunu Türkçe ve İngilizce olarak kendi hızında öğren.',
      ctaButton: 'Kartlarla çalış',
      cardsCount: '15 kart',
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
    data: zhData as FlashcardSet,
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
      ctaSubtext: '用中文和英文，按自己的节奏掌握 15 道核心 DMV 题目。',
      ctaButton: '开始学习',
      cardsCount: '15 张卡片',
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
    data: arData as FlashcardSet,
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
      ctaSubtext: 'أتقن 15 سؤالاً أساسياً من DMV بالعربية والإنجليزية بالوتيرة التي تناسبك.',
      ctaButton: 'ابدأ الدراسة',
      cardsCount: '15 بطاقة',
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
    data: hyData as FlashcardSet,
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
      ctaSubtext: 'Յուրացրու DMV-ի 15 հիմնական հարցը հայերեն և անգլերեն՝ քո տեմպով։',
      ctaButton: 'Սկսել',
      cardsCount: '15 քարտ',
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
    data: faData as FlashcardSet,
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
      ctaSubtext: '۱۵ سؤال اساسی DMV را به فارسی و انگلیسی با سرعت خودتان یاد بگیرید.',
      ctaButton: 'شروع مطالعه',
      cardsCount: '۱۵ کارت',
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
    data: paData as FlashcardSet,
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
      ctaSubtext: 'ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਾਲ 15 ਜ਼ਰੂਰੀ DMV ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਮੁਹਾਰਤ ਹਾਸਲ ਕਰੋ — ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ।',
      ctaButton: 'ਪੜ੍ਹਨਾ ਸ਼ੁਰੂ ਕਰੋ',
      cardsCount: '15 ਕਾਰਡ',
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
    data: ruData as FlashcardSet,
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
      ctaSubtext: 'Освойте 15 основных вопросов DMV на русском и английском в своём темпе.',
      ctaButton: 'Начать',
      cardsCount: '15 карточек',
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
    data: tlData as FlashcardSet,
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
      ctaSubtext: 'Masteryn ang 15 mahahalagang tanong sa DMV sa Tagalog at Ingles sa sarili mong bilis.',
      ctaButton: 'Mag-aral na',
      cardsCount: '15 kard',
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
    data: viData as FlashcardSet,
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
      ctaSubtext: 'Nắm vững 15 câu hỏi DMV thiết yếu bằng tiếng Việt và tiếng Anh theo tốc độ của bạn.',
      ctaButton: 'Bắt đầu học',
      cardsCount: '15 thẻ',
    },
  },
};

export const FLASHCARD_LANG_CODES = Object.keys(FLASHCARD_LANGUAGES) as FlashcardLang[];

export function getFlashcardLang(code: string): FlashcardLangConfig | undefined {
  return FLASHCARD_LANGUAGES[code as FlashcardLang];
}
