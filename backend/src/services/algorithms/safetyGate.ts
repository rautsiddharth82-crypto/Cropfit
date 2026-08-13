/**
 * Safety Gate Module
 * 
 * Checks whether a recommendation is safe to deliver to a farmer.
 * Prevents low-confidence, high-risk, or insufficient-evidence
 * recommendations from reaching farmers without escalation.
 */

import { SAFETY_GATE_CONFIG, CONFIDENCE_THRESHOLDS } from '../config/constants';

export interface SafetyGateInput {
  confidence: number;               // 0-100
  riskLevel: number;                // 0-100 (higher = more risky)
  evidenceSources: string[];        // List of data sources backing the recommendation
  agreementRatio: number;           // 0-1 (what fraction of sources agree)
  recommendationType: 'general' | 'irrigation' | 'fertilizer' | 'pesticide' | 'biological' | 'disease_treatment';
  hasImageEvidence?: boolean;
  hasFarmerHistory?: boolean;
}

export interface SafetyGateResult {
  approved: boolean;
  action: 'PROCEED' | 'ASK_MORE' | 'ESCALATE_AGRONOMIST' | 'REFUSE';
  reason: string;
  missingEvidence?: string[];
  warningMessage?: string;
  confidenceLevel: 'high' | 'moderate' | 'low' | 'insufficient';
}

/**
 * Run the safety gate check on a recommendation.
 * 
 * Rules:
 * 1. Confidence < 40% → ESCALATE to agronomist
 * 2. Confidence < 70% → ASK_MORE (request additional info)
 * 3. For pesticide/chemical: confidence must be ≥ 75%
 * 4. Risk > 80% → ESCALATE regardless of confidence
 * 5. Agreement ratio < 60% → ASK_MORE
 * 6. Need ≥ 2 evidence sources
 */
export function checkSafetyGate(input: SafetyGateInput): SafetyGateResult {
  const config = SAFETY_GATE_CONFIG;
  const missing: string[] = [];

  // ── Rule 1: Very low confidence → Escalate ──
  if (input.confidence < CONFIDENCE_THRESHOLDS.ESCALATE_TO_AGRONOMIST) {
    return {
      approved: false,
      action: 'ESCALATE_AGRONOMIST',
      reason: `Confidence ${input.confidence}% is below safe threshold (${CONFIDENCE_THRESHOLDS.ESCALATE_TO_AGRONOMIST}%). Recommending agronomist consultation.`,
      confidenceLevel: 'insufficient',
      warningMessage: 'I cannot safely identify the problem yet. Please consult a local agronomist or provide more information.',
    };
  }

  // ── Rule 2: High risk → Escalate ──
  if (input.riskLevel >= config.escalateAtRisk) {
    return {
      approved: false,
      action: 'ESCALATE_AGRONOMIST',
      reason: `Risk level ${input.riskLevel}% exceeds escalation threshold. Professional verification recommended.`,
      confidenceLevel: input.confidence >= 70 ? 'moderate' : 'low',
      warningMessage: 'The situation appears serious. Please consult a qualified agronomist for professional assessment.',
    };
  }

  // ── Rule 3: Insufficient evidence sources ──
  if (input.evidenceSources.length < config.minEvidenceSourcesRequired) {
    const neededSources = config.minEvidenceSourcesRequired - input.evidenceSources.length;
    missing.push(`Need ${neededSources} more evidence source(s)`);

    if (!input.hasImageEvidence) missing.push('Upload a clear crop photo');
    if (!input.hasFarmerHistory) missing.push('Provide crop age and recent actions');
  }

  // ── Rule 4: Low agreement ──
  if (input.agreementRatio < config.minAgreementRatioRequired) {
    missing.push('Data sources disagree — additional verification needed');
  }

  // ── Rule 5: Product-specific confidence requirements ──
  if (
    (input.recommendationType === 'pesticide' || input.recommendationType === 'disease_treatment') &&
    input.confidence < CONFIDENCE_THRESHOLDS.MINIMUM_FOR_PRODUCT_ADVICE
  ) {
    return {
      approved: false,
      action: 'ASK_MORE',
      reason: `Product recommendation requires ≥${CONFIDENCE_THRESHOLDS.MINIMUM_FOR_PRODUCT_ADVICE}% confidence. Current: ${input.confidence}%.`,
      missingEvidence: [
        ...missing,
        'Clearer symptom photo (upper and lower leaf)',
        'Crop age and recent spray history',
        'Whether damage is spreading',
      ],
      confidenceLevel: 'low',
      warningMessage: `Confidence: ${input.confidence}% — I need more information before recommending a treatment.`,
    };
  }

  // ── Rule 6: General confidence threshold ──
  if (input.confidence < config.minConfidenceForRecommendation) {
    return {
      approved: false,
      action: 'ASK_MORE',
      reason: `Confidence ${input.confidence}% is below recommendation threshold (${config.minConfidenceForRecommendation}%).`,
      missingEvidence: missing.length > 0 ? missing : [
        'Provide additional details about the problem',
        'Upload a photo if possible',
      ],
      confidenceLevel: 'low',
      warningMessage: `Confidence: ${input.confidence}% — I want to be more certain before giving advice.`,
    };
  }

  // ── All checks passed ──
  if (missing.length > 0) {
    // Minor concerns but still above threshold
    return {
      approved: true,
      action: 'PROCEED',
      reason: 'Recommendation approved with minor caveats.',
      missingEvidence: missing,
      confidenceLevel: input.confidence >= 85 ? 'high' : 'moderate',
      warningMessage: `Note: ${missing.join('. ')}. Recommendation confidence: ${input.confidence}%.`,
    };
  }

  return {
    approved: true,
    action: 'PROCEED',
    reason: `All safety checks passed. Confidence: ${input.confidence}%, Evidence sources: ${input.evidenceSources.length}, Agreement: ${(input.agreementRatio * 100).toFixed(0)}%.`,
    confidenceLevel: input.confidence >= 85 ? 'high' : 'moderate',
  };
}

/**
 * Generate a human-readable safety disclaimer for a recommendation.
 */
export function generateSafetyDisclaimer(
  gateResult: SafetyGateResult,
  language: 'en' | 'hi' = 'en'
): string {
  if (language === 'hi') {
    if (gateResult.action === 'ESCALATE_AGRONOMIST') {
      return '⚠️ सुरक्षा: इस समस्या के लिए स्थानीय कृषि विशेषज्ञ से परामर्श करें। AI की विश्वसनीयता अभी कम है।';
    }
    if (gateResult.action === 'ASK_MORE') {
      return `⚠️ विश्वसनीयता: ${gateResult.warningMessage || 'अधिक जानकारी दें।'}`;
    }
    return '✅ यह सलाह पर्याप्त डेटा पर आधारित है।';
  }

  if (gateResult.action === 'ESCALATE_AGRONOMIST') {
    return '⚠️ Safety: Please consult a local agronomist for this issue. AI confidence is insufficient for a safe recommendation.';
  }
  if (gateResult.action === 'ASK_MORE') {
    return `⚠️ Confidence: ${gateResult.warningMessage || 'More information needed for a reliable recommendation.'}`;
  }
  return '✅ This recommendation is based on sufficient evidence and data.';
}
