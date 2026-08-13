/**
 * Heat Stress Scoring Model
 * 
 * Calculates heat stress risk by combining forecast temperature,
 * crop-specific thresholds, growth stage sensitivity, soil moisture,
 * and historical heat event frequency.
 */

import { CROP_THRESHOLDS, getCurrentGrowthStage } from '../config/cropThresholds';
import { GROWTH_STAGE_SENSITIVITY, RISK_SCORE_THRESHOLDS, type SupportedCrop, type GrowthStage } from '../config/constants';

export interface HeatStressInput {
  forecastMaxTemp: number;
  forecastMinTemp?: number;
  crop: SupportedCrop;
  daysSinceSowing: number;
  soilMoisturePercent: number;
  historicalHeatFrequency?: number;   // Events per season at this location
  consecutiveHotDays?: number;
  currentHumidity?: number;
}

export interface HeatStressResult {
  score: number;               // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;          // 0-100
  growthStage: GrowthStage;
  stageSensitivity: number;
  tempExceedance: number;      // How many °C above threshold
  soilMoistureDeficit: number; // How far below optimal
  factors: HeatStressFactor[];
  recommendation: string;
  urgency: string;
}

export interface HeatStressFactor {
  factor: string;
  contribution: number;   // 0-100 (how much this factor contributes to total score)
  detail: string;
}

/**
 * Calculate comprehensive heat stress score.
 * 
 * Algorithm:
 * HeatStressScore = (
 *   tempExceedanceScore × 0.35 +
 *   growthStageSensitivity × 0.25 +
 *   soilMoistureDeficit × 0.20 +
 *   consecutiveHotDays × 0.10 +
 *   historicalFrequency × 0.10
 * ) × 100
 */
