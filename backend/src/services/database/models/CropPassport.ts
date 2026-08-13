import mongoose, { Document, Schema } from 'mongoose';

export interface ICropPassport extends Document {
  cropId: string;
  fieldId: string;
  fieldName: string;
  farmerName: string;
  location: string;
  lat: number;
  lon: number;
  cropName: string;
  variety?: string;
  sowingDate: Date;
  expectedHarvestDate?: Date;
  actualHarvestDate?: Date;
  growthStage: string;
  currentRiskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'harvested' | 'failed';
  totalCostINR: number;
  yieldQuintals?: number;
  revenueINR?: number;
  profitINR?: number;
  
  // Embedded arrays for simplicity
  irrigationEvents: any[];
  inputApplications: any[];
  weatherSnapshots: any[];
  cropPhotos: any[];
  pestDiseaseEvents: any[];
  aiRecommendations: any[];
  treatmentOutcomes: any[];
  costs: any[];
  alerts: any[];
}

const CropPassportSchema = new Schema<ICropPassport>({
  cropId: { type: String, required: true, unique: true },
  fieldId: { type: String, required: true },
  fieldName: { type: String, required: true },
  farmerName: { type: String, required: true },
  location: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  cropName: { type: String, required: true },
  variety: { type: String },
  sowingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date },
  actualHarvestDate: { type: Date },
  growthStage: { type: String, default: 'Germination' },
  currentRiskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: { type: String, enum: ['active', 'harvested', 'failed'], default: 'active' },
  totalCostINR: { type: Number, default: 0 },
  yieldQuintals: { type: Number },
  revenueINR: { type: Number },
  profitINR: { type: Number },
  
  irrigationEvents: { type: [Schema.Types.Mixed], default: [] },
  inputApplications: { type: [Schema.Types.Mixed], default: [] },
  weatherSnapshots: { type: [Schema.Types.Mixed], default: [] },
  cropPhotos: { type: [Schema.Types.Mixed], default: [] },
  pestDiseaseEvents: { type: [Schema.Types.Mixed], default: [] },
  aiRecommendations: { type: [Schema.Types.Mixed], default: [] },
  treatmentOutcomes: { type: [Schema.Types.Mixed], default: [] },
  costs: { type: [Schema.Types.Mixed], default: [] },
  alerts: { type: [Schema.Types.Mixed], default: [] },
}, { timestamps: true });

export const CropPassport = mongoose.models.CropPassport || mongoose.model<ICropPassport>('CropPassport', CropPassportSchema);
