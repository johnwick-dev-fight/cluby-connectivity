
import { initMongoDB, isMongoDBConnected } from '../lib/mongodb/init';

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
          : 'MongoDB is not connected'
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
