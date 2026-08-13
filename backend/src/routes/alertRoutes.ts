/**
 * Alert API Routes
 */
import { Router, type Request, type Response } from 'express';
import { getCEHubClient } from '../services/clients/cehubClient';
import { DEFAULT_LOCATION } from '../services/config/constants';

export const alertRoutes = Router();

// GET /api/alerts/active
alertRoutes.get('/active', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;
    const crop = req.query.crop as string;

    const cehub = getCEHubClient();
    const alerts = await cehub.getAlerts(lat, lon, crop);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});
