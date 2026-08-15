import React from 'react';
import { AppTab, FarmerProfile } from '../types';
import { Home, Sprout, CloudSun, Bot, BookOpen, FlaskConical, Camera, Landmark, Sliders, Wallet, LogOut, Volume2, VolumeX, Scale } from 'lucide-react';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  profile?: FarmerProfile;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const { t } = useLanguage();
  const { speak, voiceEnabled, toggleVoice } = useVoice();

  const navItems: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }>; emoji: string }[] = [
    { id: 'home', label: t('nav_home'), icon: Home, emoji: '🏠' },
    { id: 'farm', label: t('nav_farm'), icon: Sprout, emoji: '🌾' },
    { id: 'climate', label: t('nav_climate'), icon: CloudSun, emoji: '🌦️' },
    { id: 'testing', label: t('nav_testing'), icon: FlaskConical, emoji: '🧪' },
    { id: 'nutriblend', label: t('nav_nutriblend'), icon: Scale, emoji: '⚖️' },
    { id: 'disease', label: t('nav_disease'), icon: Camera, emoji: '🔍' },
    { id: 'schemes', label: t('nav_schemes'), icon: Landmark, emoji: '🏛️' },
    { id: 'simulator', label: t('nav_simulator'), icon: Sliders, emoji: '🔮' },
    { id: 'financials', label: t('nav_financials'), icon: Wallet, emoji: '💰' },
    { id: 'ai', label: t('nav_ai'), icon: Bot, emoji: '🤖' },
    { id: 'journal', label: t('nav_journal'), icon: BookOpen, emoji: '📖' },
  ];

  const handleNavClick = (item: { id: AppTab; label: string }) => {
    speak(item.label);
    onTabChange(item.id);
  };

  const handleLogoutClick = () => {
    speak(t('logout'));
    if (onLogout) onLogout();
  };

  return (
    <aside
      id="desktop-sidebar-nav"
      className="w-64 text-slate-800 hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 z-30 overflow-y-auto border-r border-slate-200/80 bg-white"
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            data-voice-text="एग्रीस्मार्ट कृषि ऐप"
            onClick={() => speak('AgriSmart AI')}
            className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            🌱
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-slate-900">AgriSmart</h1>
            <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">
              {t('nav_ai')}
            </p>
          </div>
        </div>

        {/* Voice Toggle Button */}
        <button
          onClick={toggleVoice}
          title={voiceEnabled ? 'वॉयस गाइड बंद करें (Voice Guide ON)' : 'वॉयस गाइड चालू करें (Voice Guide OFF)'}
          className={`p-2 rounded-xl transition-all cursor-pointer ${voiceEnabled
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-300/40 hover:bg-emerald-100/50'
            : 'bg-slate-50 text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              data-voice-text={item.label}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-bold text-sm transition-all text-left cursor-pointer ${isActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Panel: Logout */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50 space-y-2">
        <button
          id="btn-sidebar-logout"
          type="button"
          data-voice-text={t('logout')}
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-xs group"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>{t('logout')}</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-rose-500/80 group-hover:text-rose-700">
            Exit
          </span>
        </button>
      </div>
    </aside>
  );
};
