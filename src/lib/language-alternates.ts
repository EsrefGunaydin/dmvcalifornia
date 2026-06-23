/**
 * Reciprocal hreflang cluster for the DMV practice-test landing pages.
 *
 * Each entry is the same "California DMV practice test" page expressed in a
 * different language. They are genuine translations of one intent, so they
 * form a valid hreflang group: every page in the cluster advertises the full
 * set (including itself), and `/practice-test` (English) is the x-default.
 *
 * Usage in a page's generateMetadata / metadata:
 *   alternates: languageAlternates('es')   // for the Spanish hub
 */

export const SITE_URL = 'https://www.dmvcalifornia.us';

// hreflang code -> absolute URL of that language's practice-test hub
export const PRACTICE_TEST_HUBS: Record<string, string> = {
  en: `${SITE_URL}/practice-test`,
  es: `${SITE_URL}/muestra-del-examen-escrito-para-licencia-de-manejar`,
  tr: `${SITE_URL}/dmv-turkish-test`,
  zh: `${SITE_URL}/dmv-chinese-test`,
  ar: `${SITE_URL}/dmv-arabic-test`,
  hy: `${SITE_URL}/dmv-armenian-test`,
  fa: `${SITE_URL}/dmv-farsi-test`,
  pa: `${SITE_URL}/dmv-punjabi-test`,
  ru: `${SITE_URL}/dmv-russian-test`,
  tl: `${SITE_URL}/dmv-tagalog-test`,
  vi: `${SITE_URL}/dmv-vietnamese-test`,
  ko: `${SITE_URL}/dmv-korean-test`,
  hi: `${SITE_URL}/dmv-hindi-test`,
};

/**
 * Build a Next.js `alternates` object for a given member of the cluster.
 * @param lang the hreflang code of THIS page (e.g. 'es')
 */
export function languageAlternates(lang: keyof typeof PRACTICE_TEST_HUBS | string) {
  const self = PRACTICE_TEST_HUBS[lang];
  return {
    canonical: self,
    languages: {
      ...PRACTICE_TEST_HUBS,
      'x-default': PRACTICE_TEST_HUBS.en,
    },
  };
}
