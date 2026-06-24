/**
 * California Driver Handbook pages, one per language, served at the EXISTING
 * (previously dead/404) URLs `/california-driver-handbook/california-driver-handbook-<lang>`
 * so we recapture their accumulated SEO value instead of creating new URLs.
 *
 * en/es/zh use the current 2025 official DMV PDF. ko/ar/fa: the DMV no longer
 * publishes those languages, so we honestly present an archived reference PDF
 * and lead with the (current) language practice tests + the official English PDF.
 */

export interface HandbookFaq {
  q: string;
  a: string;
}

export interface HandbookEdition {
  code: string;
  /** second URL segment: /california-driver-handbook/<editionSlug> */
  editionSlug: string;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  pdfPath: string;
  /** true = current 2025 DMV edition; false = archived reference (no current DMV version) */
  pdfCurrent: boolean;
  pdfNote?: string;
  testHref: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sectionsHeading: string;
  sections: string[];
  downloadLabel: string;
  practiceHeading: string;
  practiceText: string;
  practiceLabel: string;
  faq: HandbookFaq[];
  sourceNote: string;
  officialUrl: string;
  /** Older editions kept downloadable so users can compare versions. */
  archives?: { label: string; path: string }[];
}

const OFFICIAL_HANDBOOK = 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/';

