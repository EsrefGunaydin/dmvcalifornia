require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

async function updatePost() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('dmvcalifornia');
    const collection = db.collection('blog_views');

    // Update the post to have the correct initial count
    const result = await collection.updateOne(
      { slug: 'what-to-do-in-a-california-car-accident' },
      { $set: { views: 20702 } }
    );

    console.log('✅ Updated:', result.modifiedCount, 'document');

    // Verify the update
    const updated = await collection.findOne({ slug: 'what-to-do-in-a-california-car-accident' });
    console.log('✅ New count:', updated.views);

  } finally {
    await client.close();
  }
}

updatePost();
