// Script to migrate existing blog view counts from JSON to MongoDB
// Run with: node scripts/migrate-blog-views.js

require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');
const blogPostsData = require('../src/data/blog_posts.json');

async function migrateBlogViews() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('Make sure you have a .env.local file with MONGODB_URI');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('dmvcalifornia');
    const collection = db.collection('blog_views');

    console.log(`\n📊 Found ${blogPostsData.posts.length} blog posts in JSON file`);

    let migrated = 0;
    let skipped = 0;

    for (const post of blogPostsData.posts) {
      const views = post.views || 0;

      // Check if this post already has a view record
      const existing = await collection.findOne({ slug: post.slug });

      if (existing) {
        console.log(`⏭️  Skipping ${post.slug} (already exists with ${existing.views} views)`);
        skipped++;
        continue;
      }

      // Insert initial view count from JSON
      await collection.insertOne({
        slug: post.slug,
        views: views,
        createdAt: new Date(),
        lastViewed: new Date(),
        migratedFrom: 'blog_posts.json'
      });

      console.log(`✅ Migrated ${post.slug}: ${views} views`);
      migrated++;
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   Migrated: ${migrated} posts`);
    console.log(`   Skipped: ${skipped} posts (already in database)`);
    console.log(`   Total: ${blogPostsData.posts.length} posts`);

    // Create index on slug for faster lookups
    await collection.createIndex({ slug: 1 }, { unique: true });
    console.log('\n🔍 Created index on slug field');

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateBlogViews();
