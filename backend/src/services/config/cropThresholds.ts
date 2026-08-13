/**
 * Crop-Specific Thresholds for CropFit
 * Based on ICAR (Indian Council of Agricultural Research) guidelines
 * and standard agronomic references.
 */

import type { SupportedCrop, GrowthStage } from './constants';

export interface CropThreshold {
  crop: SupportedCrop;
  displayName: string;
  localName: string;
  season: 'kharif' | 'rabi' | 'zaid' | 'both';

  // Temperature thresholds (°C)
  tempOptimalMin: number;
  tempOptimalMax: number;
  tempStressMin: number;       // Below this → cold stress
  tempStressMax: number;       // Above this → heat stress
  tempLethalMin: number;       // Below this → crop death
  tempLethalMax: number;       // Above this → crop death

  // Water requirements
  waterRequirementMm: number;          // Total seasonal water need
  dailyWaterNeedMm: number;            // Average daily ET
  criticalMoisturePercent: number;     // Below this = drought stress
  waterloggingThresholdPercent: number; // Above this = waterlogging

  // Growth duration
  durationDays: number;

  // Disease-favorable conditions
  diseaseFavorableHumidity: number;    // % humidity above which disease risk rises
  diseaseFavorableTempMin: number;
  diseaseFavorableTempMax: number;

  // Growth stage durations (approximate days from sowing)
  stageTimeline: Partial<Record<GrowthStage, { startDay: number; endDay: number }>>;
}

