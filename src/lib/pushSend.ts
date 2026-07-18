import webpush from 'web-push';
import { getMongoClient } from '@/lib/mongodb';

export interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
}

export interface PushSendResult {
  sent: number;
  failed: number;
  staleRemoved: number;
}

/** Sends a notification to every stored subscription, pruning any that come
 * back as gone (410/404). Shared by the manual admin-triggered send route
 * and the scheduled cron. */
export async function sendPushToAll(payload: PushPayload): Promise<PushSendResult> {
  if (!process.env.VAPID_SUBJECT || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    throw new Error('VAPID env vars not configured');
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  // Only allow relative paths to prevent push notifications being used as a
  // phishing vector.
  const rawUrl = typeof payload.url === 'string' ? payload.url : '';
  const safeUrl = rawUrl.startsWith('/') ? rawUrl : '/practice-test';

  const notification = JSON.stringify({
    title: typeof payload.title === 'string' ? payload.title.slice(0, 100) : 'DMV California',
    body: typeof payload.body === 'string' ? payload.body.slice(0, 200) : 'Practice today to keep your streak alive.',
    url: safeUrl,
    tag: 'streak-reminder',
  });

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
      console.error('pushSend: failed to delete stale subscriptions:', delErr);
    }
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  return { sent, failed, staleRemoved };
}
