/**
 * Weather Service
 * 
 * Merges Meteoblue historical + CE Hub forecast into unified weather intelligence.
 */

import { getMeteoblueClient } from './clients/meteoblueClient';
import { getCEHubClient } from './clients/cehubClient';
import { DEFAULT_LOCATION } from './config/constants';

export class WeatherService {
  private meteoblue = getMeteoblueClient();
  private cehub = getCEHubClient();

  /**
   * Get unified current + forecast weather for a field.
   */
  async getFieldWeather(lat = DEFAULT_LOCATION.lat, lon = DEFAULT_LOCATION.lon) {
    const [forecast, anomaly] = await Promise.all([
      this.cehub.getForecast(lat, lon, 7),
      this.meteoblue.calculateAnomaly(lat, lon, 32, 2, new Date().getMonth() + 1),
    ]);

    const today = forecast.forecastDays?.[0];
    return {
      current: {
        tempC: today?.tempMaxC ? Math.round((today.tempMaxC + today.tempMinC) / 2) : 28,
        tempMaxC: today?.tempMaxC || 32,
        tempMinC: today?.tempMinC || 21,
        humidity: today?.humidity || 64,
        precipitationMm: today?.precipitationMm || 0,
        windSpeedKmh: today?.windSpeedKmh || 12,
        uvIndex: today?.uvIndex || 6,
        condition: today?.condition || 'Partly Cloudy',
      },
      anomaly,
      forecast: forecast.forecastDays || [],
      source: { forecast: 'CE Hub', historical: 'Meteoblue' },
    };
  }

  /**
   * Get historical weather for anomaly comparison.
   */
  async getHistorical(lat: number, lon: number, startDate: string, endDate: string) {
    return this.meteoblue.getHistoricalWeather(lat, lon, startDate, endDate);
  }

  /**
   * Get seasonal baseline for a location.
   */
  async getBaseline(lat: number, lon: number, month: number) {
    return this.meteoblue.getSeasonalBaseline(lat, lon, month);
  }

  /**
   * Generate 24-hour irrigation activity clock.
   */
  async getIrrigationClock(lat: number, lon: number) {
    const weather = await this.getFieldWeather(lat, lon);
    const baseTemp = weather.current.tempC;

    return [
      { hour: 0, label: '12 AM', temp: baseTemp - 10, humidity: 82, heatStress: 'LOW', irrigation: 'NOT_RECOMMENDED', reason: 'Cold ambient air prevents root active uptake.' },
      { hour: 3, label: '3 AM', temp: baseTemp - 12, humidity: 88, heatStress: 'LOW', irrigation: 'NOT_RECOMMENDED', reason: 'High dew point. Dew provides canopy moisture.' },
      { hour: 6, label: '6 AM', temp: baseTemp - 7, humidity: 78, heatStress: 'LOW', irrigation: 'RECOMMENDED', reason: '⭐ OPTIMAL: Minimal evaporation, high stomatal opening.', isPeak: true },
      { hour: 9, label: '9 AM', temp: baseTemp - 2, humidity: 68, heatStress: 'LOW', irrigation: 'OPTIONAL', reason: 'Acceptable until 10:00 AM before surface heat escalates.' },
      { hour: 12, label: '12 PM', temp: baseTemp + 5, humidity: 48, heatStress: 'MEDIUM', irrigation: 'NOT_RECOMMENDED', reason: 'High radiation causes 45% water loss to evaporation.' },
      { hour: 15, label: '3 PM', temp: baseTemp + 8, humidity: 38, heatStress: 'HIGH', irrigation: 'NOT_RECOMMENDED', reason: '⚠️ Peak heat! Water drops scorch foliage under direct sun.' },
      { hour: 18, label: '6 PM', temp: baseTemp + 1, humidity: 58, heatStress: 'MEDIUM', irrigation: 'RECOMMENDED', reason: '⭐ SECONDARY WINDOW: Temperature cooling nicely.', isPeak: true },
      { hour: 21, label: '9 PM', temp: baseTemp - 5, humidity: 74, heatStress: 'LOW', irrigation: 'OPTIONAL', reason: 'Cooler surface. Water absorbs steadily.' },
    ];
  }
}

let _instance: WeatherService | null = null;
export function getWeatherService(): WeatherService {
  if (!_instance) _instance = new WeatherService();
  return _instance;
}
