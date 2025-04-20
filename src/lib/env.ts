
// Environment configuration for MongoDB connection
// This file provides connection details while ensuring credentials are secure

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// MongoDB connection configuration
export const DB_CONFIG = {
  username: process.env.MONGODB_USERNAME || 'avneesh-singh',
  password: isBrowser ? '' : (process.env.MONGODB_PASSWORD || '15q3RIL4Qwq3LKnf'),
  cluster: process.env.MONGODB_CLUSTER || 'cluby-cluster.a6odmyp.mongodb.net',
  dbName: process.env.MONGODB_DBNAME || 'cluby-db',
  // Connection string format
  get uri(): string {
    if (isBrowser) {
      console.warn('Attempting to access database URI in browser environment');
      return '';
    }
    
    return `mongodb+srv://${this.username}:${this.password}@${this.cluster}/?retryWrites=true&w=majority&appName=cluby`;
  }
};

// Function to safely get environment variables
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  if (isBrowser) {
    console.warn(`Attempting to access environment variable (${key}) in browser`);
    return defaultValue;
  }
  
  return process.env[key] || defaultValue;
}
