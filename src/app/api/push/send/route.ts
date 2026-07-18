import { NextRequest, NextResponse } from 'next/server';
import { sendPushToAll } from '@/lib/pushSend';

export async function POST(request: NextRequest) {
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

  try {
    const result = await sendPushToAll(payload);
    return NextResponse.json(result);
  } catch (err) {
    console.error('push/send error:', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
