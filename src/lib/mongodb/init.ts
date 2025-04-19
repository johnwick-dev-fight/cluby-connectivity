
import dbConnect from './db';
import mongoose from 'mongoose';
import { DB_CONFIG } from '../env';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only import models on the server side
if (!isBrowser) {
  // Models - these should only be loaded server-side
  require('./models/User');
  require('./models/Profile');
  require('./models/Club');
  require('./models/Event');
  require('./models/Post');
  require('./models/Application');
  require('./models/ClubMembership');
  require('./models/Recruitment');
}

// Cache to prevent multiple initialization attempts
let initialized = false;

/**
 * Initialize the MongoDB connection and load all models
 * This should be called during API initialization to ensure 
 * database is ready before handling requests
 */
export async function initMongoDB() {
  // Skip if already initialized or in browser environment
  if (initialized || isBrowser) {
    return;
  }
  
  const uri = DB_CONFIG.uri;
  
  if (!uri) {
    console.error('MongoDB connection string is not configured. Set MONGODB_URI environment variable.');
    return;
  }
  
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection details: Username=${DB_CONFIG.username}, Cluster=${DB_CONFIG.cluster}, DB=${DB_CONFIG.dbName}`);
    
    // Connect to MongoDB
    await dbConnect();
    console.log('MongoDB initialized successfully');
    
    // Log connection details for debugging (but hide credentials)
    const redactedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`Connected to MongoDB at: ${redactedUri}`);
    console.log(`MongoDB connection state: ${mongoose.connection.readyState}`);
    
    initialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize MongoDB:', error);
    throw error;
  }
}

/**
 * Check if MongoDB is currently connected
 * Returns true if connected, false otherwise
 */
export function isMongoDBConnected() {
  if (isBrowser) {
    console.warn('Checking MongoDB connection status from browser environment');
    return false;
  }
  
  // 1 = connected, 0 = disconnected
  return mongoose.connection.readyState === 1;
}

/**
 * Safely close the MongoDB connection when the application is shutting down
 */
export async function closeMongoDB() {
  if (isBrowser) {
    return;
  }
  
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Export the database connection for use in API routes
export { dbConnect };

// Register cleanup handlers for graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    await closeMongoDB();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await closeMongoDB();
    process.exit(0);
  });
}
