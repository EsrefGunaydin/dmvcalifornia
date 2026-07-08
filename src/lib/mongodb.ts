import { MongoClient } from 'mongodb';

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 10000,
  maxPoolSize: 10,
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Lazy initialization - creates connection only when actually called.
// Uses a module-level global so the connection is reused across invocations
// within the same Vercel container (warm starts), and across HMR reloads in dev.
export async function getMongoClient(): Promise<MongoClient> {
  // Support both the manual MONGODB_URI and the Vercel-managed DMVCALI_MONGODB_URI
  const uri = process.env.MONGODB_URI || process.env.DMVCALI_MONGODB_URI;

  if (!uri) {
    throw new Error('No MongoDB URI found. Set MONGODB_URI or DMVCALI_MONGODB_URI.');
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

// For backwards compatibility - but callers should migrate to getMongoClient()
export default { getMongoClient };
