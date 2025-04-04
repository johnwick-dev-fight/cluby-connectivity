
import { MongoClient } from 'mongodb';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<db_username>:<db_password>@cluster0.rvg9arm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      cached.clientPromise = client.connect()
        .then(client => {
          console.log('MongoDB connected via MongoClient');
          return client;
        })
        .catch(err => {
          console.error('MongoDB connection error:', err);
          throw err;
        });
      global.mongoClientPromise = cached;
    } else {
      cached = global.mongoClientPromise;
    }
  } else {
    // In production, don't use globals
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
  }
}

export default cached.clientPromise;
