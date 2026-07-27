/**
 * Hand-curated catalog of standalone, hand-authored top-level pages (not blog
 * posts, quizzes, SEO hubs, handbook editions, or safety events — those each
 * have their own data source and are assembled separately in
 * `src/lib/searchIndex.ts`). Title/description are transcribed from each
 * page's own `metadata` export, trimmed of the trailing site-name suffix.
 *
 * When adding a new standalone page under src/app/, add one entry here so
 * it's reachable from search — this file exists specifically because pages
 * like this had no other central listing (the gap that motivated search).
 */

export interface SearchPageEntry {
  title: string;
  description: string;
  href: string;
}

export const GUIDE_PAGES: SearchPageEntry[] = [
  {
    title: 'The 20 Hardest Questions on the DMV Written Test',
    description: 'The 20 hardest California DMV written test questions, ranked. Tap an answer, see if you got it right, and read why teens always miss it.',
    href: '/20-hardest-dmv-written-test-questions',
  },
  {
    title: 'About Us',
    description: 'Learn about DMV California, your trusted resource for DMV practice tests, study guides, and helpful articles.',
    href: '/about',
  },
  {
    title: 'Blog',
    description: 'Read our latest articles about California DMV, driving tests, traffic laws, and driving tips.',
    href: '/blog',
  },
  {
    title: 'CA DMV Bill of Sale & Release of Liability Guide 2026',
    description: 'What a California bill of sale needs to include, why the Release of Liability protects both buyer and seller, and how to file each one with the DMV.',
    href: '/california-dmv-bill-of-sale-release-of-liability',
  },
  {
    title: 'California DMV Blitz Test 2026: 15 Seconds Per Question',
    description: '20 DMV questions, 15 seconds each. Answer fast to earn speed-bonus points. The fastest way to sharpen your reflexes before the real test.',
    href: '/california-dmv-blitz-test',
  },
  {
    title: 'California DMV Cheat Sheet 2026 (Free Quick-Reference)',
    description: 'BAC limits, curb colors, speed limits, signal distances, right-of-way, parking on hills, points & fines — every fact the written test loves to ask.',
    href: '/california-dmv-cheat-sheet',
  },
  {
    title: 'California DMV Drug & Alcohol Test 2026',
    description: 'Free California DMV drug & alcohol practice test. BAC limits, zero tolerance, implied consent, and DUI penalties.',
    href: '/california-dmv-drug-and-alcohol-test',
  },
  {
    title: 'California DMV Fee Calculator 2026',
    description: 'Estimate your California DMV registration renewal or new-purchase fees: base fee, CHP fee, Vehicle License Fee, and use tax.',
    href: '/california-dmv-fee-calculator',
  },
  {
    title: 'California DMV Fees 2026',
    description: 'Current California DMV fees for 2026 — driver license, renewal, REAL ID, ID card, motorcycle, commercial license, and vehicle registration.',
    href: '/california-dmv-fees',
  },
  {
    title: 'California DMV Marathon Test 2026',
    description: 'Answer every practice question in one run, and any you miss come back until you get them all right. Free, unlimited, no signup.',
    href: '/california-dmv-marathon-test',
  },
  {
    title: 'California DMV Parking Test 2026',
    description: 'Curb colors, parking on hills, no-parking zones, and disabled parking — the parking rules the written test loves to ask.',
    href: '/california-dmv-parking-test',
  },
  {
    title: 'California DMV Road Signs Test 2026',
    description: 'Free California DMV road signs practice test with real sign images — regulatory, warning, and guide signs, instant answers and explanations.',
    href: '/california-dmv-road-signs-test',
  },
  {
    title: 'California DMV Speed Limits Test 2026',
    description: 'Residential, school zone, blind intersection, and freeway limits plus the Basic Speed Law — the speed questions on the written test.',
    href: '/california-dmv-speed-limit-test',
  },
  {
    title: 'How to Study for the California DMV Test 2026',
    description: 'A step-by-step study plan: handbook, cheat sheet, road signs, topic tests, full simulators, and a marathon — everything free, in one place.',
    href: '/california-dmv-test-study-guide',
  },
  {
    title: 'California Vehicle Registration Guide 2026',
    description: 'Registering a new purchase, renewing online or by mail, replacing a lost registration card, fees, smog rules, and late penalties.',
    href: '/california-dmv-vehicle-registration',
  },
  {
    title: 'California Driver Handbook 2026',
    description: 'The official California Driver Handbook, free. Read a summary and download the PDF in English, Spanish, Chinese, Korean, Arabic, and Farsi.',
    href: '/california-driver-handbook',
  },
  {
    title: 'California Regulatory Signs Test 2026',
    description: 'Learn what stop, yield, speed limit, no-turn, and other regulatory signs mean — with real images and instant answers.',
    href: '/california-regulatory-signs-test',
  },
  {
    title: 'California Commercial Driver (Class A/B) Practice Test',
    description: 'Free CDL Class A/B practice test. Real DMV questions covering general knowledge, air brakes, combination vehicles, pre-trip inspection, hazmat, and tank vehicles.',
    href: '/commercial-test',
  },
  {
    title: 'Defensive Driving: 5 Rules Every Driver Should Know',
    description: 'Scan ahead, know your surroundings, keep your eyes moving, plan for the worst, and stay visible. Free practice test included.',
    href: '/defensive-driving',
  },
  {
    title: 'DMV California اختبار عربي',
    description: 'اختبار DMV كاليفورنيا مجاناً باللغة العربية. California DMV practice test in Arabic.',
    href: '/dmv-arabic-test',
  },
  {
    title: 'DMV California Հայերեն Թեստ',
    description: 'Անվճար Կալիֆորնիայի DMV փորձնական թեստ հայերենով։ California DMV practice test in Armenian.',
    href: '/dmv-armenian-test',
  },
  {
    title: 'California DMV 中文考試',
    description: '加州 DMV 駕駛考試中文版。免費的中文練習測試，幫助您準備加州駕駛執照考試。',
    href: '/dmv-chinese-test',
  },
  {
    title: 'DMV California آزمون فارسی',
    description: 'آزمون شبیه‌ساز کالیفرنیا DMV به زبان فارسی. California DMV practice test in Farsi/Persian.',
    href: '/dmv-farsi-test',
  },
  {
    title: 'DMV California हिन्दी टेस्ट',
    description: 'मुफ़्त कैलिफोर्निया DMV हिन्दी अभ्यास परीक्षा। California DMV practice test in Hindi.',
    href: '/dmv-hindi-test',
  },
  {
    title: 'DMV California 한국어 시험',
    description: '무료 캘리포니아 DMV 한국어 연습 시험. California DMV practice test in Korean.',
    href: '/dmv-korean-test',
  },
  {
    title: 'California DMV Phone Number, Hours & Office Locations',
    description: 'California DMV phone number, hours, how to make an appointment, online services, and all 200+ DMV office locations.',
    href: '/dmv-offices',
  },
  {
    title: 'DMV California ਪੰਜਾਬੀ ਟੈਸਟ',
    description: 'ਮੁਫ਼ਤ ਕੈਲੀਫੋਰਨੀਆ DMV ਅਭਿਆਸ ਟੈਸਟ ਪੰਜਾਬੀ ਵਿੱਚ। California DMV practice test in Punjabi.',
    href: '/dmv-punjabi-test',
  },
  {
    title: 'DMV California Тест на русском',
    description: 'Бесплатный пробный тест DMV Калифорнии на русском языке. California DMV practice test in Russian.',
    href: '/dmv-russian-test',
  },
  {
    title: 'DMV California Tagalog Test',
    description: 'Libreng California DMV practice test sa Tagalog. California DMV practice test in Tagalog/Filipino.',
    href: '/dmv-tagalog-test',
  },
  {
    title: 'California DMV Türkçe Test',
    description: 'California DMV sınav soruları Türkçe. Kaliforniya ehliyet sınavına hazırlanmak için ücretsiz Türkçe pratik testleri.',
    href: '/dmv-turkish-test',
  },
  {
    title: 'DMV California Bài Thi Tiếng Việt',
    description: 'Bài thi thử DMV California miễn phí bằng tiếng Việt. California DMV practice test in Vietnamese.',
    href: '/dmv-vietnamese-test',
  },
  {
    title: 'California Traffic Safety Events Calendar 2026',
    description: 'The recurring traffic safety weeks and enforcement periods that matter to California drivers: Teen Driver Safety Week, Distracted Driving Awareness Month, CHP DUI enforcement, and more.',
    href: '/events',
  },
  {
    title: 'Examen Maratón del DMV en Español 2026',
    description: 'Practica todas las preguntas del examen del DMV de California en español en una sola sesión. Gratis, sin registro.',
    href: '/examen-maraton-dmv-espanol',
  },
  {
    title: 'Eyes on the Road — The Hazard-Spotting Game',
    description: 'A free hazard-perception game for California drivers. Scan a street scene and tap every developing hazard before the timer runs out.',
    href: '/eyes-on-the-road',
  },
  {
    title: 'DMV Games — Learn California Traffic Rules by Playing',
    description: 'Free games that teach California DMV rules: Right-of-Way Puzzle, DMVordle, Road Sign Memory Match, and a Brake Reaction Test.',
    href: '/games',
  },
  {
    title: 'Intersection — The Right-of-Way Puzzle Game',
    description: 'A free puzzle game that teaches California right-of-way rules across 10 escalating intersections.',
    href: '/intersection',
  },
  {
    title: 'DMV Practice Exams iOS Mobile App',
    description: 'Download the DMV Practice Exams iOS app. Master your California DMV written test with practice tests, flashcards, and study guides.',
    href: '/mobileapp',
  },
  {
    title: 'California Motorcycle (Class M) Practice Test',
    description: 'Free California Class M motorcycle license practice test. Real DMV questions covering helmets, lane position, braking, cornering, and group riding.',
    href: '/motorcycle-test',
  },
  {
    title: 'Examen del DMV de California en Español',
    description: 'Examen del DMV de California en español. Pruebas de práctica gratuitas en español para prepararse para su examen de licencia de conducir.',
    href: '/muestra-del-examen-escrito-para-licencia-de-manejar',
  },
  {
    title: 'MyDMV California: What It Is & How to Use It',
    description: 'MyDMV is the California DMV\'s online account portal. What you can do with it, how to sign up, and what to try if you cannot log in.',
    href: '/mydmv-california-account-guide',
  },
  {
    title: 'NY DMV Manual Chapter 4: Traffic Control',
    description: 'New York DMV driver\'s manual Chapter 4 guide: signs, traffic signals, pavement markings, and traffic officers — with a free practice quiz.',
    href: '/new-york-dmv-manual-chapter-4-traffic-control',
  },
  {
    title: 'California DMV Practice Tests',
    description: 'Free California DMV practice tests in English, Spanish, Turkish, Chinese, and more. Real DMV questions to prepare for your permit test.',
    href: '/practice-test',
  },
  {
    title: 'Videos',
    description: 'Watch our California DMV videos: practice test walkthroughs, driving tips, license guides, and more.',
    href: '/videos',
  },
];
