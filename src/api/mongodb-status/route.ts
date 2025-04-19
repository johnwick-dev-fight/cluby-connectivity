
import { initMongoDB, isMongoDBConnected } from '../../lib/mongodb/init';
import { DB_CONFIG } from '../../lib/env';

export async function GET() {
  try {
    // Initialize MongoDB if not already connected
    await initMongoDB();
    
    // Check connection status
    const isConnected = isMongoDBConnected();
    
    return new Response(
      JSON.stringify({
        success: true,
        connected: isConnected,
        message: isConnected 
          ? 'MongoDB is successfully connected' 
          : 'MongoDB is not connected',
        details: {
          username: DB_CONFIG.username,
          cluster: DB_CONFIG.cluster,
          dbName: DB_CONFIG.dbName,
          uri: `mongodb+srv://${DB_CONFIG.username}:***@${DB_CONFIG.cluster}/?retryWrites=true&w=majority&appName=cluby`
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error checking MongoDB status:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        connected: false,
        message: 'Error checking MongoDB connection',
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
