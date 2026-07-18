import { createHmac, timingSafeEqual } from 'crypto';

const secret = () => {
  const s = process.env.NEWSLETTER_SECRET;
  if (!s) throw new Error('NEWSLETTER_SECRET env var not set');
  return s;
};

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', secret()).update(email.toLowerCase()).digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = generateUnsubscribeToken(email);
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(token, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const FROM_ADDRESS = 'DMV California <hello@mail.dmvcalifornia.us>';
export const SITE_URL = 'https://dmvcalifornia.us';

// Placeholder/testing domains that show up in the leaderboard from dev
// testing (e.g. name+email typed while testing the submission form). These
// are syntactically valid but never deliverable, and providers like Resend
// reject an entire batch if even one address in it is one of these — a
// handful of bad rows was silently zeroing out every send.
const PLACEHOLDER_DOMAINS = new Set(['example.com', 'example.org', 'example.net', 'test.com', 'domain.com']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isDeliverableEmail(email: string): boolean {
  if (!EMAIL_RE.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && !PLACEHOLDER_DOMAINS.has(domain);
}

/** Every unique, deliverable-looking email opted into marketing, sourced
 * from the leaderboard collection (there's no separate subscribers store,
 * see growth-plan step 3). Shared by the campaign cron and the recurring
 * re-engagement trigger so the filtering logic can't drift between them. */
export async function getMarketingSubscriberEmails(db: {
  collection: (name: string) => {
    find: (query: object) => { project: (p: object) => { toArray: () => Promise<{ email?: string }[]> } };
  };
}): Promise<string[]> {
  const entries = await db
    .collection('leaderboard')
    .find({ marketingConsent: true, email: { $exists: true, $ne: '' } })
    .project({ email: 1 })
    .toArray();

  const seen = new Set<string>();
  const emails: string[] = [];
  for (const e of entries) {
    const email = (e.email || '').trim();
    const lower = email.toLowerCase();
    if (lower && !seen.has(lower) && isDeliverableEmail(lower)) {
      seen.add(lower);
      emails.push(email);
    }
  }
  return emails;
}
