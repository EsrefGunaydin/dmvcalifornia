import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import { verifyUnsubscribeToken } from '@/lib/newsletter';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  if (!email || !token) {
    return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
  }

  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: 'Invalid unsubscribe link' }, { status: 403 });
  }

  try {
    const client = await getMongoClient();
    const col = client.db('dmvcalifornia').collection('leaderboard');
    await col.updateMany(
      { email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
      { $set: { marketingConsent: false } }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
