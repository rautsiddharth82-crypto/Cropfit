import React from 'react';
import { Bell, MapPin, Settings, Globe } from 'lucide-react';
import { FarmerProfile, Language } from '../types';

interface HeaderProps {
  profile: FarmerProfile;
  unreadCount: number;
  currentLang: Language;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  unreadCount,
  currentLang,
  onOpenNotifications,
  onOpenSettings,
  onLanguageChange,
}) => {
  return (
    <header
      id="app-top-header"
      className="bg-white border-b border-[#E6E9E5] px-4 py-3.5 sm:px-6 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Farmer Profile & Greeting */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#A8D5A2]/30 border border-[#A8D5A2] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
            👨‍🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#26332A] leading-tight">
                Good Morning, {profile.name} 🌱
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#68736B] flex items-center gap-1 font-medium mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#6FAF78] shrink-0" />
              <span>{profile.location}</span>
              <span className="mx-1">•</span>
              <span className="text-[#56965F] font-bold">{profile.totalAreaAcres} Acres</span>
            </p>
          </div>
        </div>

        {/* Right: Language, Notifications, Settings */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Quick Dropdown */}
          <div className="hidden sm:flex items-center gap-1 bg-[#F8F7EF] p-1 rounded-xl border border-[#E6E9E5]">
            <Globe className="w-3.5 h-3.5 text-[#68736B] ml-1.5" />
            {(['en', 'hi', 'pa'] as Language[]).map((lang) => (
              <button
                key={lang}
                id={`header-lang-${lang}`}
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all ${
                  currentLang === lang
                    ? 'bg-[#6FAF78] text-white shadow-2xs'
                    : 'text-[#68736B] hover:text-[#26332A]'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
              </button>
            ))}
          </div>

          {/* Notifications Button */}
          <button
            id="btn-header-notifications"
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-2xl bg-[#F8F7EF] hover:bg-[#EAF5EC] border border-[#E6E9E5] text-[#26332A] transition-all"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E88B8B] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            id="btn-header-settings"
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl bg-[#F8F7EF] hover:bg-[#EAF5EC] border border-[#E6E9E5] text-[#26332A] transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-[#68736B]" />
          </button>
        </div>
      </div>
    </header>
  );
};
