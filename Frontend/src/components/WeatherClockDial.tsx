import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ClockHourData,
  WeatherData
} from '../types';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  Cloud,
  Moon,
  Sunset,
  Sunrise,
  Sparkles,
  Droplets,
  Wind,
  Thermometer,
  Zap,
  RotateCw,
  Compass,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MapPin,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export type ClockAtmosphereTheme = 'rain' | 'sunrise' | 'day' | 'sunset' | 'night' | 'auto';

interface WeatherClockDialProps {
  clockHours: ClockHourData[];
  weather?: WeatherData;
  locationName?: string;
  onHourSelect?: (hour: ClockHourData) => void;
  className?: string;
}

export const WeatherClockDial: React.FC<WeatherClockDialProps> = ({
  clockHours,
  weather,
  locationName = 'Kota',
  onHourSelect,
  className = '',
}) => {
  // We have 24 hours (0 = 12 AM, 12 = 12 PM)
  // Default to 12 PM (index 12) which matches the primary rain / stormy showcase in the user screenshot
  const [selectedHour24, setSelectedHour24] = useState<number>(12);
  const [themeMode, setThemeMode] = useState<ClockAtmosphereTheme>('auto');
  const [isLiveClock, setIsLiveClock] = useState<boolean>(false);
  const [liveDate, setLiveDate] = useState<Date>(new Date());
  const [cycleMode, setCycleMode] = useState<'PM' | 'AM'>('PM');
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep live time ticking if live clock is active
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update selected hour when live mode is toggled
  useEffect(() => {
    if (isLiveClock) {
      const currentHour = liveDate.getHours();
      setSelectedHour24(currentHour);
      setCycleMode(currentHour >= 12 ? 'PM' : 'AM');
    }
  }, [isLiveClock, liveDate]);

  // Current selected data
  const currentHourData = useMemo(() => {
    return clockHours[selectedHour24] || clockHours[12] || {
      hourLabel: '12 PM',
      displayTime: '12:07 PM',
      tempC: 30,
      humidityPercent: 48,
      rainChancePercent: 65,
      heatStress: 'MEDIUM',
      irrigationStatus: 'NOT_RECOMMENDED',
      irrigationMessage: 'Solar peak; rain clouds gathering over Kota basin.',
      fieldActivity: 'Indoor Machinery Maintenance',
      emoji: '🌧️',
      condition: 'Rain'
    };
  }, [clockHours, selectedHour24]);

  // Notify parent on hour select
  useEffect(() => {
    if (onHourSelect) {
      onHourSelect(currentHourData);
    }
  }, [currentHourData, onHourSelect]);

  const activeAtmosphere: 'rain' | 'sunrise' | 'day' | 'sunset' | 'night' = useMemo(() => {
    if (themeMode !== 'auto') {
      return themeMode;
    }
    
    const cond = currentHourData.condition?.toLowerCase() || '';
    const emoji = currentHourData.emoji || '';

    // Check for rain or stormy conditions first
    if (cond.includes('rain') || cond.includes('storm') || cond.includes('shower') || emoji.includes('🌧️') || emoji.includes('⛈️') || emoji.includes('☔')) {
      return 'rain';
    }
    // Check for sunrise / dawn glow
    if (cond.includes('sunrise') || cond.includes('dawn') || emoji.includes('🌅')) {
      return 'sunrise';
    }
    // Check for sunset / dusk glow
    if (cond.includes('sunset') || cond.includes('dusk') || emoji.includes('🌇')) {
      return 'sunset';
    }
    // Check for night conditions
    if (cond.includes('night') || cond.includes('midnight') || emoji.includes('🌃') || emoji.includes('🌙') || emoji.includes('🌙')) {
      return 'night';
    }
    
    // Auto-derive from selected hour as fallback
    if (selectedHour24 >= 22 || selectedHour24 < 5) return 'night'; // 10 PM - 4 AM
    if (selectedHour24 >= 5 && selectedHour24 < 9) return 'sunrise'; // 5 AM - 8 AM
    if (selectedHour24 >= 9 && selectedHour24 < 17) {
      if (currentHourData.rainChancePercent >= 50) {
        return 'rain';
      }
      return 'day';
    }
    if (selectedHour24 >= 17 && selectedHour24 < 22) return 'sunset'; // 5 PM - 9 PM
    return 'day';
  }, [themeMode, selectedHour24, currentHourData]);

  // 12-hour slice for the clock face based on PM or AM
  // If cycleMode is PM, indices 12..23 (12 PM to 11 PM)
  // If cycleMode is AM, indices 0..11 (12 AM to 11 AM)
  const displayedHours12 = useMemo(() => {
    const startIdx = cycleMode === 'PM' ? 12 : 0;
    return clockHours.slice(startIdx, startIdx + 12);
  }, [clockHours, cycleMode]);

  // Formatted digital time string
  const displayDigitalTime = useMemo(() => {
    if (isLiveClock) {
      const hours = liveDate.getHours() % 12 || 12;
      const mins = liveDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${mins}`;
    }
    // Static / scrubbed time representation
    if (activeAtmosphere === 'rain' && selectedHour24 === 12) return '12:07';
    if (activeAtmosphere === 'sunrise' && (selectedHour24 === 7 || selectedHour24 === 6)) return '07:30';
    if (activeAtmosphere === 'day' && selectedHour24 === 14) return '02:45';
    if (activeAtmosphere === 'sunset' && selectedHour24 === 18) return '06:15';
    if (activeAtmosphere === 'night' && (selectedHour24 === 0 || selectedHour24 === 23)) return '12:00';

    const hour12 = selectedHour24 % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:00`;
  }, [isLiveClock, liveDate, selectedHour24, activeAtmosphere]);

  const displayAmPm = useMemo(() => {
    if (isLiveClock) {
      return liveDate.getHours() >= 12 ? 'PM' : 'AM';
    }
    return selectedHour24 >= 12 ? 'PM' : 'AM';
  }, [isLiveClock, liveDate, selectedHour24]);

  // Selected hour's relative 12-hour index (0 to 11, where 0 is 12 o'clock, 1 is 1 o'clock, etc.)
  const active12HourIndex = selectedHour24 % 12;

  // Calculate arc angle in degrees for SVG glowing progress ring (0° is top / 12 o'clock)
  const activeAngleDeg = active12HourIndex * 30; // 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330

  // Drag / Click handler to rotate clock dial
  const handleDialPointer = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Angle in degrees from top (12 o'clock is 0°)
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;

    // Snap to nearest 30 deg (12 segments)
    const hour12 = Math.round(deg / 30) % 12;
    const targetHour24 = cycleMode === 'PM' ? hour12 + 12 : hour12;
    setSelectedHour24(targetHour24);
    setIsLiveClock(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDialPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleDialPointer(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Weather icon component renderer with high visual fidelity
  const renderWeatherIcon = (condition: string = '', rainChance: number = 0, isNight: boolean = false, className: string = 'w-6 h-6') => {
    const c = condition.toLowerCase();
    if (c.includes('lightning') || c.includes('thunder') || (rainChance >= 70 && c.includes('storm'))) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <CloudLightning className={`${className} text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]`} />
        </div>
      );
    }
    if (c.includes('rain') || rainChance >= 40) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <CloudRain className={`${className} text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]`} />
        </div>
      );
    }
    if (c.includes('sunset') || c.includes('dusk')) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <Sunset className={`${className} text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]`} />
        </div>
      );
    }
    if (c.includes('sunrise') || c.includes('dawn')) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <Sunrise className={`${className} text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]`} />
        </div>
      );
    }
    if (isNight || c.includes('night') || c.includes('moon')) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <Moon className={`${className} text-slate-100 fill-slate-100/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`} />
        </div>
      );
    }
    if (c.includes('cloud') || c.includes('overcast')) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <Cloud className={`${className} text-slate-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]`} />
        </div>
      );
    }
    if (c.includes('partly') || c.includes('scattered')) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <CloudSun className={`${className} text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.7)]`} />
        </div>
      );
    }
    return (
      <div className="relative inline-flex items-center justify-center">
        <Sun className={`${className} text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] animate-pulse`} />
      </div>
    );
  };

  // Atmospheric background styles corresponding precisely to the 5 showcase screens in user image
  const getThemeStyles = () => {
    switch (activeAtmosphere) {
      case 'rain':
        return {
          containerBg: 'bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#040817]',
          outerRingGlow: 'shadow-[0_0_50px_rgba(56,189,248,0.25)]',
          neonColor: '#38bdf8', // sky cyan
          neonTail: 'from-sky-400 via-blue-500 to-transparent',
          capsuleHighlight: 'border-sky-400/90 bg-sky-500/25 shadow-[0_0_24px_rgba(56,189,248,0.5)] text-sky-100',
          centerGlow: 'bg-sky-500/10 border-sky-400/30',
          textColor: 'text-white',
          secondaryText: 'text-sky-200/80',
          badgeTheme: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
          name: 'Stormy Rain',
          illustration: (
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              <img
                src="/images/Rainiy.png"
                alt="Rainy theme"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
            </div>
          ),
        };
      case 'sunrise':
        return {
          containerBg: 'bg-gradient-to-b from-[#78350f] via-[#b45309] to-[#d97706]',
          outerRingGlow: 'shadow-[0_0_50px_rgba(251,191,36,0.35)]',
          neonColor: '#fbbf24', // amber
          neonTail: 'from-amber-300 via-yellow-500 to-transparent',
          capsuleHighlight: 'border-amber-300/90 bg-amber-500/30 shadow-[0_0_24px_rgba(251,191,36,0.6)] text-amber-50',
          centerGlow: 'bg-amber-500/15 border-amber-300/40',
          textColor: 'text-amber-50',
          secondaryText: 'text-amber-200/90',
          badgeTheme: 'bg-amber-400/20 text-amber-100 border-amber-300/40',
          name: 'Golden Sunrise',
          illustration: (
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              <img
                src="/images/Mausmy.png"
                alt="Sunrise theme"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-slate-950/25" />
            </div>
          ),
        };
      case 'day':
        return {
          containerBg: 'bg-gradient-to-b from-[#0284c7] via-[#0ea5e9] to-[#047857]',
          outerRingGlow: 'shadow-[0_0_50px_rgba(45,212,191,0.35)]',
          neonColor: '#2dd4bf', // teal
          neonTail: 'from-teal-300 via-cyan-400 to-transparent',
          capsuleHighlight: 'border-teal-300/90 bg-teal-500/30 shadow-[0_0_24px_rgba(45,212,191,0.6)] text-white',
          centerGlow: 'bg-teal-500/15 border-teal-300/40',
          textColor: 'text-white',
          secondaryText: 'text-teal-100/90',
          badgeTheme: 'bg-teal-400/20 text-teal-100 border-teal-300/40',
          name: 'Lush Daytime',
          illustration: (
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              <img
                src="/images/Suuny.png"
                alt="Sunny theme"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-slate-950/20" />
            </div>
          ),
        };
      case 'sunset':
        return {
          containerBg: 'bg-gradient-to-b from-[#831843] via-[#9f1239] to-[#ea580c]',
          outerRingGlow: 'shadow-[0_0_50px_rgba(249,115,22,0.35)]',
          neonColor: '#f97316', // orange
          neonTail: 'from-orange-300 via-rose-500 to-transparent',
          capsuleHighlight: 'border-orange-300/90 bg-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.6)] text-orange-50',
          centerGlow: 'bg-orange-500/15 border-orange-300/40',
          textColor: 'text-orange-50',
          secondaryText: 'text-orange-200/90',
          badgeTheme: 'bg-orange-400/20 text-orange-100 border-orange-300/40',
          name: 'Dusk Sunset',
          illustration: (
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              <img
                src="/images/Mausmy.png"
                alt="Sunset theme"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-slate-950/25" />
            </div>
          ),
        };
      case 'night':
      default:
        return {
          containerBg: 'bg-gradient-to-b from-[#020617] via-[#090d24] to-[#03071e]',
          outerRingGlow: 'shadow-[0_0_50px_rgba(129,140,248,0.3)]',
          neonColor: '#818cf8', // indigo
          neonTail: 'from-indigo-300 via-sky-400 to-transparent',
          capsuleHighlight: 'border-indigo-300/90 bg-indigo-500/30 shadow-[0_0_24px_rgba(129,140,248,0.6)] text-indigo-50',
          centerGlow: 'bg-indigo-500/15 border-indigo-300/40',
          textColor: 'text-indigo-50',
          secondaryText: 'text-indigo-200/90',
          badgeTheme: 'bg-indigo-400/20 text-indigo-100 border-indigo-300/40',
          name: 'Starry Midnight',
          illustration: (
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              <img
                src="/images/Cloudy.png"
                alt="Night theme"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-slate-950/30" />
            </div>
          ),
        };
    }
  };

  const currentTheme = getThemeStyles();

  // Coordinates calculation for the SVG circular glowing arc
  // Radius R = 118px on a 280x280 or 320x320 SVG viewport
  const svgCenter = 150;
  const svgRadius = 116;
  const circumference = 2 * Math.PI * svgRadius;
  const strokeDashoffset = circumference - (activeAngleDeg / 360) * circumference;

  // Luminous thumb pointer position
  const thumbAngleRad = ((activeAngleDeg - 90) * Math.PI) / 180;
  const thumbX = svgCenter + svgRadius * Math.cos(thumbAngleRad);
  const thumbY = svgCenter + svgRadius * Math.sin(thumbAngleRad);

  return (
    <div
      id="weather-clock-dial-container"
      className={`relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 transition-all duration-700 select-none ${currentTheme.containerBg} ${className}`}
    >
      {/* 1. Atmospheric Sky Canvas & Realistic Weather Effects */}
      {currentTheme.illustration}

      {/* Top Header Bar inside Clock */}
      <div className="relative z-20 p-5 sm:p-6 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-white border border-white/20 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
            <span>Radial 24h Agronomy Clock</span>
          </div>
          <span className="text-xs font-bold text-white/80 hidden sm:inline">
            📍 {locationName} • Rajasthan Agronomy Grid
          </span>
        </div>

        {/* Atmosphere / Theme Preset Pills matching the 5 visuals */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setThemeMode('rain');
              setSelectedHour24(12);
              setCycleMode('PM');
              setIsLiveClock(false);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              themeMode === 'rain'
                ? 'bg-sky-500 text-slate-950 border-sky-300 font-black shadow-md'
                : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/10'
            }`}
            title="Rain / Thunderstorm theme (12 PM)"
          >
            <span>🌧️</span>
            <span className="hidden md:inline">Rain 12 PM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('sunrise');
              setSelectedHour24(7);
              setCycleMode('AM');
              setIsLiveClock(false);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              themeMode === 'sunrise'
                ? 'bg-amber-400 text-slate-950 border-amber-200 font-black shadow-md'
                : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/10'
            }`}
            title="Sunrise / Morning theme (7 AM)"
          >
            <span>🌅</span>
            <span className="hidden md:inline">Sunrise 7 AM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('day');
              setSelectedHour24(14);
              setCycleMode('PM');
              setIsLiveClock(false);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              themeMode === 'day'
                ? 'bg-teal-400 text-slate-950 border-teal-200 font-black shadow-md'
                : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/10'
            }`}
            title="Daytime theme (2 PM)"
          >
            <span>🌤️</span>
            <span className="hidden md:inline">Day 2 PM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('sunset');
              setSelectedHour24(18);
              setCycleMode('PM');
              setIsLiveClock(false);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              themeMode === 'sunset'
                ? 'bg-orange-500 text-white border-orange-300 font-black shadow-md'
                : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/10'
            }`}
            title="Sunset theme (6 PM)"
          >
            <span>🌇</span>
            <span className="hidden md:inline">Sunset 6 PM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('night');
              setSelectedHour24(0);
              setCycleMode('AM');
              setIsLiveClock(false);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              themeMode === 'night'
                ? 'bg-indigo-400 text-slate-950 border-indigo-200 font-black shadow-md'
                : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/10'
            }`}
            title="Starry Night theme (12 AM)"
          >
            <span>🌙</span>
            <span className="hidden md:inline">Night 12 AM</span>
          </button>

          {/* Live Clock Button */}
          <button
            type="button"
            onClick={() => {
              setIsLiveClock(!isLiveClock);
              setThemeMode('auto');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              isLiveClock
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-lg animate-pulse'
                : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveClock ? 'bg-slate-950' : 'bg-emerald-400 animate-ping'}`} />
            <span>{isLiveClock ? 'Live Clock On' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Radial Dial Face Container */}
      <div className="relative z-10 p-4 sm:p-8 flex flex-col items-center justify-center">
        {/* The Circular Clock Component (Diameter ~380px on desktop, ~320px on mobile) */}
        <div
          ref={dialRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none my-2"
        >
          {/* Subtle Outer Frosted Glass Border Ring */}
          <div className="absolute inset-0 rounded-full border border-white/20 bg-black/20 backdrop-blur-md shadow-2xl" />

          {/* SVG Glowing Arc Ring Layer */}
          <svg
            viewBox="0 0 300 300"
            className="absolute inset-0 w-full h-full pointer-events-none transform -rotate-90"
          >
            {/* Background Track Circle */}
            <circle
              cx={svgCenter}
              cy={svgCenter}
              r={svgRadius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="3.5"
            />

            {/* Glowing Active Arc */}
            <circle
              cx={svgCenter}
              cy={svgCenter}
              r={svgRadius}
              fill="none"
              stroke={currentTheme.neonColor}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 drop-shadow-[0_0_10px_currentColor]"
            />

            {/* 12 Minor Tick Dots on Arc */}
            {Array.from({ length: 12 }).map((_, i) => {
              const tickAngle = (i * 30 * Math.PI) / 180;
              const tx = svgCenter + svgRadius * Math.cos(tickAngle);
              const ty = svgCenter + svgRadius * Math.sin(tickAngle);
              return (
                <circle
                  key={i}
                  cx={tx}
                  cy={ty}
                  r="2"
                  fill="rgba(255, 255, 255, 0.4)"
                />
              );
            })}
          </svg>

          {/* Luminous Glowing Handle Bead / Thumb */}
          <div
            className="absolute w-4 h-4 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 shadow-lg"
            style={{
              left: `${(thumbX / 300) * 100}%`,
              top: `${(thumbY / 300) * 100}%`,
              backgroundColor: currentTheme.neonColor,
              boxShadow: `0 0 14px 4px ${currentTheme.neonColor}`,
            }}
          />

          {/* 12 Radial Weather Nodes around the Perimeter */}
          {displayedHours12.map((h, idx) => {
            // Angle around clock (0 = 12 o'clock, 1 = 1 o'clock, ..., 11 = 11 o'clock)
            const angleDeg = idx * 30;
            const angleRad = ((angleDeg - 90) * Math.PI) / 180;
            const radiusPx = isMobile ? 112 : 142; // Distance from center on desktop / scalable via CSS
            const x = Math.cos(angleRad) * radiusPx;
            const y = Math.sin(angleRad) * radiusPx;

            const isSelected = active12HourIndex === idx;
            const isNightNode = h.hourLabel.includes('AM') && !h.hourLabel.includes('12 AM')
              ? parseInt(h.hourLabel) < 6
              : h.hourLabel.includes('10 PM') || h.hourLabel.includes('11 PM') || h.hourLabel.includes('12 AM');

            return (
              <button
                key={h.hourLabel}
                type="button"
                id={`clock-node-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  const targetHour = cycleMode === 'PM' ? idx + 12 : idx;
                  setSelectedHour24(targetHour);
                  setIsLiveClock(false);
                }}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className={`absolute w-14 h-16 sm:w-16 sm:h-18 -ml-7 -mt-8 sm:-ml-8 sm:-mt-9 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? `${currentTheme.capsuleHighlight} scale-110 z-30 font-black border-2 backdrop-blur-md`
                    : 'text-white/80 hover:text-white hover:scale-105 hover:bg-white/10'
                }`}
              >
                {/* Hour Label */}
                <span className="text-[10px] sm:text-[11px] font-bold leading-tight uppercase tracking-tight">
                  {h.hourLabel}
                </span>

                {/* Weather Icon */}
                <div className="my-0.5 transform scale-85 sm:scale-95">
                  {renderWeatherIcon(h.condition, h.rainChancePercent, isNightNode, 'w-4 h-4 sm:w-5 sm:h-5')}
                </div>

                {/* Temperature in Degrees */}
                <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">
                  {h.tempC}°
                </span>
              </button>
            );
          })}

          {/* 3. Dial Center Plate (Digital Time + Location + Weather Condition) */}
          <div
            className={`relative z-20 w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-white/20 backdrop-blur-xl flex flex-col items-center justify-center p-3 text-center shadow-2xl transition-all duration-500 ${currentTheme.centerGlow}`}
          >
            {/* Location Tag */}
            <div className="flex items-center gap-1 text-[11px] font-black text-white/90 uppercase tracking-wider mb-0.5">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>{locationName}</span>
            </div>

            {/* AM / PM tag */}
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
              {displayAmPm}
            </span>

            {/* Large Digital Clock Time */}
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight my-0.5 font-mono drop-shadow-md">
              {displayDigitalTime}
            </h1>

            {/* Weather Graphic, Temperature & Condition Name */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="transform scale-110">
                {renderWeatherIcon(
                  currentHourData.condition,
                  currentHourData.rainChancePercent,
                  selectedHour24 >= 20 || selectedHour24 < 5,
                  'w-6 h-6 sm:w-7 sm:h-7'
                )}
              </div>
              <div className="text-left">
                <span className="text-base sm:text-lg font-black text-white leading-none block">
                  {currentHourData.tempC}°
                </span>
                <span className="text-[10px] font-bold text-white/80 leading-none capitalize block">
                  {currentHourData.condition || 'Clear'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Interactive Scrubber & Explore Hint */}
        <div className="w-full max-w-md mt-4 space-y-3">
          {/* Scroll / Explore Prompt directly from Screenshot */}
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-white/70 py-1">
            <ChevronLeft className="w-4 h-4 text-white/50 animate-pulse" />
            <span className="text-[11px] flex items-center gap-1.5">
              <span>SCROLL TO</span>
              <Sliders className="w-3.5 h-3.5 text-cyan-300" />
              <span>EXPLORE TIME</span>
            </span>
            <ChevronRight className="w-4 h-4 text-white/50 animate-pulse" />
          </div>

          {/* Time Slider Track */}
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-black text-white/70 uppercase pl-1">
              {cycleMode === 'PM' ? '12 PM' : '12 AM'}
            </span>
            <input
              type="range"
              min={cycleMode === 'PM' ? 12 : 0}
              max={cycleMode === 'PM' ? 23 : 11}
              value={selectedHour24}
              onChange={(e) => {
                setSelectedHour24(parseInt(e.target.value));
                setIsLiveClock(false);
              }}
              className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
            />
            <span className="text-[11px] font-black text-white/70 uppercase pr-1">
              {cycleMode === 'PM' ? '11 PM' : '11 AM'}
            </span>

            {/* PM / AM Cycle Switcher */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
              <button
                type="button"
                onClick={() => {
                  setCycleMode('AM');
                  if (selectedHour24 >= 12) setSelectedHour24(selectedHour24 - 12);
                  setIsLiveClock(false);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  cycleMode === 'AM' ? 'bg-white text-slate-950 shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => {
                  setCycleMode('PM');
                  if (selectedHour24 < 12) setSelectedHour24(selectedHour24 + 12);
                  setIsLiveClock(false);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  cycleMode === 'PM' ? 'bg-white text-slate-950 shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Selected Hour Agronomic Intelligence Strip */}
      <div className="relative z-20 bg-black/40 backdrop-blur-md border-t border-white/10 p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="bg-white/10 p-2.5 sm:p-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-extrabold text-white/70 block">
              💧 Irrigation Status
            </span>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full inline-block mt-1 ${
                currentHourData.irrigationStatus === 'RECOMMENDED'
                  ? 'bg-emerald-400 text-slate-950 shadow-xs'
                  : currentHourData.irrigationStatus === 'OPTIONAL'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {currentHourData.irrigationStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-white/10 p-2.5 sm:p-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-extrabold text-white/70 block">
              🌡️ Heat Stress
            </span>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full inline-block mt-1 ${
                currentHourData.heatStress === 'HIGH'
                  ? 'bg-rose-500 text-white'
                  : currentHourData.heatStress === 'MEDIUM'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-400 text-slate-950'
              }`}
            >
              {currentHourData.heatStress} STRESS
            </span>
          </div>

          <div className="bg-white/10 p-2.5 sm:p-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-extrabold text-white/70 block">
              🌧️ Rain Probability
            </span>
            <span className="text-sm font-black text-white block mt-0.5">
              {currentHourData.rainChancePercent}% Chance
            </span>
          </div>

          <div className="bg-white/10 p-2.5 sm:p-3 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] uppercase font-extrabold text-white/70 block">
              🌾 Field Recommendation
            </span>
            <span className="text-xs font-bold text-white/90 truncate block mt-1" title={currentHourData.fieldActivity}>
              {currentHourData.fieldActivity}
            </span>
          </div>
        </div>

        {/* Detailed Agronomy Advisory note */}
        <div className="max-w-4xl mx-auto mt-3 p-3 bg-white/10 rounded-2xl border border-white/15 flex items-start gap-2.5 text-xs text-white/90">
          <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">
              {currentHourData.hourLabel} Agronomic Window ({currentHourData.displayTime}):{' '}
            </span>
            <span>{currentHourData.irrigationMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
