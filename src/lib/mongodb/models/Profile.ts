
import mongoose, { Document, Schema } from 'mongoose';

export interface ProfileDocument extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  full_name: string;
  username?: string;
  avatar_url?: string;
  department?: string;
  year?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  full_name: { type: String, required: true },
  username: { type: String },
  avatar_url: { type: String },
  department: { type: String },
  year: { type: String },
  bio: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Check if model already exists (for development with hot reloading)
export default mongoose.models.Profile || mongoose.model<ProfileDocument>('Profile', ProfileSchema);
