
// This file is meant to be used only on the server side,
// not in the browser environment.

// Prevent mongoose import in browser
let clientPromise: Promise<any> | null = null;

// Only create a MongoDB client when running on the server
if (typeof window === 'undefined') {
  const { MongoClient } = require('mongodb');
  
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluby';

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  // Global is used here to maintain a cached connection across hot reloads
  // in development. This prevents connections growing exponentially.
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<any>;
  };
  
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    globalWithMongo._mongoClientPromise = client.connect()
      .then((client: any) => {
        console.log('MongoDB connected via MongoClient');
        return client;
      })
      .catch((err: any) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }
  
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.warn('MongoDB client cannot be created in the browser. Use API routes instead.');
}

export default clientPromise;
