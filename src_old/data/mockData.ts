import {
  FarmerProfile,
  CropField,
  WeatherData,
  ClockHourData,
  ForecastDay,
  EarlyWarningAlert,
  RecommendedCrop,
  FarmMemoryItem,
  JournalEntry,
  AppNotification
} from '../types';

export const INITIAL_FARMER_PROFILE: FarmerProfile = {
  name: 'Gunjan',
  location: 'Rajpura, Punjab',
  district: 'Patiala',
  state: 'Punjab',
  totalAreaAcres: 12.5,
  totalFields: 3,
  season: 'Kharif / Rabi Transition',
};

export const INITIAL_WEATHER: WeatherData = {
  tempC: 28,
  condition: 'Partly Cloudy',
  humidityPercent: 64,
  rainChancePercent: 20,
  windSpeedKmh: 12,
  uvIndex: 6,
  solarRad: 'Moderate',
};

export const DEMO_FIELDS: CropField[] = [
  {
    id: 'field-1',
    name: 'Field 01',
    cropName: 'Wheat',
    areaAcres: 4.5,
    healthStatus: 'healthy',
    healthPercent: 72,
    sowingDate: '15 Nov 2025',
    growthStage: 'Flowering & Grain Filling',
    soilMoisturePercent: 38,
    temperatureC: 32,
    rainfallMm: 2,
    climateRiskLevel: 'high',
    zones: [
      {
        id: 'f1-z1',
        name: 'Zone 01 (North East)',
        health: 'healthy',
        moisturePercent: 52,
        temperatureC: 28,
        nitrogenLevel: 'Optimum',
        soilType: 'Clay Loam',
        riskReason: 'Sufficient moisture retained from shading',
        recommendation: 'Normal monitoring',
        confidence: 91,
        gridPos: [-2, -2]
      },
      {
        id: 'f1-z2',
        name: 'Zone 02 (North West)',
        health: 'healthy',
        moisturePercent: 48,
        temperatureC: 29,
        nitrogenLevel: 'Good',
        soilType: 'Sandy Clay Loam',
        riskReason: 'Stable soil moisture balance',
        recommendation: 'No immediate action required',
        confidence: 89,
        gridPos: [2, -2]
      },
      {
        id: 'f1-z3',
        name: 'Zone 03 (Center Pivot)',
        health: 'moderate_stress',
        moisturePercent: 32,
        temperatureC: 35,
        nitrogenLevel: 'Slightly Deficient',
        soilType: 'Sandy Loam',
        riskReason: 'High solar exposure + low soil moisture retention',
        recommendation: 'Schedule early morning irrigation window',
        confidence: 87,
        gridPos: [0, 0]
      },
      {
        id: 'f1-z4',
        name: 'Zone 04 (South East)',
        health: 'monitor',
        moisturePercent: 41,
        temperatureC: 31,
        nitrogenLevel: 'Normal',
        soilType: 'Clay Loam',
        riskReason: 'Moisture dropping slowly, approaching threshold',
        recommendation: 'Monitor moisture sensors tomorrow morning',
        confidence: 84,
        gridPos: [-2, 2]
      },
      {
        id: 'f1-z5',
        name: 'Zone 05 (South West)',
        health: 'high_stress',
        moisturePercent: 26,
        temperatureC: 36,
        nitrogenLevel: 'Low',
        soilType: 'Coarse Sand-Loam',
        riskReason: 'Combined thermal heat wave + critical drop in root moisture',
        recommendation: 'Prioritize targeted light watering between 6:00-8:00 AM',
        confidence: 93,
        gridPos: [2, 2]
      }
    ]
  },
  {
    id: 'field-2',
    name: 'Field 02',
    cropName: 'Rice',
    areaAcres: 5.0,
    healthStatus: 'monitor',
    healthPercent: 58,
    sowingDate: '20 Jun 2025',
    growthStage: 'Tillering',
    soilMoisturePercent: 62,
    temperatureC: 30,
    rainfallMm: 12,
    climateRiskLevel: 'medium',
    zones: [
      {
        id: 'f2-z1',
        name: 'Zone A',
        health: 'healthy',
        moisturePercent: 68,
        temperatureC: 29,
        nitrogenLevel: 'High',
        soilType: 'Clay',
        riskReason: 'Good water ponding level',
        recommendation: 'Maintain current water level',
        confidence: 92,
        gridPos: [-1.5, -1.5]
      },
      {
        id: 'f2-z2',
        name: 'Zone B',
        health: 'monitor',
        moisturePercent: 54,
        temperatureC: 31,
        nitrogenLevel: 'Medium',
        soilType: 'Clay Loam',
        riskReason: 'Water depth dropped below 3cm',
        recommendation: 'Top up water level by tomorrow evening',
        confidence: 86,
        gridPos: [1.5, 1.5]
      }
    ]
  },
  {
    id: 'field-3',
    name: 'Field 03',
    cropName: 'Vegetable Field (Mustard & Spinach)',
    areaAcres: 3.0,
    healthStatus: 'healthy',
    healthPercent: 81,
    sowingDate: '10 Oct 2025',
    growthStage: 'Vegetative Harvesting',
    soilMoisturePercent: 55,
    temperatureC: 27,
    rainfallMm: 5,
    climateRiskLevel: 'low',
    zones: [
      {
        id: 'f3-z1',
        name: 'Green Zone',
        health: 'healthy',
        moisturePercent: 58,
        temperatureC: 27,
        nitrogenLevel: 'Optimum',
        soilType: 'Rich Loam',
        riskReason: 'Optimal microclimate beneath shade netting',
        recommendation: 'Harvest mature leaves',
        confidence: 95,
        gridPos: [0, 0]
      }
    ]
  }
];

