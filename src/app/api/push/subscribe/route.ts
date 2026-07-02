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

  if (!subscription || !(subscription as any).endpoint) {
    return NextResponse.json({ error: 'Missing subscription endpoint' }, { status: 400 });
  }

  try {
    const client = await getMongoClient();
    const col = client.db('dmvcalifornia').collection('push-subscriptions');
    await col.updateOne(
      { endpoint: (subscription as any).endpoint },
      { $set: { ...subscription, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('push/subscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
