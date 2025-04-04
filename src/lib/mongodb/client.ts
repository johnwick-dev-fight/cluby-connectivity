
import { MongoClient } from 'mongodb';
import { DB_CONFIG } from '../env';

// Check browser environment
const isBrowser = typeof window !== 'undefined';

// MongoDB connection string from environment variables
const MONGODB_URI = isBrowser ? 
  '' : // Empty string in browser
  (process.env.MONGODB_URI || DB_CONFIG.uri);

if (!isBrowser && !MONGODB_URI) {
  console.error('Missing MongoDB connection string');
}

// Global variable to maintain connection across hot reloads
let cached: { client: MongoClient | null; clientPromise: Promise<MongoClient> | null } = { client: null, clientPromise: null };

// Use globalThis instead of global for browser compatibility
if (!isBrowser) {
  const globalAny = globalThis as any;
  
  if (!globalAny.mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    cached.clientPromise = client.connect()
      .then(client => {
        console.log('MongoDB connected via MongoClient');
        return client;
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
    globalAny.mongoClientPromise = cached;
  } else {
    cached = globalAny.mongoClientPromise;
  }
}

// Return null in browser environment
export default isBrowser ? null : cached.clientPromise;