export const CLOCKWISE_HOURS: ClockHourData[] = [
  {
    hourLabel: '12 AM',
    displayTime: '12:00 Midnight',
    tempC: 18,
    humidityPercent: 82,
    rainChancePercent: 10,
    heatStress: 'LOW',
    irrigationStatus: 'NOT_RECOMMENDED',
    irrigationMessage: 'Soil absorption is minimal; cold ambient air prevents root active uptake.',
    fieldActivity: 'Rest Period / Sensor Logging'
  },
  {
    hourLabel: '3 AM',
    displayTime: '3:00 AM (Pre-dawn)',
    tempC: 16,
    humidityPercent: 88,
    rainChancePercent: 15,
    heatStress: 'LOW',
    irrigationStatus: 'NOT_RECOMMENDED',
    irrigationMessage: 'High dew point present. Dew provides canopy moisture.',
    fieldActivity: 'Automated Weather Sync'
  },
  {
    hourLabel: '6 AM',
    displayTime: '6:00 AM (Sunrise)',
    tempC: 21,
    humidityPercent: 78,
    rainChancePercent: 20,
    heatStress: 'LOW',
    irrigationStatus: 'RECOMMENDED',
    irrigationMessage: '⭐ OPTIMAL IRRIGATION WINDOW. Minimal evaporation, high stomatal opening.',
    fieldActivity: 'Ideal for Irrigation & Field Inspection',
    isPeakIrrigationWindow: true
  },
  {
    hourLabel: '9 AM',
    displayTime: '9:00 AM',
    tempC: 26,
    humidityPercent: 68,
    rainChancePercent: 20,
    heatStress: 'LOW',
    irrigationStatus: 'OPTIONAL',
    irrigationMessage: 'Irrigation acceptable until 10:00 AM before surface heat escalates.',
    fieldActivity: 'Fertilizer Application / Pest Scouting'
  },
  {
    hourLabel: '12 PM',
    displayTime: '12:00 PM (Noon)',
    tempC: 33,
    humidityPercent: 48,
    rainChancePercent: 10,
    heatStress: 'MEDIUM',
    irrigationStatus: 'NOT_RECOMMENDED',
    irrigationMessage: 'High radiation causes 45% water loss to evaporation.',
    fieldActivity: 'Avoid Heavy Field Operations'
  },
  {
    hourLabel: '3 PM',
    displayTime: '3:00 PM (Peak Heat)',
    tempC: 36,
    humidityPercent: 38,
    rainChancePercent: 5,
    heatStress: 'HIGH',
    irrigationStatus: 'NOT_RECOMMENDED',
    irrigationMessage: '⚠️ High heat stress! Water drops can scorch foliage under direct sun.',
    fieldActivity: 'Shade Spraying / Equipment Maintenance'
  },
  {
    hourLabel: '6 PM',
    displayTime: '6:00 PM (Sunset)',
    tempC: 29,
    humidityPercent: 58,
    rainChancePercent: 15,
    heatStress: 'MEDIUM',
    irrigationStatus: 'RECOMMENDED',
    irrigationMessage: '⭐ SECONDARY IRRIGATION WINDOW. Temperature cooling down nicely.',
    fieldActivity: 'Evening Irrigation & Canal Check',
    isPeakIrrigationWindow: true
  },
  {
    hourLabel: '9 PM',
    displayTime: '9:00 PM',
    tempC: 23,
    humidityPercent: 74,
    rainChancePercent: 10,
    heatStress: 'LOW',
    irrigationStatus: 'OPTIONAL',
    irrigationMessage: 'Cooler surface temperature. Water absorbs steadily.',
    fieldActivity: 'Log Farm Journal & Review Forecast'
  }
];

