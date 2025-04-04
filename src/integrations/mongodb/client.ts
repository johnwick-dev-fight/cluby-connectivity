
// This file is meant to be used only on the server side,
// not in the browser environment.
// For client-side code, use the API routes instead.

let clientPromise = null;

// Only create a MongoDB client when running on the server
if (typeof window === 'undefined') {
  const { MongoClient } = require('mongodb');
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluby';

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  clientPromise = new MongoClient(MONGODB_URI).connect();
} else {
  console.warn('MongoDB client cannot be created in the browser. Use API routes instead.');
}

export default clientPromise;
