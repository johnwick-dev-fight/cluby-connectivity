
import mongoose, { Document, Schema } from 'mongoose';

export interface ApplicationDocument extends Document {
  recruitment_id: mongoose.Schema.Types.ObjectId;
  applicant_id: mongoose.Schema.Types.ObjectId;
  club_id: mongoose.Schema.Types.ObjectId;
  cover_letter: string;
  resume_url?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

const ApplicationSchema = new Schema({
  recruitment_id: { type: Schema.Types.ObjectId, ref: 'Recruitment', required: true },
  applicant_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  club_id: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  cover_letter: { type: String, required: true },
  resume_url: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'under_review', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Safely check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safely export the model, using a different approach to handle browser vs server
let ApplicationModel;

if (!isBrowser) {
  // Server-side: We can safely work with mongoose models
  ApplicationModel = mongoose.models.Application || mongoose.model<ApplicationDocument>('Application', ApplicationSchema);
} else {
  // Browser-side: Don't attempt to create the model
  ApplicationModel = {} as any; // Provide a placeholder for the browser
}

export default ApplicationModel;
