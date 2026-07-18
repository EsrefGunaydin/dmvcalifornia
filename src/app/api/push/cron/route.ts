import { NextRequest, NextResponse } from 'next/server';
import { sendPushToAll } from '@/lib/pushSend';

// Daily reminder pointing subscribers at today's Daily Challenge. Broadcasts
// to every subscription — there's currently no link between a push
// subscription and a specific user's streak/completion state, so this can't
// yet skip people who already did today's challenge. That's the next step
// (see growth-plan step 5: server-side streak association).
export async function GET(request: NextRequest) {
  // Vercel cron sends Authorization: Bearer CRON_SECRET
  const auth = request.headers.get('authorization');
  if (!auth || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const result = await sendPushToAll({
      title: "Today's Daily Challenge is ready",
      body: '10 fresh questions, same for everyone today. Keep your streak going.',
      url: '/practice-test/daily-challenge',
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error('push/cron error:', err);
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
