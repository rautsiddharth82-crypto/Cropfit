/**
 * Crop Passport Service - MongoDB Version
 */

import { CropPassport, ICropPassport } from './database/models/CropPassport';

export class CropPassportService {
  /**
   * Create a new Crop Passport.
   */
  async createPassport(data: {
    fieldId: string;
    fieldName: string;
    farmerName: string;
    location: string;
    lat: number;
    lon: number;
    cropName: string;
    variety?: string;
    sowingDate: string;
  }) {
    const state = data.location.split(',')[1]?.trim()?.substring(0, 2)?.toUpperCase() || 'IN';
    const cropCode = data.cropName.toUpperCase().substring(0, 5);
    const year = new Date().getFullYear();
    const count = await CropPassport.countDocuments();
    const seq = count + 1;
    const cropId = `${state}-${cropCode}-${year}-${String(seq).padStart(3, '0')}`;

    const passport = new CropPassport({
      ...data,
      cropId,
      sowingDate: new Date(data.sowingDate),
    });
    await passport.save();
    return passport;
  }

  /**
   * Get a crop passport by ID.
   */
  async getPassport(cropId: string) {
    return await CropPassport.findOne({ cropId });
  }

  /**
   * Get all passports for a farmer.
   */
  async getPassportsByFarmer(farmerName: string) {
    return await CropPassport.find({ farmerName }).sort({ createdAt: -1 });
  }

  /**
   * Add an event to a crop passport.
   */
  async addEvent(cropId: string, event: {
    type: 'irrigation' | 'input' | 'photo' | 'pest' | 'recommendation' | 'outcome' | 'weather' | 'alert';
    data: any;
  }) {
    const passport = await CropPassport.findOne({ cropId });
    if (!passport) return null;

    const now = new Date();
    const eventData = { date: now, ...event.data };

    switch (event.type) {
      case 'irrigation': passport.irrigationEvents.push(eventData); break;
      case 'input':
        passport.inputApplications.push(eventData);
        if (event.data.cost) {
          passport.costs.push({ category: event.data.product, amount: event.data.cost });
          passport.totalCostINR += event.data.cost;
        }
        break;
      case 'photo': passport.cropPhotos.push(eventData); break;
      case 'pest': passport.pestDiseaseEvents.push(eventData); break;
      case 'recommendation': passport.aiRecommendations.push(eventData); break;
      case 'outcome': passport.treatmentOutcomes.push(eventData); break;
      case 'weather': passport.weatherSnapshots.push(eventData); break;
      case 'alert': passport.alerts.push(eventData); break;
    }

    await passport.save();
    return passport;
  }

  /**
   * Update growth stage.
   */
  async updateGrowthStage(cropId: string, stage: string, riskLevel?: 'low' | 'medium' | 'high') {
    const update: any = { growthStage: stage };
    if (riskLevel) update.currentRiskLevel = riskLevel;
    
    return await CropPassport.findOneAndUpdate({ cropId }, update, { new: true });
  }

  /**
   * Record harvest and finalize passport.
   */
  async recordHarvest(cropId: string, yieldQuintals: number, sellingPricePerQuintal: number) {
    const passport = await CropPassport.findOne({ cropId });
    if (!passport) return null;

    passport.status = 'harvested';
    passport.actualHarvestDate = new Date();
    passport.yieldQuintals = yieldQuintals;
    passport.revenueINR = yieldQuintals * sellingPricePerQuintal;
    passport.profitINR = passport.revenueINR - passport.totalCostINR;

    await passport.save();
    return passport;
  }

  /**
   * Generate QR code data.
   */
  async getQRData(cropId: string) {
    const passport = await CropPassport.findOne({ cropId });
    if (!passport) return null;

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const displayUrl = `${baseUrl}/passport/${cropId}`;

    return {
      qrContent: JSON.stringify({
        cropId,
        farmer: passport.farmerName,
        crop: passport.cropName,
        field: passport.fieldName,
        sowing: passport.sowingDate,
        stage: passport.growthStage,
        risk: passport.currentRiskLevel,
        url: displayUrl,
      }),
      displayUrl,
    };
  }
}

let _instance: CropPassportService | null = null;
export function getCropPassportService(): CropPassportService {
  if (!_instance) _instance = new CropPassportService();
  return _instance;
}
