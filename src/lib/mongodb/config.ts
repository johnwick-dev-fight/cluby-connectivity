
import { DB_CONFIG } from '../env';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe way to access environment variables
const getEnv = (key: string, defaultValue: string = ''): string => {
  if (isBrowser) {
    return defaultValue;
  }
  try {
    return (globalThis?.process?.env && globalThis.process.env[key]) || defaultValue;
  } catch (e) {
    console.warn(`Error accessing environment variable ${key}:`, e);
    return defaultValue;
  }
};

// MongoDB connection configuration
export const MONGODB_CONFIG = {
  // Replace the placeholders with actual values for local development and testing
  // These values are replaced by environment variables in production
  username: isBrowser ? null : (getEnv('DB_USERNAME') || DB_CONFIG.username),
  password: isBrowser ? null : (getEnv('DB_PASSWORD') || DB_CONFIG.password),
  cluster: isBrowser ? null : (getEnv('DB_CLUSTER') || DB_CONFIG.cluster),
  options: isBrowser ? null : (getEnv('DB_OPTIONS') || '?retryWrites=true&w=majority&appName=Cluster0'),
  
  // Construct the connection URI
  get uri() {
    if (isBrowser) {
      return '';
    }
    return `mongodb+srv://${this.username}:${this.password}@${this.cluster}/${this.options}`;
  }
};

// Export a method to get the connection string
export function getMongoURI(): string {
  if (isBrowser) {
    return '';
  }
  
  return getEnv('MONGODB_URI') || MONGODB_CONFIG.uri;
}
