/**
 * Progressive Question Engine
 *
 * Determines the next best question to ask a farmer to maximize
 * diagnostic certainty in the fewest steps. Uses entropy-based
 * question selection.
 */

export interface DiagnosticState {
  knownFacts: Record<string, any>;
  possibleDiagnoses: PossibleDiagnosis[];
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  currentConfidence: number;
  questionsAsked: number;
}

export interface PossibleDiagnosis {
  name: string;
  probability: number;  // 0-1
  requiredEvidence: string[];
  supportingFacts: string[];
  contradictingFacts: string[];
}

export interface NextQuestion {
  question: string;
  questionHindi: string;
  questionType: 'choice' | 'open' | 'photo' | 'yes_no';
  options?: string[];
  purpose: string;
  expectedUncertaintyReduction: number;
  relatedDiagnoses: string[];
}

// ──────────────────────────────────────────────
// Question Bank
// ──────────────────────────────────────────────

interface QuestionTemplate {
  id: string;
  factKey: string;           // What fact this question establishes
  question: string;
  questionHindi: string;
  questionType: 'choice' | 'open' | 'photo' | 'yes_no';
  options?: string[];
  uncertaintyReduction: number;   // Base uncertainty reduction
  relevantSymptoms: string[];     // Which symptom categories this helps with
  priority: number;               // Base priority (1 = highest)
}

const QUESTION_BANK: QuestionTemplate[] = [
  {
    id: 'crop_age',
    factKey: 'cropAge',
    question: 'How old is the crop (days since sowing)?',
    questionHindi: 'फसल कितने दिन की है (बुआई से)?',
    questionType: 'open',
    uncertaintyReduction: 0.30,
    relevantSymptoms: ['yellowing', 'wilting', 'spots', 'holes', 'stunted'],
    priority: 1,
  },
  {
    id: 'affected_part',
    factKey: 'affectedPart',
    question: 'Which part of the plant is affected — lower older leaves or upper new leaves?',
    questionHindi: 'पौधे का कौन सा हिस्सा प्रभावित है — नीचे की पुरानी पत्तियां या ऊपर की नई पत्तियां?',
    questionType: 'choice',
    options: ['Lower/older leaves', 'Upper/new leaves', 'Entire plant', 'Stem/roots'],
    uncertaintyReduction: 0.25,
    relevantSymptoms: ['yellowing', 'spots', 'wilting', 'curling'],
    priority: 2,
  },
  {
    id: 'last_irrigation',
    factKey: 'lastIrrigation',
    question: 'When was the last irrigation, and was there standing water in the field?',
    questionHindi: 'पिछली सिंचाई कब हुई थी? क्या खेत में पानी रुका था?',
    questionType: 'open',
    uncertaintyReduction: 0.20,
    relevantSymptoms: ['yellowing', 'wilting', 'root_rot', 'waterlogging'],
    priority: 3,
  },
  {
    id: 'spreading',
    factKey: 'isSpreading',
    question: 'Is the damage spreading to nearby plants, or is it limited to a few?',
    questionHindi: 'क्या नुकसान आसपास के पौधों में भी फैल रहा है, या सिर्फ कुछ पौधों में है?',
    questionType: 'yes_no',
    uncertaintyReduction: 0.20,
    relevantSymptoms: ['spots', 'holes', 'yellowing', 'wilting'],
    priority: 4,
  },
  {
    id: 'insect_visible',
    factKey: 'insectVisible',
    question: 'Can you see any insects on or under the leaves?',
    questionHindi: 'क्या पत्तियों पर या नीचे कोई कीड़े दिखाई दे रहे हैं?',
    questionType: 'yes_no',
    uncertaintyReduction: 0.25,
    relevantSymptoms: ['holes', 'curling', 'sticky', 'webbing'],
    priority: 3,
  },
  {
    id: 'recent_spray',
    factKey: 'recentSpray',
    question: 'Was any pesticide, fertilizer, or chemical sprayed in the last 10 days?',
    questionHindi: 'क्या पिछले 10 दिनों में कोई कीटनाशक, खाद, या रसायन छिड़का गया था?',
    questionType: 'open',
    uncertaintyReduction: 0.15,
    relevantSymptoms: ['yellowing', 'burn', 'wilting', 'spots'],
    priority: 5,
  },
  {
    id: 'photo_request',
    factKey: 'hasPhoto',
    question: 'Can you upload a clear photo of the affected plant? (close-up of leaves, top and bottom)',
    questionHindi: 'क्या आप प्रभावित पौधे की एक साफ फोटो भेज सकते हैं? (पत्तियों की करीबी फोटो, ऊपर और नीचे दोनों)',
    questionType: 'photo',
    uncertaintyReduction: 0.35,
    relevantSymptoms: ['spots', 'yellowing', 'holes', 'wilting', 'curling', 'burn'],
    priority: 2,
  },
  {
    id: 'weather_recent',
    factKey: 'recentWeather',
    question: 'Was there heavy rain, extreme heat, or frost in the last week?',
    questionHindi: 'क्या पिछले हफ्ते में भारी बारिश, अत्यधिक गर्मी, या पाला पड़ा था?',
    questionType: 'choice',
    options: ['Heavy rain', 'Extreme heat (>38°C)', 'Frost/cold', 'Normal weather'],
    uncertaintyReduction: 0.18,
    relevantSymptoms: ['yellowing', 'wilting', 'waterlogging', 'burn'],
    priority: 4,
  },
  {
    id: 'symptom_pattern',
    factKey: 'symptomPattern',
    question: 'What does the damage look like? (Describe color, shape, pattern)',
    questionHindi: 'नुकसान कैसा दिखता है? (रंग, आकार, पैटर्न बताएं)',
    questionType: 'open',
    uncertaintyReduction: 0.22,
    relevantSymptoms: ['spots', 'yellowing', 'holes', 'curling', 'wilting'],
    priority: 3,
  },
  {
    id: 'soil_condition',
    factKey: 'soilCondition',
    question: 'How does the soil feel — dry and cracking, moist, or waterlogged?',
    questionHindi: 'मिट्टी कैसी लगती है — सूखी और दरारों वाली, नम, या पानी से भरी?',
    questionType: 'choice',
    options: ['Dry and cracking', 'Moist and healthy', 'Waterlogged/muddy'],
    uncertaintyReduction: 0.15,
    relevantSymptoms: ['yellowing', 'wilting', 'root_rot', 'stunted'],
    priority: 5,
  },
];

