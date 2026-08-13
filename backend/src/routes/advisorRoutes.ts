/**
 * Bio Product Advisor API Routes (PS-03)
 */
import { Router, type Request, type Response } from 'express';
import { getCEHubClient } from '../services/clients/cehubClient';
import { checkSafetyGate, generateSafetyDisclaimer } from '../services/algorithms/safetyGate';
import { DEFAULT_LOCATION } from '../services/config/constants';

export const advisorRoutes = Router();

// POST /api/advisor/recommend
advisorRoutes.post('/recommend', async (req: Request, res: Response) => {
  try {
    const { crop, growthStage, symptom, confidence, evidenceSources } = req.body;

    // Safety gate check first
    const gate = checkSafetyGate({
      confidence: confidence || 50,
      riskLevel: 30,
      evidenceSources: evidenceSources || ['farmer_description'],
      agreementRatio: 0.6,
      recommendationType: 'biological',
      hasImageEvidence: !!req.body.hasImage,
      hasFarmerHistory: !!req.body.cropAge,
    });

    if (!gate.approved) {
      return res.json({
        recommendation: null,
        safetyGate: gate,
        disclaimer: generateSafetyDisclaimer(gate),
        message: gate.warningMessage,
      });
    }

    // Get CE Hub agronomic recommendation
    const cehub = getCEHubClient();
    const recommendations = await cehub.getAgronomicRecommendations(
      crop || 'wheat',
      growthStage || 'flowering',
      DEFAULT_LOCATION.lat,
      DEFAULT_LOCATION.lon
    );

    res.json({
      recommendations,
      safetyGate: gate,
      disclaimer: generateSafetyDisclaimer(gate),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate recommendation' });
  }
});

// GET /api/advisor/agronomic
advisorRoutes.get('/agronomic', async (req: Request, res: Response) => {
  try {
    const crop = (req.query.crop as string) || 'wheat';
    const stage = (req.query.stage as string) || 'flowering';
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;

    const cehub = getCEHubClient();
    const recs = await cehub.getAgronomicRecommendations(crop, stage, lat, lon);
    res.json({ recommendations: recs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch agronomic recommendations' });
  }
});
