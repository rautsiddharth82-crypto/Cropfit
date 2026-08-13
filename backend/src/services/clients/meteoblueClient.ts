/**
 * Meteoblue Dataset API Client
 * 
 * Wraps the Meteoblue Dataset API for historical weather data access.
 * Endpoint: POST https://my.meteoblue.com/dataset/query?apikey=KEY
 * 
 * Documentation: https://docs.meteoblue.com/en/weather-apis/dataset-api/dataset-api
 */

import { METEOBLUE_BASE_URL, METEOBLUE_CODES, METEOBLUE_UNITS } from '../config/constants';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface MeteoblueQueryCode {
  code: number;
  level: string;
}

export interface MeteoblueGeometry {
  type: 'MultiPoint';
  coordinates: [number, number, number][]; // [lon, lat, alt]
  locationNames: string[];
}

export interface MeteoblueQuery {
  domain: string;
  timeResolution: 'hourly' | 'daily' | 'monthly';
  codes: MeteoblueQueryCode[];
}

export interface MeteoblueDatasetRequest {
  units: typeof METEOBLUE_UNITS;
  geometry: MeteoblueGeometry;
  format: 'json' | 'csv' | 'protobuf';
  timeIntervals: string[];
  queries: MeteoblueQuery[];
}

export interface MeteoblueHistoricalData {
  location: string;
  lat: number;
  lon: number;
  period: { start: string; end: string };
  temperature: { hourly?: number[]; daily?: { min: number[]; max: number[]; mean: number[] } };
  humidity: { hourly?: number[]; daily?: { mean: number[] } };
  precipitation: { hourly?: number[]; daily?: { sum: number[] } };
  soilMoisture?: { daily?: { mean: number[] } };
  solarRadiation?: { daily?: { mean: number[] } };
  windSpeed?: { hourly?: number[]; daily?: { mean: number[] } };
  timestamps: string[];
}

export interface SeasonalBaseline {
  month: number;
  avgTempC: number;
  avgMaxTempC: number;
  avgMinTempC: number;
  avgRainfallMm: number;
  avgHumidity: number;
  stdDevTemp: number;
  stdDevRainfall: number;
  heatEventFrequency: number; // average # heat events per season
  droughtFrequency: number;   // average # dry spells per season
}

// ──────────────────────────────────────────────
// Client
// ──────────────────────────────────────────────

export class MeteoblueClient {
  private baseUrl: string;

  private getApiKey(): string {
    return process.env.METEOBLUE_API_KEY || '';
  }

  constructor() {
    this.baseUrl = METEOBLUE_BASE_URL;
  }

  /**
   * Build the Dataset API request body for a given location and time range.
   */
  private buildRequest(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string,
    timeResolution: 'hourly' | 'daily' = 'daily',
    codes: MeteoblueQueryCode[] = [
      METEOBLUE_CODES.TEMPERATURE_2M,
      METEOBLUE_CODES.RELATIVE_HUMIDITY_2M,
      METEOBLUE_CODES.PRECIPITATION,
    ]
  ): MeteoblueDatasetRequest {
    return {
      units: { ...METEOBLUE_UNITS },
      geometry: {
        type: 'MultiPoint',
        coordinates: [[lon, lat, 274]], // Default altitude for Punjab
        locationNames: ['FarmerField'],
      },
      format: 'json',
      timeIntervals: [`${startDate}T+00:00/${endDate}T+00:00`],
      queries: [
        {
          domain: 'NEMSGLOBAL',
          timeResolution,
          codes,
        },
      ],
    };
  }