export const FORECAST_5DAYS: ForecastDay[] = [
  { dayName: 'Today', date: '13 Aug', tempHighC: 32, tempLowC: 21, rainChancePercent: 20, condition: 'Partly Cloudy', iconName: 'cloud-sun' },
  { dayName: 'Tomorrow', date: '14 Aug', tempHighC: 36, tempLowC: 22, rainChancePercent: 5, condition: 'Hot & Clear', iconName: 'sun' },
  { dayName: 'Day 3', date: '15 Aug', tempHighC: 35, tempLowC: 23, rainChancePercent: 15, condition: 'Sunny', iconName: 'sun' },
  { dayName: 'Day 4', date: '16 Aug', tempHighC: 30, tempLowC: 20, rainChancePercent: 65, condition: 'Thundershowers', iconName: 'cloud-rain' },
  { dayName: 'Day 5', date: '17 Aug', tempHighC: 28, tempLowC: 19, rainChancePercent: 40, condition: 'Moderate Rain', iconName: 'cloud-drizzle' },
];

export const DEMO_EARLY_WARNING: EarlyWarningAlert = {
  id: 'alert-1',
  title: 'Climate Stress Alert: High Heat & Soil Moisture Drop',
  crop: 'Wheat (Field 01)',
  growthStage: 'Flowering & Grain Filling',
  riskLevel: 'HIGH',
  timeframe: 'Next 24–48 Hours',
  description: 'High heat stress risk expected in Field 01 during the critical flowering stage.',
  what: 'High heat stress risk with ambient temperature reaching 36°C.',
  why: 'Expected ambient temperature increase combined with low root zone soil moisture (26-38%) during the sensitive grain filling phase.',
  when: 'Starting within the next 24 to 48 hours (Peak at 3:00 PM tomorrow).',
  whatToDo: 'Apply light irrigation during the recommended 6:00 AM – 8:00 AM window tomorrow to shield wheat flowers from heat shock.',
  confidencePercent: 87,
  signalsAgreement: true,
  evidenceList: [
    { label: 'Ambient Temperature', value: '36°C Peak Tomorrow', icon: 'thermometer' },
    { label: 'Soil Moisture Level', value: '26% - 38% (Low)', icon: 'droplet' },
    { label: 'Rainfall Forecast', value: '< 5% Probability', icon: 'cloud-off' },
    { label: 'Satellite NDVI Trend', value: '-12% Thermal Stress', icon: 'globe' },
    { label: 'Crop Growth Vulnerability', value: 'Flowering Stage (Very High)', icon: 'sprout' }
  ],
  signals: [
    { source: 'Weather Station', status: 'High Risk', level: 'red', details: '36°C forecasted heat peak' },
    { source: 'Soil Sensors', status: 'Low Moisture', level: 'red', details: 'Volumetric soil moisture at 26% in Zone 5' },
    { source: 'Satellite Thermal', status: 'Moderate Stress', level: 'orange', details: 'Foliage canopy temperature spike' },
    { source: 'Farmer Field Observation', status: 'Normal', level: 'green', details: 'Leaves slightly curling at edge' }
  ]
};