// ──────────────────────────────────────────────
// Engine
// ──────────────────────────────────────────────

/**
 * Determine the next best question to ask based on current diagnostic state.
 * Uses a greedy information-gain approach.
 */
export function getNextBestQuestion(state: DiagnosticState): NextQuestion | null {
  // Filter out questions already answered
  const unanswered = QUESTION_BANK.filter(q => !(q.factKey in state.knownFacts));

  if (unanswered.length === 0) return null;
  if (state.currentConfidence >= 85) return null; // Sufficient confidence

  // Score each remaining question by expected information gain
  const scored = unanswered.map(q => {
    let score = q.uncertaintyReduction * 100;

    // Boost questions related to current top diagnoses
    if (state.possibleDiagnoses.length > 0) {
      const topDiagnosis = state.possibleDiagnoses[0];
      const overlap = q.relevantSymptoms.filter(s =>
        topDiagnosis.requiredEvidence.some(e => e.toLowerCase().includes(s))
      ).length;
      score += overlap * 10;
    }

    // Boost photo request if multiple questions already asked without one
    if (q.id === 'photo_request' && state.questionsAsked >= 2 && !state.knownFacts.hasPhoto) {
      score += 20;
    }

    // Priority bonus
    score += (6 - q.priority) * 5;

    return { question: q, score };
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best) return null;

  return {
    question: best.question.question,
    questionHindi: best.question.questionHindi,
    questionType: best.question.questionType,
    options: best.question.options,
    purpose: `This helps narrow the diagnosis by ${(best.question.uncertaintyReduction * 100).toFixed(0)}%`,
    expectedUncertaintyReduction: best.question.uncertaintyReduction,
    relatedDiagnoses: state.possibleDiagnoses.slice(0, 3).map(d => d.name),
  };
}

/**
 * Update diagnostic state with a new answer.
 */
export function updateDiagnosticState(
  state: DiagnosticState,
  factKey: string,
  factValue: any
): DiagnosticState {
  const updatedFacts = { ...state.knownFacts, [factKey]: factValue };

  // Re-evaluate possible diagnoses based on new evidence
  const updatedDiagnoses = state.possibleDiagnoses.map(d => {
    let newProbability = d.probability;

    // Simple heuristic adjustments based on common agricultural patterns
    if (factKey === 'affectedPart') {
      if (factValue === 'Lower/older leaves') {
        // Favors nutrient deficiency, natural aging
        if (d.name.includes('Nitrogen') || d.name.includes('nutrient')) newProbability *= 1.3;
        if (d.name.includes('disease')) newProbability *= 0.8;
      } else if (factValue === 'Upper/new leaves') {
        // Favors disease, micronutrient deficiency
        if (d.name.includes('disease') || d.name.includes('Iron') || d.name.includes('Zinc')) newProbability *= 1.3;
        if (d.name.includes('Nitrogen')) newProbability *= 0.7;
      }
    }

    if (factKey === 'isSpreading') {
      if (factValue === true || factValue === 'yes') {
        // Spreading → disease or pest
        if (d.name.includes('disease') || d.name.includes('pest')) newProbability *= 1.4;
        if (d.name.includes('nutrient') || d.name.includes('stress')) newProbability *= 0.6;
      }
    }

    if (factKey === 'insectVisible') {
      if (factValue === true || factValue === 'yes') {
        if (d.name.includes('pest') || d.name.includes('insect')) newProbability *= 1.5;
      } else {
        if (d.name.includes('pest') || d.name.includes('insect')) newProbability *= 0.4;
      }
    }

    // Normalize probability
    newProbability = Math.min(1, Math.max(0, newProbability));

    return { ...d, probability: newProbability };
  });

  // Sort by probability
  updatedDiagnoses.sort((a, b) => b.probability - a.probability);

  // Recalculate confidence
  const topProb = updatedDiagnoses[0]?.probability || 0;
  const secondProb = updatedDiagnoses[1]?.probability || 0;
  const separation = topProb - secondProb;
  const newConfidence = Math.min(95, Math.round(topProb * 60 + separation * 40));

  return {
    knownFacts: updatedFacts,
    possibleDiagnoses: updatedDiagnoses,
    conversationHistory: state.conversationHistory,
    currentConfidence: newConfidence,
    questionsAsked: state.questionsAsked + 1,
  };
}

/**
 * Create initial diagnostic state from a farmer's first message.
 */
export function createInitialDiagnosticState(
  initialSymptom: string
): DiagnosticState {
  const symptomLower = initialSymptom.toLowerCase();

  // Generate initial possible diagnoses based on symptom keywords
  const diagnoses: PossibleDiagnosis[] = [];

  if (symptomLower.includes('yellow') || symptomLower.includes('पीला') || symptomLower.includes('पीली')) {
    diagnoses.push(
      { name: 'Nitrogen Deficiency', probability: 0.25, requiredEvidence: ['yellowing', 'lower leaves', 'crop age'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Waterlogging', probability: 0.20, requiredEvidence: ['yellowing', 'waterlogging', 'soil condition'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Iron Chlorosis', probability: 0.15, requiredEvidence: ['yellowing', 'upper leaves', 'alkaline soil'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Fungal Disease', probability: 0.15, requiredEvidence: ['yellowing', 'spots', 'spreading'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Natural Lower Leaf Aging', probability: 0.15, requiredEvidence: ['yellowing', 'lower leaves', 'not spreading'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Heat Stress', probability: 0.10, requiredEvidence: ['yellowing', 'high temperature', 'wilting'], supportingFacts: [], contradictingFacts: [] },
    );
  } else if (symptomLower.includes('hole') || symptomLower.includes('छेद')) {
    diagnoses.push(
      { name: 'Insect Pest Damage', probability: 0.40, requiredEvidence: ['holes', 'insect visible', 'spreading'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Caterpillar Feeding', probability: 0.25, requiredEvidence: ['holes', 'frass visible'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Hail Damage', probability: 0.15, requiredEvidence: ['holes', 'recent weather'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Fungal Leaf Spot', probability: 0.20, requiredEvidence: ['holes', 'spots', 'humidity'], supportingFacts: [], contradictingFacts: [] },
    );
  } else if (symptomLower.includes('wilt') || symptomLower.includes('मुरझा')) {
    diagnoses.push(
      { name: 'Drought Stress', probability: 0.30, requiredEvidence: ['wilting', 'dry soil', 'irrigation'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Heat Stress', probability: 0.25, requiredEvidence: ['wilting', 'high temperature'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Root Rot', probability: 0.20, requiredEvidence: ['wilting', 'waterlogging'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Fusarium Wilt', probability: 0.15, requiredEvidence: ['wilting', 'vascular discoloration'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Stem Borer', probability: 0.10, requiredEvidence: ['wilting', 'stem damage'], supportingFacts: [], contradictingFacts: [] },
    );
  } else {
    // Generic diagnoses
    diagnoses.push(
      { name: 'Nutrient Deficiency', probability: 0.25, requiredEvidence: ['symptom pattern', 'soil test'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Pest Damage', probability: 0.25, requiredEvidence: ['insect visible', 'damage pattern'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Disease', probability: 0.25, requiredEvidence: ['spots', 'spreading', 'humidity'], supportingFacts: [], contradictingFacts: [] },
      { name: 'Environmental Stress', probability: 0.25, requiredEvidence: ['weather', 'soil condition'], supportingFacts: [], contradictingFacts: [] },
    );
  }

  return {
    knownFacts: { initialSymptom: initialSymptom },
    possibleDiagnoses: diagnoses,
    conversationHistory: [{ role: 'user', content: initialSymptom }],
    currentConfidence: 20,
    questionsAsked: 0,
  };
}
