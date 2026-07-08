import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getMongoClient } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  // VAPID details set here (inside handler) so they are read at request time,
  // not at build time when env vars are unavailable.
  if (!process.env.VAPID_SUBJECT || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'VAPID env vars not configured' }, { status: 500 });
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  // Simple auth check — only allow requests with the correct admin token
  const auth = request.headers.get('authorization');
  if (!auth || auth !== `Bearer ${process.env.PUSH_ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  let payload: { title?: string; body?: string; url?: string } = {};
  try { payload = await request.json(); } catch { /* use defaults */ }

  // Only allow relative paths or explicitly allowlisted origin to prevent
  // push notifications being used as a phishing vector.
  const rawUrl = typeof payload.url === 'string' ? payload.url : '';
  const safeUrl = rawUrl.startsWith('/') ? rawUrl : '/practice-test';

  const notification = JSON.stringify({
    title: typeof payload.title === 'string' ? payload.title.slice(0, 100) : 'DMV California',
    body: typeof payload.body === 'string' ? payload.body.slice(0, 200) : 'Practice today to keep your streak alive.',
    url: safeUrl,
    tag: 'streak-reminder',
  });

  try {
    const client = await getMongoClient();
    const col = client.db('dmvcalifornia').collection('push-subscriptions');
    const subs = await col.find({}).toArray();

    const staleIds: string[] = [];
    const results = await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(sub as unknown as webpush.PushSubscription, notification).catch((err) => {
          if (err.statusCode === 410 || err.statusCode === 404) staleIds.push(sub._id.toString());
          throw err;
        })
      )
    );

    let staleRemoved = 0;
    if (staleIds.length > 0) {
      try {
        const del = await col.deleteMany({ _id: { $in: staleIds as any } });
        staleRemoved = del.deletedCount;
      } catch (delErr) {
        console.error('push/send: failed to delete stale subscriptions:', delErr);
      }
    }

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    return NextResponse.json({ sent, failed, staleRemoved });
  } catch (err) {
    console.error('push/send error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
