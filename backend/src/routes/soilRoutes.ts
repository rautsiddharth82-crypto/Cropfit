/**
 * Soil Analysis API Routes
 */
import { Router, type Request, type Response } from 'express';
import { calculateSoilHealth } from '../services/algorithms/soilHealthScorer';
import { recommendCrops } from '../services/algorithms/cropRecommendationEngine';
import { getGeminiClient } from '../services/clients/geminiClient';

export const soilRoutes = Router();

// POST /api/soil/analyze
soilRoutes.post('/analyze', (req: Request, res: Response) => {
  try {
    const result = calculateSoilHealth(req.body);
    res.json(result);
  } catch (err) {
    console.error('Soil analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze soil' });
  }
});

// POST /api/soil/crop-recommendations
soilRoutes.post('/crop-recommendations', (req: Request, res: Response) => {
  try {
    const result = recommendCrops(req.body);
    res.json({ crops: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate crop recommendations' });
  }
});

// POST /api/soil/report/parse
soilRoutes.post('/report/parse', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Image data is required' });

    const gemini = getGeminiClient();
    const parsed = await gemini.parseSoilReport(imageBase64, mimeType || 'image/jpeg');

    // Also calculate health score if values are available
    const healthResult = calculateSoilHealth({
      pH: parsed.pH as number,
      organicCarbon: parsed.organicCarbon as number,
      nitrogen: parsed.nitrogen as number,
      phosphorus: parsed.phosphorus as number,
      potassium: parsed.potassium as number,
      zinc: parsed.zinc as number,
      iron: parsed.iron as number,
      sulfur: parsed.sulfur as number,
    });

    res.json({ parsed, health: healthResult });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse soil report' });
  }
});
