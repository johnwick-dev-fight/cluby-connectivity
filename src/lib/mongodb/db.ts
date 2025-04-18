
import mongoose from 'mongoose';
import { DB_CONFIG } from '../env';

// Prevent MongoDB connection in browser environment
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  console.warn('MongoDB connections should only be established in API routes, not in the browser');
}

// Get the MongoDB URI from environment variables or config
const MONGODB_URI = !isBrowser ? DB_CONFIG.uri : '';

if (!MONGODB_URI && !isBrowser) {
  console.error('Missing MongoDB connection string');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Create a cached connection variable in a browser-safe way
let cached: CachedConnection = { conn: null, promise: null };

if (!isBrowser) {
  const globalAny = globalThis as any;
  if (!globalAny.mongooseCache) {
    globalAny.mongooseCache = cached;
  } else {
    cached = globalAny.mongooseCache;
  }
}

async function dbConnect() {
  // Prevent connections in browser environment
  if (isBrowser) {
    console.warn('Attempted to connect to MongoDB from the browser');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
