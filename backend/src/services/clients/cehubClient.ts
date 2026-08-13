/**
 * Syngenta CE Hub API Client
 * 
 * Wraps the CE Hub REST API for forecast, disease risk, soil analysis,
 * alerts, and agronomic recommendations.
 * 
 * Swagger: https://services.cehub.syngenta-ais.com/swagger/index.html
 */

import { CEHUB_BASE_URL } from '../config/constants';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface CEHubForecastResponse {
  location: { lat: number; lon: number; name: string };
  forecastDays: CEHubForecastDay[];
  generatedAt: string;
}

export interface CEHubForecastDay {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  precipitationProbability: number;
  humidity: number;
  windSpeedKmh: number;
  uvIndex: number;
  condition: string;
  cloudCover: number;
}

export interface CEHubDiseaseRiskResponse {
  cropType: string;
  location: { lat: number; lon: number };
  risks: CEHubDiseaseRisk[];
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  generatedAt: string;
}

export interface CEHubDiseaseRisk {
  diseaseName: string;
  riskScore: number;       // 0-100
  riskLevel: string;
  favorableConditions: string[];
  preventiveActions: string[];
  weatherDrivers: string[];
}

export interface CEHubSoilAnalysisResponse {
  location: { lat: number; lon: number };
  soilType: string;
  soilMoisturePercent: number;
  soilTemperatureC: number;
  drainageClass: string;
  recommendations: string[];
}

export interface CEHubAlertResponse {
  alerts: CEHubAlert[];
  totalCount: number;
}

export interface CEHubAlert {
  id: string;
  type: 'weather' | 'disease' | 'pest' | 'frost' | 'heat' | 'flood';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedCrops: string[];
  validFrom: string;
  validUntil: string;
  actions: string[];
}

export interface CEHubAgronomicRecommendation {
  cropType: string;
  growthStage: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  category: 'irrigation' | 'fertilization' | 'pest_management' | 'harvest' | 'general';
  rationale: string;
  timing: string;
}

// ──────────────────────────────────────────────
// Client
// ──────────────────────────────────────────────

export class CEHubClient {
  private baseUrl: string;

  private getApiKey(): string {
    return process.env.CEHUB_API_KEY || '';
  }

  constructor() {
    this.baseUrl = CEHUB_BASE_URL;
  }

