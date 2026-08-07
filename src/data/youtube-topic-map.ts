export const CATEGORY_VIDEO_MAP: { keywords: string[]; videoId: string }[] = [
  { keywords: ['defensive', 'safe driving', 'habit'], videoId: 'svw0ITHJJFM' }, // "Bad driving habits"
];

export const FALLBACK_VIDEO_EN = 'AAYjx6l9X5g';
export const FALLBACK_VIDEO_ES = 'InU6I3Tsc8o';

export function pickVideoForCategory(category: string, language?: string): string {
  const norm = category.toLowerCase();
  const match = CATEGORY_VIDEO_MAP.find((m) => m.keywords.some((k) => norm.includes(k)));
  if (match) return match.videoId;
  return language === 'es' ? FALLBACK_VIDEO_ES : FALLBACK_VIDEO_EN;
}
