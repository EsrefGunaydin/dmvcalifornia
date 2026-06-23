import base from './road-signs-test.json';
import esQ from './road-signs-es.json';
import trQ from './road-signs-tr.json';
import zhQ from './road-signs-zh.json';
import arQ from './road-signs-ar.json';
import hyQ from './road-signs-hy.json';
import faQ from './road-signs-fa.json';
import paQ from './road-signs-pa.json';
import ruQ from './road-signs-ru.json';
import tlQ from './road-signs-tl.json';
import viQ from './road-signs-vi.json';
import koQ from './road-signs-ko.json';
import hiQ from './road-signs-hi.json';
import type { SignQuestion } from '@/components/SignQuiz';

export type RoadSignLang = 'es' | 'tr' | 'zh' | 'ar' | 'hy' | 'fa' | 'pa' | 'ru' | 'tl' | 'vi' | 'ko' | 'hi';

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
  keepStudying: string;
  allTestsLabel: string;
  labels: { answered: string; correct: string; pickPrompt: string; correctWord: string; answerWord: string };
  faq: { q: string; a: string }[];
  questions: TranslatedQuestion[];
}

const baseQuestions = base.questions as { id: number; image: string; correctAnswer: number }[];

export const ROAD_SIGN_LANGUAGES: Record<RoadSignLang, RoadSignLangConfig> = {
  es: {
    code: 'es', nativeName: 'Español', englishName: 'Spanish', flag: '🇪🇸', dir: 'ltr',
    metaTitle: 'Examen de Señales de Tránsito del DMV de California 2026 (Gratis) | DMV California',
    metaDescription: 'Examen gratuito de señales de tránsito del DMV de California en español, con imágenes reales. Identifica cada señal y obtén la respuesta y una explicación al instante.',
    h1: 'Examen de Señales de Tránsito del DMV de California',
    intro: 'Mira cada señal de tránsito real de California, elige lo que significa y obtén la respuesta con una breve explicación al instante.',
    badge: '38 señales reales · gratis',
    keepStudying: 'Sigue estudiando', allTestsLabel: 'Todos los exámenes de práctica',
    labels: { answered: 'Respondidas', correct: 'correctas', pickPrompt: 'Elige una respuesta para ver el significado.', correctWord: '¡Correcto!', answerWord: 'Respuesta:' },
    faq: [
      { q: '¿Cuántas preguntas de señales hay en el examen del DMV de California?', a: 'Las señales y los semáforos representan aproximadamente una cuarta parte del examen escrito de 46 preguntas del DMV de California. Reconocer las señales de un vistazo es una de las formas más rápidas de subir tu puntaje.' },
      { q: '¿Cuáles son los tres tipos principales de señales de tránsito?', a: 'Señales reglamentarias (lo que debe o no debe hacer, como alto y límites de velocidad), señales de advertencia (rombos amarillos que alertan de peligros más adelante) y señales informativas (direcciones, distancias y servicios).' },
      { q: '¿Este examen de señales de tránsito es gratuito?', a: 'Sí. Este examen es 100% gratuito, usa imágenes de señales reales y te da la respuesta correcta con una breve explicación para cada señal. Puedes repetirlo todas las veces que quieras.' },
    ],
    questions: esQ.questions,
  },
  tr: {
    code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', flag: '🇹🇷', dir: 'ltr',
    metaTitle: 'Kaliforniya DMV Trafik Tabelaları Testi 2026 (Ücretsiz) | DMV California',
    metaDescription: 'Gerçek tabela görselleriyle ücretsiz Kaliforniya DMV trafik tabelaları testi (Türkçe). Her tabelayı tanıyın, anında cevabı ve açıklamayı alın.',
    h1: 'Kaliforniya DMV Trafik Tabelaları Testi',
    intro: 'Her gerçek Kaliforniya trafik tabelasına bakın, ne anlama geldiğini seçin ve anında cevabı ile kısa bir açıklamayı alın.',
    badge: '38 gerçek tabela görseli · ücretsiz',
    keepStudying: 'Çalışmaya devam edin', allTestsLabel: 'Tüm pratik testler',
    labels: { answered: 'Yanıtlanan', correct: 'doğru', pickPrompt: 'Anlamı görmek için bir cevap seçin.', correctWord: 'Doğru!', answerWord: 'Cevap:' },
    faq: [
      { q: 'Kaliforniya DMV testinde kaç tabela sorusu var?', a: 'Tabelalar ve sinyaller, 46 soruluk Kaliforniya DMV yazılı testinin yaklaşık dörtte birini oluşturur. Tabelaları görerek tanımak, puanınızı yükseltmenin en hızlı yollarından biridir.' },
      { q: 'Üç ana trafik tabelası türü nedir?', a: 'Düzenleyici tabelalar (dur ve hız sınırları gibi ne yapmanız veya yapmamanız gerektiği), uyarı tabelaları (ileride tehlikeleri bildiren sarı baklavalar) ve bilgi tabelaları (yönler, mesafeler ve hizmetler).' },
      { q: 'Bu trafik tabelaları testi ücretsiz mi?', a: 'Evet. Bu test %100 ücretsizdir, gerçek tabela görselleri kullanır ve her tabela için doğru cevabı kısa bir açıklamayla verir. İstediğiniz kadar tekrar çözebilirsiniz.' },
    ],
    questions: trQ.questions,
  },
  zh: {
    code: 'zh', nativeName: '中文', englishName: 'Chinese', flag: '🇨🇳', dir: 'ltr',
    metaTitle: '加州 DMV 路标测试 2026（免费）| DMV California',
    metaDescription: '免费的加州 DMV 路标测试（中文），使用真实标志图片。识别每个标志，立即获得答案和解释。',
    h1: '加州 DMV 路标测试',
    intro: '查看每个真实的加州交通标志，选择它的含义，立即获得答案和简短解释。',
    badge: '38 张真实标志图片 · 免费',
    keepStudying: '继续学习', allTestsLabel: '所有练习测试',
    labels: { answered: '已答', correct: '正确', pickPrompt: '选择一个答案以查看含义。', correctWord: '正确！', answerWord: '答案：' },
    faq: [
      { q: '加州 DMV 考试有多少道路标题目？', a: '标志和信号约占加州 DMV 46 题笔试的四分之一。一眼认出标志是提高分数最快的方法之一。' },
      { q: '交通标志的三大类型是什么？', a: '管制标志（您必须或不得做什么，如停车和限速）、警告标志（提醒前方危险的黄色菱形）和指路标志（方向、距离和服务）。' },
      { q: '这个路标测试是免费的吗？', a: '是的。本测试 100% 免费，使用真实标志图片，并为每个标志提供正确答案和简短解释。您可以无限次重做。' },
    ],
    questions: zhQ.questions,
  },
  ar: {
    code: 'ar', nativeName: 'العربية', englishName: 'Arabic', flag: '🇸🇦', dir: 'rtl',
    metaTitle: 'اختبار لافتات الطرق في DMV كاليفورنيا 2026 (مجاني) | DMV California',
    metaDescription: 'اختبار مجاني للافتات الطرق في DMV كاليفورنيا بالعربية مع صور لافتات حقيقية. تعرّف على كل لافتة واحصل على الإجابة والشرح فوراً.',
    h1: 'اختبار لافتات الطرق في DMV كاليفورنيا',
    intro: 'انظر إلى كل لافتة مرور حقيقية في كاليفورنيا، واختر معناها، واحصل على الإجابة مع شرح موجز فوراً.',
    badge: '38 صورة لافتة حقيقية · مجاني',
    keepStudying: 'واصل الدراسة', allTestsLabel: 'كل اختبارات التدريب',
    labels: { answered: 'تمت الإجابة', correct: 'صحيحة', pickPrompt: 'اختر إجابة لرؤية المعنى.', correctWord: 'صحيح!', answerWord: 'الإجابة:' },
    faq: [
      { q: 'كم عدد أسئلة اللافتات في اختبار DMV كاليفورنيا؟', a: 'تشكّل اللافتات والإشارات نحو ربع اختبار DMV كاليفورنيا الكتابي المكوّن من 46 سؤالاً. التعرّف على اللافتات بنظرة واحدة من أسرع الطرق لرفع درجتك.' },
      { q: 'ما هي الأنواع الثلاثة الرئيسية للافتات الطرق؟', a: 'اللافتات التنظيمية (ما يجب أو لا يجب فعله، مثل قف وحدود السرعة)، ولافتات التحذير (المعيّنات الصفراء التي تنبّه إلى مخاطر أمامك)، ولافتات الإرشاد (الاتجاهات والمسافات والخدمات).' },
      { q: 'هل اختبار اللافتات هذا مجاني؟', a: 'نعم. هذا الاختبار مجاني 100%، ويستخدم صور لافتات حقيقية، ويعطيك الإجابة الصحيحة مع شرح موجز لكل لافتة. يمكنك إعادته عدداً غير محدود من المرات.' },
    ],
    questions: arQ.questions,
  },
  hy: {
    code: 'hy', nativeName: 'Հայերեն', englishName: 'Armenian', flag: '🇦🇲', dir: 'ltr',
    metaTitle: 'Կալիֆոռնիայի DMV ճանապարհային նշանների թեստ 2026 (անվճար) | DMV California',
    metaDescription: 'Կալիֆոռնիայի DMV ճանապարհային նշանների անվճար թեստ հայերենով՝ իրական նշանների պատկերներով։ Ճանաչեք յուրաքանչյուր նշան և անմիջապես ստացեք պատասխանն ու բացատրությունը։',
    h1: 'Կալիֆոռնիայի DMV ճանապարհային նշանների թեստ',
    intro: 'Նայեք Կալիֆոռնիայի յուրաքանչյուր իրական ճանապարհային նշանին, ընտրեք դրա նշանակությունը և անմիջապես ստացեք պատասխանը՝ կարճ բացատրությամբ։',
    badge: '38 իրական նշանի պատկեր · անվճար',
    keepStudying: 'Շարունակեք սովորել', allTestsLabel: 'Բոլոր պրակտիկ թեստերը',
    labels: { answered: 'Պատասխանված', correct: 'ճիշտ', pickPrompt: 'Ընտրեք պատասխան՝ նշանակությունը տեսնելու համար։', correctWord: 'Ճիշտ է:', answerWord: 'Պատասխան․' },
    faq: [
      { q: 'Քանի՞ նշանի հարց կա Կալիֆոռնիայի DMV թեստում։', a: 'Նշաններն ու ազդանշանները կազմում են Կալիֆոռնիայի DMV-ի 46 հարցանոց գրավոր թեստի մոտավորապես մեկ քառորդը։ Նշանները տեսնելով ճանաչելը ձեր միավորը բարձրացնելու ամենաարագ ձևերից մեկն է։' },
      { q: 'Որո՞նք են ճանապարհային նշանների երեք հիմնական տեսակները։', a: 'Կարգավորող նշաններ (ինչ պետք է կամ չպետք է անեք, օրինակ՝ կանգ և արագության սահմանափակումներ), զգուշացնող նշաններ (դեղին շեղանկյուններ, որ զգուշացնում են առջևի վտանգների մասին) և ուղղորդող նշաններ (ուղղություններ, հեռավորություններ և ծառայություններ)։' },
      { q: 'Այս նշանների թեստն անվճա՞ր է։', a: 'Այո։ Այս թեստը 100% անվճար է, օգտագործում է իրական նշանների պատկերներ և տալիս է ճիշտ պատասխանը՝ յուրաքանչյուր նշանի համար կարճ բացատրությամբ։ Կարող եք կրկնել այնքան, որքան ուզում եք։' },
    ],
    questions: hyQ.questions,
  },
  fa: {
    code: 'fa', nativeName: 'فارسی', englishName: 'Farsi', flag: '🇮🇷', dir: 'rtl',
    metaTitle: 'آزمون تابلوهای راهنمایی DMV کالیفرنیا ۲۰۲۶ (رایگان) | DMV California',
    metaDescription: 'آزمون رایگان تابلوهای راهنمایی DMV کالیفرنیا به فارسی با تصاویر واقعی تابلوها. هر تابلو را تشخیص دهید و فوراً پاسخ و توضیح را دریافت کنید.',
    h1: 'آزمون تابلوهای راهنمایی DMV کالیفرنیا',
    intro: 'به هر تابلوی راهنمایی واقعی کالیفرنیا نگاه کنید، معنای آن را انتخاب کنید و فوراً پاسخ را همراه با توضیح کوتاه دریافت کنید.',
    badge: '۳۸ تصویر تابلوی واقعی · رایگان',
    keepStudying: 'به مطالعه ادامه دهید', allTestsLabel: 'همه آزمون‌های تمرینی',
    labels: { answered: 'پاسخ‌داده‌شده', correct: 'درست', pickPrompt: 'برای دیدن معنا یک پاسخ انتخاب کنید.', correctWord: 'درست!', answerWord: 'پاسخ:' },
    faq: [
      { q: 'در آزمون DMV کالیفرنیا چند سؤال تابلو وجود دارد؟', a: 'تابلوها و علائم حدود یک‌چهارم آزمون کتبی ۴۶ سؤالی DMV کالیفرنیا را تشکیل می‌دهند. تشخیص تابلوها با یک نگاه یکی از سریع‌ترین راه‌ها برای بالا بردن نمره شماست.' },
      { q: 'سه نوع اصلی تابلوهای راهنمایی کدام‌اند؟', a: 'تابلوهای انتظامی (آنچه باید یا نباید انجام دهید، مانند توقف و محدودیت سرعت)، تابلوهای هشدار (لوزی‌های زرد که درباره خطرات پیش رو هشدار می‌دهند) و تابلوهای راهنما (جهت‌ها، فاصله‌ها و خدمات).' },
      { q: 'آیا این آزمون تابلوها رایگان است؟', a: 'بله. این آزمون ۱۰۰٪ رایگان است، از تصاویر واقعی تابلوها استفاده می‌کند و برای هر تابلو پاسخ درست را با توضیح کوتاه می‌دهد. می‌توانید هر چند بار که خواستید آن را تکرار کنید.' },
    ],
    questions: faQ.questions,
  },
  pa: {
    code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', flag: '🇮🇳', dir: 'ltr',
    metaTitle: 'ਕੈਲੀਫੋਰਨੀਆ DMV ਸੜਕ ਚਿੰਨ੍ਹ ਟੈਸਟ 2026 (ਮੁਫ਼ਤ) | DMV California',
    metaDescription: 'ਅਸਲ ਚਿੰਨ੍ਹ ਤਸਵੀਰਾਂ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਮੁਫ਼ਤ ਕੈਲੀਫੋਰਨੀਆ DMV ਸੜਕ ਚਿੰਨ੍ਹ ਟੈਸਟ। ਹਰ ਚਿੰਨ੍ਹ ਪਛਾਣੋ ਅਤੇ ਤੁਰੰਤ ਜਵਾਬ ਅਤੇ ਵਿਆਖਿਆ ਪ੍ਰਾਪਤ ਕਰੋ।',
    h1: 'ਕੈਲੀਫੋਰਨੀਆ DMV ਸੜਕ ਚਿੰਨ੍ਹ ਟੈਸਟ',
    intro: 'ਕੈਲੀਫੋਰਨੀਆ ਦੇ ਹਰ ਅਸਲ ਟ੍ਰੈਫਿਕ ਚਿੰਨ੍ਹ ਨੂੰ ਦੇਖੋ, ਚੁਣੋ ਕਿ ਇਸ ਦਾ ਕੀ ਮਤਲਬ ਹੈ, ਅਤੇ ਤੁਰੰਤ ਜਵਾਬ ਅਤੇ ਇੱਕ ਛੋਟੀ ਵਿਆਖਿਆ ਪ੍ਰਾਪਤ ਕਰੋ।',
    badge: '38 ਅਸਲ ਚਿੰਨ੍ਹ ਤਸਵੀਰਾਂ · ਮੁਫ਼ਤ',
    keepStudying: 'ਪੜ੍ਹਨਾ ਜਾਰੀ ਰੱਖੋ', allTestsLabel: 'ਸਾਰੇ ਅਭਿਆਸ ਟੈਸਟ',
    labels: { answered: 'ਜਵਾਬ ਦਿੱਤੇ', correct: 'ਸਹੀ', pickPrompt: 'ਮਤਲਬ ਦੇਖਣ ਲਈ ਇੱਕ ਜਵਾਬ ਚੁਣੋ।', correctWord: 'ਸਹੀ!', answerWord: 'ਜਵਾਬ:' },
    faq: [
      { q: 'ਕੈਲੀਫੋਰਨੀਆ DMV ਟੈਸਟ ਵਿੱਚ ਕਿੰਨੇ ਚਿੰਨ੍ਹ ਸਵਾਲ ਹੁੰਦੇ ਹਨ?', a: 'ਚਿੰਨ੍ਹ ਅਤੇ ਸਿਗਨਲ ਕੈਲੀਫੋਰਨੀਆ DMV ਦੇ 46-ਸਵਾਲ ਲਿਖਤੀ ਟੈਸਟ ਦਾ ਲਗਭਗ ਚੌਥਾ ਹਿੱਸਾ ਹੁੰਦੇ ਹਨ। ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ ਪਛਾਣਨਾ ਤੁਹਾਡਾ ਸਕੋਰ ਵਧਾਉਣ ਦੇ ਸਭ ਤੋਂ ਤੇਜ਼ ਤਰੀਕਿਆਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ।' },
      { q: 'ਸੜਕ ਚਿੰਨ੍ਹਾਂ ਦੀਆਂ ਤਿੰਨ ਮੁੱਖ ਕਿਸਮਾਂ ਕਿਹੜੀਆਂ ਹਨ?', a: 'ਨਿਯਮਕ ਚਿੰਨ੍ਹ (ਜੋ ਤੁਹਾਨੂੰ ਕਰਨਾ ਜਾਂ ਨਹੀਂ ਕਰਨਾ ਚਾਹੀਦਾ, ਜਿਵੇਂ ਰੁਕੋ ਅਤੇ ਰਫ਼ਤਾਰ ਸੀਮਾਵਾਂ), ਚੇਤਾਵਨੀ ਚਿੰਨ੍ਹ (ਪੀਲੇ ਹੀਰੇ ਜੋ ਅੱਗੇ ਖ਼ਤਰਿਆਂ ਦੀ ਚੇਤਾਵਨੀ ਦਿੰਦੇ ਹਨ), ਅਤੇ ਮਾਰਗਦਰਸ਼ਨ ਚਿੰਨ੍ਹ (ਦਿਸ਼ਾਵਾਂ, ਦੂਰੀਆਂ ਅਤੇ ਸੇਵਾਵਾਂ)।' },
      { q: 'ਕੀ ਇਹ ਸੜਕ ਚਿੰਨ੍ਹ ਟੈਸਟ ਮੁਫ਼ਤ ਹੈ?', a: 'ਹਾਂ। ਇਹ ਟੈਸਟ 100% ਮੁਫ਼ਤ ਹੈ, ਅਸਲ ਚਿੰਨ੍ਹ ਤਸਵੀਰਾਂ ਵਰਤਦਾ ਹੈ, ਅਤੇ ਹਰ ਚਿੰਨ੍ਹ ਲਈ ਸਹੀ ਜਵਾਬ ਇੱਕ ਛੋਟੀ ਵਿਆਖਿਆ ਨਾਲ ਦਿੰਦਾ ਹੈ। ਤੁਸੀਂ ਇਸਨੂੰ ਜਿੰਨੀ ਵਾਰ ਚਾਹੋ ਦੁਹਰਾ ਸਕਦੇ ਹੋ।' },
    ],
    questions: paQ.questions,
  },
  ru: {
    code: 'ru', nativeName: 'Русский', englishName: 'Russian', flag: '🇷🇺', dir: 'ltr',
    metaTitle: 'Тест на дорожные знаки DMV Калифорнии 2026 (бесплатно) | DMV California',
    metaDescription: 'Бесплатный тест на дорожные знаки DMV Калифорнии на русском с реальными изображениями знаков. Распознавайте каждый знак и сразу получайте ответ и пояснение.',
    h1: 'Тест на дорожные знаки DMV Калифорнии',
    intro: 'Смотрите на каждый реальный дорожный знак Калифорнии, выбирайте его значение и сразу получайте ответ с кратким пояснением.',
    badge: '38 реальных изображений знаков · бесплатно',
    keepStudying: 'Продолжайте учиться', allTestsLabel: 'Все пробные тесты',
    labels: { answered: 'Отвечено', correct: 'верно', pickPrompt: 'Выберите ответ, чтобы увидеть значение.', correctWord: 'Верно!', answerWord: 'Ответ:' },
    faq: [
      { q: 'Сколько вопросов о знаках в тесте DMV Калифорнии?', a: 'Знаки и сигналы составляют примерно четверть письменного теста DMV Калифорнии из 46 вопросов. Узнавать знаки с первого взгляда — один из самых быстрых способов поднять балл.' },
      { q: 'Какие три основных типа дорожных знаков?', a: 'Предписывающие знаки (что нужно или нельзя делать, например стоп и ограничения скорости), предупреждающие знаки (жёлтые ромбы, предупреждающие об опасности впереди) и информационные знаки (направления, расстояния и услуги).' },
      { q: 'Этот тест на знаки бесплатный?', a: 'Да. Этот тест на 100% бесплатный, использует реальные изображения знаков и даёт правильный ответ с кратким пояснением для каждого знака. Проходите его сколько угодно раз.' },
    ],
    questions: ruQ.questions,
  },
  tl: {
    code: 'tl', nativeName: 'Tagalog', englishName: 'Tagalog', flag: '🇵🇭', dir: 'ltr',
    metaTitle: 'California DMV Road Signs Test 2026 (Libre) | DMV California',
    metaDescription: 'Libreng California DMV road signs test sa Tagalog na may totoong larawan ng tanda. Kilalanin ang bawat tanda at makakuha ng sagot at paliwanag agad.',
    h1: 'California DMV Road Signs Test',
    intro: 'Tingnan ang bawat totoong tanda ng trapiko sa California, piliin ang ibig sabihin nito, at makakuha ng sagot at maikling paliwanag agad.',
    badge: '38 totoong larawan ng tanda · libre',
    keepStudying: 'Magpatuloy sa pag-aaral', allTestsLabel: 'Lahat ng practice test',
    labels: { answered: 'Nasagot', correct: 'tama', pickPrompt: 'Pumili ng sagot para makita ang kahulugan.', correctWord: 'Tama!', answerWord: 'Sagot:' },
    faq: [
      { q: 'Ilang tanong tungkol sa tanda ang nasa California DMV test?', a: 'Ang mga tanda at signal ay humigit-kumulang isang-kapat ng 46-tanong na nakasulat na pagsusulit ng California DMV. Ang pagkilala sa mga tanda sa isang sulyap ay isa sa pinakamabilis na paraan para itaas ang iyong score.' },
      { q: 'Ano ang tatlong pangunahing uri ng tanda sa trapiko?', a: 'Regulatory signs (kung ano ang dapat o hindi dapat gawin, tulad ng stop at speed limit), warning signs (dilaw na diyamante na nagbababala ng panganib sa unahan), at guide signs (mga direksyon, distansya, at serbisyo).' },
      { q: 'Libre ba ang road signs test na ito?', a: 'Oo. 100% libre ang pagsusulit na ito, gumagamit ng totoong larawan ng tanda, at nagbibigay ng tamang sagot na may maikling paliwanag para sa bawat tanda. Maaari mong ulitin nang paulit-ulit.' },
    ],
    questions: tlQ.questions,
  },
  vi: {
    code: 'vi', nativeName: 'Tiếng Việt', englishName: 'Vietnamese', flag: '🇻🇳', dir: 'ltr',
    metaTitle: 'Bài Thi Biển Báo Giao Thông DMV California 2026 (Miễn Phí) | DMV California',
    metaDescription: 'Bài thi biển báo giao thông DMV California miễn phí bằng tiếng Việt với hình ảnh biển báo thật. Nhận biết từng biển báo, nhận đáp án và giải thích ngay lập tức.',
    h1: 'Bài Thi Biển Báo Giao Thông DMV California',
    intro: 'Nhìn từng biển báo giao thông thật của California, chọn ý nghĩa của nó và nhận đáp án cùng lời giải thích ngắn ngay lập tức.',
    badge: '38 hình ảnh biển báo thật · miễn phí',
    keepStudying: 'Tiếp tục học', allTestsLabel: 'Tất cả bài thi thử',
    labels: { answered: 'Đã trả lời', correct: 'đúng', pickPrompt: 'Chọn một đáp án để xem ý nghĩa.', correctWord: 'Chính xác!', answerWord: 'Đáp án:' },
    faq: [
      { q: 'Có bao nhiêu câu hỏi biển báo trong bài thi DMV California?', a: 'Biển báo và tín hiệu chiếm khoảng một phần tư bài thi viết 46 câu của DMV California. Nhận ra biển báo bằng mắt là một trong những cách nhanh nhất để nâng điểm.' },
      { q: 'Ba loại biển báo giao thông chính là gì?', a: 'Biển báo điều lệ (điều bạn phải hoặc không được làm, như dừng và giới hạn tốc độ), biển báo cảnh báo (hình thoi vàng báo nguy hiểm phía trước) và biển chỉ dẫn (hướng, khoảng cách và dịch vụ).' },
      { q: 'Bài thi biển báo này có miễn phí không?', a: 'Có. Bài thi này hoàn toàn miễn phí, dùng hình ảnh biển báo thật và cho bạn đáp án đúng kèm giải thích ngắn cho mỗi biển báo. Bạn có thể làm lại bao nhiêu lần tùy thích.' },
    ],
    questions: viQ.questions,
  },
  ko: {
    code: 'ko', nativeName: '한국어', englishName: 'Korean', flag: '🇰🇷', dir: 'ltr',
    metaTitle: '캘리포니아 DMV 도로 표지판 시험 2026 (무료) | DMV California',
    metaDescription: '실제 표지판 이미지가 있는 무료 캘리포니아 DMV 도로 표지판 시험 (한국어). 각 표지판을 알아보고 즉시 답과 설명을 받으세요.',
    h1: '캘리포니아 DMV 도로 표지판 시험',
    intro: '캘리포니아의 모든 실제 교통 표지판을 보고, 그 의미를 선택하고, 즉시 답과 간단한 설명을 받으세요.',
    badge: '실제 표지판 이미지 38개 · 무료',
    keepStudying: '계속 공부하기', allTestsLabel: '모든 연습 시험',
    labels: { answered: '답변함', correct: '정답', pickPrompt: '의미를 보려면 답을 선택하세요.', correctWord: '정답입니다!', answerWord: '답:' },
    faq: [
      { q: '캘리포니아 DMV 시험에는 표지판 문제가 몇 개 있나요?', a: '표지판과 신호는 캘리포니아 DMV의 46문항 필기 시험의 약 4분의 1을 차지합니다. 표지판을 한눈에 알아보는 것은 점수를 올리는 가장 빠른 방법 중 하나입니다.' },
      { q: '교통 표지판의 세 가지 주요 유형은 무엇인가요?', a: '규제 표지판(정지나 속도 제한처럼 해야 하거나 하지 말아야 할 것), 경고 표지판(앞의 위험을 알리는 노란 마름모), 안내 표지판(방향, 거리, 서비스)입니다.' },
      { q: '이 도로 표지판 시험은 무료인가요?', a: '예. 이 시험은 100% 무료이며, 실제 표지판 이미지를 사용하고, 각 표지판에 대해 정답과 간단한 설명을 제공합니다. 원하는 만큼 반복할 수 있습니다.' },
    ],
    questions: koQ.questions,
  },
  hi: {
    code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', flag: '🇮🇳', dir: 'ltr',
    metaTitle: 'कैलिफोर्निया DMV रोड साइन टेस्ट 2026 (मुफ़्त) | DMV California',
    metaDescription: 'असली चिह्न तस्वीरों के साथ मुफ़्त कैलिफोर्निया DMV रोड साइन टेस्ट (हिन्दी)। हर चिह्न को पहचानें और तुरंत उत्तर तथा स्पष्टीकरण पाएं।',
    h1: 'कैलिफोर्निया DMV रोड साइन टेस्ट',
    intro: 'कैलिफोर्निया के हर असली ट्रैफिक चिह्न को देखें, उसका अर्थ चुनें, और तुरंत उत्तर तथा एक संक्षिप्त स्पष्टीकरण पाएं।',
    badge: '38 असली चिह्न तस्वीरें · मुफ़्त',
    keepStudying: 'पढ़ाई जारी रखें', allTestsLabel: 'सभी अभ्यास टेस्ट',
    labels: { answered: 'उत्तर दिए', correct: 'सही', pickPrompt: 'अर्थ देखने के लिए एक उत्तर चुनें।', correctWord: 'सही!', answerWord: 'उत्तर:' },
    faq: [
      { q: 'कैलिफोर्निया DMV टेस्ट में चिह्न के कितने प्रश्न होते हैं?', a: 'चिह्न और सिग्नल कैलिफोर्निया DMV की 46-प्रश्नों वाली लिखित परीक्षा का लगभग एक-चौथाई हिस्सा होते हैं। चिह्नों को एक नज़र में पहचानना आपका स्कोर बढ़ाने के सबसे तेज़ तरीकों में से एक है।' },
      { q: 'ट्रैफिक चिह्नों के तीन मुख्य प्रकार कौन से हैं?', a: 'नियामक चिह्न (क्या करना या न करना चाहिए, जैसे रुकें और गति सीमा), चेतावनी चिह्न (पीले हीरे जो आगे के खतरों की चेतावनी देते हैं), और मार्गदर्शक चिह्न (दिशाएं, दूरियां और सेवाएं)।' },
      { q: 'क्या यह रोड साइन टेस्ट मुफ़्त है?', a: 'हां। यह टेस्ट 100% मुफ़्त है, असली चिह्न तस्वीरों का उपयोग करता है, और हर चिह्न के लिए सही उत्तर एक संक्षिप्त स्पष्टीकरण के साथ देता है। आप इसे जितनी बार चाहें दोहरा सकते हैं।' },
    ],
    questions: hiQ.questions,
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
      return { code, label: c.nativeName, flag: c.flag, href: `/california-dmv-road-signs-test/${code}` };
    }),
  ];
}
