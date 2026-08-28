/**
 * One-time data fix: recompute the `percentage` field on existing
 * reaction-test-* leaderboard entries using the current percentageFromReaction
 * formula (150 / (points + 150) * 100).
 *
 * Why: the formula changed at some point (see the comment on
 * percentageFromReaction in src/types/reaction.ts) to fix a saturation bug
 * where every sub-300ms score tied at 100%. That fix only applies to new
 * writes — every entry submitted before the change still has its stale,
 * pre-fix percentage stored, and the leaderboard sorts by that stored field.
 * Result: old entries with a genuinely fast time (e.g. 17ms) sort below
 * newer entries with a slower time, because the old ones are frozen at the
 * old formula's saturated ~100% while comparably-fast new entries land at
 * their correct, non-saturated percentage.
 *
 * This script recomputes `percentage` from the already-correct `points`
 * field for every reaction-test-* document and updates only the ones whose
 * stored value is wrong. `points` itself is never touched.
 *
 * Usage: node scripts/fix-reaction-test-percentage.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

const REFERENCE_MS = 150;

function percentageFromReaction(bestMs) {
  return Math.max(0, Math.min(100, Math.round((REFERENCE_MS / (bestMs + REFERENCE_MS)) * 100)));
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected.');

    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    const entries = await collection
      .find({ quizId: { $regex: '^reaction-test-' } })
      .toArray();

    console.log(`Found ${entries.length} reaction-test entries.`);

    let updated = 0;
    let unchanged = 0;
    let skippedNoPoints = 0;

    for (const entry of entries) {
      if (typeof entry.points !== 'number') {
        skippedNoPoints += 1;
        continue;
      }
      const correctPercentage = percentageFromReaction(entry.points);
      if (entry.percentage === correctPercentage) {
        unchanged += 1;
        continue;
      }
      await collection.updateOne(
        { _id: entry._id },
        { $set: { percentage: correctPercentage } }
      );
      console.log(
        `  ${entry.name} (${entry.points}ms): ${entry.percentage} -> ${correctPercentage}`
      );
      updated += 1;
    }

    console.log('\nSummary:');
    console.log(`  Updated:   ${updated}`);
    console.log(`  Unchanged: ${unchanged}`);
    console.log(`  Skipped (no points field): ${skippedNoPoints}`);
    console.log('Done.');
  } catch (error) {
    console.error('Fix script failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
