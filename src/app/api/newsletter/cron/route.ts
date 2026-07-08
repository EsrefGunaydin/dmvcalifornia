import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getMongoClient } from '@/lib/mongodb';
import { FROM_ADDRESS } from '@/lib/newsletter';
import { buildNewsletterHtml, type NewsletterOptions } from '@/lib/newsletterTemplate';

const BATCH_SIZE = 90; // stay under Resend free tier 100/day limit
const RESEND_CHUNK = 100;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: NextRequest) {
  // Vercel cron sends Authorization: Bearer CRON_SECRET
  const auth = request.headers.get('authorization');
  if (!auth || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.NEWSLETTER_SECRET) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
  }

  const client = await getMongoClient();
  const db = client.db('dmvcalifornia');

  // Find the active campaign
  const campaign = await db.collection('newsletter_campaigns').findOne({ status: 'active' });
  if (!campaign) {
    return NextResponse.json({ message: 'No active campaign' });
  }

  // Fetch opted-in emails
  const entries = await db.collection('leaderboard')
    .find({ marketingConsent: true, email: { $exists: true, $ne: '' } })
    .project({ email: 1 })
    .toArray();

  const seen = new Set<string>();
  const allEmails: string[] = [];
  for (const e of entries) {
    const lower = (e.email as string).toLowerCase().trim();
    if (lower && !seen.has(lower) && EMAIL_RE.test(lower)) {
      seen.add(lower);
      allEmails.push(e.email as string);
    }
  }

  const offset = campaign.offset as number;
  const batch = allEmails.slice(offset, offset + BATCH_SIZE);

  if (batch.length === 0) {
    await db.collection('newsletter_campaigns').updateOne(
      { _id: campaign._id },
      { $set: { status: 'complete', completedAt: new Date() } }
    );
    return NextResponse.json({ message: 'Campaign complete', totalSent: offset });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const opts = campaign.content as NewsletterOptions;

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < batch.length; i += RESEND_CHUNK) {
    const chunk = batch.slice(i, i + RESEND_CHUNK);
    const messages = chunk.map((email) => ({
      from: FROM_ADDRESS,
      to: email,
      subject: opts.subject,
      html: buildNewsletterHtml(opts, email),
    }));

    try {
      const result = await resend.batch.send(messages);
      if (result.error) {
        failed += chunk.length;
        errors.push(`chunk ${i}: ${result.error.message}`);
      } else {
        const data = (result.data as unknown as { id: string }[] | null);
        sent += data?.length ?? chunk.length;
      }
    } catch (err: any) {
      failed += chunk.length;
      errors.push(`chunk ${i}: ${err?.message}`);
    }
  }

  const newOffset = offset + batch.length;
  const remaining = allEmails.length - newOffset;
  const isComplete = remaining <= 0;

  await db.collection('newsletter_campaigns').updateOne(
    { _id: campaign._id },
    {
      $set: {
        offset: newOffset,
        ...(isComplete ? { status: 'complete', completedAt: new Date() } : {}),
      },
      $push: { log: { date: new Date(), sent, failed, offset, newOffset } } as any,
    }
  );

  return NextResponse.json({ sent, failed, offset, newOffset, remaining, ...(errors.length ? { errors } : {}) });
}
