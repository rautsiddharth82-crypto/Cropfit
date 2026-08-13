/**
 * Soil Health Scorer
 *
 * Converts raw soil test values into a 0-100 health score
 * using ICAR standard ranges, generates remediation advice,
 * and assesses crop suitability.
 */

import { SOIL_STANDARDS, SOIL_REMEDIATION, classifySoilParameter } from '../config/soilStandards';

export interface SoilTestInput {
  pH?: number;
  ec?: number;             // dS/m
  organicCarbon?: number;  // %
  nitrogen?: number;       // kg/ha
  phosphorus?: number;     // kg/ha
  potassium?: number;      // kg/ha
  zinc?: number;           // ppm
  iron?: number;           // ppm
  sulfur?: number;         // ppm
}

export interface SoilHealthResult {
  overallScore: number;           // 0-100
  healthLevel: 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent';
  parameterScores: SoilParameterScore[];
  deficiencies: string[];
  strengths: string[];
  correctionAdvice: SoilCorrection[];
  mainIssue: string;
  secondaryIssue?: string;
  cropSuitability: { crop: string; suitable: boolean; reason: string }[];
}

export interface SoilParameterScore {
  parameter: string;
  value: number | undefined;
  unit: string;
  level: 'low' | 'medium' | 'high';
  label: string;
  score: number;  // 0-100
}