export const HANDBOOK_EDITIONS: HandbookEdition[] = [
  {
    code: 'en',
    editionSlug: 'california-driver-handbook-english',
    nativeName: 'English',
    englishName: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
    pdfPath: '/pdfs/california-driver-handbook-english.pdf',
    pdfCurrent: true,
    testHref: '/california-dmv-practice-test',
    metaTitle: 'California Driver Handbook 2026 (English) — Free PDF & Study Guide',
    metaDescription:
      "Read the official California Driver Handbook (2025 edition) in English — free. Download the PDF, see what's covered, and practice with free DMV tests to pass your written exam.",
    h1: 'California Driver Handbook (English)',
    intro:
      'The California Driver Handbook is the official study guide for the DMV written test. This is the current 2025 edition from the California DMV — free to read and download. Study it, then practice with our free tests to pass your knowledge exam the first time.',
    sectionsHeading: "What's inside the handbook",
    sections: [
      'Road signs and signals',
      'Traffic laws and rules of the road',
      'Right-of-way and intersections',
      'Speed limits',
      'Parking rules',
      'Safe and defensive driving',
      'Sharing the road — pedestrians, bikes, motorcycles',
      'Getting your license and the testing process',
    ],
    downloadLabel: 'Download the official PDF (2025 edition)',
    practiceHeading: 'Ready to test yourself?',
    practiceText: 'Practice with free California DMV questions based on this handbook — no signup.',
    practiceLabel: 'Start a free practice test →',
    faq: [
      {
        q: 'Is the California Driver Handbook free?',
        a: 'Yes. The California Driver Handbook is published free by the California DMV. You can read the summary here and download the full official PDF at no cost.',
      },
      {
        q: 'What edition is this California Driver Handbook?',
        a: 'This is the current 2025 edition of the California Driver Handbook — the same content the DMV uses for the written knowledge test.',
      },
      {
        q: 'How do I use the handbook to pass the DMV test?',
        a: 'Read the handbook, focus on road signs, right-of-way, and traffic laws, then take practice tests until you consistently score above 85%.',
      },
    ],
    sourceNote: 'Source: California Department of Motor Vehicles (DMV). Provided here as a free study aid.',
    officialUrl: OFFICIAL_HANDBOOK,
    archives: [
      { label: 'California Driver Handbook — 2020 edition (PDF)', path: '/pdfs/driver-handbook-2020-en.pdf' },
      { label: 'California Driver Handbook — 2018 edition (PDF)', path: '/pdfs/california-driver-handbook-english-2018.pdf' },
    ],
  },
  {
    code: 'es',
    editionSlug: 'california-driver-handbook-spanish',
    nativeName: 'Español',
    englishName: 'Spanish',
    dir: 'ltr',
    flag: '🇪🇸',
    pdfPath: '/pdfs/california-driver-handbook-spanish.pdf',
    pdfCurrent: true,
    testHref: '/muestra-del-examen-escrito-para-licencia-de-manejar',
    metaTitle: 'Manual del Conductor de California 2026 (Español) — PDF Gratis',
    metaDescription:
      'Lee el Manual del Conductor de California (edición 2025) en español, gratis. Descarga el PDF y practica con exámenes gratuitos del DMV para aprobar tu examen escrito.',
    h1: 'Manual del Conductor de California (Español)',
    intro:
      'El Manual del Conductor de California es la guía oficial para el examen escrito del DMV. Esta es la edición 2025 vigente del DMV de California, gratis para leer y descargar. Estúdialo y practica con nuestros exámenes gratuitos para aprobar a la primera.',
    sectionsHeading: 'Qué contiene el manual',
    sections: [
      'Señales de tránsito',
      'Leyes y reglas de la vía',
      'Derecho de paso e intersecciones',
      'Límites de velocidad',
      'Reglas de estacionamiento',
      'Conducción segura y defensiva',
      'Compartir la vía — peatones, bicicletas, motos',
      'Cómo obtener tu licencia y el proceso de examen',
    ],
    downloadLabel: 'Descargar el PDF oficial (edición 2025)',
    practiceHeading: '¿Listo para practicar?',
    practiceText: 'Practica con preguntas gratuitas del DMV de California basadas en este manual, sin registro.',
    practiceLabel: 'Comenzar examen gratis →',
    faq: [
      {
        q: '¿El Manual del Conductor de California es gratis?',
        a: 'Sí. El DMV de California publica el manual de forma gratuita. Puedes leer el resumen aquí y descargar el PDF oficial completo sin costo.',
      },
      {
        q: '¿Qué edición es este manual?',
        a: 'Es la edición 2025 vigente del Manual del Conductor de California, el mismo contenido que el DMV usa para el examen escrito de conocimientos.',
      },
    ],
    sourceNote: 'Fuente: Departamento de Vehículos Motorizados de California (DMV). Se ofrece aquí como ayuda de estudio gratuita.',
    officialUrl: 'https://www.dmv.ca.gov/portal/file/california-driver-handbook-spanish-pdf',
    archives: [
      { label: 'Manual del Conductor — edición 2018 (PDF)', path: '/pdfs/california-driver-handbook-spanish-2018.pdf' },
    ],
  },
  {
    code: 'zh',
    editionSlug: 'california-driver-handbook-chinese',
    nativeName: '中文',
    englishName: 'Chinese',
    dir: 'ltr',
    flag: '🇨🇳',
    pdfPath: '/pdfs/california-driver-handbook-chinese.pdf',
    pdfCurrent: true,
    testHref: '/dmv-chinese-test',
    metaTitle: '加州驾驶手册 2026（中文）— 免费 PDF 与学习指南',
    metaDescription:
      '免费阅读加州官方驾驶手册（2025 版）中文版。下载 PDF，了解考试内容，并用免费 DMV 练习题通过笔试。',
    h1: '加州驾驶手册（中文）',
    intro:
      '加州驾驶手册是 DMV 笔试的官方学习指南。这是加州 DMV 现行的 2025 版，可免费阅读和下载。先学习手册，再用我们的免费练习题，一次通过笔试。',
    sectionsHeading: '手册涵盖的内容',
    sections: [
      '道路标志与信号',
      '交通法规与道路规则',
      '先行权与路口',
      '限速',
      '停车规则',
      '安全与防御性驾驶',
      '共享道路——行人、自行车、摩托车',
      '如何考取驾照与考试流程',
    ],
    downloadLabel: '下载官方 PDF（2025 版）',
    practiceHeading: '准备好测试自己了吗？',
    practiceText: '用基于本手册的免费加州 DMV 试题练习，无需注册。',
    practiceLabel: '开始免费练习 →',
    faq: [
      {
        q: '加州驾驶手册是免费的吗？',
        a: '是的。加州 DMV 免费发布驾驶手册。您可以在此阅读摘要，并免费下载完整的官方 PDF。',
      },
      {
        q: '这是哪个版本的手册？',
        a: '这是加州驾驶手册现行的 2025 版，与 DMV 笔试所用内容一致。',
      },
    ],
    sourceNote: '来源：加州机动车辆管理局（DMV）。此处作为免费学习辅助提供。',
    officialUrl: 'https://www.dmv.ca.gov/portal/file/california-driver-handbook-chinese-pdf/',
    archives: [
      { label: '加州驾驶手册 — 2017 版（PDF）', path: '/pdfs/california-driver-handbook-chinese-2017.pdf' },
    ],
  },
  {
    code: 'hy',
    editionSlug: 'california-driver-handbook-armenian',
    nativeName: 'Հայերեն',
    englishName: 'Armenian',
    dir: 'ltr',
    flag: '🇦🇲',
    pdfPath: '/pdfs/california-driver-handbook-armenian.pdf',
    pdfCurrent: true,
    testHref: '/dmv-armenian-test',
    metaTitle: 'Կալիֆոռնիայի վարորդի ձեռնարկ (հայերեն) — անվճար PDF',
    metaDescription:
      'Կարդացեք Կալիֆոռնիայի վարորդի պաշտոնական ձեռնարկը հայերենով՝ անվճար (2025 հրատարակություն)։ Ներբեռնեք PDF-ը և պատրաստվեք քննությանը անվճար թեստերով։',
    h1: 'Կալիֆոռնիայի վարորդի ձեռնարկ (հայերեն)',
    intro:
      'Կալիֆոռնիայի վարորդի ձեռնարկը DMV-ի գրավոր քննության պաշտոնական ուղեցույցն է։ Սա DMV-ի ընթացիկ 2025 հրատարակությունն է՝ անվճար կարդալու և ներբեռնելու համար։ Ուսումնասիրեք այն, ապա պարապեք մեր անվճար թեստերով՝ առաջին անգամից հանձնելու համար։',
    sectionsHeading: 'Ի՞նչ կա ձեռնարկում',
    sections: [
      'Ճանապարհային նշաններ և ազդանշաններ',
      'Երթևեկության օրենքներ և կանոններ',
      'Առաջնահերթություն և խաչմերուկներ',
      'Արագության սահմանափակումներ',
      'Կայանման կանոններ',
      'Անվտանգ և պաշտպանական վարում',
      'Ճանապարհի համատեղ օգտագործում — հետիոտներ, հեծանիվներ, մոտոցիկլետներ',
      'Իրավունքի ստացում և քննության գործընթաց',
    ],
    downloadLabel: 'Ներբեռնել պաշտոնական PDF (2025 հրատարակություն)',
    practiceHeading: 'Պատրա՞ստ եք ստուգել ձեզ',
    practiceText: 'Պարապեք Կալիֆոռնիայի DMV-ի անվճար հարցերով՝ հայերենով։ Գրանցում պետք չէ։',
    practiceLabel: 'Սկսել անվճար թեստը →',
    faq: [
      {
        q: 'Կալիֆոռնիայի վարորդի ձեռնարկը հասանելի՞ է հայերենով։',
        a: 'Այո։ Կալիֆոռնիայի DMV-ն հրապարակում է ձեռնարկը հայերենով անվճար։ Կարող եք կարդալ ամփոփումն այստեղ և ներբեռնել ամբողջ պաշտոնական PDF-ը։',
      },
      {
        q: 'Կարո՞ղ եմ քննությունը հանձնել հայերենով։',
        a: 'Այո, Կալիֆոռնիայի DMV-ի գրավոր քննությունը հասանելի է մի քանի լեզուներով, և կարող եք պատրաստվել մեր հայերեն թեստերով։',
      },
    ],
    sourceNote: 'Աղբյուր՝ Կալիֆոռնիայի ավտոմեքենաների վարչություն (DMV)։ Տրամադրվում է որպես անվճար ուսումնական նյութ։',
    officialUrl: 'https://www.dmv.ca.gov/portal/file/california-driver-handbook-armenian-pdf/',
  },
  {
    code: 'hi',
    editionSlug: 'california-driver-handbook-hindi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    dir: 'ltr',
    flag: '🇮🇳',
    pdfPath: '/pdfs/california-driver-handbook-hindi.pdf',
    pdfCurrent: true,
    testHref: '/dmv-hindi-test',
    metaTitle: 'कैलिफोर्निया ड्राइवर हैंडबुक (हिन्दी) — मुफ़्त PDF',
    metaDescription:
      'कैलिफोर्निया ड्राइवर हैंडबुक (2025 संस्करण) हिन्दी में मुफ़्त पढ़ें। PDF डाउनलोड करें और मुफ़्त DMV टेस्ट से लिखित परीक्षा की तैयारी करें।',
    h1: 'कैलिफोर्निया ड्राइवर हैंडबुक (हिन्दी)',
    intro:
      'कैलिफोर्निया ड्राइवर हैंडबुक DMV लिखित परीक्षा की आधिकारिक अध्ययन मार्गदर्शिका है। यह कैलिफोर्निया DMV का मौजूदा 2025 संस्करण है — मुफ़्त में पढ़ें और डाउनलोड करें। इसे पढ़ें, फिर हमारे मुफ़्त टेस्ट से अभ्यास करके पहली बार में पास करें।',
    sectionsHeading: 'हैंडबुक में क्या है',
    sections: [
      'सड़क चिह्न और संकेत',
      'यातायात कानून और सड़क के नियम',
      'रास्ते का अधिकार और चौराहे',
      'गति सीमाएं',
      'पार्किंग नियम',
      'सुरक्षित और रक्षात्मक ड्राइविंग',
      'सड़क साझा करना — पैदल यात्री, साइकिल, मोटरसाइकिल',
      'लाइसेंस प्राप्त करना और परीक्षा प्रक्रिया',
    ],
    downloadLabel: 'आधिकारिक PDF डाउनलोड करें (2025 संस्करण)',
    practiceHeading: 'खुद को परखने के लिए तैयार हैं?',
    practiceText: 'इस हैंडबुक पर आधारित मुफ़्त कैलिफोर्निया DMV प्रश्नों से अभ्यास करें। कोई साइनअप नहीं।',
    practiceLabel: 'मुफ़्त अभ्यास टेस्ट शुरू करें →',
    faq: [
      {
        q: 'क्या कैलिफोर्निया ड्राइवर हैंडबुक हिन्दी में उपलब्ध है?',
        a: 'हां। कैलिफोर्निया DMV हैंडबुक को हिन्दी में मुफ़्त प्रकाशित करता है। आप यहां सारांश पढ़ सकते हैं और पूरा आधिकारिक PDF मुफ़्त डाउनलोड कर सकते हैं।',
      },
      {
        q: 'क्या मैं लिखित परीक्षा हिन्दी में दे सकता हूं?',
        a: 'हां, कैलिफोर्निया DMV की लिखित परीक्षा कई भाषाओं में उपलब्ध है, और आप हमारे हिन्दी टेस्ट से तैयारी कर सकते हैं।',
      },
    ],
    sourceNote: 'स्रोत: कैलिफोर्निया मोटर वाहन विभाग (DMV)। यहां मुफ़्त अध्ययन सहायता के रूप में प्रदान किया गया।',
    officialUrl: 'https://www.dmv.ca.gov/portal/file/california-driver-handbook-hindi-pdf/',
  },
  {
    code: 'pa',
    editionSlug: 'california-driver-handbook-punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    dir: 'ltr',
    flag: '🇮🇳',
    pdfPath: '/pdfs/california-driver-handbook-punjabi.pdf',
    pdfCurrent: true,
    testHref: '/dmv-punjabi-test',
    metaTitle: 'ਕੈਲੀਫੋਰਨੀਆ ਡਰਾਈਵਰ ਹੈਂਡਬੁੱਕ (ਪੰਜਾਬੀ) — ਮੁਫ਼ਤ PDF',
    metaDescription:
      'ਕੈਲੀਫੋਰਨੀਆ ਡਰਾਈਵਰ ਹੈਂਡਬੁੱਕ (2025 ਐਡੀਸ਼ਨ) ਪੰਜਾਬੀ ਵਿੱਚ ਮੁਫ਼ਤ ਪੜ੍ਹੋ। PDF ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਮੁਫ਼ਤ DMV ਟੈਸਟਾਂ ਨਾਲ ਲਿਖਤੀ ਪ੍ਰੀਖਿਆ ਦੀ ਤਿਆਰੀ ਕਰੋ।',
    h1: 'ਕੈਲੀਫੋਰਨੀਆ ਡਰਾਈਵਰ ਹੈਂਡਬੁੱਕ (ਪੰਜਾਬੀ)',
    intro:
      'ਕੈਲੀਫੋਰਨੀਆ ਡਰਾਈਵਰ ਹੈਂਡਬੁੱਕ DMV ਲਿਖਤੀ ਟੈਸਟ ਲਈ ਅਧਿਕਾਰਤ ਅਧਿਐਨ ਗਾਈਡ ਹੈ। ਇਹ ਕੈਲੀਫੋਰਨੀਆ DMV ਦਾ ਮੌਜੂਦਾ 2025 ਐਡੀਸ਼ਨ ਹੈ — ਮੁਫ਼ਤ ਪੜ੍ਹੋ ਅਤੇ ਡਾਊਨਲੋਡ ਕਰੋ। ਇਸਨੂੰ ਪੜ੍ਹੋ, ਫਿਰ ਸਾਡੇ ਮੁਫ਼ਤ ਟੈਸਟਾਂ ਨਾਲ ਅਭਿਆਸ ਕਰਕੇ ਪਹਿਲੀ ਵਾਰ ਪਾਸ ਕਰੋ।',
    sectionsHeading: 'ਹੈਂਡਬੁੱਕ ਵਿੱਚ ਕੀ ਹੈ',
    sections: [
      'ਸੜਕ ਚਿੰਨ੍ਹ ਅਤੇ ਸਿਗਨਲ',
      'ਟ੍ਰੈਫਿਕ ਕਾਨੂੰਨ ਅਤੇ ਸੜਕ ਦੇ ਨਿਯਮ',
      'ਰਾਹ ਦਾ ਅਧਿਕਾਰ ਅਤੇ ਚੌਰਾਹੇ',
      'ਰਫ਼ਤਾਰ ਸੀਮਾਵਾਂ',
      'ਪਾਰਕਿੰਗ ਨਿਯਮ',
      'ਸੁਰੱਖਿਅਤ ਅਤੇ ਬਚਾਅ ਵਾਲੀ ਡਰਾਈਵਿੰਗ',
      'ਸੜਕ ਸਾਂਝੀ ਕਰਨਾ — ਪੈਦਲ, ਸਾਈਕਲ, ਮੋਟਰਸਾਈਕਲ',
      'ਲਾਇਸੈਂਸ ਪ੍ਰਾਪਤ ਕਰਨਾ ਅਤੇ ਟੈਸਟ ਪ੍ਰਕਿਰਿਆ',
    ],
    downloadLabel: 'ਅਧਿਕਾਰਤ PDF ਡਾਊਨਲੋਡ ਕਰੋ (2025 ਐਡੀਸ਼ਨ)',
    practiceHeading: 'ਆਪਣੇ ਆਪ ਨੂੰ ਪਰਖਣ ਲਈ ਤਿਆਰ ਹੋ?',
    practiceText: 'ਇਸ ਹੈਂਡਬੁੱਕ ਉੱਤੇ ਆਧਾਰਿਤ ਮੁਫ਼ਤ ਕੈਲੀਫੋਰਨੀਆ DMV ਸਵਾਲਾਂ ਨਾਲ ਅਭਿਆਸ ਕਰੋ। ਕੋਈ ਸਾਈਨਅੱਪ ਨਹੀਂ।',
    practiceLabel: 'ਮੁਫ਼ਤ ਅਭਿਆਸ ਟੈਸਟ ਸ਼ੁਰੂ ਕਰੋ →',
    faq: [
      {
        q: 'ਕੀ ਕੈਲੀਫੋਰਨੀਆ ਡਰਾਈਵਰ ਹੈਂਡਬੁੱਕ ਪੰਜਾਬੀ ਵਿੱਚ ਉਪਲਬਧ ਹੈ?',
        a: 'ਹਾਂ। ਕੈਲੀਫੋਰਨੀਆ DMV ਹੈਂਡਬੁੱਕ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਮੁਫ਼ਤ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰਦਾ ਹੈ। ਤੁਸੀਂ ਇੱਥੇ ਸਾਰ ਪੜ੍ਹ ਸਕਦੇ ਹੋ ਅਤੇ ਪੂਰਾ ਅਧਿਕਾਰਤ PDF ਮੁਫ਼ਤ ਡਾਊਨਲੋਡ ਕਰ ਸਕਦੇ ਹੋ।',
      },
      {
        q: 'ਕੀ ਮੈਂ ਲਿਖਤੀ ਟੈਸਟ ਪੰਜਾਬੀ ਵਿੱਚ ਦੇ ਸਕਦਾ ਹਾਂ?',
        a: 'ਹਾਂ, ਕੈਲੀਫੋਰਨੀਆ DMV ਦਾ ਲਿਖਤੀ ਟੈਸਟ ਕਈ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ ਹੈ, ਅਤੇ ਤੁਸੀਂ ਸਾਡੇ ਪੰਜਾਬੀ ਟੈਸਟਾਂ ਨਾਲ ਤਿਆਰੀ ਕਰ ਸਕਦੇ ਹੋ।',
      },
    ],
    sourceNote: 'ਸਰੋਤ: ਕੈਲੀਫੋਰਨੀਆ ਮੋਟਰ ਵਹੀਕਲ ਵਿਭਾਗ (DMV)। ਇੱਥੇ ਮੁਫ਼ਤ ਅਧਿਐਨ ਸਹਾਇਤਾ ਵਜੋਂ ਪ੍ਰਦਾਨ ਕੀਤਾ ਗਿਆ।',
    officialUrl: 'https://www.dmv.ca.gov/portal/file/california-driver-handbook-punjabi-pdf/',
  },
  {
    code: 'ru',
    editionSlug: 'california-driver-handbook-russian',
    nativeName: 'Русский',
    englishName: 'Russian',
    dir: 'ltr',
    flag: '🇷🇺',
    pdfPath: '/pdfs/california-driver-handbook-russian.pdf',
    pdfCurrent: true,
    testHref: '/dmv-russian-test',
    metaTitle: 'Руководство водителя Калифорнии (русский) — бесплатный PDF',
    metaDescription:
      'Читайте официальное Руководство водителя Калифорнии (издание 2025) на русском бесплатно. Скачайте PDF и готовьтесь к письменному экзамену с бесплатными тестами DMV.',
    h1: 'Руководство водителя Калифорнии (русский)',
    intro:
      'Руководство водителя Калифорнии — официальное пособие для письменного экзамена DMV. Это действующее издание 2025 года от DMV Калифорнии — бесплатно читать и скачивать. Изучите его, затем потренируйтесь на наших бесплатных тестах, чтобы сдать с первого раза.',
    sectionsHeading: 'Что в руководстве',
    sections: [
      'Дорожные знаки и сигналы',
      'Правила дорожного движения',
      'Преимущество проезда и перекрёстки',
      'Ограничения скорости',
      'Правила парковки',
      'Безопасное и оборонительное вождение',
      'Совместное использование дороги — пешеходы, велосипеды, мотоциклы',
      'Получение прав и процесс экзамена',
    ],
    downloadLabel: 'Скачать официальный PDF (издание 2025)',
    practiceHeading: 'Готовы проверить себя?',
    practiceText: 'Тренируйтесь на бесплатных вопросах DMV Калифорнии на русском. Без регистрации.',
    practiceLabel: 'Начать бесплатный тест →',
    faq: [
      {
        q: 'Доступно ли Руководство водителя Калифорнии на русском?',
        a: 'Да. DMV Калифорнии публикует руководство на русском бесплатно. Здесь можно прочитать краткое содержание и скачать полный официальный PDF.',
      },
      {
        q: 'Можно ли сдавать письменный экзамен на русском?',
        a: 'Да, письменный экзамен DMV Калифорнии доступен на нескольких языках, и вы можете подготовиться с нашими тестами на русском.',
      },
    ],
    sourceNote: 'Источник: Департамент транспортных средств Калифорнии (DMV). Предоставляется как бесплатное учебное пособие.',
    officialUrl: 'https://www.dmv.ca.gov/portal/file/california-driver-handbook-russian-pdf/',
  },
  {
    code: 'vi',
    editionSlug: 'california-driver-handbook-vietnamese',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    dir: 'ltr',
    flag: '🇻🇳',
    pdfPath: '/pdfs/california-driver-handbook-vietnamese.pdf',
    pdfCurrent: true,
    testHref: '/dmv-vietnamese-test',
    metaTitle: 'Sổ Tay Lái Xe California (Tiếng Việt) — PDF Miễn Phí',
    metaDescription:
      'Đọc Sổ Tay Lái Xe California chính thức (ấn bản 2025) bằng tiếng Việt miễn phí. Tải PDF và luyện thi viết với các bài thi DMV miễn phí.',
    h1: 'Sổ Tay Lái Xe California (Tiếng Việt)',
    intro:
      'Sổ Tay Lái Xe California là tài liệu học chính thức cho kỳ thi viết DMV. Đây là ấn bản 2025 hiện hành của DMV California — đọc và tải miễn phí. Hãy đọc nó, rồi luyện tập với các bài thi miễn phí của chúng tôi để đậu ngay lần đầu.',
    sectionsHeading: 'Sổ tay gồm những gì',
    sections: [
      'Biển báo và tín hiệu giao thông',
      'Luật và quy tắc giao thông',
      'Quyền ưu tiên và giao lộ',
      'Giới hạn tốc độ',
      'Quy tắc đậu xe',
      'Lái xe an toàn và phòng thủ',
      'Chia sẻ đường — người đi bộ, xe đạp, xe máy',
      'Lấy bằng lái và quy trình thi',
    ],
    downloadLabel: 'Tải PDF chính thức (ấn bản 2025)',
    practiceHeading: 'Sẵn sàng kiểm tra bản thân?',
    practiceText: 'Luyện tập với các câu hỏi DMV California miễn phí bằng tiếng Việt. Không cần đăng ký.',
    practiceLabel: 'Bắt đầu bài thi miễn phí →',
    faq: [
      {
        q: 'Sổ Tay Lái Xe California có bằng tiếng Việt không?',
        a: 'Có. DMV California phát hành sổ tay bằng tiếng Việt miễn phí. Bạn có thể đọc tóm tắt tại đây và tải toàn bộ PDF chính thức miễn phí.',
      },
      {
        q: 'Tôi có thể thi viết bằng tiếng Việt không?',
        a: 'Có, kỳ thi viết DMV California có nhiều ngôn ngữ, và bạn có thể chuẩn bị với các bài thi tiếng Việt của chúng tôi.',
      },
    ],
    sourceNote: 'Nguồn: Sở Xe Cơ Giới California (DMV). Được cung cấp tại đây như tài liệu học miễn phí.',
    officialUrl: 'https://www.dmv.ca.gov/portal/file/california-driver-handbook-vietnamese-pdf/',
  },
  {
    code: 'ko',
    editionSlug: 'california-driver-handbook-korean',
    nativeName: '한국어',
    englishName: 'Korean',
    dir: 'ltr',
    flag: '🇰🇷',
    pdfPath: '/pdfs/california-driver-handbook-korean.pdf',
    pdfCurrent: false,
    pdfNote: 'DMV는 현재 한국어 핸드북을 공식 제공하지 않습니다. 아래는 참고용 이전 판이며, 최신 내용은 영어 공식 핸드북을 확인하세요.',
    testHref: '/dmv-korean-test',
    metaTitle: '캘리포니아 운전 핸드북 (한국어) — 무료 학습 자료 & 연습 시험',
    metaDescription:
      '캘리포니아 운전 핸드북 한국어 자료와 무료 DMV 연습 시험. 핸드북 PDF를 내려받고 한국어 연습 문제로 필기시험을 준비하세요.',
    h1: '캘리포니아 운전 핸드북 (한국어)',
    intro:
      '캘리포니아 운전 핸드북은 DMV 필기시험의 공식 학습 안내서입니다. 아래에서 핸드북을 내려받고, 한국어 무료 연습 시험으로 필기시험을 준비하세요.',
    sectionsHeading: '핸드북 주요 내용',
    sections: [
      '도로 표지판과 신호',
      '교통 법규와 도로 규칙',
      '우선 통행권과 교차로',
      '제한 속도',
      '주차 규칙',
      '안전 및 방어 운전',
      '도로 공유 — 보행자, 자전거, 오토바이',
      '면허 취득과 시험 절차',
    ],
    downloadLabel: '핸드북 PDF 내려받기',
    practiceHeading: '한국어로 연습해 보세요',
    practiceText: '이 핸드북을 기반으로 한 무료 캘리포니아 DMV 한국어 문제로 연습하세요. 가입 불필요.',
    practiceLabel: '무료 연습 시험 시작 →',
    faq: [
      {
        q: '캘리포니아 운전 핸드북은 한국어로 제공되나요?',
        a: '캘리포니아 DMV는 현재 한국어 핸드북을 공식적으로 제공하지 않습니다. 이 페이지에서 참고용 한국어 자료와 한국어 무료 연습 시험을 이용할 수 있으며, 최신 공식 핸드북은 영어로 제공됩니다.',
      },
      {
        q: '필기시험은 한국어로 볼 수 있나요?',
        a: '네. 캘리포니아 DMV 필기시험은 여러 언어로 제공되며, 한국어 연습 시험으로 미리 준비할 수 있습니다.',
      },
    ],
    sourceNote: '출처: 캘리포니아 차량관리국(DMV). 무료 학습 보조 자료로 제공됩니다.',
    officialUrl: OFFICIAL_HANDBOOK,
  },
  {
    code: 'ar',
    editionSlug: 'california-driver-handbook-arabic',
    nativeName: 'العربية',
    englishName: 'Arabic',
    dir: 'rtl',
    flag: '🇸🇦',
    pdfPath: '/pdfs/california-driver-handbook-arabic.pdf',
    pdfCurrent: false,
    pdfNote: 'لا توفّر DMV حاليًا نسخة عربية رسمية من الدليل. الملف أدناه نسخة مرجعية أقدم؛ للمحتوى الأحدث راجع الدليل الرسمي بالإنجليزية.',
    testHref: '/dmv-arabic-test',
    metaTitle: 'دليل سائق كاليفورنيا (بالعربية) — مادة دراسية واختبارات مجانية',
    metaDescription:
      'دليل سائق كاليفورنيا بالعربية واختبارات DMV التدريبية المجانية. حمّل ملف الدليل واستعد للاختبار التحريري بأسئلة تدريبية بالعربية.',
    h1: 'دليل سائق كاليفورنيا (بالعربية)',
    intro:
      'دليل سائق كاليفورنيا هو المرجع الرسمي للاستعداد للاختبار التحريري في DMV. حمّل الدليل أدناه، واستعد للاختبار باستخدام اختباراتنا التدريبية المجانية بالعربية.',
    sectionsHeading: 'محتويات الدليل',
    sections: [
      'إشارات وعلامات الطريق',
      'قوانين وقواعد المرور',
      'أحقية المرور والتقاطعات',
      'حدود السرعة',
      'قواعد الوقوف',
      'القيادة الآمنة والدفاعية',
      'مشاركة الطريق — المشاة والدراجات والدراجات النارية',
      'الحصول على الرخصة وإجراءات الاختبار',
    ],
    downloadLabel: 'تحميل ملف الدليل (PDF)',
    practiceHeading: 'تدرّب بالعربية',
    practiceText: 'تدرّب بأسئلة DMV كاليفورنيا المجانية بالعربية المبنية على هذا الدليل. بدون تسجيل.',
    practiceLabel: 'ابدأ اختبارًا تدريبيًا مجانيًا ←',
    faq: [
      {
        q: 'هل دليل سائق كاليفورنيا متوفر بالعربية؟',
        a: 'لا توفّر DMV كاليفورنيا حاليًا نسخة عربية رسمية من الدليل. تجد هنا مادة مرجعية بالعربية واختبارات تدريبية مجانية بالعربية، بينما يتوفر الدليل الرسمي الأحدث بالإنجليزية.',
      },
      {
        q: 'هل يمكن أداء الاختبار التحريري بالعربية؟',
        a: 'نعم، يتوفر اختبار DMV كاليفورنيا التحريري بعدة لغات، ويمكنك الاستعداد له باختباراتنا التدريبية بالعربية.',
      },
    ],
    sourceNote: 'المصدر: إدارة المركبات في كاليفورنيا (DMV). يُقدَّم هنا كمادة دراسية مجانية.',
    officialUrl: OFFICIAL_HANDBOOK,
  },
  {
    code: 'fa',
    editionSlug: 'california-driver-handbook-farsi',
    nativeName: 'فارسی',
    englishName: 'Farsi',
    dir: 'rtl',
    flag: '🇮🇷',
    pdfPath: '/pdfs/california-driver-handbook-farsi.pdf',
    pdfCurrent: false,
    pdfNote: 'DMV در حال حاضر نسخه رسمی فارسی کتابچه را ارائه نمی‌دهد. فایل زیر نسخه‌ای قدیمی‌تر برای مرجع است؛ برای محتوای به‌روز کتابچه رسمی انگلیسی را ببینید.',
    testHref: '/dmv-farsi-test',
    metaTitle: 'کتابچه راهنمای رانندگی کالیفرنیا (فارسی) — منبع رایگان و آزمون',
    metaDescription:
      'کتابچه راهنمای رانندگی کالیفرنیا به فارسی و آزمون‌های تمرینی رایگان DMV. فایل کتابچه را دانلود کنید و برای آزمون کتبی با سؤالات فارسی آماده شوید.',
    h1: 'کتابچه راهنمای رانندگی کالیفرنیا (فارسی)',
    intro:
      'کتابچه راهنمای رانندگی کالیفرنیا مرجع رسمی آمادگی برای آزمون کتبی DMV است. کتابچه را در پایین دانلود کنید و با آزمون‌های تمرینی رایگان فارسی ما آماده شوید.',
    sectionsHeading: 'محتوای کتابچه',
    sections: [
      'تابلوها و علائم راه',
      'قوانین و مقررات رانندگی',
      'حق تقدم و تقاطع‌ها',
      'محدودیت سرعت',
      'قوانین پارک',
      'رانندگی ایمن و تدافعی',
      'استفاده مشترک از جاده — عابران، دوچرخه، موتور',
      'دریافت گواهینامه و مراحل آزمون',
    ],
    downloadLabel: 'دانلود فایل کتابچه (PDF)',
    practiceHeading: 'به فارسی تمرین کنید',
    practiceText: 'با سؤالات رایگان DMV کالیفرنیا به فارسی که بر اساس این کتابچه است تمرین کنید. بدون ثبت‌نام.',
    practiceLabel: 'شروع آزمون تمرینی رایگان ←',
    faq: [
      {
        q: 'آیا کتابچه راهنمای رانندگی کالیفرنیا به فارسی موجود است؟',
        a: 'DMV کالیفرنیا در حال حاضر نسخه رسمی فارسی کتابچه را ارائه نمی‌دهد. در این صفحه منبع فارسی و آزمون‌های تمرینی رایگان فارسی در دسترس است و کتابچه رسمی به‌روز به انگلیسی ارائه می‌شود.',
      },
      {
        q: 'آیا می‌توان آزمون کتبی را به فارسی داد؟',
        a: 'بله، آزمون کتبی DMV کالیفرنیا به چند زبان ارائه می‌شود و می‌توانید با آزمون‌های تمرینی فارسی ما آماده شوید.',
      },
    ],
    sourceNote: 'منبع: اداره وسایل نقلیه موتوری کالیفرنیا (DMV). در اینجا به‌عنوان کمک‌آموزشی رایگان ارائه شده است.',
    officialUrl: OFFICIAL_HANDBOOK,
  },
];

export const HANDBOOK_EDITION_SLUGS = HANDBOOK_EDITIONS.map((e) => e.editionSlug);

export function getHandbookEdition(slug: string): HandbookEdition | undefined {
  return HANDBOOK_EDITIONS.find((e) => e.editionSlug === slug);
}
