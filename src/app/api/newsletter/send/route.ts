import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getMongoClient } from '@/lib/mongodb';
import { FROM_ADDRESS } from '@/lib/newsletter';
import { buildNewsletterHtml, type NewsletterOptions } from '@/lib/newsletterTemplate';

export async function POST(request: NextRequest) {
  // Admin-only — reuse the existing push admin token
  const auth = request.headers.get('authorization');
  if (!auth || auth !== `Bearer ${process.env.PUSH_ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }
  if (!process.env.NEWSLETTER_SECRET) {
    return NextResponse.json({ error: 'NEWSLETTER_SECRET not configured' }, { status: 500 });
  }

  let body: NewsletterOptions & { batchSize?: number; offset?: number; dryRun?: boolean; [k: string]: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    subject, previewText, posts, updates,
    youtubeId, youtubeTitle, quizQuestions, quizAnswerUrl,
    batchSize = 90, offset = 0, dryRun = false,
  } = body;

  if (!subject || !posts?.length) {
    return NextResponse.json({ error: 'subject and posts are required' }, { status: 400 });
  }

  // Fetch opted-in emails from MongoDB
  const client = await getMongoClient();
  const col = client.db('dmvcalifornia').collection('leaderboard');
  const entries = await col
    .find({ marketingConsent: true, email: { $exists: true, $ne: '' } })
    .project({ email: 1 })
    .toArray();

  // Deduplicate by email (case-insensitive)
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const e of entries) {
    const lower = (e.email as string).toLowerCase().trim();
    if (lower && !seen.has(lower)) {
      seen.add(lower);
      emails.push(e.email as string);
    }
  }

  const batch = emails.slice(offset, offset + batchSize);
  const remaining = emails.length - offset - batch.length;

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      totalOptedIn: emails.length,
      batchStart: offset,
      batchSize: batch.length,
      remaining,
      sample: batch.slice(0, 3),
    });
  }

  if (batch.length === 0) {
    return NextResponse.json({ sent: 0, remaining: 0, message: 'No emails in this batch' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const opts: NewsletterOptions = {
    subject, previewText: previewText || subject, posts, updates: updates || [],
    youtubeId, youtubeTitle, quizQuestions, quizAnswerUrl,
  };

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Send individually so each gets a personalised unsubscribe token
  for (const email of batch) {
    try {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject,
        html: buildNewsletterHtml(opts, email),
      });
      sent++;
    } catch (err: any) {
      failed++;
      errors.push(`${email}: ${err?.message}`);
      console.error('Newsletter send error:', email, err?.message);
    }
  }

  return NextResponse.json({
    sent,
    failed,
    totalOptedIn: emails.length,
    batchStart: offset,
    remaining,
    nextOffset: offset + batch.length,
    ...(errors.length ? { errors } : {}),
  });
}
