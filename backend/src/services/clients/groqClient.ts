/**
 * Groq AI Client
 * 
 * Uses the ultra-fast Groq API for text generation.
 * Default model: llama-3.3-70b-versatile
 */

import Groq from 'groq-sdk';
import type { FarmContext } from './geminiClient';

export class GroqClient {
  private groq: Groq | null = null;
  private model = 'qwen/qwen3.6-27b';

  private getClient(): Groq {
    if (!this.groq) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
    }
    return this.groq;
  }

  /**
   * Generate farm advice based on context and user message.
   */
  async generateFarmAdvice(context: FarmContext, userMessage: string) {
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ GROQ_API_KEY not set. Generating fallback response.');
      return {
        reply: `This is a fallback response. Groq API is not configured. You said: ${userMessage}`,
        confidence: 50,
      };
    }

    const systemPrompt = `You are CropFit, an expert climate-smart farming assistant.
You provide precise, actionable, and safe agronomic advice to farmers.
Use the following context about the farmer and their field to personalize your response.
If the farmer asks a question in a language other than English, reply in that language (e.g., Hindi, Punjabi).

FARMER CONTEXT:
Name: ${context.farmerName || 'Farmer'}
Location: ${context.location || 'Unknown'}
Crop: ${context.cropName || 'Unknown'}
Field: ${context.fieldName || 'Unknown'}
Growth Stage: ${context.growthStage || 'Unknown'}
Current Temperature: ${context.temperature ? `${context.temperature}°C` : 'Unknown'}
Recent Alerts: ${context.recentAlerts?.join(', ') || 'None'}

IMPORTANT INSTRUCTIONS:
- Reply in extremely precise, simple, and easy-to-understand words.
- Keep your entire response very short and direct (maximum of 2-3 sentences or simple bullet points).
- Do NOT provide long explanations, reasoning steps, or verbose paragraphs.
- Answer the user's question directly.
`;

    try {
      const response = await this.getClient().chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        model: this.model,
        temperature: 0.3,
      });

      let reply = response.choices[0]?.message?.content || 'I could not generate a response.';
      
      // Clean and remove the thinking process reasoning block
      reply = reply.replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '').trim();
      reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      
      return {
        reply,
        confidence: 90, // Static for now, as Groq doesn't provide confidence scores
        sources: ['Groq AI (qwen/qwen3.6-27b)'],
      };
    } catch (err) {
      console.error('Groq generation error:', err);
      throw new Error('Failed to generate response from Groq');
    }
  }

  /**
   * Translates text into Hindi or English based on target.
   */
  async translateText(text: string, targetLanguage: 'hi' | 'en' | 'pa') {
    if (!process.env.GROQ_API_KEY) return text;

    try {
      const response = await this.getClient().chat.completions.create({
        messages: [
          { role: 'system', content: `You are a translator. Translate the following text into ${targetLanguage === 'hi' ? 'Hindi' : targetLanguage === 'pa' ? 'Punjabi' : 'English'}. ONLY output the translation, no extra text.` },
          { role: 'user', content: text },
        ],
        model: this.model,
        temperature: 0.1,
      });

      return response.choices[0]?.message?.content || text;
    } catch (err) {
      console.error('Groq translation error:', err);
      return text;
    }
  }

  /**
   * Parse a raw spoken voice log into a structured journal entry JSON.
   */
  async parseJournalEntry(spokenText: string) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const systemPrompt = `You are an AI assistant that extracts structured farming journal entries from raw farmer speech.
Extract the following details and return ONLY a valid JSON object matching this schema:
{
  "type": "irrigation" | "fertilizer" | "pesticide" | "weather" | "observation" | "harvest" | "recommendation" | "other",
  "title": string (A short 3-5 word summary),
  "notes": string (A clean, professional rewrite of the farmer's log),
  "cost": number (Optional, extract any cost/price mentioned. Convert to number),
  "quantity": string (Optional, extract any quantity/volume mentioned, e.g., "2 liters")
}

Return ONLY the raw JSON object. Do NOT include markdown blocks like \`\`\`json.`;

    try {
      const response = await this.getClient().chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: spokenText },
        ],
        model: this.model,
        temperature: 0.1,
      });

      const rawJson = response.choices[0]?.message?.content || '{}';
      // Clean up potential think tags and markdown formatting
      let cleaned = rawJson.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error('Groq parse error:', err);
      throw new Error('Failed to parse journal entry');
    }
  }
}

let _instance: GroqClient | null = null;
export function getGroqClient(): GroqClient {
  if (!_instance) _instance = new GroqClient();
  return _instance;
}
