/**
 * Weather API Routes
 */
import { Router, type Request, type Response } from 'express';
import { getWeatherService } from '../services/weatherService';
import { DEFAULT_LOCATION } from '../services/config/constants';

export const weatherRoutes = Router();
const service = getWeatherService();

// GET /api/weather/current
weatherRoutes.get('/current', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;
    const weather = await service.getFieldWeather(lat, lon);
    res.json(weather);
  } catch (err) {
    console.error('Weather current error:', err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET /api/weather/forecast
weatherRoutes.get('/forecast', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;
    const weather = await service.getFieldWeather(lat, lon);
    res.json({ forecast: weather.forecast, source: weather.source });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

// GET /api/weather/historical
weatherRoutes.get('/historical', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;
    const startDate = (req.query.start as string) || '2025-01-01';
    const endDate = (req.query.end as string) || '2025-12-31';
    const data = await service.getHistorical(lat, lon, startDate, endDate);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// GET /api/weather/anomaly
weatherRoutes.get('/anomaly', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;
    const weather = await service.getFieldWeather(lat, lon);
    res.json(weather.anomaly);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate anomaly' });
  }
});

// GET /api/weather/irrigation-clock
weatherRoutes.get('/irrigation-clock', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string) || DEFAULT_LOCATION.lat;
    const lon = parseFloat(req.query.lon as string) || DEFAULT_LOCATION.lon;
    const clock = await service.getIrrigationClock(lat, lon);
    res.json({ hours: clock });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate irrigation clock' });
  }
});
