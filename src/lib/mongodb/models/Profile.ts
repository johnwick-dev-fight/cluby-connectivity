
import mongoose, { Document, Schema } from 'mongoose';

export interface ProfileDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  full_name: string;
  username: string;
  avatar_url?: string;
  department?: string;
  year?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema = new Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  full_name: { type: String, required: true },
  username: { type: String, required: true },
  avatar_url: { type: String },
  department: { type: String },
  year: { type: String },
  bio: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Safe model initialization that handles both browser and server environments
let Profile: mongoose.Model<ProfileDocument>;

// Only create/access model on server side
if (typeof window === 'undefined') {
  try {
    // Try to get existing model
    Profile = mongoose.model<ProfileDocument>('Profile');
  } catch {
    // Create new model if it doesn't exist
    Profile = mongoose.model<ProfileDocument>('Profile', ProfileSchema);
  }
} else {
  // In browser, provide a placeholder
  Profile = {} as mongoose.Model<ProfileDocument>;
}

export default Profile;
