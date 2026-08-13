/**
 * CropFit Backend Constants
 * Central configuration for API URLs, thresholds, and app-wide settings.
 */

// ──────────────────────────────────────────────
// External API Configuration
// ──────────────────────────────────────────────

export const METEOBLUE_BASE_URL = 'https://my.meteoblue.com/dataset/query';
export const CEHUB_BASE_URL = process.env.CEHUB_BASE_URL || 'https://services.cehub.syngenta-ais.com';

// Meteoblue Dataset API variable codes
export const METEOBLUE_CODES = {
  TEMPERATURE_2M: { code: 11, level: '2 m above gnd' },          // °C
  RELATIVE_HUMIDITY_2M: { code: 52, level: '2 m above gnd' },    // %
  PRECIPITATION: { code: 61, level: 'sfc' },                      // mm
  WIND_SPEED_10M: { code: 32, level: '10 m above gnd' },         // m/s
  SOIL_TEMPERATURE: { code: 85, level: '0-10 cm down' },         // °C
  SOIL_MOISTURE: { code: 144, level: '0-10 cm down' },           // m³/m³
  SOLAR_RADIATION: { code: 111, level: 'sfc' },                   // W/m²
  DEW_POINT: { code: 17, level: '2 m above gnd' },               // °C
  EVAPOTRANSPIRATION: { code: 261, level: 'sfc' },                // mm
} as const;

// Default Meteoblue query units
export const METEOBLUE_UNITS = {
  temperature: 'C',
  velocity: 'km/h',
  length: 'metric',
  energy: 'watts',
} as const;

// ──────────────────────────────────────────────
// Default Location (Rajpura, Punjab, India)
// ──────────────────────────────────────────────

export const DEFAULT_LOCATION = {
  lat: 30.4764,
  lon: 76.5927,
  altitude: 274,
  name: 'Rajpura, Punjab',
  district: 'Patiala',
  state: 'Punjab',
} as const;

// ──────────────────────────────────────────────
// Alert & Risk Thresholds
// ──────────────────────────────────────────────

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export const RISK_SCORE_THRESHOLDS = {
  LOW_MAX: 30,
  MEDIUM_MAX: 60,
  HIGH_MAX: 80,
  // ≥80 is CRITICAL
} as const;

export const CONFIDENCE_THRESHOLDS = {
  MINIMUM_FOR_RECOMMENDATION: 70,
  MINIMUM_FOR_PRODUCT_ADVICE: 75,
  ESCALATE_TO_AGRONOMIST: 40,
} as const;

// ──────────────────────────────────────────────
// Crop Growth Stages & Sensitivity
// ──────────────────────────────────────────────

export type GrowthStage =
  | 'germination'
  | 'seedling'
  | 'vegetative'
  | 'tillering'
  | 'flowering'
  | 'grain_filling'
  | 'maturity'
  | 'harvesting';

export const GROWTH_STAGE_SENSITIVITY: Record<GrowthStage, number> = {
  germination: 0.8,
  seedling: 0.7,
  vegetative: 0.5,
  tillering: 0.6,
  flowering: 1.0,      // Most sensitive
  grain_filling: 0.9,
  maturity: 0.3,
  harvesting: 0.2,
} as const;

export const GROWTH_STAGE_LABELS: Record<GrowthStage, string> = {
  germination: 'Germination',
  seedling: 'Seedling',
  vegetative: 'Vegetative',
  tillering: 'Tillering',
  flowering: 'Flowering',
  grain_filling: 'Grain Filling',
  maturity: 'Maturity',
  harvesting: 'Harvesting',
} as const;

// ──────────────────────────────────────────────
// Supported Languages
// ──────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'pa'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
} as const;

// ──────────────────────────────────────────────
// Supported Crops (Hackathon MVP)
// ──────────────────────────────────────────────

export const SUPPORTED_CROPS = ['wheat', 'rice', 'cotton', 'mustard', 'maize', 'pearl_millet', 'sorghum', 'moong', 'tomato'] as const;
export type SupportedCrop = typeof SUPPORTED_CROPS[number];

// ──────────────────────────────────────────────
// Season Definitions
// ──────────────────────────────────────────────

export const SEASONS = {
  KHARIF: { name: 'Kharif', months: [6, 7, 8, 9, 10] },     // June - October
  RABI: { name: 'Rabi', months: [11, 12, 1, 2, 3] },         // November - March
  ZAID: { name: 'Zaid', months: [4, 5] },                     // April - May
} as const;

// ──────────────────────────────────────────────
// Irrigation Window Definitions
// ──────────────────────────────────────────────

export const IRRIGATION_WINDOWS = {
  OPTIMAL_MORNING: { start: 6, end: 8, label: '6:00 AM – 8:00 AM' },
  ACCEPTABLE_MORNING: { start: 8, end: 10, label: '8:00 AM – 10:00 AM' },
  AVOID_MIDDAY: { start: 11, end: 15, label: '11:00 AM – 3:00 PM' },
  SECONDARY_EVENING: { start: 17, end: 19, label: '5:00 PM – 7:00 PM' },
} as const;

// ──────────────────────────────────────────────
// Safety Gate Configuration
// ──────────────────────────────────────────────

export const SAFETY_GATE_CONFIG = {
  minConfidenceForRecommendation: 70,
  minConfidenceForProductAdvice: 75,
  minEvidenceSourcesRequired: 2,
  minAgreementRatioRequired: 0.6,
  maxRiskForAutoApproval: 60,
  escalateAtRisk: 80,
} as const;

// ──────────────────────────────────────────────
// Follow-up Configuration
// ──────────────────────────────────────────────

export const FOLLOW_UP_DAYS = 7;
export const MISSING_DATA_ALERT_DAYS = 20;

// ──────────────────────────────────────────────
// Cache TTL (Time-to-Live) in seconds
// ──────────────────────────────────────────────

export const CACHE_TTL = {
  WEATHER_FORECAST: 3600,         // 1 hour
  WEATHER_HISTORICAL: 86400,      // 24 hours
  DISEASE_RISK: 7200,             // 2 hours
  SOIL_ANALYSIS: 604800,          // 7 days
} as const;
