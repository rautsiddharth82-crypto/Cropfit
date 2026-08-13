/**
 * Crop Passport API Routes - Async
 */
import { Router, type Request, type Response } from 'express';
import { getCropPassportService } from '../services/cropPassportService';

export const passportRoutes = Router();
const service = getCropPassportService();

// POST /api/passport/create
passportRoutes.post('/create', async (req: Request, res: Response) => {
  try {
    const passport = await service.createPassport(req.body);
    res.status(201).json(passport);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create crop passport' });
  }
});

// GET /api/passport/:cropId
passportRoutes.get('/:cropId', async (req: Request, res: Response) => {
  try {
    const passport = await service.getPassport(req.params.cropId);
    if (!passport) return res.status(404).json({ error: 'Passport not found' });
    res.json(passport);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passport' });
  }
});

// GET /api/passport/:cropId/qr
passportRoutes.get('/:cropId/qr', async (req: Request, res: Response) => {
  try {
    const qr = await service.getQRData(req.params.cropId);
    if (!qr) return res.status(404).json({ error: 'Passport not found' });
    res.json(qr);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR data' });
  }
});

// POST /api/passport/:cropId/event
passportRoutes.post('/:cropId/event', async (req: Request, res: Response) => {
  try {
    const updated = await service.addEvent(req.params.cropId, req.body);
    if (!updated) return res.status(404).json({ error: 'Passport not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add event' });
  }
});

// PUT /api/passport/:cropId/stage
passportRoutes.put('/:cropId/stage', async (req: Request, res: Response) => {
  try {
    const { stage, riskLevel } = req.body;
    const updated = await service.updateGrowthStage(req.params.cropId, stage, riskLevel);
    if (!updated) return res.status(404).json({ error: 'Passport not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

// POST /api/passport/:cropId/harvest
passportRoutes.post('/:cropId/harvest', async (req: Request, res: Response) => {
  try {
    const { yieldQuintals, sellingPricePerQuintal } = req.body;
    const updated = await service.recordHarvest(req.params.cropId, yieldQuintals, sellingPricePerQuintal);
    if (!updated) return res.status(404).json({ error: 'Passport not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record harvest' });
  }
});

// GET /api/passport/farmer/:farmerName
passportRoutes.get('/farmer/:farmerName', async (req: Request, res: Response) => {
  try {
    const passports = await service.getPassportsByFarmer(req.params.farmerName);
    res.json({ passports, count: passports.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch farmer passports' });
  }
});
