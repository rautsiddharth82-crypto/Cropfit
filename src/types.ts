export type AppTab = 
  | 'home' 
  | 'farm' 
  | 'climate' 
  | 'testing' 
  | 'disease' 
  | 'schemes' 
  | 'simulator' 
  | 'financials' 
  | 'ai' 
  | 'journal'
  | 'api-tester';

export type Language = 'en' | 'hi' | 'pa';

// Soil & Water Testing
export interface SoilTestRecord {
  id: string;
  fieldId: string;
  fieldName: string;
  sampleDate: string;
  ph: number;
  phStatus: 'Optimal' | 'Slightly Alkaline' | 'Acidic';
  ec: number; // dS/m
  organicCarbon: number; // %
  nitrogen: number; // kg/ha
  nitrogenStatus: 'Low' | 'Medium' | 'High';
  phosphorus: number; // kg/ha
  phosphorusStatus: 'Low' | 'Medium' | 'High';
  potassium: number; // kg/ha
  potassiumStatus: 'Low' | 'Medium' | 'High';
  zincPpm: number;
  ironPpm: number;
  sulfurPpm: number;
  overallHealthScore: number; // 0-100
  aiCorrectionAdvice: string[];
}

export interface WaterTestRecord {
  id: string;
  sourceName: string;
  sampleDate: string;
  salinityEc: number; // dS/m
  tdsPpm: number;
  sar: number; // Sodium Adsorption Ratio
  ph: number;
  suitability: 'Suitable for All Crops' | 'Requires Gypsum/Dilution' | 'Unsuitable without Treatment';
  aiRecommendation: string;
}

// Disease Diagnosis
export interface CropDisease {
  id: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  severityPercent: number;
  confidencePercent: number;
  imageUrl: string;
  symptoms: string[];
  chemicalTreatment: string;
  organicTreatment: string;
  preventiveMeasures: string[];
}

// Gov Schemes
export interface GovScheme {
  id: string;
  title: string;
  category: 'Solar & Energy' | 'Crop Insurance' | 'Micro-Irrigation' | 'Equipment & Machinery' | 'Direct Income' | 'Soil & Fertilizers';
  subsidyPercentage: string;
  description: string;
  eligibility: string;
  requiredDocuments: string[];
  matchScore: number; // 0-100
  officialPortalUrl: string;
  state: string;
}

// Financials & Profit Memory
export interface CropExpenseBreakdown {
  seeds: number;
  fertilizers: number;
  pesticides: number;
  labor: number;
  irrigationEnergy: number;
  machineryHarvesting: number;
}

export interface SeasonFinancialRecord {
  id: string;
  seasonName: string; // e.g., "Rabi 2025-26"
  cropName: string;
  areaAcres: number;
  expenses: CropExpenseBreakdown;
  yieldQuintals: number;
  sellingPricePerQuintal: number;
  grossRevenue: number;
  netProfit: number;
  profitPerAcre: number;
  aiProfitTips: string[];
}

// What-If Simulator
export interface SimulatorInputs {
  tempDeltaC: number; // -2 to +5
  rainDeltaPercent: number; // -50 to +50
  fertilizerDeltaPercent: number; // -30 to +40
  irrigationMethod: 'Flood' | 'Sprinkler' | 'Drip' | 'Sub-surface Drip';
  pestRisk: 'Low' | 'Medium' | 'High';
}

export interface SimulationResult {
  projectedYieldChangePercent: number;
  waterConsumptionLitersPerAcre: number;
  soilHealthIndex: number; // 0-100
  netProfitShiftPerAcre: number; // +/- amount
  heatStressRiskScore: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  aiAgronomistVerdict: string;
  mitigationActions: string[];
}

export interface FarmerProfile {
  name: string;
  location: string;
  district: string;
  state: string;
  totalAreaAcres: number;
  totalFields: number;
  season: string;
  avatarUrl?: string;
}

export type HealthStatus = 'healthy' | 'monitor' | 'moderate_stress' | 'high_stress';

export interface FieldZone {
  id: string;
  name: string;
  health: HealthStatus;
  moisturePercent: number;
  temperatureC: number;
  nitrogenLevel: string;
  soilType: string;
  riskReason: string;
  recommendation: string;
  confidence: number;
  gridPos: [number, number]; // [x, z] for 3D layout
}

export interface CropField {
  id: string;
  name: string;
  cropName: string;
  areaAcres: number;
  healthStatus: HealthStatus;
  healthPercent: number;
  sowingDate: string;
  growthStage: string;
  soilMoisturePercent: number;
  temperatureC: number;
  rainfallMm: number;
  climateRiskLevel: 'low' | 'medium' | 'high';
  zones: FieldZone[];
}

export interface WeatherData {
  tempC: number;
  condition: string;
  humidityPercent: number;
  rainChancePercent: number;
  windSpeedKmh: number;
  uvIndex: number;
  solarRad: string;
  anomaly?: {
    type: 'heat' | 'drought' | 'flood' | 'frost' | 'none';
    tempAnomaly: number;
    severity: 'Normal' | 'Moderate' | 'High' | 'Extreme';
  };
}

export interface ClockHourData {
  hourLabel: string;
  displayTime: string;
  tempC: number;
  humidityPercent: number;
  rainChancePercent: number;
  heatStress: 'LOW' | 'MEDIUM' | 'HIGH';
  irrigationStatus: 'RECOMMENDED' | 'NOT_RECOMMENDED' | 'OPTIONAL';
  irrigationMessage: string;
  fieldActivity: string;
  isPeakIrrigationWindow?: boolean;
}

export interface ForecastDay {
  dayName: string;
  date: string;
  tempHighC: number;
  tempLowC: number;
  rainChancePercent: number;
  condition: string;
  iconName: string;
}

export interface SignalValidation {
  source: string;
  status: 'High Risk' | 'Low Moisture' | 'Moderate Stress' | 'Normal' | 'Disagrees';
  level: 'red' | 'orange' | 'yellow' | 'green';
  details: string;
}

export interface EarlyWarningAlert {
  id: string;
  title: string;
  crop: string;
  growthStage: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  timeframe: string;
  description: string;
  what: string;
  why: string;
  when: string;
  whatToDo: string;
  confidencePercent: number;
  signalsAgreement: boolean;
  signals: SignalValidation[];
  evidenceList: { label: string; value: string; icon: string }[];
}

export interface RecommendedCrop {
  id: string;
  name: string;
  localName: string;
  suitability: 'High' | 'Medium' | 'Low';
  waterNeed: 'Low' | 'Medium' | 'High';
  durationDays: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  profitPotential: 'Indicative High (₹₹₹₹)' | 'Indicative Medium (₹₹₹)' | 'Indicative Moderate (₹₹)';
  notes: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  reasoning?: string;
  timestamp: string;
  supportingData?: {
    soilMoisture?: string;
    temperature?: string;
    actionWindow?: string;
    confidence?: string;
  };
}

export interface FarmMemoryItem {
  id: string;
  date: string;
  crop: string;
  eventType: string;
  description: string;
  actionTaken: string;
  outcome: string;
  severity: 'high' | 'medium' | 'info';
}

export interface JournalEntry {
  id: string;
  date: string;
  time: string;
  type: 'irrigation' | 'fertilizer' | 'pesticide' | 'weather' | 'observation' | 'harvest' | 'other';
  title: string;
  fieldName: string;
  notes: string;
  photoUrl?: string;
  observedStressFeedback?: 'yes' | 'partially' | 'no';
  actionFeedback?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'info';
  read: boolean;
  type: 'alert' | 'weather' | 'reminder' | 'ai';
}
