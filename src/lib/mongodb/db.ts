
import mongoose from 'mongoose';

// Prevent MongoDB connection in browser environment
if (typeof window !== 'undefined') {
  console.warn('MongoDB connections should only be established in API routes, not in the browser');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluby';

if (!MONGODB_URI) {
  console.warn('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (typeof window !== 'undefined') {
    console.warn('Attempted to connect to MongoDB from the browser');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
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
