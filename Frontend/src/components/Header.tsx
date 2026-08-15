import React from 'react';
import { Bell, MapPin, Settings, Globe, Undo2, Redo2, Volume2, VolumeX } from 'lucide-react';
import { FarmerProfile, Language, AppTab } from '../types';
import { SearchBar } from './SearchBar';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface HeaderProps {
  profile: FarmerProfile;
  unreadCount: number;
  currentLang: Language;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (tab: AppTab) => void;
  onAskAi: (question: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  unreadCount,
  currentLang: propLang,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onOpenNotifications,
  onOpenSettings,
  onLanguageChange,
  onNavigate,
  onAskAi,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { speak, voiceEnabled, toggleVoice } = useVoice();
  const currentLang = propLang || language;

  const handleLangSelect = (lang: Language) => {
    setLanguage(lang);
    if (onLanguageChange) onLanguageChange(lang);
    const langNames = { en: 'English language selected', hi: 'हिंदी भाषा चुनी गई', pa: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ' };
    speak(langNames[lang], lang);
  };

  const handleUndo = () => {
    if (canUndo && onUndo) {
      speak(t('undo'));
      onUndo();
    }
  };

  const handleRedo = () => {
    if (canRedo && onRedo) {
      speak(t('redo'));
      onRedo();
    }
  };

  const handleNotificationsClick = () => {
    speak(t('notifications'));
    onOpenNotifications();
  };

  const handleSettingsClick = () => {
    speak(t('settings'));
    onOpenSettings();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('good_morning');
    if (hour < 17) return t('good_afternoon');
    return t('good_evening');
  };

  return (
    <header
      id="app-top-header"
      className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 sm:px-6 sticky top-0 z-20 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Greeting & Location + Undo / Redo buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              data-voice-text={profile.name}
              onClick={() => speak(`${profile.name}, ${profile.location}`)}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs cursor-pointer"
            >
              🌱
            </div>
            <div>
              <h1
                data-voice-text={getGreeting()}
                onClick={() => speak(getGreeting())}
                className="text-base sm:text-lg font-black text-slate-800 leading-tight cursor-pointer hover:text-emerald-700 transition-colors"
              >
                {getGreeting()} 🌱
              </h1>
              <p
                data-voice-text={`${profile.location}, ${profile.totalAreaAcres} ${t('acres')}`}
                onClick={() => speak(`${profile.location}, ${profile.totalAreaAcres} ${t('acres')}`)}
                className="text-xs text-slate-500 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{profile.location}</span>
                <span className="mx-1 text-slate-300">•</span>
                <span className="text-emerald-700 font-bold">{profile.totalAreaAcres} {t('acres')}</span>
              </p>
            </div>

            {/* Undo and Redo Controls */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 ml-1">
              <button
                id="btn-header-undo"
                type="button"
                data-voice-text={t('undo')}
                onClick={handleUndo}
                disabled={!canUndo}
                title={`${t('undo')} (Ctrl+Z)`}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                  canUndo
                    ? 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-100/80 cursor-pointer active:scale-95 shadow-2xs'
                    : 'text-slate-300 cursor-not-allowed opacity-40'
                }`}
                aria-label="Undo"
              >
                <Undo2 className="w-4 h-4" />
                <span className="text-[10px] hidden lg:inline">{t('undo')}</span>
              </button>

              <div className="w-px h-3.5 bg-slate-300 mx-0.5" />

              <button
                id="btn-header-redo"
                type="button"
                data-voice-text={t('redo')}
                onClick={handleRedo}
                disabled={!canRedo}
                title={`${t('redo')} (Ctrl+Y)`}
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${
                  canRedo
                    ? 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-100/80 cursor-pointer active:scale-95 shadow-2xs'
                    : 'text-slate-300 cursor-not-allowed opacity-40'
                }`}
                aria-label="Redo"
              >
                <Redo2 className="w-4 h-4" />
                <span className="text-[10px] hidden lg:inline">{t('redo')}</span>
              </button>
            </div>
          </div>

          {/* User Profile & Notifications for Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Mobile Voice Toggle */}
            <button
              onClick={toggleVoice}
              title={voiceEnabled ? 'वॉयस बंद करें' : 'वॉयस चालू करें'}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                voiceEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Mobile Language Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              {(['en', 'hi', 'pa'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  data-voice-text={lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
                  onClick={() => handleLangSelect(lang)}
                  className={`px-1.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                    currentLang === lang
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'ਪੰ'}
                </button>
              ))}
            </div>

            <button
              id="btn-header-notifications-mobile"
              data-voice-text={t('notifications')}
              onClick={handleNotificationsClick}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              id="btn-header-settings-mobile"
              data-voice-text={t('settings')}
              onClick={handleSettingsClick}
              className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Search Bar & Voice Mic */}
        <div className="flex-1 max-w-xl">
          <SearchBar onNavigate={onNavigate} onAskAi={onAskAi} />
        </div>

        {/* Right: Controls & Language */}
        <div className="hidden md:flex items-center gap-2">
          {/* Voice Toggle */}
          <button
            onClick={toggleVoice}
            data-voice-text={voiceEnabled ? 'वॉयस गाइड सक्रिय है' : 'वॉयस गाइड बंद है'}
            title={voiceEnabled ? 'बोलकर सुनाना सक्रिय है (Voice Guide ON)' : 'बोलकर सुनाना बंद है (Voice Guide OFF)'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
              voiceEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{voiceEnabled ? (language === 'hi' ? 'आवाज़: ऑन' : language === 'pa' ? 'ਅਵਾਜ਼: ਆਨ' : 'Voice: ON') : (language === 'hi' ? 'आवाज़: ऑफ' : 'Voice: OFF')}</span>
          </button>

          {/* User Profile Pill */}
          <button
            id="btn-header-user-profile"
            data-voice-text={`${profile.name}, किसान प्रोफाइल`}
            onClick={handleSettingsClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-800 transition-all cursor-pointer"
            title="Logged in as Profile & Settings"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              👨‍🌾
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-slate-800 leading-tight">{profile.name}</p>
            </div>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
            {(['en', 'hi', 'pa'] as Language[]).map((lang) => (
              <button
                key={lang}
                id={`header-lang-${lang}`}
                data-voice-text={lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी भाषा' : 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ'}
                onClick={() => handleLangSelect(lang)}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  currentLang === lang
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
              </button>
            ))}
          </div>

          {/* Notifications Button */}
          <button
            id="btn-header-notifications"
            data-voice-text={t('notifications')}
            onClick={handleNotificationsClick}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            title={t('notifications')}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            id="btn-header-settings"
            data-voice-text={t('settings')}
            onClick={handleSettingsClick}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            title={t('settings')}
          >
            <Settings className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
