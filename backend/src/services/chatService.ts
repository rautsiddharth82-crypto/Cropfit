/**
 * AI Chat Service (PS-04)
 * 
 * Enhanced multilingual conversational assistant with progressive questioning,
 * context enrichment from APIs, and safety gate integration.
 */

import { getGeminiClient, type FarmContext, type ChatResponse } from './clients/geminiClient';
import { getGroqClient } from './clients/groqClient';
import { getWeatherService } from './weatherService';
import { getClimateStressService } from './climateStressService';
import { createInitialDiagnosticState, getNextBestQuestion, updateDiagnosticState, type DiagnosticState } from './algorithms/progressiveQuestionEngine';
import { checkSafetyGate, generateSafetyDisclaimer } from './algorithms/safetyGate';
import { DEFAULT_LOCATION, type SupportedCrop } from './config/constants';

// In-memory session storage (production: use database)
const sessions = new Map<string, ChatSession>();

interface ChatSession {
  id: string;
  farmerId: string;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
  diagnosticState?: DiagnosticState;
  context: FarmContext;
  createdAt: string;
}

export class ChatService {
  private gemini = getGeminiClient();
  private groq = getGroqClient();
  private weatherService = getWeatherService();
  private stressService = getClimateStressService();

  /**
   * Process a chat message with full context enrichment.
   */
  async processMessage(
    sessionId: string,
    message: string,
    farmContext: FarmContext
  ): Promise<ChatResponse & { sessionId: string; diagnosticState?: any }> {
    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        farmerId: farmContext.farmerName,
        messages: [],
        context: farmContext,
        createdAt: new Date().toISOString(),
      };
      sessions.set(sessionId, session);
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });

    // Detect if this is a diagnostic conversation (symptom described)
    const isDiagnostic = this.isDiagnosticQuery(message);

    if (isDiagnostic) {
      return this.handleDiagnosticConversation(session, message, farmContext);
    }

    // Enrich context with live API data
    const enrichedContext = await this.enrichContext(farmContext);

    // Generate AI response via Groq
    const response = await this.groq.generateFarmAdvice(enrichedContext, message);

    // Add assistant response
    session.messages.push({
      role: 'assistant',
      content: response.reply,
      timestamp: new Date().toISOString(),
    });

    return { ...response, sessionId };
  }

  /**
   * Handle diagnostic conversation with progressive questioning.
   */
  private async handleDiagnosticConversation(
    session: ChatSession,
    message: string,
    farmContext: FarmContext
  ): Promise<ChatResponse & { sessionId: string; diagnosticState?: any }> {
    // Initialize or update diagnostic state
    if (!session.diagnosticState) {
      session.diagnosticState = createInitialDiagnosticState(message);
    } else {
      // Parse the latest answer and update state
      const lastQuestion = session.messages.filter(m => m.role === 'assistant').pop();
      if (lastQuestion) {
        const factKey = this.inferFactKey(lastQuestion.content);
        session.diagnosticState = updateDiagnosticState(
          session.diagnosticState,
          factKey,
          message
        );
      }
    }

    const state = session.diagnosticState;

    // Check if we have enough confidence to give a recommendation
    if (state.currentConfidence >= 70) {
      // Run safety gate
      const gateResult = checkSafetyGate({
        confidence: state.currentConfidence,
        riskLevel: 30,
        evidenceSources: Object.keys(state.knownFacts),
        agreementRatio: 0.7,
        recommendationType: 'general',
        hasImageEvidence: !!state.knownFacts.hasPhoto,
        hasFarmerHistory: !!state.knownFacts.cropAge,
      });

      if (gateResult.approved) {
        const topDiagnosis = state.possibleDiagnoses[0];
        const disclaimer = generateSafetyDisclaimer(gateResult);
        const reply = `🔍 **Diagnosis: ${topDiagnosis.name}** (Confidence: ${state.currentConfidence}%)\n\n${disclaimer}\n\n${topDiagnosis.name} is the most likely cause based on your description.\n\nI'll now generate a detailed treatment recommendation.`;

        session.messages.push({ role: 'assistant', content: reply, timestamp: new Date().toISOString() });

        return {
          reply,
          confidence: state.currentConfidence,
          sessionId: session.id,
          diagnosticState: {
            confidence: state.currentConfidence,
            topDiagnosis: topDiagnosis.name,
            possibleDiagnoses: state.possibleDiagnoses.slice(0, 3),
            questionsAsked: state.questionsAsked,
          },
          sources: ['Progressive Diagnosis', 'Safety Gate'],
        };
      } else if (gateResult.action === 'ESCALATE_AGRONOMIST') {
        const reply = `⚠️ ${gateResult.warningMessage}\n\nI recommend consulting a local agronomist for a professional field inspection.`;
        session.messages.push({ role: 'assistant', content: reply, timestamp: new Date().toISOString() });
        return { reply, confidence: state.currentConfidence, sessionId: session.id, sources: ['Safety Gate'] };
      }
    }

    // Need more info → ask next best question
    const nextQuestion = getNextBestQuestion(state);
    if (nextQuestion) {
      const lang = farmContext.language || 'en';
      const question = lang === 'hi' ? nextQuestion.questionHindi : nextQuestion.question;
      const reply = question;

      session.messages.push({ role: 'assistant', content: reply, timestamp: new Date().toISOString() });

      return {
        reply,
        confidence: state.currentConfidence,
        sessionId: session.id,
        diagnosticState: {
          confidence: state.currentConfidence,
          questionsAsked: state.questionsAsked,
          possibleDiagnoses: state.possibleDiagnoses.slice(0, 3).map(d => ({
            name: d.name,
            probability: Math.round(d.probability * 100),
          })),
        },
        suggestedFollowUp: nextQuestion.purpose,
        sources: ['Progressive Question Engine'],
      };
    }

    // Fallback to AI (Groq)
    const response = await this.groq.generateFarmAdvice(farmContext, message);
    session.messages.push({ role: 'assistant', content: response.reply, timestamp: new Date().toISOString() });
    return { ...response, sessionId: session.id };
  }

  /**
   * Process an image upload in conversation context.
   */
  async processImage(
    sessionId: string,
    imageBase64: string,
    mimeType: string,
    farmContext: FarmContext
  ) {
    const analysis = await this.gemini.analyzeCropImage(imageBase64, mimeType, farmContext);

    // Run through safety gate
    const gateResult = checkSafetyGate({
      confidence: analysis.overallConfidence * 100,
      riskLevel: 30,
      evidenceSources: ['Gemini Vision', 'Image Analysis'],
      agreementRatio: 0.8,
      recommendationType: 'disease_treatment',
      hasImageEvidence: true,
    });

    const disclaimer = generateSafetyDisclaimer(gateResult);

    return {
      analysis,
      safetyGate: gateResult,
      disclaimer,
      sessionId,
    };
  }

  /**
   * Get chat history for a session.
   */
  getHistory(sessionId: string) {
    const session = sessions.get(sessionId);
    if (!session) return { messages: [], sessionId };
    return { messages: session.messages, sessionId };
  }

  // ── Helpers ──

  private isDiagnosticQuery(message: string): boolean {
    const diagnosticKeywords = [
      'yellow', 'पीला', 'पीली', 'spot', 'hole', 'wilt', 'मुरझा',
      'curl', 'rot', 'insect', 'pest', 'कीड़', 'disease', 'रोग',
      'problem', 'समस्या', 'damage', 'dying', 'brown', 'black',
    ];
    const lower = message.toLowerCase();
    return diagnosticKeywords.some(kw => lower.includes(kw));
  }

  private inferFactKey(question: string): string {
    const lower = question.toLowerCase();
    if (lower.includes('old') || lower.includes('age') || lower.includes('दिन')) return 'cropAge';
    if (lower.includes('lower') || lower.includes('upper') || lower.includes('नीचे') || lower.includes('ऊपर')) return 'affectedPart';
    if (lower.includes('irrigation') || lower.includes('water') || lower.includes('सिंचाई')) return 'lastIrrigation';
    if (lower.includes('spread') || lower.includes('फैल')) return 'isSpreading';
    if (lower.includes('insect') || lower.includes('कीड़')) return 'insectVisible';
    if (lower.includes('spray') || lower.includes('छिड़क')) return 'recentSpray';
    if (lower.includes('photo') || lower.includes('फोटो')) return 'hasPhoto';
    if (lower.includes('rain') || lower.includes('heat') || lower.includes('frost')) return 'recentWeather';
    return 'otherInfo';
  }

  private async enrichContext(farmContext: FarmContext): Promise<FarmContext> {
    try {
      const weather = await this.weatherService.getFieldWeather();
      return {
        ...farmContext,
        temperature: weather.current.tempC,
        recentAlerts: weather.anomaly.severity !== 'Normal'
          ? [`Weather anomaly: ${weather.anomaly.severity} (temp ${weather.anomaly.tempAnomaly > 0 ? '+' : ''}${weather.anomaly.tempAnomaly}°C)`]
          : [],
      };
    } catch {
      return farmContext;
    }
  }
}

let _instance: ChatService | null = null;
export function getChatService(): ChatService {
  if (!_instance) _instance = new ChatService();
  return _instance;
}
