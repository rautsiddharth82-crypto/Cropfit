/**
 * Soil Parameter Standards for Indian Agriculture
 * Based on ICAR (Indian Council of Agricultural Research) guidelines
 * and standard soil testing laboratory reference ranges.
 */

export interface SoilParameterRange {
  parameter: string;
  unit: string;
  low: { max: number; label: string };
  medium: { min: number; max: number; label: string };
  high: { min: number; label: string };
  optimalForCrop?: Record<string, { min: number; max: number }>;
  weight: number; // Weight in overall health score (0-1, all sum to 1)
}

export const SOIL_STANDARDS: Record<string, SoilParameterRange> = {
  pH: {
    parameter: 'Soil pH',
    unit: '',
    low: { max: 5.5, label: 'Acidic' },
    medium: { min: 5.5, max: 7.5, label: 'Optimal' },
    high: { min: 7.5, label: 'Alkaline' },
    optimalForCrop: {
      wheat: { min: 6.0, max: 7.5 },
      rice: { min: 5.5, max: 7.0 },
      cotton: { min: 6.0, max: 8.0 },
      mustard: { min: 6.0, max: 7.5 },
      maize: { min: 5.8, max: 7.0 },
      tomato: { min: 6.0, max: 7.0 },
    },
    weight: 0.15,
  },

  organicCarbon: {
    parameter: 'Organic Carbon',
    unit: '%',
    low: { max: 0.5, label: 'Low' },
    medium: { min: 0.5, max: 0.75, label: 'Medium' },
    high: { min: 0.75, label: 'High' },
    weight: 0.20,
  },

  nitrogen: {
    parameter: 'Available Nitrogen',
    unit: 'kg/ha',
    low: { max: 200, label: 'Low' },
    medium: { min: 200, max: 350, label: 'Medium' },
    high: { min: 350, label: 'High' },
    weight: 0.20,
  },

  phosphorus: {
    parameter: 'Available Phosphorus',
    unit: 'kg/ha',
    low: { max: 15, label: 'Low' },
    medium: { min: 15, max: 30, label: 'Medium' },
    high: { min: 30, label: 'High' },
    weight: 0.15,
  },

  potassium: {
    parameter: 'Available Potassium',
    unit: 'kg/ha',
    low: { max: 120, label: 'Low' },
    medium: { min: 120, max: 280, label: 'Medium' },
    high: { min: 280, label: 'High' },
    weight: 0.15,
  },

  zinc: {
    parameter: 'Zinc',
    unit: 'ppm',
    low: { max: 0.6, label: 'Deficient' },
    medium: { min: 0.6, max: 1.5, label: 'Sufficient' },
    high: { min: 1.5, label: 'High' },
    weight: 0.05,
  },

  iron: {
    parameter: 'Iron',
    unit: 'ppm',
    low: { max: 4.5, label: 'Deficient' },
    medium: { min: 4.5, max: 10, label: 'Sufficient' },
    high: { min: 10, label: 'High' },
    weight: 0.05,
  },

  sulfur: {
    parameter: 'Sulfur',
    unit: 'ppm',
    low: { max: 10, label: 'Deficient' },
    medium: { min: 10, max: 20, label: 'Sufficient' },
    high: { min: 20, label: 'High' },
    weight: 0.05,
  },

  ec: {
    parameter: 'Electrical Conductivity',
    unit: 'dS/m',
    low: { max: 0.8, label: 'Normal (Non-saline)' },
    medium: { min: 0.8, max: 1.6, label: 'Slightly Saline' },
    high: { min: 1.6, label: 'Saline' },
    weight: 0.0, // Informational, not in health score
  },
};

/**
 * Water quality standards for irrigation suitability
 */
export const WATER_QUALITY_STANDARDS = {
  ec: {
    suitable: { max: 0.75 },
    marginal: { min: 0.75, max: 2.25 },
    unsuitable: { min: 2.25 },
  },
  sar: {
    suitable: { max: 6 },
    marginal: { min: 6, max: 12 },
    unsuitable: { min: 12 },
  },
  tds: {
    suitable: { max: 500 },
    marginal: { min: 500, max: 1500 },
    unsuitable: { min: 1500 },
  },
  ph: {
    suitable: { min: 6.5, max: 8.5 },
  },
} as const;

/**
 * Soil remediation recommendations based on parameter deficiencies
 */
export const SOIL_REMEDIATION: Record<string, Record<string, string[]>> = {
  pH_acidic: {
    action: ['Apply agricultural lime @ 2-4 quintal/acre to raise pH'],
    organic: ['Add wood ash or dolomite lime as organic pH corrector'],
  },
  pH_alkaline: {
    action: ['Apply gypsum (CaSO₄) @ 2-5 quintal/acre to reduce alkalinity'],
    organic: ['Add sulfur-enriched compost, press mud, or FYM'],
  },
  organicCarbon_low: {
    action: ['Incorporate 4-5 tons/acre vermicompost or FYM before sowing'],
    organic: ['Green manuring with Dhaincha/Sesbania for 45 days before crop'],
  },
  nitrogen_low: {
    action: ['Apply Urea in 3 split doses: basal, first irrigation, flowering'],
    organic: ['Apply neem-coated urea or Azotobacter bio-fertilizer @ 200g/acre'],
  },
  phosphorus_low: {
    action: ['Apply DAP @ 50 kg/acre as basal dose at sowing'],
    organic: ['Use PSB (Phosphate Solubilizing Bacteria) to improve P availability'],
  },
  potassium_low: {
    action: ['Apply MOP (Muriate of Potash) @ 25 kg/acre'],
    organic: ['Banana stem compost or wood ash are natural K sources'],
  },
  zinc_low: {
    action: ['Apply Zinc Sulphate (ZnSO₄ 21%) @ 25 kg/acre before irrigation'],
    organic: ['Zinc-enriched vermicompost or chelated zinc foliar spray'],
  },
  iron_low: {
    action: ['Foliar spray of FeSO₄ 0.5% solution at 15-day intervals'],
    organic: ['Improve organic matter content to increase iron availability'],
  },
  sulfur_low: {
    action: ['Apply elemental sulfur @ 20 kg/acre or gypsum @ 100 kg/acre'],
    organic: ['Add sulfur-rich organic materials like mustard oil cake'],
  },
};

/**
 * Classify a soil parameter value against ICAR standards.
 */
export function classifySoilParameter(
  param: string,
  value: number
): { level: 'low' | 'medium' | 'high'; label: string } {
  const standard = SOIL_STANDARDS[param];
  if (!standard) return { level: 'medium', label: 'Unknown' };

  if (param === 'pH') {
    // pH is special: both low and high are suboptimal
    if (value < standard.low.max) return { level: 'low', label: standard.low.label };
    if (value > standard.high.min) return { level: 'high', label: standard.high.label };
    return { level: 'medium', label: standard.medium.label };
  }

  if (value <= standard.low.max) return { level: 'low', label: standard.low.label };
  if (value >= standard.high.min) return { level: 'high', label: standard.high.label };
  return { level: 'medium', label: standard.medium.label };
}
