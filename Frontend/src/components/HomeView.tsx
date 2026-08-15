import React, { useState } from 'react';
import {
  Droplets,
  CloudRain,
  Wind,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  HelpCircle,
  CheckCircle2,
  Sprout,
  FlaskConical,
  Camera,
  Landmark,
  Bot,
  CloudSun,
  Sliders,
  Wallet,
  BookOpen,
  Clock
} from 'lucide-react';
import {
  FarmerProfile,
  WeatherData,
  EarlyWarningAlert,
  CropField,
  AppTab
} from '../types';
import { WeatherAnimatedBackground, WeatherAnimationType } from './WeatherAnimatedBackground';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

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
  onNavigate,
  onOpenWhyAlert,
  onOpenActionAlert,
}) => {
  const [animType, setAnimType] = useState<WeatherAnimationType>('auto');
  const { t, language } = useLanguage();
  const { speak } = useVoice();

  const mainFeatures = [
    {
      id: 'farm',
      tab: 'farm' as AppTab,
      title: t('feature_farm_title'),
      badge: language === 'hi' ? '3 खेत सक्रिय' : language === 'pa' ? '3 ਖੇਤ ਸਰਗਰਮ' : '3 Fields Active',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: t('feature_farm_desc'),
      icon: Sprout,
      iconBg: 'bg-emerald-500 text-white',
      accentHover: 'hover:border-emerald-500 hover:shadow-emerald-500/10',
      actionText: language === 'hi' ? 'खेत विवरण देखें' : language === 'pa' ? 'ਖੇਤ ਦਾ ਵੇਰਵਾ ਵੇਖੋ' : 'View My Fields',
    },
    {
      id: 'testing',
      tab: 'testing' as AppTab,
      title: t('feature_testing_title'),
      badge: language === 'hi' ? 'सरकारी लैब व NPK कार्ड' : language === 'pa' ? 'ਲੈਬ ਤੇ NPK ਰਿਪੋਰਟ' : 'Apply & Govt Reports',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      description: t('feature_testing_desc'),
      icon: FlaskConical,
      iconBg: 'bg-teal-600 text-white',
      accentHover: 'hover:border-teal-500 hover:shadow-teal-500/10',
      actionText: language === 'hi' ? 'जांच आवेदन / रिपोर्ट देखें' : language === 'pa' ? 'ਰਿਪੋਰਟ ਵੇਖੋ' : 'Apply / View Reports',
    },
    {
      id: 'disease',
      tab: 'disease' as AppTab,
      title: t('feature_disease_title'),
      badge: language === 'hi' ? 'तुरंत फोटो एआई पहचान' : language === 'pa' ? 'ਤੁਰੰਤ ਫੋਟੋ ਏਆਈ ਜਾਂਚ' : 'Instant AI Photo AI',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      description: t('feature_disease_desc'),
      icon: Camera,
      iconBg: 'bg-rose-500 text-white',
      accentHover: 'hover:border-rose-500 hover:shadow-rose-500/10',
      actionText: language === 'hi' ? 'पत्ते की फोटो खींचें' : language === 'pa' ? 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਸਕੈਨ ਕਰੋ' : 'Scan Plant Leaf',
    },
    {
      id: 'schemes',
      tab: 'schemes' as AppTab,
      title: t('feature_schemes_title'),
      badge: language === 'hi' ? 'सोलर पंप व ड्रिप सब्सिडी' : language === 'pa' ? 'ਸੋਲਰ ਪੰਪ ਤੇ ਸਬਸਿਡੀ' : 'Solar & Drip Schemes',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: t('feature_schemes_desc'),
      icon: Landmark,
      iconBg: 'bg-indigo-600 text-white',
      accentHover: 'hover:border-indigo-500 hover:shadow-indigo-500/10',
      actionText: language === 'hi' ? 'योजनाएं खोजें' : language === 'pa' ? 'ਸਕੀਮਾਂ ਵੇਖੋ' : 'Explore Schemes',
    },
    {
      id: 'climate',
      tab: 'climate' as AppTab,
      title: t('feature_climate_title'),
      badge: language === 'hi' ? '24 घंटे का कार्य चक्र' : language === 'pa' ? '24 ਘੰਟੇ ਦਾ ਮੌਸਮ ਚੱਕਰ' : 'Live Radar & Advisory',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      description: t('feature_climate_desc'),
      icon: CloudSun,
      iconBg: 'bg-sky-500 text-white',
      accentHover: 'hover:border-sky-500 hover:shadow-sky-500/10',
      actionText: language === 'hi' ? 'मौसम चक्र देखें' : language === 'pa' ? 'ਮੌਸਮ ਚੱਕਰ ਵੇਖੋ' : 'Check Weather Clock',
    },
    {
      id: 'simulator',
      tab: 'simulator' as AppTab,
      title: t('feature_simulator_title'),
      badge: language === 'hi' ? 'तापमान व सूखा सिमुलेशन' : language === 'pa' ? 'ਸੋਕਾ ਤੇ ਗਰਮੀ ਸਿਮੂਲੇਟਰ' : 'What-If Climate AI',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description: t('feature_simulator_desc'),
      icon: Sliders,
      iconBg: 'bg-purple-600 text-white',
      accentHover: 'hover:border-purple-500 hover:shadow-purple-500/10',
      actionText: language === 'hi' ? 'सिम्युलेटर चलाएं' : language === 'pa' ? 'ਸਿਮੂਲੇਟਰ ਪਰਖੋ' : 'Run Simulation',
    },
    {
      id: 'financials',
      tab: 'financials' as AppTab,
      title: t('feature_financials_title'),
      badge: language === 'hi' ? 'शुद्ध बचत व ROI' : language === 'pa' ? 'ਮੁਨਾਫ਼ਾ ਤੇ ਲਾਗਤ' : 'Cost & Profit ROI',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: t('feature_financials_desc'),
      icon: Wallet,
      iconBg: 'bg-emerald-600 text-white',
      accentHover: 'hover:border-emerald-500 hover:shadow-emerald-500/10',
      actionText: language === 'hi' ? 'आय-व्यय देखें' : language === 'pa' ? 'ਹਿਸਾਬ-ਕਿਤਾਬ ਵੇਖੋ' : 'View Financials',
    },
    {
      id: 'journal',
      tab: 'journal' as AppTab,
      title: t('feature_journal_title'),
      badge: language === 'hi' ? 'डिजिटल फील्ड लॉग' : language === 'pa' ? 'ਡਿਜੀਟਲ ਖੇਤੀ ਡਾਇਰੀ' : 'Field Diary',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: t('feature_journal_desc'),
      icon: BookOpen,
      iconBg: 'bg-amber-600 text-white',
      accentHover: 'hover:border-amber-500 hover:shadow-amber-500/10',
      actionText: language === 'hi' ? 'डायरी खोलें' : language === 'pa' ? 'ਡਾਇਰੀ ਖੋਲ੍ਹੋ' : 'Open Journal',
    },
    {
      id: 'ai',
      tab: 'ai' as AppTab,
      title: t('feature_ai_title'),
      badge: language === 'hi' ? 'हिंदी व पंजाबी में आवाज' : language === 'pa' ? 'ਪੰਜਾਬੀ ਤੇ ਹਿੰਦੀ ਆਵਾਜ਼' : 'Voice in Hindi/English',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      description: t('feature_ai_desc'),
      icon: Bot,
      iconBg: 'bg-teal-600 text-white',
      accentHover: 'hover:border-teal-500 hover:shadow-teal-500/10',
      actionText: language === 'hi' ? 'विशेषज्ञ से बात करें' : language === 'pa' ? 'ਏਆਈ ਮਾਹਿਰ ਨਾਲ ਗੱਲ ਕਰੋ' : 'Talk to AI Assistant',
    },
  ];

  return (
    <div id="home-view-container" className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* 1. Weather Summary Banner with Animated Moving Clouds / Sky Background */}
      <div
        id="home-weather-card"
        className="text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-emerald-600/40 min-h-[220px]"
      >
        {/* Animated Dynamic Weather Canvas / Moving Clouds */}
        <WeatherAnimatedBackground
          condition={weather.condition}
          rainChance={weather.rainChancePercent}
          tempC={weather.tempC}
          windSpeed={weather.windSpeedKmh}
          overrideType={animType}
        />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-black rounded-full uppercase tracking-wider border border-white/20 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <span>{language === 'hi' ? 'लाइव मौसम' : language === 'pa' ? 'ਲਾਈਵ ਮੌਸਮ' : 'Live Climate'}</span>
            </span>
            <span className="text-xs text-emerald-100 font-extrabold drop-shadow-sm">{profile.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-weather-view-forecast"
              onClick={() => onNavigate('climate')}
              className="text-xs font-black text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? '24-घंटे का मौसम चक्र' : language === 'pa' ? '24 ਘੰਟੇ ਦਾ ਮੌਸਮ ਚੱਕਰ' : 'Radial Weather Clock'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 shadow-md">
              {animType === 'clouds' || (animType === 'auto' && weather.condition.toLowerCase().includes('cloud')) ? (
                '⛅'
              ) : animType === 'rain' || (animType === 'auto' && weather.rainChancePercent >= 45) ? (
                '🌧️'
              ) : animType === 'wind' || (animType === 'auto' && weather.windSpeedKmh >= 20) ? (
                '💨'
              ) : animType === 'heat' || (animType === 'auto' && weather.tempC >= 36) ? (
                '🔥'
              ) : (
                '☀️'
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                  {weather.tempC}°C
                </span>
                <span className="text-sm font-extrabold text-emerald-100 drop-shadow-sm">
                  {language === 'hi'
                    ? (animType === 'clouds'
                        ? 'हवा और बादल'
                        : animType === 'rain'
                        ? 'बारिश की संभावना'
                        : animType === 'wind'
                        ? 'तेज हवाएं'
                        : animType === 'heat'
                        ? 'तेज धूप व लू'
                        : 'धूप व सामान्य मौसम')
                    : language === 'pa'
                    ? (animType === 'clouds'
                        ? 'ਬੱਦਲਵਾਈ ਅਤੇ ਹਵਾ'
                        : animType === 'rain'
                        ? 'ਮੀਂਹ ਦਾ ਖ਼ਦਸ਼ਾ'
                        : animType === 'wind'
                        ? 'ਤੇਜ਼ ਹਵਾਵਾਂ'
                        : animType === 'heat'
                        ? 'ਤੇਜ਼ ਧੁੱਪ ਤੇ ਲੂ'
                        : 'ਖ਼ੁਸ਼ਗਵਾਰ ਧੁੱਪ')
                    : weather.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Weather Animation Effect Switcher */}
          <div className="flex items-center flex-wrap gap-1 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
            <span className="text-[10px] font-black text-emerald-200 uppercase px-2">
              {language === 'hi' ? 'दृश्य:' : 'Sky:'}
            </span>
            <button
              onClick={() => {
                speak(language === 'hi' ? 'ऑटो मौसम दृश्य' : 'Auto sky view');
                setAnimType('auto');
              }}
              data-voice-text={language === 'hi' ? 'ऑटो मौसम दृश्य' : 'Auto sky view'}
              className={`px-2 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                animType === 'auto'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Auto"
            >
              {language === 'hi' ? 'ऑटो' : 'Auto'}
            </button>
            <button
              onClick={() => {
                speak(language === 'hi' ? 'बादल मौसम दृश्य' : 'Clouds view');
                setAnimType('clouds');
              }}
              data-voice-text={language === 'hi' ? 'बादल मौसम दृश्य' : 'Clouds view'}
              className={`px-2 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                animType === 'clouds'
                  ? 'bg-emerald-400 text-slate-950 shadow-sm font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Clouds"
            >
              ⛅ {language === 'hi' ? 'बादल' : 'Clouds'}
            </button>
            <button
              onClick={() => {
                speak(language === 'hi' ? 'धूप मौसम दृश्य' : 'Sunny sky view');
                setAnimType('sunny');
              }}
              data-voice-text={language === 'hi' ? 'धूप मौसम दृश्य' : 'Sunny sky view'}
              className={`px-2 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                animType === 'sunny'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Sun"
            >
              ☀️ {language === 'hi' ? 'धूप' : 'Sun'}
            </button>
            <button
              onClick={() => {
                speak(language === 'hi' ? 'बारिश मौसम दृश्य' : 'Rain sky view');
                setAnimType('rain');
              }}
              data-voice-text={language === 'hi' ? 'बारिश मौसम दृश्य' : 'Rain sky view'}
              className={`px-2 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                animType === 'rain'
                  ? 'bg-sky-400 text-slate-950 shadow-sm font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Rain"
            >
              🌧️ {language === 'hi' ? 'बारिश' : 'Rain'}
            </button>
            <button
              onClick={() => {
                speak(language === 'hi' ? 'हवा मौसम दृश्य' : 'Windy sky view');
                setAnimType('wind');
              }}
              data-voice-text={language === 'hi' ? 'हवा मौसम दृश्य' : 'Windy sky view'}
              className={`px-2 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                animType === 'wind'
                  ? 'bg-teal-300 text-slate-950 shadow-sm font-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Wind"
            >
              💨 {language === 'hi' ? 'हवा' : 'Wind'}
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 mt-3 text-center">
          <div
            onClick={() => speak(`${language === 'hi' ? 'हवा में नमी' : 'Humidity'}: ${weather.humidityPercent}%`)}
            data-voice-text={`${language === 'hi' ? 'हवा में नमी' : 'Humidity'}: ${weather.humidityPercent}%`}
            className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-xs cursor-pointer hover:bg-white/25 transition-all"
          >
            <div className="flex items-center justify-center gap-1 text-emerald-200 mb-0.5">
              <Droplets className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold text-emerald-100">
                {language === 'hi' ? 'हवा में नमी' : language === 'pa' ? 'ਨਮੀ' : 'Humidity'}
              </span>
            </div>
            <span className="text-sm sm:text-base font-black text-white">
              {weather.humidityPercent}%
            </span>
          </div>

          <div
            onClick={() => speak(`${language === 'hi' ? 'बारिश का अनुमान' : 'Rain Chance'}: ${weather.rainChancePercent}%`)}
            data-voice-text={`${language === 'hi' ? 'बारिश का अनुमान' : 'Rain Chance'}: ${weather.rainChancePercent}%`}
            className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-xs cursor-pointer hover:bg-white/25 transition-all"
          >
            <div className="flex items-center justify-center gap-1 text-emerald-200 mb-0.5">
              <CloudRain className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold text-emerald-100">
                {language === 'hi' ? 'बारिश का अनुमान' : language === 'pa' ? 'ਮੀਂਹ ਦਾ ਅਨੁਮਾਨ' : 'Rain Chance'}
              </span>
            </div>
            <span className="text-sm sm:text-base font-black text-white">
              {weather.rainChancePercent}%
            </span>
          </div>

          <div
            onClick={() => speak(`${language === 'hi' ? 'हवा की गति' : 'Wind speed'}: ${weather.windSpeedKmh} किलोमीटर प्रति घंटा`)}
            data-voice-text={`${language === 'hi' ? 'हवा की गति' : 'Wind speed'}: ${weather.windSpeedKmh} km/h`}
            className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-xs cursor-pointer hover:bg-white/25 transition-all"
          >
            <div className="flex items-center justify-center gap-1 text-emerald-200 mb-0.5">
              <Wind className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold text-emerald-100">
                {language === 'hi' ? 'हवा की गति' : language === 'pa' ? 'ਹਵਾ ਦੀ ਗਤੀ' : 'Wind'}
              </span>
            </div>
            <span className="text-sm sm:text-base font-black text-white">
              {weather.windSpeedKmh} <span className="text-[10px] font-normal">km/h</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Urgent Climate Advisory Alert */}
      <div
        id="home-crop-alert-card"
        className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-5 shadow-xs space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                  {t('early_warning_tag')}
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  {language === 'hi' ? 'उच्च तापमान जोखिम' : language === 'pa' ? 'ਵੱਧ ਗਰਮੀ ਦਾ ਖ਼ਤਰਾ' : 'High Heatwave Risk'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                {t('early_warning_desc')}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            id="btn-alert-why"
            data-voice-text={t('view_why_alert')}
            onClick={() => {
              speak(t('view_why_alert'));
              onOpenWhyAlert();
            }}
            className="w-full py-2.5 px-3 bg-white hover:bg-amber-100 text-slate-800 font-bold rounded-xl border border-amber-300 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>{t('view_why_alert')}</span>
          </button>

          <button
            id="btn-alert-view-action"
            data-voice-text={t('view_action_plan')}
            onClick={() => {
              speak(t('view_action_plan'));
              onOpenActionAlert();
            }}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('view_action_plan')}</span>
          </button>
        </div>
      </div>

      {/* 3. Systematically Arranged & Prominent Main Features Grid */}
      <div id="home-main-features-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {t('main_features')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainFeatures.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.id}
                data-voice-text={`${feat.title}, ${feat.description}`}
                onClick={() => {
                  speak(`${feat.title}`);
                  onNavigate(feat.tab);
                }}
                className={`bg-white rounded-3xl p-5 border border-slate-200 transition-all cursor-pointer shadow-xs hover:shadow-lg flex flex-col justify-between group ${feat.accentHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl ${feat.iconBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-700 group-hover:text-emerald-800">
                  <span>{feat.actionText}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