export const RECOMMENDED_CROPS: RecommendedCrop[] = [
  {
    id: 'crop-a',
    name: 'Pearl Millet (Bajra)',
    localName: 'बाजरा / High Resilient Pearl Millet',
    suitability: 'High',
    waterNeed: 'Low',
    durationDays: 85,
    riskLevel: 'Low',
    profitPotential: 'Indicative High (₹₹₹₹)',
    notes: 'More suitable for the expected climate. Thrives under high heat and limited irrigation.'
  },
  {
    id: 'crop-b',
    name: 'Sorghum (Jowar)',
    localName: 'ज्वार / Climate Smart Sorghum',
    suitability: 'High',
    waterNeed: 'Medium',
    durationDays: 100,
    riskLevel: 'Low',
    profitPotential: 'Indicative High (₹₹₹₹)',
    notes: 'Strong deep root system, highly resilient to prolonged dry spells.'
  },
  {
    id: 'crop-c',
    name: 'Green Gram / Moong Dal',
    localName: 'मूंग / Short Duration Pulse',
    suitability: 'Medium',
    waterNeed: 'Low',
    durationDays: 65,
    riskLevel: 'Medium',
    profitPotential: 'Indicative Medium (₹₹₹)',
    notes: 'Enriches soil nitrogen while requiring minimal water applications.'
  }
];

export const DEMO_AI_MEMORY: FarmMemoryItem[] = [
  {
    id: 'mem-1',
    date: '10 Aug 2025',
    crop: 'Wheat (Field 01)',
    eventType: 'Heat Stress Detected',
    description: 'Soil temperature reached 34°C with moisture dropping to 30%. System issued early heat alert.',
    actionTaken: 'Gunjan applied 35mm early morning sprinkler irrigation in Zone 03 & 05.',
    outcome: 'Crop fully recovered. Canopy temperature normalized by 2°C within 18 hours.',
    severity: 'high'
  },
  {
    id: 'mem-2',
    date: '28 Jul 2025',
    crop: 'Rice (Field 02)',
    eventType: 'Water Level Deficit',
    description: 'Ponded water level dropped to 1.5cm during critical tillering phase.',
    actionTaken: 'Canal pump activated for 3 hours; water restored to 5cm.',
    outcome: 'Tiller count remained healthy at 420 tillers/m².',
    severity: 'medium'
  },
  {
    id: 'mem-3',
    date: '15 May 2025',
    crop: 'Mustard (Field 03)',
    eventType: 'Pest Risk Early Warning',
    description: 'High humidity (85%) triggered fungal leaf spot alert.',
    actionTaken: 'Bio-fungicide neem oil spray applied.',
    outcome: 'Zero disease spread observed. Harvest yield +14% above regional average.',
    severity: 'info'
  }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-1',
    date: '12 Aug 2026',
    time: '07:15 AM',
    type: 'irrigation',
    title: 'Morning Irrigation in Field 01',
    fieldName: 'Field 01 (Wheat)',
    notes: 'Applied 2 hours of drip irrigation in Zone 03 & Zone 05 following AI alert.',
    photoUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    observedStressFeedback: 'yes',
    actionFeedback: 'Irrigated early morning 6-8 AM'
  },
  {
    id: 'j-2',
    date: '10 Aug 2026',
    time: '04:30 PM',
    type: 'observation',
    title: 'Field Inspection & Leaf Color Check',
    fieldName: 'Field 02 (Rice)',
    notes: 'Checked Leaf Color Chart (LCC) in Field 02. Nitrogen levels look adequate in Zone A.',
    photoUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80',
    observedStressFeedback: 'no',
    actionFeedback: 'No immediate action'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '⚠️ High Heat Stress Alert',
    message: '36°C heat expected tomorrow. Recommended light morning irrigation for Field 01.',
    timestamp: '10 mins ago',
    read: false,
    type: 'alert'
  },
  {
    id: 'notif-2',
    title: '🧪 Soil Test Result Ready',
    message: 'Field 01 soil analysis updated: Zinc deficiency identified (0.45 ppm).',
    timestamp: '2 hours ago',
    read: false,
    type: 'info'
  },
  {
    id: 'notif-[#',
    title: '🏛️ PM-KUSUM Subsidy Open',
    message: 'Punjab state 80% solar pump subsidy application deadline extended to 31 Aug.',
    timestamp: '1 day ago',
    read: true,
    type: 'system'
  }
];

