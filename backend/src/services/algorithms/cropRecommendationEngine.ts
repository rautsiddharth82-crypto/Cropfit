/**
 * Crop Recommendation Engine
 * 
 * Ranks crops by suitability for a farmer's conditions using weighted
 * scoring across climate, soil, water, market, and risk factors.
 */

import { CROP_THRESHOLDS, type CropThreshold } from '../config/cropThresholds';
import type { SupportedCrop } from '../config/constants';

export interface CropRecommendationInput {
  soilType: string;
  soilpH: number;
  organicCarbon: number;
  avgTemperature: number;
  annualRainfallMm: number;
  irrigationAvailable: boolean;
  previousCrop?: string;
  season: 'kharif' | 'rabi' | 'zaid';
  farmerPreference?: string;
  riskTolerance?: 'low' | 'medium' | 'high';
}

export interface RankedCropRecommendation {
  crop: SupportedCrop;
  displayName: string;
  localName: string;
  overallScore: number;          // 0-100
  suitability: 'High' | 'Medium' | 'Low';
  scores: {
    climateSuitability: number;
    soilMatch: number;
    waterFeasibility: number;
    riskLevel: number;
    rotationBenefit: number;
  };
  waterNeed: 'Low' | 'Medium' | 'High';
  durationDays: number;
  profitPotential: string;
  notes: string;
  warnings: string[];
}

/**
 * Rank all suitable crops for given conditions.
 * 
 * Score = (
 *   climateSuitability × 0.30 +
 *   soilMatch × 0.25 +
 *   waterFeasibility × 0.20 +
 *   riskLevel × 0.15 +
 *   rotationBenefit × 0.10
 * )
 */
export function recommendCrops(input: CropRecommendationInput): RankedCropRecommendation[] {
  const results: RankedCropRecommendation[] = [];

  for (const [key, threshold] of Object.entries(CROP_THRESHOLDS)) {
    const crop = key as SupportedCrop;

    // Filter by season
    if (threshold.season !== 'both' && threshold.season !== input.season) {
      continue;
    }

    const scores = calculateCropScores(input, threshold);
    const overallScore = Math.round(
      scores.climateSuitability * 0.30 +
      scores.soilMatch * 0.25 +
      scores.waterFeasibility * 0.20 +
      scores.riskLevel * 0.15 +
      scores.rotationBenefit * 0.10
    );

    const suitability: 'High' | 'Medium' | 'Low' =
      overallScore >= 70 ? 'High' : overallScore >= 45 ? 'Medium' : 'Low';

    const waterNeed: 'Low' | 'Medium' | 'High' =
      threshold.waterRequirementMm < 350 ? 'Low' :
      threshold.waterRequirementMm < 600 ? 'Medium' : 'High';

    const warnings: string[] = [];
    if (scores.climateSuitability < 40) warnings.push('Temperature range suboptimal for this crop');
    if (scores.soilMatch < 40) warnings.push('Soil conditions may limit growth');
    if (scores.waterFeasibility < 40 && !input.irrigationAvailable) warnings.push('Insufficient water without irrigation');

    const profitPotential = overallScore >= 75
      ? 'Indicative High (₹₹₹₹)'
      : overallScore >= 55
        ? 'Indicative Medium (₹₹₹)'
        : 'Indicative Moderate (₹₹)';

    results.push({
      crop,
      displayName: threshold.displayName,
      localName: threshold.localName,
      overallScore,
      suitability,
      scores,
      waterNeed,
      durationDays: threshold.durationDays,
      profitPotential,
      notes: generateCropNotes(input, threshold, scores),
      warnings,
    });
  }

  // Sort by overall score descending
  results.sort((a, b) => b.overallScore - a.overallScore);

  return results;
}

