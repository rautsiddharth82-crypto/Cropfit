import dotenv from 'dotenv';
dotenv.config();

import { getChatService } from './src/services/chatService';
import { getGeminiClient } from './src/services/clients/geminiClient';
import { getGroqClient } from './src/services/clients/groqClient';

async function main() {
  try {
    const service = getChatService();
    const res = await service.processMessage('session-1', 'Hello, how can I improve my wheat yield?', { farmerName: 'Test' } as any);
    console.log(res);
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