export const MOCK_SOIL_TESTS: SoilTestRecord[] = [
  {
    id: 'st-1',
    fieldId: 'field-1',
    fieldName: 'Field 01 (Wheat - North Block)',
    sampleDate: '01 Aug 2026',
    ph: 7.8,
    phStatus: 'Slightly Alkaline',
    ec: 0.65,
    organicCarbon: 0.42,
    nitrogen: 185,
    nitrogenStatus: 'Low',
    phosphorus: 22,
    phosphorusStatus: 'Medium',
    potassium: 310,
    potassiumStatus: 'High',
    zincPpm: 0.45,
    ironPpm: 4.8,
    sulfurPpm: 12.5,
    overallHealthScore: 68,
    aiCorrectionAdvice: [
      'Apply 25 kg/acre Zinc Sulphate (21% Zn) before next irrigation to fix leaf yellowing.',
      'Incorporate 4-5 tons/acre Vermicompost to boost low organic carbon from 0.42% to >0.75%.',
      'Split Urea application into 3 light doses rather than 1 heavy dose to prevent nitrogen leaching.'
    ]
  },
  {
    id: 'st-2',
    fieldId: 'field-2',
    fieldName: 'Field 02 (Rice - Clay Basin)',
    sampleDate: '25 Jul 2026',
    ph: 7.2,
    phStatus: 'Optimal',
    ec: 0.48,
    organicCarbon: 0.68,
    nitrogen: 240,
    nitrogenStatus: 'Medium',
    phosphorus: 28,
    phosphorusStatus: 'Medium',
    potassium: 280,
    potassiumStatus: 'High',
    zincPpm: 0.72,
    ironPpm: 7.5,
    sulfurPpm: 18.0,
    overallHealthScore: 84,
    aiCorrectionAdvice: [
      'Soil parameters are well balanced for Paddy tillering stage.',
      'Maintain 3-5 cm ponded water depth; avoid complete drying out during panicle initiation.'
    ]
  }
];

export const MOCK_WATER_TESTS: WaterTestRecord[] = [
  {
    id: 'wt-1',
    sourceName: 'Tube-well #1 (Field 01 North)',
    sampleDate: '02 Aug 2026',
    salinityEc: 1.85,
    tdsPpm: 1180,
    sar: 6.4,
    ph: 8.1,
    suitability: 'Requires Gypsum/Dilution',
    aiRecommendation: 'Water salinity is slightly elevated (EC 1.85 dS/m). Mix tube-well water with canal water (1:1 ratio) or pass water through Gypsum bed treatment before applying to sensitive wheat flowering stage.'
  },
  {
    id: 'wt-2',
    sourceName: 'Canal Supply (Patiala Main Branch)',
    sampleDate: '28 Jul 2026',
    salinityEc: 0.35,
    tdsPpm: 220,
    sar: 1.2,
    ph: 7.4,
    suitability: 'Suitable for All Crops',
    aiRecommendation: 'Excellent sweet water quality with low electrical conductivity. Ideal for sensitive germinating seeds, nursery beds, and micro-drip fertigation.'
  }
];