  /**
   * Execute a raw query to the Meteoblue Dataset API.
   */
  private async executeQuery(request: MeteoblueDatasetRequest): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn(`[Meteoblue] No API key configured. Returning simulated data`);
      return this.getSimulatedData(request);
    }

    try {
      const url = `${this.baseUrl}/dataset/query?apikey=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[MeteoblueClient] API error: ${response.status} - ${errorText}`);
        return this.getSimulatedData(request);
      }

      return await response.json();
    } catch (error) {
      console.error('[MeteoblueClient] Request failed:', error);
      return this.getSimulatedData(request);
    }
  }

  /**
   * Get historical weather data for a location.
   */
  async getHistoricalWeather(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string,
    resolution: 'hourly' | 'daily' = 'daily'
  ): Promise<MeteoblueHistoricalData> {
    const codes = [
      METEOBLUE_CODES.TEMPERATURE_2M,
      METEOBLUE_CODES.RELATIVE_HUMIDITY_2M,
      METEOBLUE_CODES.PRECIPITATION,
      METEOBLUE_CODES.WIND_SPEED_10M,
      METEOBLUE_CODES.SOLAR_RADIATION,
    ];

    const request = this.buildRequest(lat, lon, startDate, endDate, resolution, codes);
    const raw = await this.executeQuery(request);

    return this.parseHistoricalResponse(raw, lat, lon, startDate, endDate);
  }

  /**
   * Get soil conditions (temperature + moisture) for a location.
   */
  async getSoilConditions(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
  ): Promise<{ soilTemperature: number[]; soilMoisture: number[]; timestamps: string[] }> {
    const codes = [
      METEOBLUE_CODES.SOIL_TEMPERATURE,
      METEOBLUE_CODES.SOIL_MOISTURE,
    ];

    const request = this.buildRequest(lat, lon, startDate, endDate, 'daily', codes);
    const raw = await this.executeQuery(request);

    // Parse soil-specific data
    return {
      soilTemperature: raw?.data?.[0]?.coordinates?.[0]?.dates?.[0]?.value || this.generateSimulatedSoilTemp(),
      soilMoisture: raw?.data?.[1]?.coordinates?.[0]?.dates?.[0]?.value || this.generateSimulatedSoilMoisture(),
      timestamps: this.generateDateRange(startDate, endDate),
    };
  }

  /**
   * Calculate the 30-year seasonal baseline for anomaly detection.
   * Since we may not have 30 years of free API access, this provides
   * reasonable baselines for key Indian agricultural regions.
   */
  async getSeasonalBaseline(lat: number, lon: number, month: number): Promise<SeasonalBaseline> {
    // For hackathon: Use pre-computed baselines for Punjab/Rajasthan regions
    // Production: Would query Meteoblue ERA5 reanalysis data
    const baselines = this.getRegionalBaselines(lat, lon);
    return baselines[month - 1] || baselines[0];
  }

  /**
   * Get historical stress events for a location.
   */
  async getHistoricalStressEvents(
    lat: number,
    lon: number,
    seasonMonths: number[]
  ): Promise<{
    heatEvents: number;
    droughtEvents: number;
    frostEvents: number;
    floodEvents: number;
    avgEventsPerSeason: number;
  }> {
    // For hackathon: derive from regional climate normals
    // Production: analyse multiple years of Meteoblue historical data
    const isPunjab = lat > 29 && lat < 33 && lon > 73 && lon < 78;

    return {
      heatEvents: isPunjab ? 4 : 3,
      droughtEvents: isPunjab ? 2 : 3,
      frostEvents: isPunjab ? 1 : 0,
      floodEvents: isPunjab ? 1 : 2,
      avgEventsPerSeason: isPunjab ? 2.0 : 2.5,
    };
  }

  /**
   * Calculate weather anomaly by comparing current period vs baseline.
   */
  async calculateAnomaly(
    lat: number,
    lon: number,
    currentTemp: number,
    currentRainfall: number,
    month: number
  ): Promise<{
    tempAnomaly: number;      // Current - baseline (°C)
    tempZScore: number;       // Standard deviations from mean
    rainfallAnomaly: number;  // Current - baseline (mm)
    rainfallZScore: number;
    isAboveNormal: boolean;
    severity: string;
  }> {
    const baseline = await this.getSeasonalBaseline(lat, lon, month);

    const tempAnomaly = currentTemp - baseline.avgTempC;
    const tempZScore = baseline.stdDevTemp > 0 ? tempAnomaly / baseline.stdDevTemp : 0;
    const rainfallAnomaly = currentRainfall - baseline.avgRainfallMm;
    const rainfallZScore = baseline.stdDevRainfall > 0 ? rainfallAnomaly / baseline.stdDevRainfall : 0;

    let severity = 'Normal';
    if (Math.abs(tempZScore) > 2 || Math.abs(rainfallZScore) > 2) severity = 'Extreme';
    else if (Math.abs(tempZScore) > 1.5 || Math.abs(rainfallZScore) > 1.5) severity = 'Significant';
    else if (Math.abs(tempZScore) > 1 || Math.abs(rainfallZScore) > 1) severity = 'Moderate';

    return {
      tempAnomaly: Math.round(tempAnomaly * 10) / 10,
      tempZScore: Math.round(tempZScore * 100) / 100,
      rainfallAnomaly: Math.round(rainfallAnomaly * 10) / 10,
      rainfallZScore: Math.round(rainfallZScore * 100) / 100,
      isAboveNormal: tempAnomaly > 0,
      severity,
    };
  }

  // ──────────────────────────────────────────────
  // Helpers & Fallback Simulation
  // ──────────────────────────────────────────────

  private parseHistoricalResponse(
    raw: any,
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
  ): MeteoblueHistoricalData {
    const timestamps = this.generateDateRange(startDate, endDate);

    // Try to parse actual API response structure
    try {
      if (raw?.data) {
        return {
          location: 'FarmerField',
          lat,
          lon,
          period: { start: startDate, end: endDate },
          temperature: {
            daily: {
              min: raw.data[0]?.coordinates?.[0]?.dates?.map((d: any) => d.value?.[0]) || [],
              max: raw.data[0]?.coordinates?.[0]?.dates?.map((d: any) => d.value?.[1]) || [],
              mean: raw.data[0]?.coordinates?.[0]?.dates?.map((d: any) => d.value?.[2]) || [],
            },
          },
          humidity: {
            daily: { mean: raw.data[1]?.coordinates?.[0]?.dates?.map((d: any) => d.value?.[0]) || [] },
          },
          precipitation: {
            daily: { sum: raw.data[2]?.coordinates?.[0]?.dates?.map((d: any) => d.value?.[0]) || [] },
          },
          timestamps,
        };
      }
    } catch (e) {
      // Fall through to simulated
    }

    // Simulated fallback
    return this.getSimulatedHistorical(lat, lon, startDate, endDate, timestamps);
  }

  private getSimulatedHistorical(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string,
    timestamps: string[]
  ): MeteoblueHistoricalData {
    const days = timestamps.length;
    const month = new Date(startDate).getMonth();
    const baseTemp = [15, 17, 22, 28, 34, 36, 33, 32, 30, 26, 20, 16][month];

    return {
      location: 'FarmerField',
      lat,
      lon,
      period: { start: startDate, end: endDate },
      temperature: {
        daily: {
          min: Array.from({ length: days }, () => baseTemp - 8 + Math.random() * 4),
          max: Array.from({ length: days }, () => baseTemp + 5 + Math.random() * 4),
          mean: Array.from({ length: days }, () => baseTemp + Math.random() * 3),
        },
      },
      humidity: {
        daily: { mean: Array.from({ length: days }, () => 45 + Math.random() * 30) },
      },
      precipitation: {
        daily: { sum: Array.from({ length: days }, () => Math.random() > 0.7 ? Math.random() * 20 : 0) },
      },
      timestamps,
    };
  }

  private getSimulatedData(request: MeteoblueDatasetRequest): any {
    return { simulated: true, data: [] };
  }

  private generateSimulatedSoilTemp(): number[] {
    return Array.from({ length: 30 }, () => 22 + Math.random() * 10);
  }

  private generateSimulatedSoilMoisture(): number[] {
    return Array.from({ length: 30 }, () => 25 + Math.random() * 30);
  }

  private generateDateRange(start: string, end: string): string[] {
    const dates: string[] = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  /**
   * Pre-computed seasonal baselines for Punjab/North India region.
   * Based on IMD climate normals.
   */
  private getRegionalBaselines(lat: number, lon: number): SeasonalBaseline[] {
    // Punjab / North India baselines (monthly, Jan–Dec)
    return [
      { month: 1,  avgTempC: 12.5, avgMaxTempC: 19.5, avgMinTempC: 5.5,  avgRainfallMm: 25,  avgHumidity: 68, stdDevTemp: 3.2, stdDevRainfall: 15, heatEventFrequency: 0,   droughtFrequency: 0.3 },
      { month: 2,  avgTempC: 15.0, avgMaxTempC: 22.0, avgMinTempC: 8.0,  avgRainfallMm: 28,  avgHumidity: 62, stdDevTemp: 3.5, stdDevRainfall: 18, heatEventFrequency: 0,   droughtFrequency: 0.2 },
      { month: 3,  avgTempC: 21.0, avgMaxTempC: 28.5, avgMinTempC: 13.5, avgRainfallMm: 22,  avgHumidity: 52, stdDevTemp: 3.0, stdDevRainfall: 14, heatEventFrequency: 0.5, droughtFrequency: 0.3 },
      { month: 4,  avgTempC: 28.0, avgMaxTempC: 36.0, avgMinTempC: 20.0, avgRainfallMm: 12,  avgHumidity: 38, stdDevTemp: 3.8, stdDevRainfall: 10, heatEventFrequency: 1.5, droughtFrequency: 0.5 },
      { month: 5,  avgTempC: 33.5, avgMaxTempC: 40.5, avgMinTempC: 26.5, avgRainfallMm: 18,  avgHumidity: 32, stdDevTemp: 3.0, stdDevRainfall: 12, heatEventFrequency: 3.0, droughtFrequency: 0.8 },
      { month: 6,  avgTempC: 34.0, avgMaxTempC: 40.0, avgMinTempC: 28.0, avgRainfallMm: 55,  avgHumidity: 48, stdDevTemp: 2.8, stdDevRainfall: 30, heatEventFrequency: 2.5, droughtFrequency: 0.4 },
      { month: 7,  avgTempC: 31.5, avgMaxTempC: 35.5, avgMinTempC: 27.5, avgRainfallMm: 210, avgHumidity: 75, stdDevTemp: 2.0, stdDevRainfall: 65, heatEventFrequency: 1.0, droughtFrequency: 0.1 },
      { month: 8,  avgTempC: 30.5, avgMaxTempC: 34.0, avgMinTempC: 27.0, avgRainfallMm: 195, avgHumidity: 78, stdDevTemp: 1.8, stdDevRainfall: 55, heatEventFrequency: 0.8, droughtFrequency: 0.1 },
      { month: 9,  avgTempC: 29.5, avgMaxTempC: 34.0, avgMinTempC: 25.0, avgRainfallMm: 95,  avgHumidity: 70, stdDevTemp: 2.2, stdDevRainfall: 40, heatEventFrequency: 0.5, droughtFrequency: 0.2 },
      { month: 10, avgTempC: 25.5, avgMaxTempC: 33.0, avgMinTempC: 18.0, avgRainfallMm: 18,  avgHumidity: 55, stdDevTemp: 3.0, stdDevRainfall: 12, heatEventFrequency: 0.3, droughtFrequency: 0.4 },
      { month: 11, avgTempC: 18.5, avgMaxTempC: 27.0, avgMinTempC: 10.0, avgRainfallMm: 8,   avgHumidity: 60, stdDevTemp: 3.5, stdDevRainfall: 8,  heatEventFrequency: 0,   droughtFrequency: 0.6 },
      { month: 12, avgTempC: 13.0, avgMaxTempC: 21.0, avgMinTempC: 5.0,  avgRainfallMm: 15,  avgHumidity: 66, stdDevTemp: 3.0, stdDevRainfall: 10, heatEventFrequency: 0,   droughtFrequency: 0.4 },
    ];
  }
}

// Singleton instance
let _instance: MeteoblueClient | null = null;
export function getMeteoblueClient(): MeteoblueClient {
  if (!_instance) _instance = new MeteoblueClient();
  return _instance;
}
