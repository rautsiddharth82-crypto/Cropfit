/**
 * Chat API Routes (PS-04)
 */
import { Router, type Request, type Response } from 'express';
import { getChatService } from '../services/chatService';

export const chatRoutes = Router();
const service = getChatService();

// POST /api/chat/message
chatRoutes.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, sessionId, farmContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const context = farmContext || {
      farmerName: 'Gunjan',
      location: 'Rajpura, Punjab',
      cropName: 'Wheat',
      fieldName: 'Field 01',
      growthStage: 'Flowering & Grain Filling',
    };

    const result = await service.processMessage(
      sessionId || `session-${Date.now()}`,
      message,
      context
    );

    res.json({
      reply: result.reply,
      confidence: result.confidence,
      sessionId: result.sessionId,
      diagnosticState: result.diagnosticState,
      supportingData: result.supportingData,
      sources: result.sources,
    });
  } catch (err) {
    console.error('Chat message error:', err);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// POST /api/chat/image
chatRoutes.post('/image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, sessionId, farmContext } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const context = farmContext || {
      farmerName: 'Gunjan',
      location: 'Rajpura, Punjab',
      cropName: 'Wheat',
      fieldName: 'Field 01',
      growthStage: 'Flowering & Grain Filling',
    };

    const result = await service.processImage(
      sessionId || `session-${Date.now()}`,
      imageBase64,
      mimeType || 'image/jpeg',
      context
    );

    res.json(result);
  } catch (err) {
    console.error('Chat image error:', err);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// GET /api/chat/history/:sessionId
chatRoutes.get('/history/:sessionId', (req: Request, res: Response) => {
  try {
    const history = service.getHistory(req.params.sessionId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});
