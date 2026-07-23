// Turns a quiz object (see src/data/quizzes.json) into an ordered list of
// "cues" — one per video slide. Each cue pairs a narration line (sent to
// ElevenLabs) with the exact render-route state/query that produces the
// matching slide, so audio duration and slide duration always agree
// (each slide is shown for exactly as long as its own audio clip lasts —
// no post-hoc silence detection or alignment step needed).

function letterFor(i) {
  return String.fromCharCode(65 + i);
}

const TEMPLATES = {
  en: {
    intro: (title, total) => `${title}. ${total} real DMV questions. Let's get started.`,
    number: (n) => `Question ${n}.`,
    reveal: (letter, correctText, explanation) =>
      `The correct answer is ${letter}. ${correctText}.${explanation}`,
    outro: `Great work. Take the full practice test for free at D M V California dot U S.`,
  },
  es: {
    intro: (title, total) => `${title}. ${total} preguntas reales del DMV. Empecemos.`,
    number: (n) => `Pregunta ${n}.`,
    reveal: (letter, correctText, explanation) =>
      `La respuesta correcta es ${letter}. ${correctText}.${explanation}`,
    outro: `Buen trabajo. Realiza el examen de practica completo gratis en D M V California punto U S.`,
  },
};

function buildCues(quiz) {
  const lang = TEMPLATES[quiz.language] ? quiz.language : 'en';
  const t = TEMPLATES[lang];
  const cues = [];

  cues.push({
    key: 'intro',
    state: 'intro',
    q: null,
    narration: t.intro(quiz.title, quiz.questions.length),
  });

  quiz.questions.forEach((question, i) => {
    cues.push({
      key: `q${i}-number`,
      state: 'number',
      q: i,
      narration: t.number(i + 1),
    });

    const optionsSpeech = question.options
      .map((opt, oi) => `${letterFor(oi)}. ${opt}`)
      .join(' ');
    cues.push({
      key: `q${i}-question`,
      state: 'question',
      q: i,
      narration: `${question.question} ${optionsSpeech}`,
    });

    const correctText = question.options[question.correctAnswer];
    const explanation = question.explanation && question.explanation.trim()
      ? ` ${question.explanation.trim()}`
      : '';
    cues.push({
      key: `q${i}-reveal`,
      state: 'reveal',
      q: i,
      narration: t.reveal(letterFor(question.correctAnswer), correctText, explanation),
    });
  });

  cues.push({
    key: 'outro',
    state: 'outro',
    q: null,
    narration: t.outro,
  });

  return cues;
}

module.exports = { buildCues };
