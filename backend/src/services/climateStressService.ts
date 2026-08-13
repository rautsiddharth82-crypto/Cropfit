/**
 * Climate Stress Service (PS-02)
 * 
 * Integrates heat stress, drought risk, flood/waterlogging,
 * and disease-favorable weather detection into a unified
 * climate stress early warning system.
 */

import { getWeatherService } from './weatherService';
import { getMeteoblueClient } from './clients/meteoblueClient';
import { getCEHubClient } from './clients/cehubClient';
import { calculateHeatStress, calculateHeatStressForecast, type HeatStressResult } from './algorithms/heatStressModel';
import { calculateDroughtRisk, type DroughtRiskResult } from './algorithms/droughtRiskModel';
import { DEFAULT_LOCATION, type SupportedCrop } from './config/constants';
import { CROP_THRESHOLDS } from './config/cropThresholds';

export interface CompositeStressResult {
  fieldId: string;
  timestamp: string;
  heatStress: HeatStressResult;
  droughtRisk: DroughtRiskResult;
  floodRisk: { score: number; riskLevel: string; reason: string };
  diseaseWeatherRisk: { score: number; riskLevel: string; diseases: string[] };
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  overallScore: number;
  topAlert: { title: string; description: string; action: string } | null;
}

export class ClimateStressService {
  private weatherService = getWeatherService();
  private meteoblue = getMeteoblueClient();
  private cehub = getCEHubClient();

  /**
   * Get comprehensive stress assessment for a field.
   */
  async getCompositeStress(
    fieldId: string,
    crop: SupportedCrop,
    daysSinceSowing: number,
    soilMoisturePercent: number,
    lat = DEFAULT_LOCATION.lat,
    lon = DEFAULT_LOCATION.lon
  ): Promise<CompositeStressResult> {
    const month = new Date().getMonth() + 1;

    // Parallel API calls
    const [weather, baseline, diseaseRisk, historicalStress] = await Promise.all([
      this.weatherService.getFieldWeather(lat, lon),
      this.meteoblue.getSeasonalBaseline(lat, lon, month),
      this.cehub.getDiseaseRisk(lat, lon, crop),
      this.meteoblue.getHistoricalStressEvents(lat, lon, [month - 1, month, month + 1]),
    ]);

    // ── Heat Stress ──
    const forecastMaxTemp = weather.forecast[1]?.tempMaxC || weather.current.tempMaxC;
    const heatStress = calculateHeatStress({
      forecastMaxTemp,
      crop,
      daysSinceSowing,
      soilMoisturePercent,
      historicalHeatFrequency: historicalStress.heatEvents,
      consecutiveHotDays: this.countConsecutiveHotDays(weather.forecast, CROP_THRESHOLDS[crop].tempStressMax),
      currentHumidity: weather.current.humidity,
    });

    // ── Drought Risk ──
    const droughtRisk = calculateDroughtRisk({
      currentRainfallMm: weather.current.precipitationMm * 30,  // Approximate monthly
      baselineRainfallMm: baseline.avgRainfallMm,
      soilMoisturePercent,
      crop,
      daysSinceSowing,
      daysWithoutRain: this.countDryDays(weather.forecast),
      forecastRainProbability: weather.forecast[0]?.precipitationProbability || 20,
      irrigationAvailable: true,
    });

    // ── Flood / Waterlogging Risk ──
    const floodRisk = this.assessFloodRisk(weather, soilMoisturePercent, crop);

    // ── Disease-Favorable Weather Risk ──
    const diseaseWeatherRisk = this.assessDiseaseWeatherRisk(weather, diseaseRisk, crop);

    // ── Overall Score ──
    const overallScore = Math.round(
      heatStress.score * 0.35 +
      droughtRisk.score * 0.30 +
      floodRisk.score * 0.15 +
      diseaseWeatherRisk.score * 0.20
    );

    let overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (overallScore >= 80) overallRiskLevel = 'CRITICAL';
    else if (overallScore >= 60) overallRiskLevel = 'HIGH';
    else if (overallScore >= 30) overallRiskLevel = 'MEDIUM';
    else overallRiskLevel = 'LOW';

    // ── Top Alert ──
    const topAlert = this.generateTopAlert(heatStress, droughtRisk, floodRisk, crop, daysSinceSowing);

    return {
      fieldId,
      timestamp: new Date().toISOString(),
      heatStress,
      droughtRisk,
      floodRisk,
      diseaseWeatherRisk,
      overallRiskLevel,
      overallScore,
      topAlert,
    };
  }

