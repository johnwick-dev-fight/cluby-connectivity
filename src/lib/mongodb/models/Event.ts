
import mongoose, { Document, Schema } from 'mongoose';

export interface EventDocument extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  image_url?: string;
  club_id: mongoose.Schema.Types.ObjectId;
  organizer_id: mongoose.Schema.Types.ObjectId;
  attendees?: mongoose.Schema.Types.ObjectId[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  image_url: { type: String },
  club_id: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  organizer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Check if model already exists (for development with hot reloading)
export default mongoose.models.Event || mongoose.model<EventDocument>('Event', EventSchema);