  /**
   * Make an authenticated request to CE Hub API.
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn(`[CEHubClient] No API key configured, returning simulated data for ${endpoint}`);
      return this.getSimulatedResponse(endpoint) as T;
    }

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        console.error(`[CEHubClient] API error ${response.status} for ${endpoint}`);
        return this.getSimulatedResponse(endpoint) as T;
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`[CEHubClient] Request failed for ${endpoint}:`, error);
      return this.getSimulatedResponse(endpoint) as T;
    }
  }

  // ──────────────────────────────────────────────
  // Forecast Controller
  // ──────────────────────────────────────────────

  async getForecast(lat: number, lon: number, days: number = 7): Promise<CEHubForecastResponse> {
    return this.request<CEHubForecastResponse>(
      `/api/forecast?lat=${lat}&lon=${lon}&days=${days}`
    );
  }

  // ──────────────────────────────────────────────
  // Disease Risk Controller
  // ──────────────────────────────────────────────

  async getDiseaseRisk(
    lat: number,
    lon: number,
    cropType: string,
    growthStage?: string
  ): Promise<CEHubDiseaseRiskResponse> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      crop: cropType,
      ...(growthStage && { stage: growthStage }),
    });
    return this.request<CEHubDiseaseRiskResponse>(`/api/disease/risk?${params}`);
  }

  // ──────────────────────────────────────────────
  // Soil Analysis Controller
  // ──────────────────────────────────────────────

  async getSoilAnalysis(lat: number, lon: number): Promise<CEHubSoilAnalysisResponse> {
    return this.request<CEHubSoilAnalysisResponse>(
      `/api/soil/analysis?lat=${lat}&lon=${lon}`
    );
  }

  // ──────────────────────────────────────────────
  // Alerts Controller
  // ──────────────────────────────────────────────

  async getAlerts(lat: number, lon: number, cropType?: string): Promise<CEHubAlertResponse> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      ...(cropType && { crop: cropType }),
    });
    return this.request<CEHubAlertResponse>(`/api/alerts?${params}`);
  }

  // ──────────────────────────────────────────────
  // Agronomic Recommendations Controller
  // ──────────────────────────────────────────────

  async getAgronomicRecommendations(
    cropType: string,
    growthStage: string,
    lat: number,
    lon: number
  ): Promise<CEHubAgronomicRecommendation[]> {
    const params = new URLSearchParams({
      crop: cropType,
      stage: growthStage,
      lat: lat.toString(),
      lon: lon.toString(),
    });
    return this.request<CEHubAgronomicRecommendation[]>(`/api/agronomic/recommendations?${params}`);
  }

  // ──────────────────────────────────────────────
  // Generic Recommendation Controller
  // ──────────────────────────────────────────────

  async getGenericRecommendation(query: string, cropType?: string): Promise<{ recommendation: string; sources: string[] }> {
    return this.request(`/api/recommendations/generic`, {
      method: 'POST',
      body: JSON.stringify({ query, cropType }),
    });
  }

  // ──────────────────────────────────────────────
  // Simulated Responses (Hackathon Fallback)
  // ──────────────────────────────────────────────

  private getSimulatedResponse(endpoint: string): any {
    if (endpoint.includes('/forecast')) {
      return this.simulateForecast();
    }
    if (endpoint.includes('/disease/risk')) {
      return this.simulateDiseaseRisk();
    }
    if (endpoint.includes('/soil/analysis')) {
      return this.simulateSoilAnalysis();
    }
    if (endpoint.includes('/alerts')) {
      return this.simulateAlerts();
    }
    if (endpoint.includes('/agronomic')) {
      return this.simulateAgronomicRecommendations();
    }
    if (endpoint.includes('/recommendations/generic')) {
      return { recommendation: 'General crop management practices advised.', sources: ['CE Hub'] };
    }
    return {};
  }

  private simulateForecast(): CEHubForecastResponse {
    const today = new Date();
    return {
      location: { lat: 30.4764, lon: 76.5927, name: 'Rajpura, Punjab' },
      generatedAt: new Date().toISOString(),
      forecastDays: Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const isRainy = i === 3 || i === 4;
        return {
          date: date.toISOString().split('T')[0],
          tempMaxC: isRainy ? 28 + Math.random() * 4 : 32 + Math.random() * 6,
          tempMinC: isRainy ? 20 + Math.random() * 3 : 22 + Math.random() * 3,
          precipitationMm: isRainy ? 15 + Math.random() * 40 : Math.random() * 2,
          precipitationProbability: isRainy ? 60 + Math.random() * 30 : 5 + Math.random() * 15,
          humidity: isRainy ? 75 + Math.random() * 15 : 35 + Math.random() * 25,
          windSpeedKmh: 8 + Math.random() * 12,
          uvIndex: isRainy ? 3 + Math.floor(Math.random() * 3) : 7 + Math.floor(Math.random() * 4),
          condition: isRainy ? 'Thundershowers' : (i === 0 ? 'Partly Cloudy' : 'Hot & Clear'),
          cloudCover: isRainy ? 70 + Math.random() * 25 : 10 + Math.random() * 30,
        };
      }),
    };
  }

  private simulateDiseaseRisk(): CEHubDiseaseRiskResponse {
    return {
      cropType: 'wheat',
      location: { lat: 30.4764, lon: 76.5927 },
      generatedAt: new Date().toISOString(),
      overallRiskLevel: 'medium',
      risks: [
        {
          diseaseName: 'Yellow Rust (Stripe Rust)',
          riskScore: 62,
          riskLevel: 'medium',
          favorableConditions: ['Cool temperatures (10-20°C)', 'High humidity (>80%)', 'Dense canopy'],
          preventiveActions: ['Monitor fields during foggy mornings', 'Apply preventive fungicide if symptoms appear'],
          weatherDrivers: ['Humidity expected to rise above 80% on Day 4-5'],
        },
        {
          diseaseName: 'Karnal Bunt',
          riskScore: 35,
          riskLevel: 'low',
          favorableConditions: ['Humid weather during flowering', 'Temperatures 18-22°C'],
          preventiveActions: ['Use certified disease-free seed', 'Avoid late sowing'],
          weatherDrivers: ['Temperature within favorable range during grain filling'],
        },
      ],
    };
  }

  private simulateSoilAnalysis(): CEHubSoilAnalysisResponse {
    return {
      location: { lat: 30.4764, lon: 76.5927 },
      soilType: 'Sandy Clay Loam',
      soilMoisturePercent: 34,
      soilTemperatureC: 28,
      drainageClass: 'Moderate',
      recommendations: [
        'Soil moisture below optimal range for wheat flowering stage',
        'Consider light irrigation to maintain root zone moisture',
        'Sandy loam component increases drainage; more frequent lighter irrigations recommended',
      ],
    };
  }

  private simulateAlerts(): CEHubAlertResponse {
    return {
      totalCount: 2,
      alerts: [
        {
          id: 'cehub-alert-1',
          type: 'heat',
          severity: 'warning',
          title: 'Heat Wave Advisory',
          description: 'Maximum temperatures expected to exceed 36°C for the next 2-3 days.',
          affectedCrops: ['wheat', 'mustard', 'vegetables'],
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 3 * 86400000).toISOString(),
          actions: [
            'Ensure adequate irrigation during early morning hours',
            'Avoid nitrogen fertilizer application during peak heat',
            'Monitor crops for wilting and leaf scorching',
          ],
        },
        {
          id: 'cehub-alert-2',
          type: 'disease',
          severity: 'info',
          title: 'Yellow Rust Watch',
          description: 'Weather conditions becoming favorable for yellow rust development in wheat.',
          affectedCrops: ['wheat'],
          validFrom: new Date(Date.now() + 3 * 86400000).toISOString(),
          validUntil: new Date(Date.now() + 6 * 86400000).toISOString(),
          actions: [
            'Scout lower leaves for yellow pustule symptoms',
            'Keep preventive fungicide ready',
          ],
        },
      ],
    };
  }

  private simulateAgronomicRecommendations(): CEHubAgronomicRecommendation[] {
    return [
      {
        cropType: 'wheat',
        growthStage: 'flowering',
        recommendation: 'Apply light irrigation (25-30mm) during early morning to support grain filling and mitigate heat stress.',
        priority: 'high',
        category: 'irrigation',
        rationale: 'Wheat during flowering is highly sensitive to heat and moisture stress. Transpirational cooling requires adequate soil moisture.',
        timing: '6:00 AM – 8:00 AM, before ambient temperature exceeds 28°C',
      },
      {
        cropType: 'wheat',
        growthStage: 'flowering',
        recommendation: 'Avoid nitrogen fertilizer application during heat wave period. Delay by 3-4 days until temperature normalizes.',
        priority: 'medium',
        category: 'fertilization',
        rationale: 'High temperature reduces nitrogen uptake efficiency and can cause fertilizer burn on stressed plants.',
        timing: 'After heat wave passes (Day 4-5)',
      },
      {
        cropType: 'wheat',
        growthStage: 'flowering',
        recommendation: 'Scout for yellow rust symptoms on lower leaves, especially in humid field zones.',
        priority: 'medium',
        category: 'pest_management',
        rationale: 'Humidity increase after heat wave creates favorable conditions for rust pustule development.',
        timing: 'Morning inspection between 7:00 AM – 9:00 AM',
      },
    ];
  }
}

// Singleton instance
let _instance: CEHubClient | null = null;
export function getCEHubClient(): CEHubClient {
  if (!_instance) _instance = new CEHubClient();
  return _instance;
}
