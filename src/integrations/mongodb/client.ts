
// This file is meant to be used only on the server side,
// not in the browser environment.

// Prevent mongoose import in browser
let clientPromise: Promise<any> | null = null;

// Only create a MongoDB client when running on the server
if (typeof window === 'undefined') {
  const { MongoClient } = require('mongodb');
  
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<db_username>:<db_password>@cluster0.rvg9arm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  // Global is used here to maintain a cached connection across hot reloads
  // in development. This prevents connections growing exponentially.
  const globalAny = globalThis as any;
  
  if (!globalAny.mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect()
      .then((client: any) => {
        console.log('MongoDB connected via MongoClient');
        return client;
      })
      .catch((err: any) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
    globalAny.mongoClientPromise = clientPromise;
  } else {
    clientPromise = globalAny.mongoClientPromise;
  }
} else {
  console.warn('MongoDB client cannot be created in the browser. Use API routes instead.');
}

export default clientPromise;
