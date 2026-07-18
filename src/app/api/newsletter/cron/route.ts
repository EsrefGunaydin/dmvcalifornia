import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getMongoClient } from '@/lib/mongodb';
import { FROM_ADDRESS, getMarketingSubscriberEmails } from '@/lib/newsletter';
import { buildNewsletterHtml, buildReEngagementHtml, type NewsletterOptions } from '@/lib/newsletterTemplate';

const BATCH_SIZE = 90; // stay under Resend free tier 100/day limit
const RESEND_CHUNK = 100;

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

  // Priority 1: a manually-created one-off announcement campaign. Untouched
  // behavior from before — completes and stops once it reaches the end.
  let campaign = await db.collection('newsletter_campaigns').findOne({ status: 'active', kind: { $ne: 're_engagement' } });
  const isReEngagement = !campaign;

  // Priority 2: no one-off campaign running, so use the daily quota on the
  // persistent re-engagement drip instead (growth-plan step 4). This is a
  // singleton document that never "completes" — it wraps back to offset 0
  // once it reaches the end, so every subscriber gets touched roughly once
  // per full pass through the list (~853 people / 90 per day ≈ every 9-10
  // days), not "2-3x/week" as originally sketched, since Resend's free-tier
  // 100/day cap is shared with any one-off campaign and can't be exceeded.
  if (isReEngagement) {
    campaign = await db.collection('newsletter_campaigns').findOneAndUpdate(
      { kind: 're_engagement' },
      { $setOnInsert: { kind: 're_engagement', offset: 0, status: 'active', createdAt: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );
  }

  if (!campaign) {
    return NextResponse.json({ message: 'No active campaign' });
  }

  // Fetch opted-in emails, filtered to deliverable-looking addresses
  const allEmails = await getMarketingSubscriberEmails(db);

  const offset = campaign.offset as number;
  const batch = allEmails.slice(offset, offset + BATCH_SIZE);

  if (batch.length === 0) {
    if (isReEngagement) {
      return NextResponse.json({ kind: 're_engagement', message: 'No subscribers to re-engage' });
    }
    await db.collection('newsletter_campaigns').updateOne(
      { _id: campaign._id },
      { $set: { status: 'complete', completedAt: new Date() } }
    );
    return NextResponse.json({ kind: 'announcement', message: 'Campaign complete', totalSent: offset });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const opts: NewsletterOptions | null = isReEngagement ? null : {
    ...(campaign.content as NewsletterOptions),
    campaignId: campaign._id.toString(),
  };

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < batch.length; i += RESEND_CHUNK) {
    const chunk = batch.slice(i, i + RESEND_CHUNK);
    const messages = chunk.map((email) => ({
      from: FROM_ADDRESS,
      to: email,
      subject: opts ? opts.subject : "Today's Daily Challenge is ready",
      html: opts ? buildNewsletterHtml(opts, email) : buildReEngagementHtml(email),
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

  const reachedEnd = offset + batch.length >= allEmails.length;
  const newOffset = isReEngagement && reachedEnd ? 0 : offset + batch.length;
  const remaining = allEmails.length - (offset + batch.length);
  const isComplete = !isReEngagement && remaining <= 0;

  await db.collection('newsletter_campaigns').updateOne(
    { _id: campaign._id },
    {
      $set: {
        offset: newOffset,
        lastSentAt: new Date(),
        ...(isComplete ? { status: 'complete', completedAt: new Date() } : {}),
      },
      $push: { log: { date: new Date(), sent, failed, offset, newOffset } } as any,
    }
  );

  return NextResponse.json({
    kind: isReEngagement ? 're_engagement' : 'announcement',
    sent,
    failed,
    offset,
    newOffset,
    remaining: Math.max(0, remaining),
    ...(errors.length ? { errors } : {}),
  });
}
