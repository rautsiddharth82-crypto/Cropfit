import React, { useMemo } from 'react';

export type WeatherAnimationType = 'auto' | 'clouds' | 'sunny' | 'rain' | 'wind' | 'heat';

interface WeatherAnimatedBackgroundProps {
  condition?: string;
  rainChance?: number;
  tempC?: number;
  windSpeed?: number;
  overrideType?: WeatherAnimationType;
  className?: string;
}

export const WeatherAnimatedBackground: React.FC<WeatherAnimatedBackgroundProps> = ({
  condition = 'Clear',
  rainChance = 10,
  tempC = 31,
  windSpeed = 12,
  overrideType = 'auto',
  className = '',
}) => {
  // Determine effective weather type
  const activeType: 'clouds' | 'sunny' | 'rain' | 'wind' | 'heat' = useMemo(() => {
    if (overrideType && overrideType !== 'auto') {
      return overrideType;
    }
    const condLower = (condition || '').toLowerCase();
    if (rainChance >= 45 || condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('storm')) {
      return 'rain';
    }
    if (windSpeed >= 20 || condLower.includes('wind') || condLower.includes('breeze')) {
      return 'wind';
    }
    if (tempC >= 36 || condLower.includes('heat') || condLower.includes('hot')) {
      return 'heat';
    }
    if (condLower.includes('cloud') || condLower.includes('overcast') || condLower.includes('haze') || condLower.includes('fog')) {
      return 'clouds';
    }
    return 'sunny';
  }, [condition, rainChance, tempC, windSpeed, overrideType]);

  // Generate rain drops with deterministic positions for pure rendering
  const rainDrops = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.6 + (i % 3) * 1.5) % 100}%`,
      delay: `${(i * 0.12) % 1.6}s`,
      duration: `${0.75 + (i % 4) * 0.2}s`,
      height: `${14 + (i % 5) * 6}px`,
      opacity: 0.4 + (i % 5) * 0.12,
    }));
  }, []);

  // Generate ambient floating light particles / wind trails
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${(i * 8.5) % 95}%`,
      top: `${20 + (i * 7) % 65}%`,
      delay: `${(i * 0.4) % 4}s`,
      size: 3 + (i % 3) * 2,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 rounded-3xl transition-colors duration-700 ${className}`}
    >
      {/* 1. Base Adaptive Dynamic Gradients */}
      {activeType === 'sunny' && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-emerald-700 to-sky-800 opacity-95 transition-all duration-700" />
      )}
      {activeType === 'clouds' && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-teal-800 to-emerald-900 opacity-95 transition-all duration-700" />
      )}
      {activeType === 'rain' && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-950 opacity-95 transition-all duration-700" />
      )}
      {activeType === 'wind' && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-teal-700 to-sky-900 opacity-95 transition-all duration-700" />
      )}
      {activeType === 'heat' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-orange-800 to-emerald-900 opacity-95 transition-all duration-700" />
      )}

      {/* 2. SUNNY & RADIANT SKY LAYER */}
      {(activeType === 'sunny' || activeType === 'heat') && (
        <div className="absolute inset-0">
          {/* Radiant Glowing Sun Orb */}
          <div className="absolute -top-10 -right-10 w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-500 blur-2xl opacity-60 animate-sun-pulse" />

          {/* Rotating Sun Beam Graphic */}
          <div className="absolute -top-6 -right-6 w-44 h-44 sm:w-56 sm:h-56 opacity-35 animate-sun-spin">
            <svg viewBox="0 0 200 200" className="w-full h-full text-yellow-300 fill-current">
              <circle cx="100" cy="100" r="32" fill="currentColor" opacity="0.6" />
              {/* Radial Ray Lines */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const angle = idx * 30;
                return (
                  <rect
                    key={idx}
                    x="98"
                    y="18"
                    width="4"
                    height="28"
                    rx="2"
                    transform={`rotate(${angle} 100 100)`}
                    opacity="0.85"
                  />
                );
              })}
            </svg>
          </div>

          {/* Shimmering Golden Floating Pollen/Dust Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-amber-200/50 blur-[0.5px]"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animation: `particle-float 4.5s ease-in-out infinite ${p.delay}`,
              }}
            />
          ))}
        </div>
      )}

      {/* 3. MOVING CLOUDS LAYER (Layered Depth Parallax) */}
      {(activeType === 'clouds' || activeType === 'sunny' || activeType === 'wind') && (
        <div className="absolute inset-0">
          {/* Background Cloud Layer - Slow Drift */}
          <div className="absolute top-2 -left-20 w-[420px] sm:w-[540px] opacity-25 animate-cloud-slow">
            <svg viewBox="0 0 300 100" fill="currentColor" className="w-full text-white">
              <path d="M40,75 Q45,45 75,50 Q90,25 130,35 Q165,15 200,40 Q235,30 255,60 Q275,65 270,78 Q260,88 230,88 L50,88 Q30,88 40,75 Z" />
            </svg>
          </div>

          {/* Mid-ground Cloud Layer - Moderate Speed */}
          <div className="absolute top-8 left-10 w-[340px] sm:w-[460px] opacity-40 animate-cloud-mid">
            <svg viewBox="0 0 280 90" fill="currentColor" className="w-full text-white">
              <path d="M30,65 Q35,35 65,42 Q80,18 120,28 Q150,10 185,32 Q215,22 235,50 Q255,55 250,68 Q240,78 210,78 L40,78 Q20,78 30,65 Z" />
            </svg>
          </div>

          {/* Foreground Fluffy Cloud - Fast Drift with Soft Shadows */}
          <div className="absolute -bottom-4 -left-12 w-[380px] sm:w-[500px] opacity-35 animate-cloud-fast">
            <svg viewBox="0 0 320 110" fill="currentColor" className="w-full text-emerald-100">
              <path d="M50,85 Q55,50 90,58 Q110,28 155,40 Q195,18 240,48 Q280,38 300,72 Q320,80 310,95 Q295,105 260,105 L60,105 Q35,105 50,85 Z" />
            </svg>
          </div>

          {/* Additional Floating Cloud Puff on Right */}
          {activeType === 'clouds' && (
            <div
              className="absolute top-1/2 -left-28 w-[290px] opacity-30 animate-cloud-mid"
              style={{ animationDelay: '-16s' }}
            >
              <svg viewBox="0 0 260 85" fill="currentColor" className="w-full text-teal-100">
                <path d="M25,58 Q30,30 60,36 Q75,15 110,24 Q140,8 170,28 Q198,18 215,44 Q235,48 230,60 L35,68 Z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* 4. MONSOON RAIN & STORM LAYER */}
      {activeType === 'rain' && (
        <div className="absolute inset-0">
          {/* Lightning Illumination Flash */}
          <div className="absolute inset-0 bg-sky-200 animate-lightning" />

          {/* Heavy Storm Clouds Overhead */}
          <div className="absolute -top-6 left-0 right-0 h-28 opacity-60">
            <svg viewBox="0 0 500 120" fill="currentColor" className="w-full h-full text-slate-800" preserveAspectRatio="none">
              <path d="M0,0 L500,0 L500,80 Q440,110 380,85 Q320,115 250,80 Q180,120 120,85 Q60,110 0,75 Z" />
            </svg>
          </div>

          {/* Animated Falling Rain Drops */}
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute rounded-full bg-gradient-to-b from-cyan-200 via-sky-300 to-transparent"
              style={{
                left: drop.left,
                top: 0,
                width: '2px',
                height: drop.height,
                opacity: drop.opacity,
                transform: 'rotate(15deg)',
                animation: `rain-drop-fall ${drop.duration} linear infinite ${drop.delay}`,
              }}
            />
          ))}

          {/* Bottom Mist & Water Surface Glow */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-cyan-400/25 to-transparent blur-xs" />
        </div>
      )}

      {/* 5. WIND STREAMLINES LAYER */}
      {activeType === 'wind' && (
        <div className="absolute inset-0">
          {/* Animated Curved Wind Lines */}
          <div
            className="absolute top-1/4 left-0 w-64 h-8 opacity-60"
            style={{ animation: 'wind-trail-flow 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          >
            <svg viewBox="0 0 200 30" fill="none" className="w-full h-full stroke-cyan-200">
              <path d="M0,15 C60,5 120,25 180,15 C190,13 195,8 190,4 C185,0 175,5 178,12" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div
            className="absolute top-1/2 left-0 w-80 h-10 opacity-70"
            style={{ animation: 'wind-trail-flow 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.8s' }}
          >
            <svg viewBox="0 0 240 30" fill="none" className="w-full h-full stroke-emerald-200">
              <path d="M0,15 C80,25 150,5 220,15 C230,17 235,22 230,26 C225,30 215,25 218,18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div
            className="absolute top-3/4 left-0 w-72 h-8 opacity-50"
            style={{ animation: 'wind-trail-flow 3.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.5s' }}
          >
            <svg viewBox="0 0 220 30" fill="none" className="w-full h-full stroke-white">
              <path d="M0,15 C70,10 140,20 200,15" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      {/* 6. Subtle Vignette Border for Clean Framing */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/5 to-black/30 rounded-3xl" />
    </div>
  );
};
