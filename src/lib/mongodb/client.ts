
import { MongoClient } from 'mongodb';

// Your MongoDB connection string 
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cluby";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global variable to maintain connection across hot reloads
let cached: { client: MongoClient | null; clientPromise: Promise<MongoClient> | null } = global.mongoClientPromise || { client: null, clientPromise: null };

if (!cached.clientPromise) {
  // In development mode, we use global variables to preserve connections
  if (process.env.NODE_ENV === 'development') {
    if (!global.mongoClientPromise) {
      const client = new MongoClient(MONGODB_URI);
      cached.clientPromise = client.connect();
      global.mongoClientPromise = cached;
    } else {
      cached = global.mongoClientPromise;
    }
  } else {
    // In production, don't use globals
    const client = new MongoClient(MONGODB_URI);
    cached.clientPromise = client.connect();
  }
}

export default cached.clientPromise;
