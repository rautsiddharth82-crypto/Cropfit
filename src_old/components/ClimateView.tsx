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
  Sparkles
} from 'lucide-react';

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
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(2); // Default to 6 AM (Index 2 - Peak Irrigation Window)

  const currentClock = clockHours[selectedHourIndex] || clockHours[2];

  return (
    <div id="climate-view-container" className="space-y-6 pb-24 md:pb-12">
      {/* Header & Quick Climate Alert Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#9CCFE5]/30 text-[#0284C7] text-xs font-bold rounded-full">
              🌦️ Climate Intelligence
            </span>
            <span className="text-xs text-[#68736B]">Rajpura Station</span>
          </div>
          <h2 className="text-2xl font-black text-[#26332A] mt-1">Weather & Climate Dashboard</h2>
        </div>

        <button
          id="btn-open-early-warning-modal"
          onClick={onOpenEarlyWarning}
          className="px-4 py-2.5 bg-[#F4B66A] hover:bg-[#f2a850] text-[#26332A] font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <AlertTriangle className="w-4 h-4 text-[#26332A]" />
          <span>View Climate Stress Early Warning</span>
        </button>
      </div>

      {/* SIGNATURE FEATURE: 24-HOUR CLOCKWISE CLIMATE VIEW */}
      <div
        id="clockwise-climate-view-card"
        className="bg-gradient-to-br from-white via-[#F8F7EF] to-[#9CCFE5]/10 rounded-3xl p-5 sm:p-6 border-2 border-[#9CCFE5] shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E9E5]">
          <div>
            <span className="text-xs font-extrabold text-[#0284C7] tracking-wider uppercase bg-[#9CCFE5]/30 px-3 py-1 rounded-full">
              Signature Feature
            </span>
            <h3 className="text-xl font-black text-[#26332A] mt-1.5 flex items-center gap-2">
              <span>24-Hour Clockwise Climate View</span>
              <RotateCw className="w-5 h-5 text-[#6FAF78]" />
            </h3>
            <p className="text-xs text-[#68736B]">
              Tap or drag hours around the clock dial to simulate micro-climate changes
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-[#E6E9E5] text-xs font-bold text-[#56965F]">
            <Sparkles className="w-4 h-4 text-[#6FAF78]" />
            <span>Best Irrigation Window: 6:00 AM – 8:00 AM</span>
          </div>
        </div>

        {/* Circular Clock Dial Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Dial Graphic / Interactive Hours */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-[#9CCFE5]/60 bg-white shadow-inner flex items-center justify-center">
              {/* Dial Center Info */}
              <div className="text-center p-4 rounded-full bg-[#F8F7EF] border-2 border-[#9CCFE5] w-36 h-36 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xs font-bold text-[#68736B]">{currentClock.hourLabel}</span>
                <span className="text-2xl font-black text-[#26332A] leading-none my-1">
                  {currentClock.tempC}°C
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    currentClock.irrigationStatus === 'RECOMMENDED'
                      ? 'bg-[#EAF5EC] text-[#56965F]'
                      : currentClock.irrigationStatus === 'OPTIONAL'
                      ? 'bg-[#F7E7A8] text-[#854D0E]'
                      : 'bg-[#E88B8B] text-white'
                  }`}
                >
                  {currentClock.irrigationStatus.replace('_', ' ')}
                </span>
              </div>

              {/* 8 Clock Nodes along perimeter */}
              {clockHours.map((ch, idx) => {
                // Calculate position on circle
                const total = clockHours.length;
                const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                const radius = 108; // px from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                const isSelected = selectedHourIndex === idx;

                return (
                  <button
                    key={ch.hourLabel}
                    id={`btn-clock-hour-${idx}`}
                    onClick={() => setSelectedHourIndex(idx)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute w-11 h-11 rounded-full font-bold text-xs flex items-center justify-center transition-all duration-200 shadow-xs ${
                      isSelected
                        ? 'bg-[#6FAF78] text-white ring-4 ring-[#6FAF78]/30 scale-125 z-10'
                        : ch.isPeakIrrigationWindow
                        ? 'bg-[#9CCFE5] text-[#26332A] hover:scale-110'
                        : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:bg-[#F8F7EF]'
                    }`}
                    title={`${ch.hourLabel}: ${ch.tempC}°C`}
                  >
                    <span>{ch.hourLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Hour Selector Buttons Row for accessibility */}
            <div className="flex items-center gap-1.5 mt-6 flex-wrap justify-center">
              {clockHours.map((ch, idx) => (
                <button
                  key={ch.hourLabel}
                  onClick={() => setSelectedHourIndex(idx)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                    selectedHourIndex === idx
                      ? 'bg-[#6FAF78] text-white shadow-2xs'
                      : 'bg-white text-[#68736B] border border-[#E6E9E5]'
                  }`}
                >
                  {ch.hourLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Hour Details Display */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#E6E9E5] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
              <div>
                <span className="text-xs text-[#68736B]">Simulated Time Window:</span>
                <h4 className="text-lg font-black text-[#26332A]">{currentClock.displayTime}</h4>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-extrabold ${
                  currentClock.heatStress === 'HIGH'
                    ? 'bg-[#E88B8B] text-white'
                    : currentClock.heatStress === 'MEDIUM'
                    ? 'bg-[#F4B66A] text-[#26332A]'
                    : 'bg-[#EAF5EC] text-[#56965F]'
                }`}
              >
                Heat Stress: {currentClock.heatStress}
              </span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E6E9E5]">
                <span className="text-xs text-[#68736B] block">Temperature</span>
                <span className="text-lg font-black text-[#26332A]">{currentClock.tempC}°C</span>
              </div>
              <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E6E9E5]">
                <span className="text-xs text-[#68736B] block">Humidity</span>
                <span className="text-lg font-black text-[#26332A]">{currentClock.humidityPercent}%</span>
              </div>
              <div className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E6E9E5]">
                <span className="text-xs text-[#68736B] block">Rain Chance</span>
                <span className="text-lg font-black text-[#26332A]">{currentClock.rainChancePercent}%</span>
              </div>
            </div>

            {/* Irrigation & Field Activity Guidance */}
            <div className="p-4 rounded-xl bg-[#EAF5EC] border border-[#A8D5A2] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#56965F] text-sm">
                <Droplets className="w-4 h-4" />
                <span>Irrigation Status: {currentClock.irrigationStatus.replace('_', ' ')}</span>
              </div>
              <p className="text-xs text-[#26332A] font-medium leading-relaxed">
                {currentClock.irrigationMessage}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F7EF] border border-[#E6E9E5] text-xs text-[#26332A]">
              <span className="font-bold text-[#68736B] block mb-0.5">Field Activity Suitability:</span>
              <span>{currentClock.fieldActivity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Forecast (5 Days) */}
      <div id="weather-forecast-section" className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs space-y-4">
        <h3 className="text-lg font-extrabold text-[#26332A]">5-Day Weather Forecast</h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5] text-center space-y-2 hover:border-[#6FAF78] transition-all"
            >
              <span className="text-xs font-bold text-[#68736B] block">{day.dayName}</span>
              <span className="text-[11px] text-[#A3A3A3] block">{day.date}</span>

              <div className="text-2xl my-1">
                {day.iconName === 'sun' ? '☀️' : day.iconName === 'cloud-sun' ? '⛅' : day.iconName === 'cloud-rain' ? '⛈️' : '🌧️'}
              </div>

              <div className="font-extrabold text-[#26332A] text-sm">
                {day.tempHighC}° / {day.tempLowC}°
              </div>

              <span className="text-[11px] text-[#0284C7] font-semibold block">
                {day.rainChancePercent}% Rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Climate Risk Dashboard Cards */}
      <div id="climate-risk-summary-section" className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs space-y-4">
        <h3 className="text-lg font-extrabold text-[#26332A]">Climate Risk Summary</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-[#F4B66A]/20 border border-[#F4B66A] rounded-2xl text-center">
            <span className="text-xs text-[#68736B] font-bold block mb-1">Heat Stress</span>
            <span className="text-base font-extrabold text-[#C2410C]">🟠 Medium</span>
          </div>

          <div className="p-4 bg-[#F7E7A8]/40 border border-[#F7E7A8] rounded-2xl text-center">
            <span className="text-xs text-[#68736B] font-bold block mb-1">Water Stress</span>
            <span className="text-base font-extrabold text-[#854D0E]">🟡 Watch</span>
          </div>

          <div className="p-4 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl text-center">
            <span className="text-xs text-[#68736B] font-bold block mb-1">Heavy Rain</span>
            <span className="text-base font-extrabold text-[#56965F]">🟢 Low</span>
          </div>

          <div className="p-4 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl text-center">
            <span className="text-xs text-[#68736B] font-bold block mb-1">Drought Risk</span>
            <span className="text-base font-extrabold text-[#56965F]">🟢 Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};
