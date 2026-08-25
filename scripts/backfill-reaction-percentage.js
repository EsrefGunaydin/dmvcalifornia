/**
 * One-off backfill: recompute `percentage` for existing reaction-test
 * leaderboard entries using the corrected percentageFromReaction formula.
 *
 * The old formula clamped every score under 300ms to percentage=100, so
 * most real reaction times tied and the all-time board sorted them in
 * whatever order MongoDB happened to return ties in, not by actual speed.
 * This recomputes `percentage` from the stored `points` (bestMs) field
 * using the same asymptotic formula now in src/types/reaction.ts, so
 * existing scores rank correctly against new submissions going forward.
 *
 * Safe to re-run — recomputing an already-correct percentage is a no-op.
 *
 * Usage:
 *   node scripts/backfill-reaction-percentage.js           # apply the fix
 *   node scripts/backfill-reaction-percentage.js --dry-run # preview only, no writes
 */

const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DRY_RUN = process.argv.includes('--dry-run');

// Keep in sync with percentageFromReaction() in src/types/reaction.ts.
const REFERENCE_MS = 150;
function percentageFromReaction(bestMs) {
  return Math.max(0, Math.min(100, Math.round((REFERENCE_MS / (bestMs + REFERENCE_MS)) * 100)));
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.DMVCALI_MONGODB_URI;
  if (!uri) {
    console.error('❌ Error: no MongoDB URI found. Set MONGODB_URI or DMVCALI_MONGODB_URI.');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB' + (DRY_RUN ? ' (dry run — no writes)' : ''));

    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    const entries = await collection.find({ quizId: { $regex: '^reaction-test-' } }).toArray();
    console.log(`📊 Found ${entries.length} reaction-test entries`);

    let updated = 0;
    let unchanged = 0;
    let skipped = 0;

    for (const entry of entries) {
      if (typeof entry.points !== 'number') {
        console.warn(`⏭️  Skipping ${entry._id} (${entry.name}): no numeric points field`);
        skipped++;
        continue;
      }

      const correctPercentage = percentageFromReaction(entry.points);
      if (entry.percentage === correctPercentage) {
        unchanged++;
        continue;
      }

      console.log(`  ${String(entry.name).padEnd(20)} ${entry.points}ms  ${entry.percentage}% -> ${correctPercentage}%`);
      if (!DRY_RUN) {
        await collection.updateOne({ _id: entry._id }, { $set: { percentage: correctPercentage } });
      }
      updated++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total reaction-test entries: ${entries.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Already correct: ${unchanged}`);
    console.log(`   Skipped (bad data): ${skipped}`);
    if (DRY_RUN) {
      console.log(`\n   Dry run only — re-run without --dry-run to apply.`);
    } else {
      console.log(`\n✅ Backfill complete!`);
    }
  } catch (error) {
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main();