export const CROP_THRESHOLDS: Record<SupportedCrop, CropThreshold> = {
  wheat: {
    crop: 'wheat',
    displayName: 'Wheat',
    localName: 'गेहूं',
    season: 'rabi',
    tempOptimalMin: 15,
    tempOptimalMax: 25,
    tempStressMin: 5,
    tempStressMax: 32,
    tempLethalMin: -2,
    tempLethalMax: 42,
    waterRequirementMm: 450,
    dailyWaterNeedMm: 4.5,
    criticalMoisturePercent: 30,
    waterloggingThresholdPercent: 85,
    durationDays: 140,
    diseaseFavorableHumidity: 80,
    diseaseFavorableTempMin: 10,
    diseaseFavorableTempMax: 20,
    stageTimeline: {
      germination: { startDay: 0, endDay: 10 },
      seedling: { startDay: 10, endDay: 25 },
      tillering: { startDay: 25, endDay: 55 },
      vegetative: { startDay: 55, endDay: 75 },
      flowering: { startDay: 75, endDay: 95 },
      grain_filling: { startDay: 95, endDay: 120 },
      maturity: { startDay: 120, endDay: 140 },
    },
  },

  rice: {
    crop: 'rice',
    displayName: 'Rice / Paddy',
    localName: 'धान',
    season: 'kharif',
    tempOptimalMin: 25,
    tempOptimalMax: 35,
    tempStressMin: 15,
    tempStressMax: 38,
    tempLethalMin: 10,
    tempLethalMax: 45,
    waterRequirementMm: 1200,
    dailyWaterNeedMm: 8.0,
    criticalMoisturePercent: 50,
    waterloggingThresholdPercent: 95,  // Rice tolerates standing water
    durationDays: 120,
    diseaseFavorableHumidity: 85,
    diseaseFavorableTempMin: 25,
    diseaseFavorableTempMax: 30,
    stageTimeline: {
      germination: { startDay: 0, endDay: 10 },
      seedling: { startDay: 10, endDay: 25 },
      tillering: { startDay: 25, endDay: 55 },
      flowering: { startDay: 55, endDay: 80 },
      grain_filling: { startDay: 80, endDay: 100 },
      maturity: { startDay: 100, endDay: 120 },
    },
  },

  cotton: {
    crop: 'cotton',
    displayName: 'Cotton',
    localName: 'कपास',
    season: 'kharif',
    tempOptimalMin: 25,
    tempOptimalMax: 35,
    tempStressMin: 15,
    tempStressMax: 40,
    tempLethalMin: 5,
    tempLethalMax: 48,
    waterRequirementMm: 700,
    dailyWaterNeedMm: 5.5,
    criticalMoisturePercent: 35,
    waterloggingThresholdPercent: 75,
    durationDays: 180,
    diseaseFavorableHumidity: 80,
    diseaseFavorableTempMin: 25,
    diseaseFavorableTempMax: 35,
    stageTimeline: {
      germination: { startDay: 0, endDay: 10 },
      seedling: { startDay: 10, endDay: 30 },
      vegetative: { startDay: 30, endDay: 65 },
      flowering: { startDay: 65, endDay: 110 },
      maturity: { startDay: 110, endDay: 160 },
      harvesting: { startDay: 160, endDay: 180 },
    },
  },

  mustard: {
    crop: 'mustard',
    displayName: 'Mustard',
    localName: 'सरसों',
    season: 'rabi',
    tempOptimalMin: 12,
    tempOptimalMax: 25,
    tempStressMin: 5,
    tempStressMax: 30,
    tempLethalMin: -3,
    tempLethalMax: 40,
    waterRequirementMm: 250,
    dailyWaterNeedMm: 3.0,
    criticalMoisturePercent: 25,
    waterloggingThresholdPercent: 70,
    durationDays: 120,
    diseaseFavorableHumidity: 85,
    diseaseFavorableTempMin: 15,
    diseaseFavorableTempMax: 25,
    stageTimeline: {
      germination: { startDay: 0, endDay: 8 },
      seedling: { startDay: 8, endDay: 20 },
      vegetative: { startDay: 20, endDay: 50 },
      flowering: { startDay: 50, endDay: 80 },
      maturity: { startDay: 80, endDay: 110 },
      harvesting: { startDay: 110, endDay: 120 },
    },
  },

  maize: {
    crop: 'maize',
    displayName: 'Maize / Corn',
    localName: 'मक्का',
    season: 'kharif',
    tempOptimalMin: 21,
    tempOptimalMax: 30,
    tempStressMin: 10,
    tempStressMax: 38,
    tempLethalMin: 0,
    tempLethalMax: 45,
    waterRequirementMm: 500,
    dailyWaterNeedMm: 5.0,
    criticalMoisturePercent: 35,
    waterloggingThresholdPercent: 80,
    durationDays: 110,
    diseaseFavorableHumidity: 80,
    diseaseFavorableTempMin: 20,
    diseaseFavorableTempMax: 30,
    stageTimeline: {
      germination: { startDay: 0, endDay: 10 },
      seedling: { startDay: 10, endDay: 25 },
      vegetative: { startDay: 25, endDay: 55 },
      flowering: { startDay: 55, endDay: 75 },
      grain_filling: { startDay: 75, endDay: 95 },
      maturity: { startDay: 95, endDay: 110 },
    },
  },

  pearl_millet: {
    crop: 'pearl_millet',
    displayName: 'Pearl Millet (Bajra)',
    localName: 'बाजरा',
    season: 'kharif',
    tempOptimalMin: 25,
    tempOptimalMax: 35,
    tempStressMin: 15,
    tempStressMax: 42,
    tempLethalMin: 8,
    tempLethalMax: 48,
    waterRequirementMm: 250,
    dailyWaterNeedMm: 3.0,
    criticalMoisturePercent: 20,
    waterloggingThresholdPercent: 70,
    durationDays: 85,
    diseaseFavorableHumidity: 85,
    diseaseFavorableTempMin: 25,
    diseaseFavorableTempMax: 35,
    stageTimeline: {
      germination: { startDay: 0, endDay: 8 },
      seedling: { startDay: 8, endDay: 20 },
      vegetative: { startDay: 20, endDay: 40 },
      flowering: { startDay: 40, endDay: 55 },
      grain_filling: { startDay: 55, endDay: 72 },
      maturity: { startDay: 72, endDay: 85 },
    },
  },

  sorghum: {
    crop: 'sorghum',
    displayName: 'Sorghum (Jowar)',
    localName: 'ज्वार',
    season: 'kharif',
    tempOptimalMin: 25,
    tempOptimalMax: 32,
    tempStressMin: 12,
    tempStressMax: 40,
    tempLethalMin: 5,
    tempLethalMax: 47,
    waterRequirementMm: 400,
    dailyWaterNeedMm: 4.0,
    criticalMoisturePercent: 22,
    waterloggingThresholdPercent: 75,
    durationDays: 100,
    diseaseFavorableHumidity: 80,
    diseaseFavorableTempMin: 20,
    diseaseFavorableTempMax: 30,
    stageTimeline: {
      germination: { startDay: 0, endDay: 10 },
      seedling: { startDay: 10, endDay: 25 },
      vegetative: { startDay: 25, endDay: 50 },
      flowering: { startDay: 50, endDay: 70 },
      grain_filling: { startDay: 70, endDay: 88 },
      maturity: { startDay: 88, endDay: 100 },
    },
  },

  moong: {
    crop: 'moong',
    displayName: 'Green Gram (Moong)',
    localName: 'मूंग',
    season: 'kharif',
    tempOptimalMin: 25,
    tempOptimalMax: 35,
    tempStressMin: 15,
    tempStressMax: 40,
    tempLethalMin: 8,
    tempLethalMax: 45,
    waterRequirementMm: 200,
    dailyWaterNeedMm: 3.0,
    criticalMoisturePercent: 25,
    waterloggingThresholdPercent: 70,
    durationDays: 65,
    diseaseFavorableHumidity: 85,
    diseaseFavorableTempMin: 25,
    diseaseFavorableTempMax: 35,
    stageTimeline: {
      germination: { startDay: 0, endDay: 7 },
      seedling: { startDay: 7, endDay: 15 },
      vegetative: { startDay: 15, endDay: 30 },
      flowering: { startDay: 30, endDay: 45 },
      maturity: { startDay: 45, endDay: 60 },
      harvesting: { startDay: 60, endDay: 65 },
    },
  },

  tomato: {
    crop: 'tomato',
    displayName: 'Tomato',
    localName: 'टमाटर',
    season: 'both',
    tempOptimalMin: 20,
    tempOptimalMax: 30,
    tempStressMin: 10,
    tempStressMax: 35,
    tempLethalMin: 2,
    tempLethalMax: 42,
    waterRequirementMm: 600,
    dailyWaterNeedMm: 5.0,
    criticalMoisturePercent: 35,
    waterloggingThresholdPercent: 75,
    durationDays: 130,
    diseaseFavorableHumidity: 80,
    diseaseFavorableTempMin: 20,
    diseaseFavorableTempMax: 28,
    stageTimeline: {
      germination: { startDay: 0, endDay: 12 },
      seedling: { startDay: 12, endDay: 30 },
      vegetative: { startDay: 30, endDay: 55 },
      flowering: { startDay: 55, endDay: 80 },
      maturity: { startDay: 80, endDay: 110 },
      harvesting: { startDay: 110, endDay: 130 },
    },
  },
};

/**
 * Get the current growth stage for a crop based on days since sowing.
 */
export function getCurrentGrowthStage(crop: SupportedCrop, daysSinceSowing: number): GrowthStage {
  const thresholds = CROP_THRESHOLDS[crop];
  const stages = thresholds.stageTimeline;

  // Iterate stages in reverse order to find the current one
  const stageEntries = Object.entries(stages) as [GrowthStage, { startDay: number; endDay: number }][];
  for (const [stage, range] of stageEntries.reverse()) {
    if (daysSinceSowing >= range.startDay && daysSinceSowing <= range.endDay) {
      return stage;
    }
  }

  // Default: if past all stages, return maturity; if before, return germination
  if (daysSinceSowing > (stageEntries[0]?.[1]?.endDay || 0)) return 'harvesting';
  return 'germination';
}

/**
 * Get the heat stress sensitivity for a crop at a given number of days since sowing.
 */
export function getHeatSensitivity(crop: SupportedCrop, daysSinceSowing: number): number {
  const stage = getCurrentGrowthStage(crop, daysSinceSowing);
  const { GROWTH_STAGE_SENSITIVITY } = require('./constants');
  return GROWTH_STAGE_SENSITIVITY[stage] ?? 0.5;
}
