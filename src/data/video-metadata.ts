// Metadata for every YouTube video embedded on a blog post via the
// `youtubeId` field, keyed by video ID. Powers the VideoObject structured
// data in ArticleSchema.tsx so Google recognizes the post as a "watch page"
// for the video (Search Console's Video indexing report otherwise flags
// "Video isn't on a watch page" even though the iframe embed itself works
// fine for visitors).
//
// title/description/durationSeconds/uploadDate are sourced directly from
// YouTube's own schema.org meta tags on the video's watch page (uploadDate
// and duration are not reliably available via the public oEmbed endpoint).
// When adding a new `youtubeId` to a blog post, add a matching entry here —
// posts whose video ID has no entry simply don't get VideoObject markup.
export const videoMetadata: Record<
  string,
  { title: string; description: string; durationSeconds: number; uploadDate: string }
> = {
  qoAq535Khqc: {
    title: 'How to renew your driver license at a DMV kiosk',
    description: 'A short walkthrough of renewing a California driver license at a self-service DMV kiosk.',
    durationSeconds: 69,
    uploadDate: '2024-11-01T01:51:54Z',
  },
  AAYjx6l9X5g: {
    title: 'California DMV practice test 2026',
    description: '46 real California DMV practice questions with answers and explanations.',
    durationSeconds: 1269,
    uploadDate: '2026-06-27T23:44:44Z',
  },
  '__jvm6b2l78': {
    title: "State driver's licenses: all 51 designs",
    description: 'A look at driver license card designs across all 50 states and Washington D.C.',
    durationSeconds: 128,
    uploadDate: '2021-02-24T19:04:26Z',
  },
  ZILES86M7Ic: {
    title: 'How to get a driver license as an international student in the USA (2026)',
    description: 'Steps for international students to get a US driver license, including required documents.',
    durationSeconds: 92,
    uploadDate: '2018-05-29T01:50:11Z',
  },
  JgdKvdyQ87s: {
    title: 'Behind the wheel mistakes that fail the driving test',
    description: 'Common driving errors that lead to an automatic fail on the behind-the-wheel test.',
    durationSeconds: 56,
    uploadDate: '2018-04-09T20:22:48Z',
  },
  svw0ITHJJFM: {
    title: 'Bad driving habits that cost you points and money',
    description: 'Everyday driving habits that lead to points on your license and higher insurance costs.',
    durationSeconds: 132,
    uploadDate: '2018-03-30T20:48:13Z',
  },
  R1YeCA2fJyE: {
    title: 'Examen de práctica del DMV #1 en español',
    description: 'Preguntas reales del examen de manejo del DMV de California con respuestas explicadas.',
    durationSeconds: 665,
    uploadDate: '2026-07-23T18:48:32Z',
  },
  '7GrrcUR97E8': {
    title: 'Department Of Justice DMV Traffic Stop',
    description: 'What to expect and how to behave during a traffic stop in California.',
    durationSeconds: 733,
    uploadDate: '2026-01-06T13:14:11-08:00',
  },
  ILbrTbz3uLM: {
    title: 'Upgrade to a REAL ID Now',
    description: 'Why and how to upgrade to a REAL ID-compliant California driver license or ID card.',
    durationSeconds: 86,
    uploadDate: '2024-03-21T15:29:02-07:00',
  },
};

/** Converts whole seconds to an ISO 8601 duration string, e.g. 754 -> "PT12M34S". */
export function secondsToIso8601Duration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  if (seconds > 0 || (hours === 0 && minutes === 0)) result += `${seconds}S`;
  return result;
}
