#!/usr/bin/env node
/**
 * One-time migration: ensures quiz_views collection has a unique index on quizId.
 * Run once after deploying: node scripts/migrate-quiz-views.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function migrateQuizViews() {
  const uri = process.env.MONGODB_URI || process.env.DMVCALI_MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found. Set it in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const collection = client.db('dmvcalifornia').collection('quiz_views');

    // Deduplicate: if two docs exist for the same quizId (race condition before
    // the index existed), keep the one with the higher view count.
    const dupes = await collection.aggregate([
      { $group: { _id: '$quizId', count: { $sum: 1 }, ids: { $push: '$_id' }, maxViews: { $max: '$views' } } },
      { $match: { count: { $gt: 1 } } },
    ]).toArray();

    for (const dupe of dupes) {
      // Find the doc with the highest views and keep it; delete the rest.
      const docs = await collection.find({ quizId: dupe._id }).sort({ views: -1 }).toArray();
      const [keep, ...remove] = docs;
      if (remove.length > 0) {
        await collection.deleteMany({ _id: { $in: remove.map(d => d._id) } });
        console.log(`Deduped quizId=${dupe._id}: kept ${keep.views} views, removed ${remove.length} duplicate(s)`);
      }
    }

    // Create unique index (no-op if it already exists).
    await collection.createIndex({ quizId: 1 }, { unique: true });
    console.log('Unique index on quizId created (or already existed)');

    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrateQuizViews();
