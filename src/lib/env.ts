
import { getEnv } from '../utils/env-utils'; // Assuming this utility exists or will be created

export const DB_CONFIG = {
  username: 'johnnywick1947',
  password: process.env.MONGODB_PASSWORD || '<db_password>', // Use environment variable for password
  cluster: 'cluby.tkfcyvx.mongodb.net',
  dbName: 'cluby',
  
  get uri(): string {
    if (typeof window !== 'undefined') {
      console.warn('Attempting to access database URI in browser environment');
      return '';
    }
    
    return `mongodb+srv://${this.username}:${this.password}@${this.cluster}/?retryWrites=true&w=majority&appName=cluby`;
  }
};
