
import mongoose, { Document, Schema } from 'mongoose';

export interface ClubDocument extends Document {
  name: string;
  logo_url?: string;
  banner_url?: string;
  description?: string;
  objectives?: string;
  social_links?: Record<string, string>;
  representative_id: mongoose.Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

const ClubSchema = new Schema({
  name: { type: String, required: true },
  logo_url: { type: String },
  banner_url: { type: String },
  description: { type: String },
  objectives: { type: String },
  social_links: { type: Schema.Types.Mixed },
  representative_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.Club || mongoose.model<ClubDocument>('Club', ClubSchema);
