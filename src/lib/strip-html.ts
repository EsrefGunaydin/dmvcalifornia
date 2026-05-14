/**
 * Remove all HTML tags and collapse whitespace. Safe for plain-text contexts
 * like JSON-LD answers, meta descriptions, etc.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Word count of HTML content after stripping tags. Used for reading-time
 * estimates and schema metadata.
 */
export function countWords(html: string): number {
  const text = stripHtml(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Reading time in minutes (Medium-style: 200 words/min average).
 */
export function readingTimeMinutes(html: string): number {
  return Math.max(1, Math.ceil(countWords(html) / 200));
}
