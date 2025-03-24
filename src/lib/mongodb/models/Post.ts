
import mongoose, { Document, Schema } from 'mongoose';

export interface PostDocument extends Document {
  title: string;
  content: string;
  image_url?: string;
  club_id: mongoose.Schema.Types.ObjectId;
  author_id: mongoose.Schema.Types.ObjectId;
  post_type: 'general' | 'event' | 'announcement';
  is_flagged: boolean;
  created_at: Date;
  updated_at: Date;
}

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image_url: { type: String },
  club_id: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post_type: { 
    type: String, 
    enum: ['general', 'event', 'announcement'], 
    default: 'general' 
  },
  is_flagged: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Check if model already exists (for development with hot reloading)
export default mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);
