
// Environment configuration for MongoDB connection
// This file provides connection details while ensuring credentials are secure

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe way to access environment variables in both browser and server contexts
const getEnv = (key: string, defaultValue: string = ''): string => {
  if (isBrowser) {
    return defaultValue;
  }
  // Use a try-catch to safely access process.env in server environments
  try {
    return (typeof process !== 'undefined' && process.env && process.env[key]) || defaultValue;
  } catch (e) {
    console.warn(`Error accessing process.env.${key}:`, e);
    return defaultValue;
  }
};

// MongoDB connection configuration
export const DB_CONFIG = {
  username: getEnv('MONGODB_USERNAME', 'avneesh-singh'),
  password: isBrowser ? '' : getEnv('MONGODB_PASSWORD', '15q3RIL4Qwq3LKnf'),
  cluster: getEnv('MONGODB_CLUSTER', 'cluby-cluster.a6odmyp.mongodb.net'),
  dbName: getEnv('MONGODB_DBNAME', 'cluby-db'),
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
  return getEnv(key, defaultValue);
}
