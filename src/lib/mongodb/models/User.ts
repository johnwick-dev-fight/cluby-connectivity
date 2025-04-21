
import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string; // This will be hashed
  role: 'student' | 'clubRepresentative' | 'admin';
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'clubRepresentative', 'admin'], 
    default: 'student' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Safe model initialization that handles both browser and server environments
let User: mongoose.Model<UserDocument>;

// Only create/access model on server side
if (typeof window === 'undefined') {
  try {
    // Try to get existing model
    User = mongoose.model<UserDocument>('User');
  } catch {
    // Create new model if it doesn't exist
    User = mongoose.model<UserDocument>('User', UserSchema);
  }
} else {
  // In browser, provide a placeholder
  User = {} as mongoose.Model<UserDocument>;
}

export default User;
