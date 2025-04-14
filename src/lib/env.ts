
// Environment configuration
// This centralizes environment variable management and provides fallbacks

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Utility to safely access environment variables
export function getEnv(key: string, defaultValue: string = ''): string {
  if (isBrowser) {
    return defaultValue;
  }
  return (process.env && process.env[key]) || defaultValue;
}

// Database configuration
export const DB_CONFIG = {
  username: getEnv('DB_USERNAME', ''),
  password: getEnv('DB_PASSWORD', ''),
  cluster: getEnv('DB_CLUSTER', ''),
  dbName: getEnv('DB_NAME', 'cluby'),
  
  // Get the full connection URI
  get uri(): string {
    if (isBrowser) {
      console.warn('Attempting to access database URI in browser environment');
      return '';
    }
    
    const uri = getEnv('MONGODB_URI');
    if (uri) return uri;
    
    return `mongodb+srv://${this.username}:${this.password}@${this.cluster}/${this.dbName}?retryWrites=true&w=majority`;
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
