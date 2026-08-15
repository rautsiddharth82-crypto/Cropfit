import React, { useState } from 'react';
import {
  WeatherData,
  ClockHourData,
  ForecastDay
} from '../types';
import {
  Sun,
  CloudSun,
  CloudRain,
  Droplets,
  Wind,
  Clock,
  Thermometer,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Cloud,
  Compass,
  Moon,
  Sunset,
  Sunrise,
  ArrowUpRight,
  Zap,
  Waves,
  ChevronRight
} from 'lucide-react';
import { WeatherAnimatedBackground, WeatherAnimationType } from './WeatherAnimatedBackground';
import { WeatherClockDial } from './WeatherClockDial';
import { useLanguage } from '../i18n/translations';

interface ClimateViewProps {
  weather: WeatherData;
  clockHours: ClockHourData[];
  forecast: ForecastDay[];
  onOpenEarlyWarning: () => void;
}

export const ClimateView: React.FC<ClimateViewProps> = ({
  weather,
  clockHours,
  forecast,
  onOpenEarlyWarning,
}) => {
  const { t, language } = useLanguage();
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(2); // Default 6 AM (Best Irrigation Window)
  const [climateAnim, setClimateAnim] = useState<WeatherAnimationType>('auto');

  const currentClock = clockHours[selectedHourIndex] || clockHours[2] || {
    hourLabel: '6 AM',
    displayTime: '6:00 AM (Dawn)',
    tempC: 21,
    humidityPercent: 78,
    rainChancePercent: 20,
    heatStress: 'LOW',
    irrigationStatus: 'RECOMMENDED',
    irrigationMessage: 'OPTIMAL IRRIGATION WINDOW. Minimal evaporation, high stomatal opening.',
    fieldActivity: 'Ideal for Irrigation & Field Inspection',
    isPeakIrrigationWindow: true,
    emoji: '🌅',
    condition: 'Dawn Glow'
  };

  return (
    <div id="climate-view-container" className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Live Atmospheric Weather Banner */}
      <div
        id="climate-live-banner"
        className="rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-emerald-600/40 min-h-[200px]"
      >
        <WeatherAnimatedBackground
          condition={weather.condition}
          rainChance={weather.rainChancePercent}
          tempC={weather.tempC}
          windSpeed={weather.windSpeedKmh}
          overrideType={climateAnim}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-black rounded-full uppercase tracking-wider border border-white/20 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                <span>{language === 'hi' ? 'लाइव सैटेलाइट सूक्ष्म-मौसम रडार' : language === 'pa' ? 'ਲਾਈਵ ਸੈਟੇਲਾਈਟ ਮੌਸਮ ਰਡਾਰ' : 'Live Satellite Micro-Climate Radar'}</span>
              </span>
              <span className="text-xs text-emerald-100 font-extrabold">{language === 'hi' ? 'राजपुरा / कोटा कृषि मौसम केंद्र' : 'Rajpura / Kota Agronomy Station'}</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">
                30°C
              </h2>
              <span className="text-xl">🌧️</span>
              <span className="text-base sm:text-lg font-bold text-white/90">
                {language === 'hi' ? 'वर्षा • महसूस: 37°C' : language === 'pa' ? 'ਮੀਂਹ • ਮਹਿਸੂਸ: 37°C' : 'Rain • Feels like 37°C'}
              </span>
            </div>

            {/* Lightning Watch pill */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/90 text-slate-950 text-xs font-black rounded-full shadow-md backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>{language === 'hi' ? 'बिजली व गरज-चमक का येलो अलर्ट' : language === 'pa' ? 'ਬਿਜਲੀ ਤੇ ਗਰਜ ਦਾ ਯੈਲੋ ਅਲਰਟ' : 'Yellow Watch for Lightning & Thundershowers'}</span>
              </span>
              <span className="text-xs text-white/90 font-bold hidden sm:inline">
                {language === 'hi' ? 'दोपहर 2:00 बजे बारिश की 70% संभावना' : 'Rain likely around 2:00 PM (70%)'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {/* Quick Sky Animation Selector */}
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
              <span className="text-[10px] font-black text-emerald-200 uppercase px-1.5">{language === 'hi' ? 'दृश्य:' : 'Anim:'}</span>
              <button
                onClick={() => setClimateAnim('auto')}
                className={`px-2 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                  climateAnim === 'auto'
                    ? 'bg-emerald-400 text-slate-950 font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {language === 'hi' ? 'ऑटो' : 'Auto'}
              </button>
              <button
                onClick={() => setClimateAnim('clouds')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                  climateAnim === 'clouds'
                    ? 'bg-emerald-400 text-slate-950 font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बादल' : 'Clouds'}</span>
              </button>
              <button
                onClick={() => setClimateAnim('rain')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                  climateAnim === 'rain'
                    ? 'bg-sky-400 text-slate-950 font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बारिश' : 'Rain'}</span>
              </button>
              <button
                onClick={() => setClimateAnim('wind')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                  climateAnim === 'wind'
                    ? 'bg-teal-300 text-slate-950 font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'हवा' : 'Wind'}</span>
              </button>
            </div>

            <button
              id="btn-open-early-warning-modal"
              onClick={onOpenEarlyWarning}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer shrink-0"
            >
              <AlertTriangle className="w-4 h-4 text-slate-950" />
              <span>{language === 'hi' ? 'जलवायु तनाव चेतावनी' : 'Climate Stress Alert'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FLASH FLOOD RISK BANNER */}
      <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-amber-300/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
            <Waves className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">
                {language === 'hi' ? 'अचानक तेज बारिश व जलभराव का जोखिम' : 'Flash flood & Waterlogging Risk'}
              </span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full uppercase">
                {language === 'hi' ? 'राजपुरा / स्थानीय क्षेत्र' : 'Local Region'}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'hi' ? 'दोपहर 2:00 बजे से 4:00 बजे के बीच तेज बारिश की संभावना। खेतों की निकासी नालियां खुली रखें।' : 'Heavy precipitation expected between 2:00 PM – 4:00 PM. Keep drainage channels open.'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenEarlyWarning}
          className="text-xs font-black text-amber-900 hover:text-amber-950 flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-xl bg-white border border-amber-200 shadow-2xs cursor-pointer hover:bg-amber-50 transition-all"
        >
          <span>{language === 'hi' ? 'प्रोटोकॉल देखें' : 'View Protocol'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 24-HOUR RADIAL AGRONOMY CLOCK MATCHING THE SPECIFICATION */}
      <div id="clockwise-climate-view-card" className="space-y-6">
        <WeatherClockDial
          clockHours={clockHours}
          weather={weather}
          locationName="Kota"
          onHourSelect={(hour) => {
            const idx = clockHours.findIndex(c => c.hourLabel === hour.hourLabel);
            if (idx !== -1) setSelectedHourIndex(idx);
          }}
        />

        {/* HOURLY WEATHER TIMELINE & TEMPERATURE CURVE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>24-Hour Continuous Timeline Strip</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Tap any time block below to synchronize the dial and view micro-climate telemetry.
              </p>
            </div>
            <span className="text-xs text-emerald-800 font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Selected: {currentClock.hourLabel} • {currentClock.tempC}°C
            </span>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-4 overflow-x-auto shadow-inner">
            <div className="min-w-[720px] flex items-center justify-between gap-3 py-2">
              {clockHours.map((ch, idx) => {
                const isSelected = selectedHourIndex === idx;
                return (
                  <button
                    key={ch.hourLabel}
                    type="button"
                    onClick={() => setSelectedHourIndex(idx)}
                    className={`flex flex-col items-center flex-1 py-2.5 px-2 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/30 ring-2 ring-sky-400 scale-105 shadow-lg'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {/* Temperature */}
                    <span className="text-sm font-black text-white">{ch.tempC}°</span>

                    {/* Rain percentage */}
                    <div className="h-5 flex items-center justify-center my-0.5">
                      {ch.rainChancePercent > 15 ? (
                        <span className="text-[10px] font-black text-sky-400">
                          {ch.rainChancePercent}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">-</span>
                      )}
                    </div>

                    {/* Weather Emoji */}
                    <span className="text-xl my-1 drop-shadow-sm">{ch.emoji || '⛅'}</span>

                    {/* Time Label */}
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-sky-300 font-black' : 'text-slate-300'}`}>
                      {ch.hourLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Gradient progress line indicator */}
            <div className="relative h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 rounded-full transition-all duration-300"
                style={{
                  left: `${(selectedHourIndex / (clockHours.length - 1)) * 85}%`,
                  width: '15%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5-DAY WEATHER FORECAST CARDS WITH EMOJIS (From Image 1 & 2) */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span>5-Day Farm Weather Outlook</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {forecast.map((day, idx) => {
            const emojiIcon = day.condition.toLowerCase().includes('lightning') || day.condition.toLowerCase().includes('thunder')
              ? '⛈️'
              : day.condition.toLowerCase().includes('rain')
              ? '🌧️'
              : day.condition.toLowerCase().includes('cloud')
              ? '⛅'
              : '☀️';

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs text-center space-y-2 hover:border-emerald-300 transition-all hover:shadow-md cursor-pointer"
              >
                <p className="text-xs font-black text-slate-700">{day.dayName}</p>
                <p className="text-[11px] text-slate-400">{day.date}</p>
                <div className="text-3xl py-1">
                  {emojiIcon}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs font-black">
                  <span className="text-slate-900">{day.tempHighC || (day as any).highC}°</span>
                  <span className="text-slate-400 font-normal">{day.tempLowC || (day as any).lowC}°</span>
                </div>
                <p className="text-[10px] text-sky-700 font-bold flex items-center justify-center gap-1">
                  <span>💧</span>
                  <span>{day.rainChancePercent}% Rain</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