  /**
   * Get heat stress forecast for the next 7 days.
   */
  async getHeatStressForecast(
    crop: SupportedCrop,
    daysSinceSowing: number,
    soilMoisturePercent: number,
    lat = DEFAULT_LOCATION.lat,
    lon = DEFAULT_LOCATION.lon
  ): Promise<HeatStressResult[]> {
    const weather = await this.weatherService.getFieldWeather(lat, lon);
    const dailyMaxTemps = weather.forecast.map(d => d.tempMaxC);
    const historicalStress = await this.meteoblue.getHistoricalStressEvents(lat, lon, [new Date().getMonth() + 1]);

    return calculateHeatStressForecast(
      dailyMaxTemps,
      crop,
      daysSinceSowing,
      soilMoisturePercent,
      historicalStress.heatEvents
    );
  }

  // ── Helpers ──

  private countConsecutiveHotDays(forecast: any[], threshold: number): number {
    let count = 0;
    for (const day of forecast) {
      if (day.tempMaxC > threshold) count++;
      else break;
    }
    return count;
  }

  private countDryDays(forecast: any[]): number {
    let count = 0;
    for (const day of forecast) {
      if (day.precipitationMm < 2) count++;
      else break;
    }
    return count;
  }

  private assessFloodRisk(weather: any, moisture: number, crop: SupportedCrop) {
    const threshold = CROP_THRESHOLDS[crop];
    const heavyRainDays = weather.forecast.filter((d: any) => d.precipitationMm > 30).length;
    const isWaterlogged = moisture > threshold.waterloggingThresholdPercent;

    let score = 0;
    if (heavyRainDays >= 2) score += 40;
    if (heavyRainDays >= 3) score += 20;
    if (isWaterlogged) score += 30;
    if (moisture > 80) score += 10;
    score = Math.min(100, score);

    return {
      score,
      riskLevel: score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW',
      reason: isWaterlogged
        ? `Soil moisture ${moisture}% exceeds waterlogging threshold (${threshold.waterloggingThresholdPercent}%).`
        : heavyRainDays > 0
          ? `${heavyRainDays} days of heavy rain (>30mm) forecast.`
          : 'No significant flood risk.',
    };
  }

  private assessDiseaseWeatherRisk(weather: any, diseaseRisk: any, crop: SupportedCrop) {
    const threshold = CROP_THRESHOLDS[crop];
    const avgHumidity = weather.forecast.reduce((s: number, d: any) => s + (d.humidity || 60), 0) / Math.max(weather.forecast.length, 1);
    const humidDays = weather.forecast.filter((d: any) => (d.humidity || 60) > threshold.diseaseFavorableHumidity).length;

    let score = diseaseRisk?.risks?.[0]?.riskScore || 0;
    if (avgHumidity > threshold.diseaseFavorableHumidity) score += 15;
    if (humidDays >= 3) score += 10;
    score = Math.min(100, score);

    const diseases = (diseaseRisk?.risks || []).map((r: any) => r.diseaseName);

    return {
      score,
      riskLevel: score >= 60 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW',
      diseases,
    };
  }

  private generateTopAlert(
    heat: HeatStressResult,
    drought: DroughtRiskResult,
    flood: { score: number; riskLevel: string },
    crop: SupportedCrop,
    daysSinceSowing: number
  ) {
    const threshold = CROP_THRESHOLDS[crop];
    const risks = [
      { type: 'heat', score: heat.score, level: heat.riskLevel },
      { type: 'drought', score: drought.score, level: drought.riskLevel },
      { type: 'flood', score: flood.score, level: flood.riskLevel },
    ].sort((a, b) => b.score - a.score);

    const top = risks[0];
    if (top.score < 30) return null;

    if (top.type === 'heat') {
      return {
        title: `⚠️ ${top.level} Heat Stress Risk — ${threshold.displayName}`,
        description: `Temperature expected to exceed ${threshold.tempStressMax}°C. ${threshold.displayName} at ${heat.growthStage} stage is highly sensitive.`,
        action: heat.recommendation,
      };
    } else if (top.type === 'drought') {
      return {
        title: `⚠️ ${top.level} Drought Risk — ${threshold.displayName}`,
        description: `Rainfall ${drought.rainfallDeficitPercent}% below seasonal average. ${drought.daysToStress} days until critical moisture.`,
        action: drought.recommendation,
      };
    } else {
      return {
        title: `⚠️ ${top.level} Flood/Waterlogging Risk`,
        description: `Heavy rainfall expected with soil moisture already elevated.`,
        action: 'Inspect drainage. Open drainage channels if water is standing. Do not irrigate. Postpone fertilizer.',
      };
    }
  }
}

let _instance: ClimateStressService | null = null;
export function getClimateStressService(): ClimateStressService {
  if (!_instance) _instance = new ClimateStressService();
  return _instance;
}
