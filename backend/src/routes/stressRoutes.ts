/**
 * Climate Stress API Routes (PS-02)
 */
import { Router, type Request, type Response } from 'express';
import { getClimateStressService } from '../services/climateStressService';
import { DEFAULT_LOCATION, type SupportedCrop } from '../services/config/constants';

export const stressRoutes = Router();
const service = getClimateStressService();

// GET /api/stress/composite
stressRoutes.get('/composite', async (req: Request, res: Response) => {
  try {
    const fieldId = (req.query.fieldId as string) || 'field-1';
    const crop = (req.query.crop as SupportedCrop) || 'wheat';
    const daysSinceSowing = parseInt(req.query.days as string) || 85;
    const soilMoisture = parseFloat(req.query.moisture as string) || 38;
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;

    const result = await service.getCompositeStress(fieldId, crop, daysSinceSowing, soilMoisture, lat, lon);
    res.json(result);
  } catch (err) {
    console.error('Composite stress error:', err);
    res.status(500).json({ error: 'Failed to calculate composite stress' });
  }
});

// GET /api/stress/heat
stressRoutes.get('/heat', async (req: Request, res: Response) => {
  try {
    const crop = (req.query.crop as SupportedCrop) || 'wheat';
    const daysSinceSowing = parseInt(req.query.days as string) || 85;
    const soilMoisture = parseFloat(req.query.moisture as string) || 38;
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;

    const result = await service.getHeatStressForecast(crop, daysSinceSowing, soilMoisture, lat, lon);
    res.json({ forecast: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate heat stress' });
  }
});

// POST /api/stress/alerts/generate
stressRoutes.post('/alerts/generate', async (req: Request, res: Response) => {
  try {
    const { fieldId, crop, daysSinceSowing, soilMoisture, lat, lon } = req.body;
    const result = await service.getCompositeStress(
      fieldId || 'field-1',
      crop || 'wheat',
      daysSinceSowing || 85,
      soilMoisture || 38,
      lat || DEFAULT_LOCATION.lat,
      lon || DEFAULT_LOCATION.lon
    );

    res.json({
      alert: result.topAlert,
      overallRisk: result.overallRiskLevel,
      overallScore: result.overallScore,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate alerts' });
  }
});
