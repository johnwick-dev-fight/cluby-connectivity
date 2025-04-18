
import mongoose, { Document, Schema } from 'mongoose';

export interface RecruitmentDocument extends Document {
  title: string;
  description: string;
  requirements: string;
  club_id: mongoose.Schema.Types.ObjectId;
  created_by: mongoose.Schema.Types.ObjectId;
  positions_available: number;
  application_deadline: Date;
  status: 'open' | 'closed' | 'filled';
  created_at: Date;
  updated_at: Date;
}

const RecruitmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  club_id: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  positions_available: { type: Number, required: true, default: 1 },
  application_deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['open', 'closed', 'filled'], 
    default: 'open' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Safely check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safely export the model, using a different approach to handle browser vs server
let RecruitmentModel;

if (!isBrowser) {
  // Server-side: We can safely work with mongoose models
  RecruitmentModel = mongoose.models.Recruitment || mongoose.model<RecruitmentDocument>('Recruitment', RecruitmentSchema);
} else {
  // Browser-side: Don't attempt to create the model
  RecruitmentModel = {} as any; // Provide a placeholder for the browser
}

export default RecruitmentModel;
