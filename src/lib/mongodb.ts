import { MongoClient } from 'mongodb';

const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Lazy initialization - creates connection only when actually called
export async function getMongoClient(): Promise<MongoClient> {
  // Support both the manual MONGODB_URI and the Vercel-managed DMVCALI_MONGODB_URI
  const uri = process.env.MONGODB_URI || process.env.DMVCALI_MONGODB_URI;

  if (!uri) {
    throw new Error('No MongoDB URI found. Set MONGODB_URI or DMVCALI_MONGODB_URI.');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, create a new client for each invocation
    // Vercel serverless functions are stateless
    const client = new MongoClient(uri, options);
    return client.connect();
  }
}

// For backwards compatibility - but callers should migrate to getMongoClient()
export default { getMongoClient };
