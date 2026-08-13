/**
 * Drought Risk Model
 * 
 * Calculates drought risk using rainfall deficit against seasonal baseline,
 * soil water balance, crop water requirements, and forecast rain probability.
 */

import { CROP_THRESHOLDS } from '../config/cropThresholds';
import type { SupportedCrop } from '../config/constants';

export interface DroughtRiskInput {
  currentRainfallMm: number;       // Cumulative rainfall this season
  baselineRainfallMm: number;      // 30-year average for this period (from Meteoblue)
  soilMoisturePercent: number;
  crop: SupportedCrop;
  daysSinceSowing: number;
  daysWithoutRain: number;
  forecastRainProbability: number;  // 0-100
  forecastRainMm?: number;
  irrigationAvailable: boolean;
  lastIrrigationDaysAgo?: number;
}

export interface DroughtRiskResult {
  score: number;                   // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  rainfallDeficitPercent: number;
  daysToStress: number;           // Estimated days before critical moisture
  waterBalanceMm: number;         // Current surplus/deficit
  factors: { factor: string; contribution: number; detail: string }[];
  recommendation: string;
  urgency: string;
}

/**
 * Calculate drought risk score.
 *
 * Algorithm:
 * DroughtScore = (
 *   rainfallDeficit × 0.30 +
 *   soilMoistureDeficit × 0.25 +
 *   drySpellLength × 0.20 +
 *   forecastDryProbability × 0.15 +
 *   cropWaterDemand × 0.10
 * ) × 100
 */
export function calculateDroughtRisk(input: DroughtRiskInput): DroughtRiskResult {
  const threshold = CROP_THRESHOLDS[input.crop];
  if (!threshold) throw new Error(`Unknown crop: ${input.crop}`);

  // ── Factor 1: Rainfall Deficit (30%) ──
  const rainfallDeficit = input.baselineRainfallMm > 0
    ? (input.baselineRainfallMm - input.currentRainfallMm) / input.baselineRainfallMm
    : 0;
  const rainfallDeficitNormalized = Math.max(0, Math.min(1, rainfallDeficit));
  const rainfallDeficitPercent = Math.round(rainfallDeficit * 100);

  // ── Factor 2: Soil Moisture Deficit (25%) ──
  const moistureDeficit = Math.max(0, threshold.criticalMoisturePercent + 10 - input.soilMoisturePercent);
  const moistureNormalized = Math.min(1, moistureDeficit / (threshold.criticalMoisturePercent + 10));

  // ── Factor 3: Dry Spell Duration (20%) ──
  const drySpellNormalized = Math.min(1, input.daysWithoutRain / 14); // 14 days = max concern

  // ── Factor 4: Forecast Dry Probability (15%) ──
  const forecastDryProb = 1 - (input.forecastRainProbability / 100);
  const forecastNormalized = forecastDryProb;

  // ── Factor 5: Crop Water Demand vs Supply (10%) ──
  const dailyDemand = threshold.dailyWaterNeedMm;
  const dailySupply = input.irrigationAvailable
    ? dailyDemand * 0.8  // Irrigation covers ~80% if available
    : (input.currentRainfallMm / Math.max(input.daysSinceSowing, 1));
  const demandSupplyGap = Math.max(0, (dailyDemand - dailySupply) / dailyDemand);
  const demandNormalized = Math.min(1, demandSupplyGap);

  // ── Combined Score ──
  const rawScore = (
    rainfallDeficitNormalized * 0.30 +
    moistureNormalized * 0.25 +
    drySpellNormalized * 0.20 +
    forecastNormalized * 0.15 +
    demandNormalized * 0.10
  );

  const score = Math.round(Math.min(100, rawScore * 100));

  // ── Risk Level ──
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (score < 30) riskLevel = 'LOW';
  else if (score < 60) riskLevel = 'MEDIUM';
  else if (score < 80) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  // ── Days to Stress ──
  const moistureAboveCritical = Math.max(0, input.soilMoisturePercent - threshold.criticalMoisturePercent);
  const dailyMoistureLoss = 2.5; // Approximate % per day without rain
  const daysToStress = moistureAboveCritical > 0
    ? Math.round(moistureAboveCritical / dailyMoistureLoss)
    : 0;

  // ── Water Balance ──
  const seasonalDemand = threshold.waterRequirementMm * (input.daysSinceSowing / threshold.durationDays);
  const waterBalance = input.currentRainfallMm - seasonalDemand;

  // ── Confidence ──
  let confidence = 65;
  if (input.soilMoisturePercent !== undefined) confidence += 12;
  if (input.baselineRainfallMm > 0) confidence += 10;
  if (input.forecastRainProbability !== undefined) confidence += 8;
  confidence = Math.min(95, confidence);

  // ── Factors ──
  const factors = [
    {
      factor: 'Rainfall Deficit',
      contribution: Math.round(rainfallDeficitNormalized * 30),
      detail: `${input.currentRainfallMm}mm received vs ${input.baselineRainfallMm}mm expected (${rainfallDeficitPercent}% deficit)`,
    },
    {
      factor: 'Soil Moisture',
      contribution: Math.round(moistureNormalized * 25),
      detail: `Current ${input.soilMoisturePercent}% vs critical threshold ${threshold.criticalMoisturePercent}%`,
    },
    {
      factor: 'Dry Spell Duration',
      contribution: Math.round(drySpellNormalized * 20),
      detail: `${input.daysWithoutRain} consecutive days without significant rainfall`,
    },
    {
      factor: 'Forecast Outlook',
      contribution: Math.round(forecastNormalized * 15),
      detail: `${input.forecastRainProbability}% probability of rain in forecast period`,
    },
    {
      factor: 'Water Supply Gap',
      contribution: Math.round(demandNormalized * 10),
      detail: `${threshold.displayName} needs ${dailyDemand}mm/day; current supply ~${dailySupply.toFixed(1)}mm/day`,
    },
  ];

  // ── Recommendation ──
  let recommendation: string;
  let urgency: string;

  if (riskLevel === 'CRITICAL') {
    recommendation = `CRITICAL drought risk. Apply emergency irrigation immediately. Prioritize ${threshold.displayName} at critical growth stages. Consider deficit irrigation strategy to conserve water.`;
    urgency = 'Immediate — irrigate within 12 hours';
  } else if (riskLevel === 'HIGH') {
    recommendation = `Schedule irrigation within 24 hours. Estimated ${daysToStress} days before soil moisture reaches critical level. Apply mulch to reduce evaporation.`;
    urgency = `Urgent — ${daysToStress} days to critical moisture`;
  } else if (riskLevel === 'MEDIUM') {
    recommendation = `Monitor soil moisture daily. Plan irrigation if no rain within ${Math.max(2, daysToStress)} days. Current water balance: ${waterBalance.toFixed(0)}mm.`;
    urgency = `Monitor — ${daysToStress} days buffer`;
  } else {
    recommendation = `Drought risk is low. Continue normal irrigation schedule. Water balance is adequate.`;
    urgency = 'Routine monitoring';
  }

  return {
    score,
    riskLevel,
    confidence,
    rainfallDeficitPercent,
    daysToStress,
    waterBalanceMm: Math.round(waterBalance),
    factors,
    recommendation,
    urgency,
  };
}
