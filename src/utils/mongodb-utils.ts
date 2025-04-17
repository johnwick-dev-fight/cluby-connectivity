
import { isMongoDBConnected } from '@/lib/mongodb/init';

/**
 * Check if MongoDB is connected and return status information
 */
export async function checkMongoDBStatus() {
  try {
    const isConnected = isMongoDBConnected();
    
    return {
      success: true,
      connected: isConnected,
      message: isConnected 
        ? 'MongoDB is successfully connected' 
        : 'MongoDB is not connected'
    };
  } catch (error) {
    console.error('Error checking MongoDB connection:', error);
    
    return {
      success: false,
      connected: false,
      message: 'Error checking MongoDB connection',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get connection string details (safe version without credentials)
 */
export function getConnectionDetails() {
  const { username, cluster, dbName } = require('@/lib/env').DB_CONFIG;
  
  return {
    username,
    cluster,
    dbName,
    uri: `mongodb+srv://${username}:***@${cluster}/?retryWrites=true&w=majority&appName=cluby`
  };
}
