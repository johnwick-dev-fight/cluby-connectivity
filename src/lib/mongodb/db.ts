
import mongoose from 'mongoose';
import { DB_CONFIG } from '../env';

// Prevent MongoDB connection in browser environment
if (typeof window !== 'undefined') {
  console.warn('MongoDB connections should only be established in API routes, not in the browser');
}

// Get the MongoDB URI from environment variables or config
const MONGODB_URI = typeof window === 'undefined' ? 
  (process.env.MONGODB_URI || DB_CONFIG.uri) : 
  ''; // Empty string in browser

if (typeof window === 'undefined' && !MONGODB_URI) {
  console.error('Missing MongoDB connection string');
}

// Define a type-safe cached connection object
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Create a cached connection variable in a browser-safe way
let cached: CachedConnection = { conn: null, promise: null };

// In Node.js environment, we might want to attach to global object
if (typeof window === 'undefined') {
  // Using globalThis which works in both browser and Node environments
  const globalAny = globalThis as any;
  if (!globalAny.mongooseCache) {
    globalAny.mongooseCache = cached;
  } else {
    cached = globalAny.mongooseCache;
  }
}

async function dbConnect() {
  // Prevent connections in browser environment
  if (typeof window !== 'undefined') {
    console.warn('Attempted to connect to MongoDB from the browser');
    return null;
  }

  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully via Mongoose');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e);
    throw e;
  }
  
  return cached.conn;
}

export default dbConnect;
