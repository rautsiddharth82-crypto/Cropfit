/**
 * Disease Diagnosis API Routes
 */
import { Router, type Request, type Response } from 'express';
import { getGeminiClient } from '../services/clients/geminiClient';
import { getCEHubClient } from '../services/clients/cehubClient';
import { checkSafetyGate, generateSafetyDisclaimer } from '../services/algorithms/safetyGate';
import { DEFAULT_LOCATION, type SupportedCrop } from '../services/config/constants';

export const diseaseRoutes = Router();

// POST /api/disease/diagnose — Image-based diagnosis
diseaseRoutes.post('/diagnose', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, cropName, growthStage, location } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'Image data is required' });

    const gemini = getGeminiClient();
    const analysis = await gemini.analyzeCropImage(imageBase64, mimeType || 'image/jpeg', {
      farmerName: 'Farmer',
      location: location || DEFAULT_LOCATION.name,
      cropName: cropName || 'Wheat',
      fieldName: 'Field',
      growthStage: growthStage || 'Flowering',
    });

    // Safety gate check
    const gate = checkSafetyGate({
      confidence: analysis.overallConfidence * 100,
      riskLevel: 30,
      evidenceSources: ['Gemini Vision'],
      agreementRatio: 0.7,
      recommendationType: 'disease_treatment',
      hasImageEvidence: true,
    });

    res.json({
      analysis,
      safetyGate: gate,
      disclaimer: generateSafetyDisclaimer(gate),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to diagnose disease' });
  }
});

// GET /api/disease/risk — Weather-driven disease risk
diseaseRoutes.get('/risk', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;
    const crop = (req.query.crop as string) || 'wheat';
    const stage = req.query.stage as string;

    const cehub = getCEHubClient();
    const risk = await cehub.getDiseaseRisk(lat, lon, crop, stage);
    res.json(risk);
  } catch (err) {
    res.status(500).json({ error: 'Failed to assess disease risk' });
  }
});
