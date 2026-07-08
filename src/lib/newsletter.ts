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
