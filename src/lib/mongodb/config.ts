
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// MongoDB connection configuration
export const MONGODB_CONFIG = {
  // Replace the placeholders with actual values for local development and testing
  // These values are replaced by environment variables in production
  username: isBrowser ? null : process.env.DB_USERNAME || '<db_username>',
  password: isBrowser ? null : process.env.DB_PASSWORD || '<db_password>',
  cluster: isBrowser ? null : process.env.DB_CLUSTER || 'cluster0.rvg9arm.mongodb.net',
  options: isBrowser ? null : process.env.DB_OPTIONS || '?retryWrites=true&w=majority&appName=Cluster0',
  
  // Construct the connection URI
  get uri() {
    if (isBrowser) {
      console.warn('Attempting to access MongoDB URI in browser environment');
      return '';
    }
    return `mongodb+srv://${this.username}:${this.password}@${this.cluster}/${this.options}`;
  }
};

// Export a method to get the connection string
export function getMongoURI(): string {
  if (isBrowser) {
    console.warn('Attempting to access MongoDB URI in browser environment');
    return '';
  }
  
  return process.env.MONGODB_URI || MONGODB_CONFIG.uri;
}
