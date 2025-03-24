
import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string; // Note: This should be hashed
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

// Check if model already exists (for development with hot reloading)
export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
