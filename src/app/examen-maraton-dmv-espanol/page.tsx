import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import MarathonQuiz, { type MarathonQuestion } from '@/components/MarathonQuiz';
import quizzesData from '@/data/quizzes.json';

export const metadata: Metadata = {
  title: 'Examen Maratón del DMV en Español 2026: Todas las Preguntas | DMV California',
  description:
    'Practica todas las preguntas del examen del DMV de California en español en una sola sesión. Si fallas una, regresa hasta que la domines. Gratis, sin registro.',
  keywords: [
    'examen maraton dmv espanol',
    'examen dmv california espanol',
    'todas las preguntas examen dmv espanol',
    'practica examen dmv espanol california',
    'dmv practice test spanish california',
  ],
  alternates: { canonical: 'https://dmvcalifornia.us/examen-maraton-dmv-espanol' },
  openGraph: { title: 'Examen Maratón del DMV en Español 2026', type: 'website' },
};

function buildPool(): MarathonQuestion[] {
  const seen = new Set<string>();
  const pool: MarathonQuestion[] = [];
  for (const quiz of quizzesData.quizzes as any[]) {
    if (quiz.language !== 'es') continue;
    for (const q of quiz.questions || []) {
      if (q.image) continue;
      if (!Array.isArray(q.options) || q.options.length < 2) continue;
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer >= q.options.length) continue;
      const key = q.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push({
        id: `${quiz.slug}-${q.id}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
      });
    }
  }
  return pool;
}

const pool = buildPool();

const FAQ = [
  {
    q: '¿Qué es el examen maratón del DMV en español?',
    a: 'El maratón recorre todas las preguntas de práctica disponibles en español en una sola sesión. Si fallas una pregunta, vuelve al final de la fila y regresa hasta que la respondas correctamente. Solo terminas cuando has dominado todas.',
  },
  {
    q: '¿Cuántas preguntas tiene el maratón?',
    a: `Este maratón cubre ${pool.length} preguntas únicas del DMV de California en español, tomadas de todos nuestros exámenes de práctica en español. Los temas incluyen reglas de tráfico, señales, estacionamiento, límites de velocidad, alcohol al volante y manejo seguro.`,
  },
  {
    q: '¿Es gratis el examen maratón?',
    a: 'Sí, es completamente gratis y sin límite de intentos. No necesitas registrarte. Es la forma más completa de prepararte para el examen escrito del DMV de California.',
  },
  {
    q: '¿En qué se diferencia del examen de práctica regular?',
    a: 'Los exámenes de práctica regulares tienen entre 20 y 40 preguntas y te dan una puntuación al final. El maratón no tiene tiempo límite ni puntuación: avanzas pregunta por pregunta y no puedes pasar ninguna hasta responderla bien.',
  },
];

export default function SpanishMarathonPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-dmv-700 via-dmv-500 to-blue-500 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {pool.length} preguntas · gratis · sin registro
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Examen Maratón del DMV en Español
              </h1>
              <p className="text-xl text-white/90">
                Responde todas las preguntas en una sola sesión. Si fallas una, regresa al final hasta que la domines.
                Terminas solo cuando las sabes todas.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <MarathonQuiz questions={pool} />
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Preguntas frecuentes</h2>
              <div className="space-y-3">
                {FAQ.map((f, i) => (
                  <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                      {f.q}
                      <span className="text-primary group-open:rotate-180 transition-transform ml-2">▾</span>
                    </summary>
                    <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Más formas de practicar en español</h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/practice-test/examen-dmv-espanol-1" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Examen Español 1</Link>
                <Link href="/practice-test/examen-dmv-espanol-2" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Examen Español 2</Link>
                <Link href="/practice-test/examen-dmv-espanol-3" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Examen Español 3</Link>
                <Link href="/practice-test/examen-dmv-espanol-4" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Examen Español 4</Link>
                <Link href="/practice-test/dmv-spanish-practice-test-1" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Simulador Completo 1</Link>
                <Link href="/practice-test/dmv-spanish-practice-test-2" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Simulador Completo 2</Link>
                <Link href="/muestra-del-examen-escrito-para-licencia-de-manejar/examen-de-senales" className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">Examen de Señales</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
