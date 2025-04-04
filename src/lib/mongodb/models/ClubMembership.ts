
import mongoose, { Document, Schema } from 'mongoose';

export interface ClubMembershipDocument extends Document {
  club_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  role: 'member' | 'coordinator' | 'leader';
  join_date: Date;
  status: 'active' | 'inactive' | 'pending';
  created_at: Date;
  updated_at: Date;
}

const ClubMembershipSchema = new Schema({
  club_id: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { 
    type: String, 
    enum: ['member', 'coordinator', 'leader'], 
    default: 'member' 
  },
  join_date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending'], 
    default: 'pending' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Add a compound index to ensure a user can only have one membership record per club
ClubMembershipSchema.index({ club_id: 1, user_id: 1 }, { unique: true });

// Check if model already exists (for development with hot reloading)
export default mongoose.models.ClubMembership || mongoose.model<ClubMembershipDocument>('ClubMembership', ClubMembershipSchema);
