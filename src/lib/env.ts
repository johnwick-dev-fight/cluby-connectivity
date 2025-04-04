
// Environment configuration
// This centralizes environment variable management and provides fallbacks

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Utility to safely access environment variables
export function getEnv(key: string, defaultValue: string = ''): string {
  if (isBrowser) {
    // In browser, return the default value (no process.env in browser)
    return defaultValue;
  }
  
  // In Node.js, access process.env
  return (process.env && process.env[key]) || defaultValue;
}

// Database configuration
export const DB_CONFIG = {
  // For development and testing only
  username: getEnv('DB_USERNAME', 'sampleuser'),
  password: getEnv('DB_PASSWORD', 'samplepassword'),
  cluster: getEnv('DB_CLUSTER', 'cluster0.rvg9arm.mongodb.net'),
  dbName: getEnv('DB_NAME', 'cluby'),
  
  // Get the full connection URI
  get uri(): string {
    if (isBrowser) {
      console.warn('Attempting to access database URI in browser environment');
      return '';
    }
    
    return getEnv(
      'MONGODB_URI', 
      `mongodb+srv://${this.username}:${this.password}@${this.cluster}/?retryWrites=true&w=majority&appName=Cluster0`
    );
  }
};

// JWT configuration for authentication
export const JWT_CONFIG = {
  secret: getEnv('JWT_SECRET', 'your-development-secret-key'),
  expiresIn: getEnv('JWT_EXPIRES_IN', '7d')
};

// Application configuration
export const APP_CONFIG = {
  name: 'Cluby',
  environment: getEnv('NODE_ENV', 'development'),
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  isProduction: getEnv('NODE_ENV') === 'production',
  frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3000'),
  apiUrl: getEnv('API_URL', 'http://localhost:3000/api'),
};
