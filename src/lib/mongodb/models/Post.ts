
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
  likes: mongoose.Schema.Types.ObjectId[];
  comments: {
    user_id: mongoose.Schema.Types.ObjectId;
    content: string;
    created_at: Date;
  }[];
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
  updated_at: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  }]
});

// Only attempt to create/export the model when running on the server
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Handle model creation safely
let Post: mongoose.Model<PostDocument>;

if (!isBrowser) {
  // Check if model already exists to avoid model overwrite errors during hot reloading
  Post = mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);
} else {
  // Return a dummy model or null in browser context
  // This prevents errors when importing in browser contexts
  Post = {} as mongoose.Model<PostDocument>;
}

export default Post;
