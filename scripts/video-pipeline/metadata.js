function formatTimestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Short jump-label for a timestamp line, e.g. "Two sets of solid, double,
// yellow lines that are two or more feet apart:" -> "Two sets of solid,
// double, yellow lines that are two or...". Full question text is already
// spoken in the video and shown on-slide; this is just a scannable label
// in the description, so a clean truncation is enough — no need to
// hand-author a punchier rewrite per question.
function shortLabel(questionText, maxLen = 48) {
  const cleaned = questionText.replace(/[:?]\s*$/, '').trim();
  if (cleaned.length <= maxLen) return cleaned;
  const cut = cleaned.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen)}...`;
}

// YouTube rejects titles over 100 chars. Some quiz titles are already
// bilingual/long (e.g. "California DMV Practice Test in Spanish / Examen de
// Practica del DMV en Espanol"), so base title + suffix can overflow —
// truncate the base at a word boundary rather than let the upload fail.
const MAX_TITLE_LENGTH = 100;
function buildTitle(baseTitle, suffix, maxLen = MAX_TITLE_LENGTH) {
  const full = `${baseTitle} | ${suffix}`;
  if (full.length <= maxLen) return full;
  const room = maxLen - suffix.length - 5; // " | " + ellipsis buffer
  const cut = baseTitle.slice(0, Math.max(0, room));
  const lastSpace = cut.lastIndexOf(' ');
  const trimmedBase = (lastSpace > 15 ? cut.slice(0, lastSpace) : cut).trim();
  return `${trimmedBase}… | ${suffix}`;
}

const DIVIDER = '─'.repeat(38);

const SITE = 'https://dmvcalifornia.us';
const APP_URL = 'https://apps.apple.com/app/dmv-california/id6754900213';

// English audience has 14 dedicated tool pages to cross-promote. Spanish
// content is limited to what actually exists today (2 pages) — don't list
// English-only pages as if they were Spanish content. Expand this list as
// more /*-espanol pages ship.
const MORE_TESTS = {
  en: [
    { emoji: '🚗', label: 'Full Practice Test', path: '/california-dmv-practice-test' },
    { emoji: '📋', label: 'Permit Test', path: '/california-permit-test' },
    { emoji: '🛣️', label: 'Road Signs Test', path: '/california-dmv-road-signs-test' },
    { emoji: '🏎️', label: 'Marathon Test (All Topics)', path: '/california-dmv-marathon-test' },
    { emoji: '📖', label: 'DMV Cheat Sheet', path: '/california-dmv-cheat-sheet' },
    { emoji: '📘', label: 'CA Driver Handbook', path: '/california-driver-handbook' },
    { emoji: '⚡', label: 'Speed Limit Test', path: '/california-dmv-speed-limit-test' },
    { emoji: '🅿️', label: 'Parking Test', path: '/california-dmv-parking-test' },
    { emoji: '🧪', label: 'Drug & Alcohol Test', path: '/california-dmv-drug-and-alcohol-test' },
    { emoji: '🚛', label: 'Commercial (CDL) Test', path: '/commercial-test' },
    { emoji: '🏍️', label: 'Motorcycle Test', path: '/motorcycle-test' },
    { emoji: '👴', label: 'Seniors Test', path: '/california-dmv-practice-test-for-seniors' },
    { emoji: '🇪🇸', label: 'Examen en Español', path: '/california-dmv-practice-test-espanol' },
    { emoji: '🔥', label: '20 Hardest Questions', path: '/20-hardest-dmv-written-test-questions' },
  ],
  es: [
    { emoji: '🚗', label: 'Examen de Practica Completo', path: '/california-dmv-practice-test-espanol' },
    { emoji: '🏎️', label: 'Examen Maraton (Todos los Temas)', path: '/examen-maraton-dmv-espanol' },
    { emoji: '🇺🇸', label: 'Full Test in English', path: '/california-dmv-practice-test' },
  ],
};

const STRINGS = {
  en: {
    intro: (total) =>
      `Pass your California DMV written test on the first try! ${total} real DMV practice questions with the correct answer and a clear explanation after each one — updated for 2026.`,
    freeTests: '🔗 FREE PRACTICE TESTS',
    iosApp: '📱 iOS APP',
    jumpHeader: '📌 JUMP TO ANY QUESTION',
    introLabel: 'Intro',
    moreTestsHeader: '📚 MORE FREE PRACTICE TESTS',
    downloadHeader: '📱 DOWNLOAD THE FREE iOS APP',
    downloadBody: 'Practice offline, track your score, retake anytime — no sign-up needed.',
    topicsHeader: '🏷️ TOPICS COVERED IN THIS TEST',
    closing: 'All questions are based on the official 2026 California Driver Handbook. Practice as many times as you need.',
    titleSuffix: (total) => `Answers Explained (${total} Questions)`,
  },
  es: {
    intro: (total) =>
      `Aprueba tu examen escrito del DMV de California a la primera! ${total} preguntas reales con la respuesta correcta y una explicacion clara despues de cada una, actualizado para 2026.`,
    freeTests: '🔗 EXAMENES GRATIS',
    iosApp: '📱 APP PARA iOS',
    jumpHeader: '📌 IR A CUALQUIER PREGUNTA',
    introLabel: 'Introduccion',
    moreTestsHeader: '📚 MAS EXAMENES GRATIS',
    downloadHeader: '📱 DESCARGA LA APP GRATIS PARA iOS',
    downloadBody: 'Practica sin conexion, guarda tu puntaje, repite cuando quieras, sin necesidad de registrarte.',
    topicsHeader: '🏷️ TEMAS CUBIERTOS EN ESTE EXAMEN',
    closing: 'Todas las preguntas estan basadas en el Manual Oficial del Conductor de California 2026. Practica las veces que necesites.',
    titleSuffix: (total) => `Respuestas Explicadas (${total} Preguntas)`,
  },
};

function padLabel(label, width) {
  return label.length >= width ? label : label + ' '.repeat(width - label.length);
}

function buildYoutubeMetadata(quiz, cues, cumulativeStarts) {
  const lang = STRINGS[quiz.language] ? quiz.language : 'en';
  const s = STRINGS[lang];
  const moreTests = MORE_TESTS[lang];

  const total = quiz.questions.length;
  const title = buildTitle(quiz.title, s.titleSuffix(total));

  const numberCues = cues
    .map((cue, i) => ({ cue, i }))
    .filter(({ cue }) => cue.state === 'number');

  const allTimestamps = ['0:00', ...numberCues.map(({ i }) => formatTimestamp(cumulativeStarts[i]))];
  const timeWidth = Math.max(...allTimestamps.map((t) => t.length)) + 1;
  const qWidth = `Q${total}`.length + 1;

  const timestampLines = [`${'0:00'.padEnd(timeWidth)}${s.introLabel}`];
  numberCues.forEach(({ cue, i }) => {
    const label = shortLabel(quiz.questions[cue.q].question);
    const timestamp = formatTimestamp(cumulativeStarts[i]).padEnd(timeWidth);
    const qLabel = `Q${cue.q + 1}`.padEnd(qWidth);
    timestampLines.push(`${timestamp}${qLabel}— ${label}`);
  });

  const maxLabelWidth = Math.max(...moreTests.map((t) => t.label.length)) + 2;
  const moreTestsLines = moreTests.map(
    (t) => `${t.emoji} ${padLabel(t.label, maxLabelWidth)} → ${SITE}${t.path}`
  );

  const topics = [...new Set(quiz.questions.map((q) => q.category).filter(Boolean))];

  const description = [
    s.intro(total),
    '',
    `${s.freeTests} → ${SITE}`,
    `${s.iosApp} → ${APP_URL}`,
    '',
    DIVIDER,
    s.jumpHeader,
    DIVIDER,
    ...timestampLines,
    '',
    DIVIDER,
    s.moreTestsHeader,
    DIVIDER,
    ...moreTestsLines,
    '',
    DIVIDER,
    s.downloadHeader,
    DIVIDER,
    s.downloadBody,
    `→ ${APP_URL}`,
    '',
    DIVIDER,
    s.topicsHeader,
    DIVIDER,
    ...topics.map((t) => `✅ ${t}`),
    '',
    DIVIDER,
    '',
    s.closing,
  ].join('\n');

  const tags = [
    'DMV practice test',
    'California DMV',
    'DMV written test',
    'drivers permit test',
    'DMV test answers',
    quiz.title,
  ];

  return { title, description, tags };
}

module.exports = { buildYoutubeMetadata, formatTimestamp, shortLabel };