export interface SoilCorrection {
  parameter: string;
  issue: string;
  chemicalAction: string;
  organicAction: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Calculate comprehensive soil health score.
 */
export function calculateSoilHealth(input: SoilTestInput): SoilHealthResult {
  const parameterScores: SoilParameterScore[] = [];
  const deficiencies: string[] = [];
  const strengths: string[] = [];
  const corrections: SoilCorrection[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  // Process each parameter
  const params: { key: keyof SoilTestInput; standardKey: string }[] = [
    { key: 'pH', standardKey: 'pH' },
    { key: 'organicCarbon', standardKey: 'organicCarbon' },
    { key: 'nitrogen', standardKey: 'nitrogen' },
    { key: 'phosphorus', standardKey: 'phosphorus' },
    { key: 'potassium', standardKey: 'potassium' },
    { key: 'zinc', standardKey: 'zinc' },
    { key: 'iron', standardKey: 'iron' },
    { key: 'sulfur', standardKey: 'sulfur' },
  ];

  for (const { key, standardKey } of params) {
    const value = input[key];
    const standard = SOIL_STANDARDS[standardKey];
    if (!standard || value === undefined) continue;

    const classification = classifySoilParameter(standardKey, value);
    let paramScore: number;

    // Convert classification to a 0-100 score
    if (standardKey === 'pH') {
      // pH: optimal is middle range
      if (classification.level === 'medium') {
        paramScore = 85 + Math.random() * 10;
      } else {
        const deviation = classification.level === 'low'
          ? standard.low.max - value
          : value - standard.high.min;
        paramScore = Math.max(20, 70 - deviation * 15);
      }
    } else {
      // Other params: higher is generally better (within reason)
      if (classification.level === 'high') paramScore = 90;
      else if (classification.level === 'medium') paramScore = 65;
      else paramScore = 30;
    }

    paramScore = Math.round(Math.min(100, Math.max(0, paramScore)));

    parameterScores.push({
      parameter: standard.parameter,
      value,
      unit: standard.unit,
      level: classification.level,
      label: classification.label,
      score: paramScore,
    });

    // Track weighted sum
    if (standard.weight > 0) {
      weightedSum += paramScore * standard.weight;
      totalWeight += standard.weight;
    }

    // Track deficiencies and strengths
    if (classification.level === 'low') {
      deficiencies.push(`${standard.parameter}: ${classification.label} (${value} ${standard.unit})`);

      // Add correction advice
      const remedKey = `${standardKey}_low`;
      const remed = SOIL_REMEDIATION[remedKey];
      if (remed) {
        corrections.push({
          parameter: standard.parameter,
          issue: `${standard.parameter} is ${classification.label}`,
          chemicalAction: remed.action?.[0] || 'Consult local agronomist',
          organicAction: remed.organic?.[0] || 'Apply organic manure',
          priority: standard.weight >= 0.15 ? 'high' : 'medium',
        });
      }
    } else if (classification.level === 'high' && standardKey !== 'pH') {
      strengths.push(`${standard.parameter}: ${classification.label} (${value} ${standard.unit})`);
    } else if (classification.level === 'medium') {
      strengths.push(`${standard.parameter}: ${classification.label}`);
    }

    // Special: pH corrections
    if (standardKey === 'pH') {
      if (classification.level === 'low') {
        const remed = SOIL_REMEDIATION['pH_acidic'];
        if (remed) {
          corrections.push({
            parameter: 'Soil pH',
            issue: `pH ${value} is acidic`,
            chemicalAction: remed.action[0],
            organicAction: remed.organic[0],
            priority: 'high',
          });
        }
      } else if (classification.level === 'high') {
        const remed = SOIL_REMEDIATION['pH_alkaline'];
        if (remed) {
          corrections.push({
            parameter: 'Soil pH',
            issue: `pH ${value} is alkaline`,
            chemicalAction: remed.action[0],
            organicAction: remed.organic[0],
            priority: 'medium',
          });
        }
      }
    }
  }

  // Overall score
  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;

  // Health level
  let healthLevel: SoilHealthResult['healthLevel'];
  if (overallScore >= 85) healthLevel = 'Excellent';
  else if (overallScore >= 70) healthLevel = 'Good';
  else if (overallScore >= 55) healthLevel = 'Average';
  else if (overallScore >= 40) healthLevel = 'Below Average';
  else healthLevel = 'Poor';

  // Main issues
  const sortedCorrections = corrections.sort((a, b) =>
    a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
  );
  const mainIssue = sortedCorrections[0]?.issue || 'No major soil issues detected';
  const secondaryIssue = sortedCorrections[1]?.issue;

  // Crop suitability
  const cropSuitability = assessCropSuitability(input);

  return {
    overallScore,
    healthLevel,
    parameterScores,
    deficiencies,
    strengths,
    correctionAdvice: sortedCorrections,
    mainIssue,
    secondaryIssue,
    cropSuitability,
  };
}

/**
 * Assess which crops are suitable for the given soil conditions.
 */
function assessCropSuitability(
  soil: SoilTestInput
): { crop: string; suitable: boolean; reason: string }[] {
  const crops = [
    { name: 'Wheat', phRange: [6.0, 7.5], nNeed: 'medium' },
    { name: 'Rice', phRange: [5.5, 7.0], nNeed: 'high' },
    { name: 'Cotton', phRange: [6.0, 8.0], nNeed: 'medium' },
    { name: 'Pearl Millet', phRange: [5.5, 8.5], nNeed: 'low' },
    { name: 'Mustard', phRange: [6.0, 7.5], nNeed: 'medium' },
    { name: 'Green Gram', phRange: [6.5, 7.5], nNeed: 'low' },
  ];

  return crops.map(crop => {
    const issues: string[] = [];

    if (soil.pH !== undefined) {
      if (soil.pH < crop.phRange[0] || soil.pH > crop.phRange[1]) {
        issues.push(`pH ${soil.pH} outside optimal range ${crop.phRange[0]}-${crop.phRange[1]}`);
      }
    }

    if (soil.nitrogen !== undefined) {
      if (crop.nNeed === 'high' && soil.nitrogen < 250) {
        issues.push('Nitrogen below requirement for this crop');
      }
    }

    return {
      crop: crop.name,
      suitable: issues.length === 0,
      reason: issues.length > 0 ? issues.join('; ') : 'Soil parameters within acceptable range',
    };
  });
}
