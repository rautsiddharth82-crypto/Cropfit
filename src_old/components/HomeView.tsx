import React from 'react';
import {
  Sun,
  Droplets,
  CloudRain,
  Wind,
  AlertTriangle,
  ChevronRight,
  Sprout,
  CloudSun,
  Bot,
  BookOpen,
  ArrowUpRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import {
  FarmerProfile,
  WeatherData,
  EarlyWarningAlert,
  CropField,
  AppTab
} from '../types';

interface HomeViewProps {
  profile: FarmerProfile;
  weather: WeatherData;
  alert: EarlyWarningAlert;
  crops: CropField[];
  onNavigate: (tab: AppTab) => void;
  onOpenWhyAlert: () => void;
  onOpenActionAlert: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  weather,
  alert,
  crops,
  onNavigate,
  onOpenWhyAlert,
  onOpenActionAlert,
}) => {
  return (
    <div id="home-view-container" className="space-y-6 pb-24 md:pb-12">
      {/* 1. Large Weather Card (Sky Blue accents) */}
      <div
        id="home-weather-card"
        className="bg-gradient-to-br from-[#9CCFE5]/20 via-white to-[#EAF5EC] rounded-3xl p-5 sm:p-6 border border-[#9CCFE5]/50 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#9CCFE5]/40 text-[#26332A] text-xs font-bold rounded-full uppercase tracking-wider">
              Today's Weather
            </span>
            <span className="text-xs text-[#68736B] font-medium">{profile.location}</span>
          </div>
          <button
            id="btn-weather-view-forecast"
            onClick={() => onNavigate('climate')}
            className="text-xs font-bold text-[#26332A] hover:text-[#56965F] bg-white px-3 py-1.5 rounded-xl border border-[#E6E9E5] shadow-2xs flex items-center gap-1 transition-all"
          >
            <span>View Forecast</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#9CCFE5]/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#9CCFE5]/30 flex items-center justify-center text-4xl shrink-0">
              ☀️
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[#26332A] tracking-tight">
                  {weather.tempC}°C
                </span>
                <span className="text-base font-bold text-[#68736B]">
                  {weather.condition}
                </span>
              </div>
              <p className="text-xs text-[#68736B] font-medium mt-1">
                Favorable morning conditions. High heat expected afternoon.
              </p>
            </div>
          </div>
        </div>

        {/* Weather Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 text-center">
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#E6E9E5]">
            <div className="flex items-center justify-center gap-1 text-[#3B82F6] mb-1">
              <Droplets className="w-4 h-4" />
              <span className="text-xs font-bold text-[#68736B]">Humidity</span>
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#26332A]">
              {weather.humidityPercent}%
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#E6E9E5]">
            <div className="flex items-center justify-center gap-1 text-[#0284C7] mb-1">
              <CloudRain className="w-4 h-4" />
              <span className="text-xs font-bold text-[#68736B]">Rain Chance</span>
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#26332A]">
              {weather.rainChancePercent}%
            </span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#E6E9E5]">
            <div className="flex items-center justify-center gap-1 text-[#6FAF78] mb-1">
              <Wind className="w-4 h-4" />
              <span className="text-xs font-bold text-[#68736B]">Wind</span>
            </div>
            <span className="text-base sm:text-lg font-extrabold text-[#26332A]">
              {weather.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. IMPORTANT CROP ALERT (Soft Orange / Warning) */}
      <div
        id="home-crop-alert-card"
        className="bg-[#F4B66A]/15 border-2 border-[#F4B66A] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F4B66A] flex items-center justify-center text-white shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6 text-[#26332A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#F4B66A] text-[#26332A] text-[11px] font-extrabold rounded-md uppercase tracking-wider">
                  Climate Stress Alert
                </span>
                <span className="text-xs font-bold text-[#E88B8B] bg-white px-2 py-0.5 rounded-md border border-[#E88B8B]">
                  HIGH RISK
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#26332A] mt-1">
                High heat stress risk expected within next 24–48 hours
              </h3>
            </div>
          </div>
        </div>

        {/* Alert Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-[#F4B66A]/40 text-xs">
          <div>
            <span className="text-[#68736B] block">Crop Affected:</span>
            <span className="font-bold text-[#26332A] text-sm">{alert.crop}</span>
          </div>
          <div>
            <span className="text-[#68736B] block">Growth Stage:</span>
            <span className="font-bold text-[#26332A] text-sm">{alert.growthStage}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[#68736B] block">AI Confidence:</span>
            <span className="font-bold text-[#56965F] text-sm">{alert.confidencePercent}% (High)</span>
          </div>
        </div>

        {/* Two Required Alert Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            id="btn-alert-why"
            onClick={onOpenWhyAlert}
            className="w-full py-3 px-4 bg-white hover:bg-[#F8F7EF] text-[#26332A] font-extrabold rounded-2xl border-2 border-[#F4B66A] text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-[#F4B66A]" />
            <span>Why this alert?</span>
          </button>

          <button
            id="btn-alert-view-action"
            onClick={onOpenActionAlert}
            className="w-full py-3 px-4 bg-[#6FAF78] hover:bg-[#56965F] text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>View Action Recommendation</span>
          </button>
        </div>
      </div>

      {/* 3. "WHAT DO YOU WANT TO DO?" Action Cards */}
      <div id="home-action-cards-section" className="space-y-3">
        <h2 className="text-base sm:text-lg font-extrabold text-[#26332A] flex items-center gap-2">
          <span>What do you want to do?</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Check Crop Health */}
          <button
            id="btn-action-check-crop"
            onClick={() => onNavigate('farm')}
            className="bg-white hover:bg-[#EAF5EC] p-3.5 rounded-2xl border border-[#E6E9E5] text-left transition-all group flex flex-col justify-between shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EC] text-[#56965F] flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
              🌱
            </div>
            <div>
              <h3 className="font-extrabold text-[#26332A] text-xs sm:text-sm flex items-center justify-between">
                <span>Crop Health</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#68736B] group-hover:text-[#56965F]" />
              </h3>
              <p className="text-[10px] text-[#68736B] mt-0.5 line-clamp-1">
                Field moisture & status
              </p>
            </div>
          </button>

          {/* Card 2: Soil & Water Test */}
          <button
            id="btn-action-soil-testing"
            onClick={() => onNavigate('testing')}
            className="bg-white hover:bg-[#EAF5EC] p-3.5 rounded-2xl border border-[#E6E9E5] text-left transition-all group flex flex-col justify-between shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EC] text-[#56965F] flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
              🧪
            </div>
            <div>
              <h3 className="font-extrabold text-[#26332A] text-xs sm:text-sm flex items-center justify-between">
                <span>Soil & Water Test</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#68736B] group-hover:text-[#56965F]" />
              </h3>
              <p className="text-[10px] text-[#68736B] mt-0.5 line-clamp-1">
                NPK, pH & Salinity logs
              </p>
            </div>
          </button>

          {/* Card 3: Disease Scanner */}
          <button
            id="btn-action-disease-scanner"
            onClick={() => onNavigate('disease')}
            className="bg-white hover:bg-[#EAF5EC] p-3.5 rounded-2xl border border-[#E6E9E5] text-left transition-all group flex flex-col justify-between shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
              🔍
            </div>
            <div>
              <h3 className="font-extrabold text-[#26332A] text-xs sm:text-sm flex items-center justify-between">
                <span>Disease Scanner</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#68736B] group-hover:text-red-600" />
              </h3>
              <p className="text-[10px] text-[#68736B] mt-0.5 line-clamp-1">
                Photo diagnosis & spray advice
              </p>
            </div>
          </button>

          {/* Card 4: Gov Schemes */}
          <button
            id="btn-action-gov-schemes"
            onClick={() => onNavigate('schemes')}
            className="bg-white hover:bg-[#EAF5EC] p-3.5 rounded-2xl border border-[#E6E9E5] text-left transition-all group flex flex-col justify-between shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EC] text-[#56965F] flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
              🏛️
            </div>
            <div>
              <h3 className="font-extrabold text-[#26332A] text-xs sm:text-sm flex items-center justify-between">
                <span>Gov Subsidies</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#68736B] group-hover:text-[#56965F]" />
              </h3>
              <p className="text-[10px] text-[#68736B] mt-0.5 line-clamp-1">
                Solar, Insurance & Drip schemes
              </p>
            </div>
          </button>

          {/* Card 5: What-If Simulator */}
          <button
            id="btn-action-crop-simulator"
            onClick={() => onNavigate('simulator')}
            className="bg-white hover:bg-[#EAF5EC] p-3.5 rounded-2xl border border-[#E6E9E5] text-left transition-all group flex flex-col justify-between shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EC] text-[#56965F] flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
              🔮
            </div>
            <div>
              <h3 className="font-extrabold text-[#26332A] text-xs sm:text-sm flex items-center justify-between">
                <span>What-If Simulator</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#68736B] group-hover:text-[#56965F]" />
              </h3>
              <p className="text-[10px] text-[#68736B] mt-0.5 line-clamp-1">
                Heatwave & Rain yield engine
              </p>
            </div>
          </button>

          {/* Card 6: Cost to Profit Memory */}
          <button
            id="btn-action-cost-profit"
            onClick={() => onNavigate('financials')}
            className="bg-white hover:bg-[#EAF5EC] p-3.5 rounded-2xl border border-[#E6E9E5] text-left transition-all group flex flex-col justify-between shadow-2xs"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform">
              💰
            </div>
            <div>
              <h3 className="font-extrabold text-[#26332A] text-xs sm:text-sm flex items-center justify-between">
                <span>Profit Memory</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#68736B] group-hover:text-amber-700" />
              </h3>
              <p className="text-[10px] text-[#68736B] mt-0.5 line-clamp-1">
                Ledger & ROI recommendations
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. QUICK CROP SUMMARY */}
      <div id="home-crop-summary-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-[#26332A]">
            Quick Crop Summary
          </h2>
          <button
            id="btn-view-all-crops"
            onClick={() => onNavigate('farm')}
            className="text-xs font-extrabold text-[#56965F] hover:underline flex items-center gap-1"
          >
            <span>View All Crops</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {crops.map((field) => (
            <div
              key={field.id}
              onClick={() => onNavigate('farm')}
              className="bg-white rounded-2xl p-4 border border-[#E6E9E5] hover:border-[#6FAF78] transition-all cursor-pointer shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#68736B]">{field.name}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    field.healthStatus === 'healthy'
                      ? 'bg-[#EAF5EC] text-[#56965F]'
                      : field.healthStatus === 'monitor'
                      ? 'bg-[#F7E7A8] text-[#854D0E]'
                      : 'bg-[#F4B66A]/30 text-[#C2410C]'
                  }`}
                >
                  {field.healthStatus === 'healthy' ? '🟢 Healthy' : '🟡 Monitor'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <h4 className="font-extrabold text-[#26332A] text-base">{field.cropName}</h4>
                <span className="text-xs text-[#68736B] font-semibold">{field.areaAcres} Acres</span>
              </div>

              {/* Health Bar */}
              <div>
                <div className="flex justify-between text-xs text-[#68736B] mb-1">
                  <span>Field Health</span>
                  <span className="font-bold text-[#26332A]">{field.healthPercent}%</span>
                </div>
                <div className="w-full bg-[#E6E9E5] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      field.healthPercent >= 70
                        ? 'bg-[#6FAF78]'
                        : field.healthPercent >= 55
                        ? 'bg-[#F4B66A]'
                        : 'bg-[#E88B8B]'
                    }`}
                    style={{ width: `${field.healthPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
