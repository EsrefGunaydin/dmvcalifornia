/**
 * Convert a tag like "Driver License" → "driver-license" for URL slug.
 * Shared by the category hub pages and blog post breadcrumbs.
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
