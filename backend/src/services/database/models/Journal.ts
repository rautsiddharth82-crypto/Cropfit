import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  farmerId: string;
  fieldId: string;
  cropId?: string;
  type: 'irrigation' | 'fertilizer' | 'pesticide' | 'weather' | 'observation' | 'harvest' | 'recommendation' | 'other';
  title: string;
  notes: string;
  fieldName: string;
  photoUrl?: string;
  voiceNoteUrl?: string;
  weatherSnapshot?: {
    tempC: number;
    humidity: number;
    condition: string;
  };
  cost?: number;
  quantity?: string;
  relatedRecommendationId?: string;
  outcomeFeedback?: 'better' | 'same' | 'worse';
  outcomePhoto?: string;
  outcomeNotes?: string;
  outcomeRecordedAt?: Date;
  createdAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
  farmerId: { type: String, required: true },
  fieldId: { type: String, required: true },
  cropId: { type: String },
  type: { type: String, required: true },
  title: { type: String, required: true },
  notes: { type: String, required: true },
  fieldName: { type: String, required: true },
  photoUrl: { type: String },
  voiceNoteUrl: { type: String },
  weatherSnapshot: {
    tempC: { type: Number },
    humidity: { type: Number },
    condition: { type: String },
  },
  cost: { type: Number },
  quantity: { type: String },
  relatedRecommendationId: { type: String },
  outcomeFeedback: { type: String, enum: ['better', 'same', 'worse'] },
  outcomePhoto: { type: String },
  outcomeNotes: { type: String },
  outcomeRecordedAt: { type: Date },
}, { timestamps: true });

export const JournalEntry = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);

export interface IFollowUp extends Document {
  journalEntryId: string;
  recommendationId?: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  message: string;
  farmerId: string;
}

const FollowUpSchema = new Schema<IFollowUp>({
  journalEntryId: { type: String, required: true },
  recommendationId: { type: String },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
  message: { type: String, required: true },
  farmerId: { type: String, required: true },
}, { timestamps: true });

export const FollowUp = mongoose.models.FollowUp || mongoose.model<IFollowUp>('FollowUp', FollowUpSchema);
