import { NextResponse } from 'next/server';
import { AFFILIATES, AFFILIATE_FALLBACK_URL } from '@/config/affiliates';

/**
 * Cloaked affiliate redirect. Article buttons link to /go/<slug>; this handler
 * 302-redirects to the configured destination. Keeping links internal lets us
 * swap destinations in one place (src/config/affiliates.ts), add tracking, and
 * keep crawlers out (see Disallow: /go/ in robots.txt).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const affiliate = AFFILIATES[slug];
  const target = affiliate?.url || AFFILIATE_FALLBACK_URL;
  return NextResponse.redirect(target, 302);
}
