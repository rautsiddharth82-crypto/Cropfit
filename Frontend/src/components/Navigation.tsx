import React, { useState } from 'react';
import { Home, Sprout, CloudSun, Bot, BookOpen, FlaskConical, Camera, Landmark, Sliders, Wallet, Scale, Menu } from 'lucide-react';
import { AppTab } from '../types';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainItems = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'farm', label: t('nav_farm'), icon: Sprout },
    { id: 'climate', label: t('nav_climate'), icon: CloudSun },
    { id: 'disease', label: t('nav_disease'), icon: Camera },
    { id: 'ai', label: t('nav_ai'), icon: Bot },
  ] as const;

  const secondaryItems = [
    { id: 'testing', label: t('nav_testing'), icon: FlaskConical },
    { id: 'nutriblend', label: t('nav_nutriblend'), icon: Scale },
    { id: 'schemes', label: t('nav_schemes'), icon: Landmark },
    { id: 'simulator', label: t('nav_simulator'), icon: Sliders },
    { id: 'financials', label: t('nav_financials'), icon: Wallet },
    { id: 'journal', label: t('nav_journal'), icon: BookOpen },
  ] as const;

  const handleTabClick = (item: { id: AppTab; label: string }) => {
    speak(item.label);
    onTabChange(item.id);
  };

  const isSecondaryActive = secondaryItems.some(item => item.id === activeTab);

  return (
    <>
      {/* Drawer / Hamburger Menu Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-950/25 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="md:hidden fixed bottom-20 left-4 right-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 px-2">
              {language === 'hi' ? 'अन्य सेवाएँ' : 'Other Features'}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleTabClick(item);
                      setIsMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/40 font-extrabold shadow-sm'
                        : 'bg-slate-55 text-slate-600 hover:bg-slate-100/70 border border-slate-200/40'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="text-[10px] tracking-tight whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Main Bottom Nav Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-40 px-2 py-2 shadow-lg"
      >
        <div className="flex items-center justify-between px-2 max-w-md mx-auto">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !isMenuOpen;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                data-voice-text={item.label}
                onClick={() => {
                  handleTabClick(item);
                  setIsMenuOpen(false);
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/40 font-extrabold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span className="text-[10px] tracking-tight whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}

          {/* More Hamburger Button */}
          <button
            id="nav-btn-more"
            data-voice-text={language === 'hi' ? 'अधिक' : 'More'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              isMenuOpen || isSecondaryActive
                ? 'bg-emerald-55 text-emerald-850 border border-emerald-200/40 font-extrabold shadow-xs'
                : 'text-slate-550 hover:text-slate-800'
            }`}
          >
            <Menu className={`w-4 h-4 mb-0.5 ${isMenuOpen || isSecondaryActive ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight whitespace-nowrap">{language === 'hi' ? 'अधिक' : 'More'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
