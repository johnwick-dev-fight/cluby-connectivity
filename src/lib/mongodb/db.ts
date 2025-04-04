
import mongoose from 'mongoose';

// Prevent MongoDB connection in browser environment
if (typeof window !== 'undefined') {
  console.warn('MongoDB connections should only be established in API routes, not in the browser');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<db_username>:<db_password>@cluster0.rvg9arm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cache to maintain a single connection
const globalWithMongoose = global as typeof global & {
  mongoose: CachedConnection;
};

let cached: CachedConnection = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
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
