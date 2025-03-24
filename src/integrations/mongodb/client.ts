
// This file is meant to be used only on the server side,
// not in the browser environment.
// For client-side code, use the API routes instead.

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluby';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Create a MongoDB client only when running on the server
const clientPromise = typeof window === 'undefined' 
  ? new MongoClient(MONGODB_URI).connect()
  : null;

export default clientPromise;
