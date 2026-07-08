import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getMongoClient } from '@/lib/mongodb';
import { FROM_ADDRESS } from '@/lib/newsletter';
import { buildNewsletterHtml, type NewsletterOptions } from '@/lib/newsletterTemplate';

const RESEND_BATCH_LIMIT = 100;

export async function POST(request: NextRequest) {
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

  let body: NewsletterOptions & { offset?: number; dryRun?: boolean; [k: string]: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    subject, previewText, posts, updates,
    youtubeId, youtubeTitle, quizQuestions, quizAnswerUrl,
    offset = 0, dryRun = false,
  } = body;

  if (!subject || !posts?.length) {
    return NextResponse.json({ error: 'subject and posts are required' }, { status: 400 });
  }

  const client = await getMongoClient();
  const col = client.db('dmvcalifornia').collection('leaderboard');
  const entries = await col
    .find({ marketingConsent: true, email: { $exists: true, $ne: '' } })
    .project({ email: 1 })
    .toArray();

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const seen = new Set<string>();
  const allEmails: string[] = [];
  for (const e of entries) {
    const lower = (e.email as string).toLowerCase().trim();
    if (lower && !seen.has(lower) && EMAIL_RE.test(lower)) {
      seen.add(lower);
      allEmails.push(e.email as string);
    }
  }

  const emails = allEmails.slice(offset);

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      totalOptedIn: allEmails.length,
      willSend: emails.length,
      sample: emails.slice(0, 3),
    });
  }

  if (emails.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No emails to send' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const opts: NewsletterOptions = {
    subject, previewText: previewText || subject, posts, updates: updates || [],
    youtubeId, youtubeTitle, quizQuestions, quizAnswerUrl,
  };

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Chunk into groups of 100 and use Resend batch API
  for (let i = 0; i < emails.length; i += RESEND_BATCH_LIMIT) {
    const chunk = emails.slice(i, i + RESEND_BATCH_LIMIT);
    const messages = chunk.map((email) => ({
      from: FROM_ADDRESS,
      to: email,
      subject,
      html: buildNewsletterHtml(opts, email),
    }));

    try {
      const result = await resend.batch.send(messages);
      if (result.error) {
        failed += chunk.length;
        errors.push(`chunk ${i}-${i + chunk.length}: ${result.error.message}`);
        console.error('Newsletter batch error:', result.error);
      } else {
        const data = (result.data as unknown as { id: string }[] | null);
        sent += data?.length ?? chunk.length;
      }
    } catch (err: any) {
      failed += chunk.length;
      errors.push(`chunk ${i}-${i + chunk.length}: ${err?.message}`);
      console.error('Newsletter batch error:', err?.message);
    }
  }

  return NextResponse.json({
    sent,
    failed,
    totalOptedIn: allEmails.length,
    ...(errors.length ? { errors } : {}),
  });
}
