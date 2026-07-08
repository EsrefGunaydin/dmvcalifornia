import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  let subscription: PushSubscription;
  try {
    subscription = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const raw = subscription as any;
  if (!raw?.endpoint || typeof raw.endpoint !== 'string') {
    return NextResponse.json({ error: 'Missing subscription endpoint' }, { status: 400 });
  }

  // Only store the three known fields — never spread arbitrary client JSON into DB.
  const safeDoc = {
    endpoint: raw.endpoint,
    keys: {
      auth: typeof raw.keys?.auth === 'string' ? raw.keys.auth : '',
      p256dh: typeof raw.keys?.p256dh === 'string' ? raw.keys.p256dh : '',
    },
  };

  try {
    const client = await getMongoClient();
    const col = client.db('dmvcalifornia').collection('push-subscriptions');
    await col.updateOne(
      { endpoint: safeDoc.endpoint },
      { $set: { ...safeDoc, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('push/subscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
