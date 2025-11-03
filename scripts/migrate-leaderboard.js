/**
 * Migration script to import existing leaderboard data from JSON to MongoDB
 * Run this once to migrate your existing leaderboard entries
 *
 * Usage: node scripts/migrate-leaderboard.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

async function migrateLeaderboard() {
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in environment variables');
    console.error('Please add MONGODB_URI to your .env file');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    // Check if collection already has data
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Warning: Collection already has ${existingCount} entries`);
      console.log('Do you want to continue and add more entries? (y/n)');

      // For non-interactive mode, we'll skip this check
      // You can manually run this script and handle the prompt
    }

    // Read JSON file
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'leaderboard.json');
    console.log(`📖 Reading leaderboard data from: ${jsonPath}`);

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const entries = jsonData.leaderboard;

    console.log(`📊 Found ${entries.length} entries in JSON file`);

    if (entries.length === 0) {
      console.log('No entries to migrate');
      return;
    }

    // Transform entries to MongoDB format
    const mongoEntries = entries.map(entry => ({
      quizId: entry.quizId,
      name: entry.name,
      email: entry.email || '',
      points: entry.points,
      percentage: entry.percentage,
      date: entry.date,
      completedAt: entry.completedAt || new Date(entry.date).toISOString(),
      createdAt: new Date(entry.date),
      // Keep original ID as reference
      originalId: entry.id,
    }));

    // Check for duplicates (based on name, quizId, and percentage)
    console.log('🔍 Checking for duplicates...');
    const newEntries = [];

    for (const entry of mongoEntries) {
      const existing = await collection.findOne({
        name: entry.name,
        quizId: entry.quizId,
        percentage: entry.percentage,
        completedAt: entry.completedAt,
      });

      if (!existing) {
        newEntries.push(entry);
      } else {
        console.log(`⏭️  Skipping duplicate: ${entry.name} - ${entry.percentage}% on Quiz ${entry.quizId}`);
      }
    }

    if (newEntries.length === 0) {
      console.log('✅ No new entries to import (all entries already exist in MongoDB)');
      return;
    }

    // Insert entries
    console.log(`📥 Importing ${newEntries.length} new entries...`);
    const result = await collection.insertMany(newEntries);
    console.log(`✅ Successfully imported ${result.insertedCount} entries`);

    // Show summary
    const totalCount = await collection.countDocuments();
    console.log(`\n📊 Migration Summary:`);
    console.log(`   Total entries in JSON: ${entries.length}`);
    console.log(`   New entries imported: ${result.insertedCount}`);
    console.log(`   Total entries in MongoDB: ${totalCount}`);
    console.log(`\n✅ Migration completed successfully!`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateLeaderboard();