export const MOCK_DISEASES: CropDisease[] = [
  {
    id: 'dis-1',
    cropName: 'Wheat',
    diseaseName: 'Yellow Rust (Stripe Rust)',
    scientificName: 'Puccinia striiformis',
    severityPercent: 76,
    confidencePercent: 96,
    imageUrl: '/diseases/wheat_yellow_rust.png',
    symptoms: [
      'Bright yellow powdery pustules arranged in linear stripes on leaf surface.',
      'Chlorotic leaf chlorosis spreading under high humidity and cool temperatures (10-20°C).',
      'Premature leaf drying leading to shriveled grain kernels.'
    ],
    chemicalTreatment: 'Spray Propiconazole 25% EC @ 1 ml/Liter water (200 ml/acre) immediately in 200 Liters of water.',
    organicTreatment: 'Spray Bio-control Agent Trichoderma harzianum @ 5g/Liter or Neem seed kernel extract (NSKE 5%) as preventive shield.',
    preventiveMeasures: [
      'Avoid over-application of nitrogen fertilizers which produces dense succulent leaves.',
      'Monitor fields daily during foggy/cool morning hours.',
      'Grow resistant wheat varieties like HD 3086 or PBW 725.'
    ]
  },
  {
    id: 'dis-2',
    cropName: 'Rice / Paddy',
    diseaseName: 'Brown Spot (Fungal Blight)',
    scientificName: 'Bipolaris oryzae',
    severityPercent: 42,
    confidencePercent: 91,
    imageUrl: '/diseases/rice_brown_spot.png',
    symptoms: [
      'Oval or cylindrical sesame-seed-like dark brown lesions with yellow halo.',
      'Affected leaves dry prematurely; grain discoloration at panicle stage.'
    ],
    chemicalTreatment: 'Foliar spray of Mancozeb 75% WP @ 2g/Liter or Hexaconazole 5% EC @ 2ml/Liter.',
    organicTreatment: 'Foliar spray of Pseudomonas fluorescens @ 10g/Liter water during early morning.',
    preventiveMeasures: [
      'Apply Muriate of Potash (MOP) fertilizer as potassium deficiency aggravates brown spot.',
      'Ensure seed treatment with Carbendazim before sowing.'
    ]
  },
  {
    id: 'dis-3',
    cropName: 'Tomato / Vegetables',
    diseaseName: 'Early Blight',
    scientificName: 'Alternaria solani',
    severityPercent: 58,
    confidencePercent: 94,
    imageUrl: '/diseases/tomato_early_blight.png',
    symptoms: [
      'Target-board concentric dark rings on lower leaves first.',
      'Leaf yellowing surrounding lesions causing leaf drop.'
    ],
    chemicalTreatment: 'Spray Copper Oxychloride 50% WP @ 3g/Liter or Azoxystrobin 23% SC @ 1ml/Liter.',
    organicTreatment: 'Spray 10% Cow urine extract + Neem oil mixture every 7 days.',
    preventiveMeasures: [
      'Mulch soil surface to prevent fungal spores from splashing onto lower leaves during watering.',
      'Maintain drip irrigation to keep canopy dry.'
    ]
  }
];

