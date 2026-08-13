/**
 * Enhanced Gemini AI Client for CropFit
 * 
 * Refactored from the inline server.ts code into a dedicated client
 * with context-enriched prompts, multimodal image analysis,
 * translation, and progressive questioning support.
 */

import { GoogleGenAI } from '@google/genai';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface FarmContext {
  farmerName: string;
  location: string;
  cropName: string;
  fieldName: string;
  growthStage: string;
  soilMoisture?: number;
  temperature?: number;
  recentAlerts?: string[];
  recentActions?: string[];
  language?: string;
}

export interface ChatResponse {
  reply: string;
  confidence?: number;
  supportingData?: Record<string, string>;
  suggestedFollowUp?: string;
  sources?: string[];
}

export interface ImageAnalysisResult {
  description: string;
  possibleDiagnoses: { name: string; confidence: number; symptoms: string[] }[];
  overallConfidence: number;
  recommendedAction: string;
  needsMoreInfo: boolean;
  additionalInfoNeeded?: string[];
}

export interface ProgressiveQuestionResult {
  question: string;
  questionHindi: string;
  purpose: string;
  expectedUncertaintyReduction: number;
}

// ──────────────────────────────────────────────
// Client
// ──────────────────────────────────────────────

export class GeminiClient {
  private ai: GoogleGenAI | null = null;
  private model = 'gemini-2.5-flash';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI({ apiKey: key });
      } catch (e) {
        console.warn('[GeminiClient] Failed to initialize:', e);
      }
    }
  }

  get isAvailable(): boolean {
    return this.ai !== null;
  }

  // ──────────────────────────────────────────────
  // Farm Advisory Chat
  // ──────────────────────────────────────────────

  async generateFarmAdvice(context: FarmContext, userMessage: string): Promise<ChatResponse> {
    const systemPrompt = this.buildFarmAdvisoryPrompt(context);

    if (!this.ai) {
      return this.getFallbackResponse(userMessage, context);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Farmer question: "${userMessage}"`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return {
        reply: response.text || 'I recommend inspecting your field conditions and consulting local advisors.',
        sources: ['Gemini AI', 'Farm Context'],
      };
    } catch (error) {
      console.error('[GeminiClient] generateFarmAdvice error:', error);
      return this.getFallbackResponse(userMessage, context);
    }
  }

  // ──────────────────────────────────────────────
  // Crop Image Analysis (Multimodal)
  // ──────────────────────────────────────────────

  async analyzeCropImage(
    imageBase64: string,
    mimeType: string,
    context: FarmContext
  ): Promise<ImageAnalysisResult> {
    if (!this.ai) {
      return this.getFallbackImageAnalysis();
    }

    try {
      const prompt = `You are a crop disease and health expert. Analyze this image from a ${context.cropName} field at ${context.growthStage} stage in ${context.location}.

IMPORTANT RULES:
1. If the image is unclear, say so and request a better photo.
2. If you are less than 60% confident in ANY diagnosis, say "I cannot safely identify the problem yet" and list what additional info or images you need.
3. Never give treatment recommendations below 70% confidence.
4. Consider multiple possible causes: disease, pest damage, nutrient deficiency, waterlogging, heat stress, or natural aging.

Respond in this JSON format:
{
  "description": "What you observe in the image",
  "possibleDiagnoses": [
    { "name": "...", "confidence": 0.0-1.0, "symptoms": ["..."] }
  ],
  "overallConfidence": 0.0-1.0,
  "recommendedAction": "...",
  "needsMoreInfo": true/false,
  "additionalInfoNeeded": ["..."]
}`;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

      const text = response.text || '';
      try {
        // Try to parse JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as ImageAnalysisResult;
        }
      } catch {
        // If JSON parse fails, create a structured response from text
      }

      return {
        description: text,
        possibleDiagnoses: [],
        overallConfidence: 0.5,
        recommendedAction: 'Please upload a clearer image for accurate diagnosis.',
        needsMoreInfo: true,
        additionalInfoNeeded: ['Clearer close-up photo', 'Photo of leaf undersides'],
      };
    } catch (error) {
      console.error('[GeminiClient] analyzeCropImage error:', error);
      return this.getFallbackImageAnalysis();
    }
  }

  // ──────────────────────────────────────────────
  // Translation
  // ──────────────────────────────────────────────

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    if (!this.ai) return text;

    try {
      const langNames: Record<string, string> = {
        en: 'English', hi: 'Hindi', pa: 'Punjabi',
      };
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Translate the following text from ${langNames[sourceLang] || sourceLang} to ${langNames[targetLang] || targetLang}. 
Keep agricultural terms accurate. Translate naturally, not word-by-word.
Only output the translation, nothing else.

Text: "${text}"`,
        config: { temperature: 0.3 },
      });

      return response.text || text;
    } catch (error) {
      console.error('[GeminiClient] translateText error:', error);
      return text;
    }
  }

  // ──────────────────────────────────────────────
  // Progressive Question Generation
  // ──────────────────────────────────────────────

  async generateProgressiveQuestion(
    conversationHistory: { role: string; content: string }[],
    knownFacts: Record<string, any>,
    possibleIssues: string[]
  ): Promise<ProgressiveQuestionResult> {
    if (!this.ai) {
      return this.getFallbackProgressiveQuestion(knownFacts);
    }

    try {
      const prompt = `You are an agricultural diagnostic assistant. Based on the conversation so far, determine the SINGLE most important question to ask the farmer next to narrow down the problem.

Known facts so far:
${JSON.stringify(knownFacts, null, 2)}

Possible issues being considered:
${possibleIssues.join(', ')}

Conversation history:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

Rules:
1. Ask the question that will MOST reduce diagnostic uncertainty.
2. Keep questions simple and practical for a farmer.
3. Provide the question in both English and Hindi.
4. Explain why this question matters.

Respond in JSON:
{
  "question": "English question",
  "questionHindi": "Hindi question",
  "purpose": "Why this question helps",
  "expectedUncertaintyReduction": 0.0-1.0
}`;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: { temperature: 0.5 },
      });

      const text = response.text || '';
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as ProgressiveQuestionResult;
        }
      } catch {}

      return this.getFallbackProgressiveQuestion(knownFacts);
    } catch (error) {
      console.error('[GeminiClient] generateProgressiveQuestion error:', error);
      return this.getFallbackProgressiveQuestion(knownFacts);
    }
  }

  // ──────────────────────────────────────────────
  // Soil Report Parsing (Vision)
  // ──────────────────────────────────────────────

  async parseSoilReport(imageBase64: string, mimeType: string): Promise<Record<string, number | string>> {
    if (!this.ai) {
      return { error: 'AI not available', pH: 7.2, nitrogen: 220, phosphorus: 25, potassium: 280 };
    }

    try {
      const prompt = `Extract soil test values from this soil report image. Return a JSON object with these fields:
- pH (number)
- ec (electrical conductivity, dS/m, number)
- organicCarbon (%, number)
- nitrogen (kg/ha, number)
- phosphorus (kg/ha, number)
- potassium (kg/ha, number)
- zinc (ppm, number)
- iron (ppm, number)
- sulfur (ppm, number)
- labName (string)
- sampleDate (string)

Only include values you can clearly read from the report. Set others to null.
Return ONLY the JSON object.`;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: imageBase64 } },
            ],
          },
        ],
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { error: 'Could not parse soil report' };
    } catch (error) {
      console.error('[GeminiClient] parseSoilReport error:', error);
      return { error: 'Failed to parse soil report' };
    }
  }

  // ──────────────────────────────────────────────
  // Private Helpers
  // ──────────────────────────────────────────────

  private buildFarmAdvisoryPrompt(ctx: FarmContext): string {
    return `You are "Kishan Mitra" — a friendly, expert climate-smart farming assistant.
You work for CropFit, powered by Annam AI (IIT Ropar) and Syngenta agronomic intelligence.

CORE RULES:
1. Give SHORT, ACTIONABLE advice. Farmers are busy.
2. Always connect weather → crop stage → soil → action.
3. If confidence < 70%, say so honestly and ask for more information.
4. Never recommend a chemical product without first considering biological/organic alternatives.
5. Include specific timing (morning/evening, exact hours) when possible.
6. Use crop-appropriate language.

FARMER CONTEXT:
- Name: ${ctx.farmerName}
- Location: ${ctx.location}
- Field: ${ctx.fieldName}
- Crop: ${ctx.cropName}
- Growth Stage: ${ctx.growthStage}
${ctx.soilMoisture !== undefined ? `- Soil Moisture: ${ctx.soilMoisture}%` : ''}
${ctx.temperature !== undefined ? `- Temperature: ${ctx.temperature}°C` : ''}
${ctx.recentAlerts?.length ? `- Active Alerts: ${ctx.recentAlerts.join(', ')}` : ''}
${ctx.recentActions?.length ? `- Recent Actions: ${ctx.recentActions.join(', ')}` : ''}

RESPONSE FORMAT:
1. ⚡ Quick Answer (1-2 lines)
2. 📋 Action Steps (bulleted, with emojis)
3. 🔬 Why (1 sentence connecting soil/weather science)
4. ⏰ Best Timing / Window

${ctx.language === 'hi' ? 'Respond in Hindi (Devanagari script). Use simple agricultural Hindi.' : ''}
${ctx.language === 'pa' ? 'Respond in Punjabi (Gurmukhi script).' : ''}`;
  }

  private getFallbackResponse(message: string, context: FarmContext): ChatResponse {
    const lower = message.toLowerCase();

    if (lower.includes('irrigat') || lower.includes('water') || lower.includes('सिंचाई') || lower.includes('पानी')) {
      return {
        reply: `💧 **Irrigation Recommendation for ${context.cropName}**:\n\n• **Action**: Apply light irrigation (25-30mm) to ${context.fieldName}.\n• **Best Time**: 6:00 AM – 8:00 AM tomorrow morning.\n• **Why**: Early morning irrigation minimizes evaporation and cools the root zone before peak heat.\n• **Volume**: 25-30mm recommended for ${context.growthStage} stage.`,
        confidence: 75,
        sources: ['Farm Context', 'Agronomic Rules'],
      };
    }

    if (lower.includes('heat') || lower.includes('temperature') || lower.includes('गर्मी') || lower.includes('तापमान')) {
      return {
        reply: `🌡️ **Heat Stress Management for ${context.cropName}**:\n\n• **Risk**: ${context.cropName} at ${context.growthStage} is sensitive to temperatures above 32°C.\n• **Steps**:\n  1. Maintain soil moisture above 50% for transpirational cooling.\n  2. Avoid nitrogen fertilizer during peak heat.\n  3. Consider foliar spray of KNO₃ (1%) if heat persists above 37°C.\n• **Timing**: Irrigate before 8:00 AM; spray in evening after 5:00 PM.`,
        confidence: 80,
        sources: ['Crop Thresholds', 'Farm Context'],
      };
    }

    if (lower.includes('disease') || lower.includes('yellow') || lower.includes('rust') || lower.includes('रोग') || lower.includes('पीला')) {
      return {
        reply: `🔍 **Disease Assessment**:\n\n• I need more information to give a safe recommendation.\n• **Please provide**:\n  1. Close-up photo of affected leaves (top and bottom)\n  2. Crop age in days\n  3. Whether the issue is spreading\n  4. Recent spray history\n\n⚠️ Confidence: 45% — I want to be certain before recommending any treatment.`,
        confidence: 45,
        sources: ['Safety Gate'],
      };
    }

    return {
      reply: `🌱 **Farm Advisory for ${context.farmerName}**:\n\nBased on your ${context.cropName} at ${context.growthStage} stage in ${context.location}:\n• Monitor soil moisture levels in ${context.fieldName}.\n• Check the Climate tab for upcoming weather risks.\n• Use the Season Journal to log your observations.\n\nAsk me about irrigation, heat stress, disease symptoms, or crop recommendations!`,
      confidence: 70,
      sources: ['Farm Context'],
    };
  }

  private getFallbackImageAnalysis(): ImageAnalysisResult {
    return {
      description: 'Image analysis requires an active Gemini API connection. Please configure your API key.',
      possibleDiagnoses: [],
      overallConfidence: 0,
      recommendedAction: 'Configure Gemini API key and re-upload the image for analysis.',
      needsMoreInfo: true,
      additionalInfoNeeded: ['Active Gemini API key'],
    };
  }

  private getFallbackProgressiveQuestion(knownFacts: Record<string, any>): ProgressiveQuestionResult {
    // Determine what's missing and ask the most useful question
    if (!knownFacts.cropAge) {
      return {
        question: 'How old is the crop (days since sowing)?',
        questionHindi: 'फसल कितने दिन की है (बुआई से)?',
        purpose: 'Crop age determines growth stage sensitivity and helps narrow possible causes.',
        expectedUncertaintyReduction: 0.3,
      };
    }
    if (!knownFacts.affectedArea) {
      return {
        question: 'Which part of the plant is affected — lower older leaves or upper new leaves?',
        questionHindi: 'पौधे का कौन सा हिस्सा प्रभावित है — नीचे की पुरानी पत्तियां या ऊपर की नई पत्तियां?',
        purpose: 'Lower leaf issues suggest nutrient deficiency or aging; upper leaf issues suggest disease or environmental stress.',
        expectedUncertaintyReduction: 0.25,
      };
    }
    if (!knownFacts.lastIrrigation) {
      return {
        question: 'When was the last irrigation, and did water stand in the field?',
        questionHindi: 'पिछली सिंचाई कब हुई थी? क्या खेत में पानी रुका था?',
        purpose: 'Recent waterlogging or drought both cause yellowing but require opposite treatments.',
        expectedUncertaintyReduction: 0.2,
      };
    }
    if (!knownFacts.hasPhoto) {
      return {
        question: 'Can you upload a clear photo of the affected plant?',
        questionHindi: 'क्या आप प्रभावित पौधे की एक साफ फोटो भेज सकते हैं?',
        purpose: 'Visual evidence significantly improves diagnostic accuracy.',
        expectedUncertaintyReduction: 0.35,
      };
    }

    return {
      question: 'Is the damage spreading to nearby plants, or is it limited to a few?',
      questionHindi: 'क्या नुकसान आसपास के पौधों में भी फैल रहा है, या सिर्फ कुछ पौधों में है?',
      purpose: 'Spreading damage suggests disease/pest; isolated damage suggests nutrient or physical cause.',
      expectedUncertaintyReduction: 0.15,
    };
  }
}

// Singleton instance
let _instance: GeminiClient | null = null;
export function getGeminiClient(): GeminiClient {
  if (!_instance) _instance = new GeminiClient();
  return _instance;
}