export function calculateHeatStress(input: HeatStressInput): HeatStressResult {
  const threshold = CROP_THRESHOLDS[input.crop];
  if (!threshold) {
    throw new Error(`Unknown crop: ${input.crop}`);
  }

  const growthStage = getCurrentGrowthStage(input.crop, input.daysSinceSowing);
  const stageSensitivity = GROWTH_STAGE_SENSITIVITY[growthStage] ?? 0.5;

  // ── Factor 1: Temperature Exceedance (35% weight) ──
  const tempExceedance = Math.max(0, input.forecastMaxTemp - threshold.tempStressMax);
  const lethalRange = threshold.tempLethalMax - threshold.tempStressMax;
  const tempExceedanceNormalized = lethalRange > 0
    ? Math.min(1, tempExceedance / lethalRange)
    : (tempExceedance > 0 ? 1 : 0);

  // ── Factor 2: Growth Stage Sensitivity (25% weight) ──
  // Already normalized 0-1

  // ── Factor 3: Soil Moisture Deficit (20% weight) ──
  const moistureDeficit = Math.max(0, threshold.criticalMoisturePercent - input.soilMoisturePercent);
  const soilMoistureNormalized = Math.min(1, moistureDeficit / (threshold.criticalMoisturePercent || 30));

  // ── Factor 4: Consecutive Hot Days (10% weight) ──
  const consecutiveDays = input.consecutiveHotDays ?? 0;
  const consecutiveNormalized = Math.min(1, consecutiveDays / 5);

  // ── Factor 5: Historical Heat Frequency (10% weight) ──
  const histFrequency = input.historicalHeatFrequency ?? 2;
  const historicalNormalized = Math.min(1, histFrequency / 5);

  // ── Combined Score ──
  const rawScore = (
    tempExceedanceNormalized * 0.35 +
    stageSensitivity * tempExceedanceNormalized * 0.25 + // Stage amplifies temp effect
    soilMoistureNormalized * 0.20 +
    consecutiveNormalized * 0.10 +
    historicalNormalized * 0.10
  );

  const score = Math.round(Math.min(100, rawScore * 100));

  // ── Risk Level ──
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (score < RISK_SCORE_THRESHOLDS.LOW_MAX) riskLevel = 'LOW';
  else if (score < RISK_SCORE_THRESHOLDS.MEDIUM_MAX) riskLevel = 'MEDIUM';
  else if (score < RISK_SCORE_THRESHOLDS.HIGH_MAX) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  // ── Confidence Calculation ──
  // Higher when we have more data sources
  let confidence = 70; // Base confidence from temperature data
  if (input.soilMoisturePercent !== undefined) confidence += 10;
  if (input.consecutiveHotDays !== undefined) confidence += 5;
  if (input.historicalHeatFrequency !== undefined) confidence += 8;
  if (input.currentHumidity !== undefined) confidence += 7;
  confidence = Math.min(95, confidence);

  // ── Build Factor Breakdown ──
  const factors: HeatStressFactor[] = [
    {
      factor: 'Temperature Exceedance',
      contribution: Math.round(tempExceedanceNormalized * 35),
      detail: tempExceedance > 0
        ? `${input.forecastMaxTemp}°C exceeds ${threshold.displayName} threshold of ${threshold.tempStressMax}°C by ${tempExceedance.toFixed(1)}°C`
        : `${input.forecastMaxTemp}°C is within safe range (threshold: ${threshold.tempStressMax}°C)`,
    },
    {
      factor: 'Growth Stage Sensitivity',
      contribution: Math.round(stageSensitivity * tempExceedanceNormalized * 25),
      detail: `${threshold.displayName} at ${growthStage} stage has sensitivity ${(stageSensitivity * 100).toFixed(0)}%`,
    },
    {
      factor: 'Soil Moisture Deficit',
      contribution: Math.round(soilMoistureNormalized * 20),
      detail: moistureDeficit > 0
        ? `Soil moisture ${input.soilMoisturePercent}% is ${moistureDeficit}% below critical threshold (${threshold.criticalMoisturePercent}%)`
        : `Soil moisture ${input.soilMoisturePercent}% is adequate`,
    },
    {
      factor: 'Consecutive Hot Days',
      contribution: Math.round(consecutiveNormalized * 10),
      detail: `${consecutiveDays} consecutive days above stress temperature`,
    },
    {
      factor: 'Historical Heat Pattern',
      contribution: Math.round(historicalNormalized * 10),
      detail: `Region averages ${histFrequency} heat stress events per season`,
    },
  ];

  // ── Recommendation ──
  let recommendation: string;
  let urgency: string;

  if (riskLevel === 'CRITICAL') {
    recommendation = `CRITICAL: Apply emergency irrigation immediately (25-30mm). Avoid all field operations during 11AM-4PM. Consider foliar KNO₃ spray (1%) in evening.`;
    urgency = 'Immediate action required within 6 hours';
  } else if (riskLevel === 'HIGH') {
    recommendation = `Apply light irrigation during 6:00-8:00 AM tomorrow. Avoid nitrogen fertilizer application. Monitor leaf curling and wilting.`;
    urgency = 'Action recommended within 12-24 hours';
  } else if (riskLevel === 'MEDIUM') {
    recommendation = `Monitor soil moisture levels. Schedule irrigation if moisture drops below ${threshold.criticalMoisturePercent}%. Inspect crop for early stress signs.`;
    urgency = 'Monitor closely over next 48 hours';
  } else {
    recommendation = `No immediate heat stress action required. Continue normal field management.`;
    urgency = 'Routine monitoring';
  }

  return {
    score,
    riskLevel,
    confidence,
    growthStage,
    stageSensitivity,
    tempExceedance,
    soilMoistureDeficit: moistureDeficit,
    factors,
    recommendation,
    urgency,
  };
}

/**
 * Batch calculate heat stress for multiple days (forecast period).
 */
export function calculateHeatStressForecast(
  dailyMaxTemps: number[],
  crop: SupportedCrop,
  daysSinceSowing: number,
  soilMoisturePercent: number,
  historicalHeatFrequency?: number
): HeatStressResult[] {
  let consecutiveHotDays = 0;
  const threshold = CROP_THRESHOLDS[crop];

  return dailyMaxTemps.map((temp, i) => {
    if (temp > threshold.tempStressMax) {
      consecutiveHotDays++;
    } else {
      consecutiveHotDays = 0;
    }

    return calculateHeatStress({
      forecastMaxTemp: temp,
      crop,
      daysSinceSowing: daysSinceSowing + i,
      soilMoisturePercent: Math.max(soilMoisturePercent - i * 2, 15), // Moisture declines daily
      historicalHeatFrequency,
      consecutiveHotDays,
    });
  });
}
