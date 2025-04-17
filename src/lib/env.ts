
// Environment configuration for MongoDB connection
// This file provides connection details while ensuring credentials are secure

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// MongoDB connection configuration
export const DB_CONFIG = {
  username: 'johnnywick1947',
  password: isBrowser ? '' : (process.env.MONGODB_PASSWORD || 'password123'), // Use environment variable for password
  cluster: 'cluby.tkfcyvx.mongodb.net',
  dbName: 'cluby',
  
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