export const MOCK_SCHEMES: GovScheme[] = [
  {
    id: 'sch-1',
    title: 'PM-KUSUM Component-B (Off-Grid Solar Pumps)',
    category: 'Solar & Energy',
    subsidyPercentage: '75% - 80% Subsidy',
    description: 'Provides standalone solar agriculture pumps up to 7.5 HP to replace diesel pumps, offering 25 years of zero-cost irrigation electricity.',
    eligibility: 'Individual farmers, Panchayats, Water User Associations with valid land ownership in Punjab & Haryana.',
    requiredDocuments: ['Aadhaar Card', 'Land Khasra/Pattadar Copy', 'Bank Passbook with IFSC', 'Electricity No-Objection Certificate'],
    matchScore: 98,
    officialPortalUrl: 'https://pmkusum.mnre.gov.in',
    state: 'Punjab / Central'
  },
  {
    id: 'sch-2',
    title: 'PM Fasal Bima Yojana (PMFBY - Crop Insurance)',
    category: 'Crop Insurance',
    subsidyPercentage: 'Nominal 1.5% Premium',
    description: 'Comprehensive risk coverage against heatwaves, unseasonal hail, drought, and post-harvest localized storm damage with direct bank claims.',
    eligibility: 'All farmers growing notified Rabi (Wheat) and Kharif (Rice) crops in Patiala/Rajpura district.',
    requiredDocuments: ['Aadhaar Card', 'Crop Sowing Certificate (Patwari)', 'Land Record', 'Bank Account details'],
    matchScore: 95,
    officialPortalUrl: 'https://pmfby.gov.in',
    state: 'National'
  },
  {
    id: 'sch-3',
    title: 'Per Drop More Crop (PDMC Micro-Irrigation)',
    category: 'Micro-Irrigation',
    subsidyPercentage: '80% Subsidy for Small Farmers',
    description: 'Subsidizes high-efficiency Drip and Sprinkler irrigation systems, reducing water consumption by 50% and electricity cost by 40%.',
    eligibility: 'Farmers possessing operational tube-wells or canal water connections.',
    requiredDocuments: ['Aadhaar Card', 'Land Record', 'Water Source Proof', 'Quotation from authorized drip dealer'],
    matchScore: 92,
    officialPortalUrl: 'https://pmksy.gov.in',
    state: 'Punjab / Central'
  },
  {
    id: 'sch-4',
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    category: 'Equipment & Machinery',
    subsidyPercentage: '50% - 80% Subsidy',
    description: 'Financial assistance for purchasing laser land levelers, rotavators, happy seeders, and establishing Custom Hiring Centers.',
    eligibility: 'Small & Marginal farmers, Farmer Producer Organizations (FPOs).',
    requiredDocuments: ['Aadhaar Card', 'RTI Land Certificate', 'Pan Card', 'Bank Passbook'],
    matchScore: 88,
    officialPortalUrl: 'https://agrimachinery.nic.in',
    state: 'National'
  },
  {
    id: 'sch-5',
    title: 'PM Kisan Samman Nidhi (Direct Income Transfer)',
    category: 'Direct Income',
    subsidyPercentage: '₹6,000 / Year Cash Benefit',
    description: 'Direct financial benefit of ₹6,000 per year transferred in 3 equal installments directly to farmer bank accounts for seed/input purchases.',
    eligibility: 'Landholding farmer families with cultivable land.',
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Record', 'e-KYC verified Bank Account'],
    matchScore: 100,
    officialPortalUrl: 'https://pmkisan.gov.in',
    state: 'National'
  }
];

export const MOCK_FINANCIALS: SeasonFinancialRecord[] = [
  {
    id: 'fin-1',
    seasonName: 'Rabi 2025-26 (Wheat Current Season)',
    cropName: 'Wheat (PBW 725)',
    areaAcres: 4.5,
    expenses: {
      seeds: 4500,
      fertilizers: 9800,
      pesticides: 3200,
      labor: 11500,
      irrigationEnergy: 7400,
      machineryHarvesting: 8200
    },
    yieldQuintals: 98, // ~21.7 quintals/acre
    sellingPricePerQuintal: 2425, // MSP rate
    grossRevenue: 237650,
    netProfit: 193050,
    profitPerAcre: 42900,
    aiProfitTips: [
      'Switching to PM-KUSUM Solar Pump will cut your ₹7,400 irrigation electricity/diesel cost down to ₹0.',
      'Your fertilizer cost (₹9,800) is 18% higher than regional benchmark due to broadcasting Urea. Drip fertigation saves ₹3,100 in fertilizer leaching loss.',
      'Selling directly via e-NAM platform or local FPO can yield a ₹80/quintal premium over local Mandi brokers.'
    ]
  },
  {
    id: 'fin-2',
    seasonName: 'Kharif 2025 (Paddy Harvested)',
    cropName: 'Rice (PR 126)',
    areaAcres: 5.0,
    expenses: {
      seeds: 3800,
      fertilizers: 12400,
      pesticides: 5600,
      labor: 16800,
      irrigationEnergy: 11200,
      machineryHarvesting: 10500
    },
    yieldQuintals: 135,
    sellingPricePerQuintal: 2320,
    grossRevenue: 313200,
    netProfit: 252900,
    profitPerAcre: 50580,
    aiProfitTips: [
      'Short duration PR 126 saved 25 days of pumping electricity compared to Pusa 44.',
      'Bio-pesticide Neem spray reduced chemical spray counts from 4 to 2.'
    ]
  }
];

