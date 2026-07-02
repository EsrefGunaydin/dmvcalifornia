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

  const notification = JSON.stringify({
    title: payload.title || 'DMV California',
    body: payload.body || 'Practice today to keep your streak alive.',
    url: payload.url || '/practice-test',
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

    if (staleIds.length > 0) {
      await col.deleteMany({ _id: { $in: staleIds as any } });
    }

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    return NextResponse.json({ sent, failed, staleRemoved: staleIds.length });
  } catch (err) {
    console.error('push/send error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