function calculateCropScores(
  input: CropRecommendationInput,
  threshold: CropThreshold
): RankedCropRecommendation['scores'] {
  // ── Climate Suitability ──
  let climateSuitability = 100;
  if (input.avgTemperature < threshold.tempOptimalMin) {
    const deficit = threshold.tempOptimalMin - input.avgTemperature;
    climateSuitability -= deficit * 8;
  } else if (input.avgTemperature > threshold.tempOptimalMax) {
    const excess = input.avgTemperature - threshold.tempOptimalMax;
    climateSuitability -= excess * 8;
  }
  if (input.avgTemperature < threshold.tempStressMin || input.avgTemperature > threshold.tempStressMax) {
    climateSuitability -= 30;
  }
  climateSuitability = Math.max(0, Math.min(100, climateSuitability));

  // ── Soil Match ──
  let soilMatch = 80; // Default decent match
  const optimalPH = threshold.crop === 'rice'
    ? { min: 5.5, max: 7.0 }
    : { min: 6.0, max: 7.5 };

  if (input.soilpH < optimalPH.min || input.soilpH > optimalPH.max) {
    const deviation = Math.min(
      Math.abs(input.soilpH - optimalPH.min),
      Math.abs(input.soilpH - optimalPH.max)
    );
    soilMatch -= deviation * 20;
  }
  if (input.organicCarbon < 0.5) soilMatch -= 15;
  soilMatch = Math.max(0, Math.min(100, soilMatch));

  // ── Water Feasibility ──
  let waterFeasibility = 100;
  if (!input.irrigationAvailable) {
    // Rain-fed: compare rainfall with crop water need
    const rainfallSupply = input.annualRainfallMm * 0.7; // Effective rainfall ~70%
    const deficit = threshold.waterRequirementMm - rainfallSupply;
    if (deficit > 0) {
      waterFeasibility -= (deficit / threshold.waterRequirementMm) * 100;
    }
  } else {
    // Irrigation available: penalize high water users slightly
    if (threshold.waterRequirementMm > 800) waterFeasibility -= 10;
  }
  waterFeasibility = Math.max(0, Math.min(100, waterFeasibility));

  // ── Risk Level (inverse: lower risk = higher score) ──
  let riskScore = 80;
  // Longer crops have more risk
  if (threshold.durationDays > 150) riskScore -= 15;
  // Drought-tolerant crops get bonus if low rainfall
  if (threshold.criticalMoisturePercent < 25 && input.annualRainfallMm < 500) riskScore += 10;
  // Heat-tolerant crops get bonus if hot area
  if (threshold.tempStressMax > 38 && input.avgTemperature > 30) riskScore += 10;
  riskScore = Math.max(0, Math.min(100, riskScore));

  // ── Rotation Benefit ──
  let rotationBenefit = 60; // Default
  if (input.previousCrop) {
    const prevLower = input.previousCrop.toLowerCase();
    const currentLower = threshold.displayName.toLowerCase();
    // Same crop twice: penalize
    if (prevLower.includes(currentLower) || currentLower.includes(prevLower)) {
      rotationBenefit = 20;
    }
    // Legume after cereal: bonus
    if (['moong', 'pearl_millet'].includes(threshold.crop) &&
      ['wheat', 'rice', 'maize'].some(c => prevLower.includes(c))) {
      rotationBenefit = 90;
    }
    // Cereal after legume: bonus
    if (['wheat', 'rice', 'maize'].includes(threshold.crop) &&
      ['moong', 'gram'].some(c => prevLower.includes(c))) {
      rotationBenefit = 85;
    }
  }

  return {
    climateSuitability,
    soilMatch,
    waterFeasibility,
    riskLevel: riskScore,
    rotationBenefit,
  };
}

function generateCropNotes(
  input: CropRecommendationInput,
  threshold: CropThreshold,
  scores: RankedCropRecommendation['scores']
): string {
  const notes: string[] = [];

  if (scores.climateSuitability >= 80) {
    notes.push(`Well-suited to ${input.avgTemperature}°C average temperature.`);
  }
  if (threshold.waterRequirementMm < 350) {
    notes.push('Low water requirement — suitable for water-scarce areas.');
  }
  if (threshold.durationDays < 80) {
    notes.push(`Short duration crop (${threshold.durationDays} days) — quick returns.`);
  }
  if (threshold.crop === 'moong' || threshold.crop === 'sorghum') {
    notes.push('Enriches soil nitrogen — excellent rotation crop.');
  }

  return notes.join(' ') || `Standard ${threshold.displayName} cultivation recommended for this region.`;
}
