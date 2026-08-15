import React, { useState } from 'react';
import { 
  Home, 
  Sprout, 
  CloudSun, 
  Bot, 
  BookOpen, 
  FlaskConical, 
  Camera, 
  Landmark, 
  Sliders, 
  Wallet, 
  Scale, 
  Menu,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import { AppTab } from '../types';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenSettings?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange,
  onOpenSettings 
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { speak, voiceEnabled, toggleVoice } = useVoice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainItems = [
    { id: 'home', icon: Home },
    { id: 'farm', icon: Sprout },
    { id: 'climate', icon: CloudSun },
    { id: 'nutriblend', icon: Scale },
    { id: 'ai', icon: Bot },
  ] as const;

  const secondaryItems = [
    { id: 'disease', label: t('nav_disease'), icon: Camera },
    { id: 'testing', label: t('nav_testing'), icon: FlaskConical },
    { id: 'schemes', label: t('nav_schemes'), icon: Landmark },
    { id: 'simulator', label: t('nav_simulator'), icon: Sliders },
    { id: 'financials', label: t('nav_financials'), icon: Wallet },
    { id: 'journal', label: t('nav_journal'), icon: BookOpen },
  ] as const;

  const getShortLabel = (id: string) => {
    const labels: Record<string, Record<string, string>> = {
      home: {
        en: 'Home',
        hi: 'होम',
        pa: 'ਮੁੱਖ'
      },
      farm: {
        en: 'My Farm',
        hi: 'मेरा खेत',
        pa: 'ਮੇਰਾ ਖੇਤ'
      },
      climate: {
        en: 'Weather',
        hi: 'मौसम',
        pa: 'ਮੌਸਮ'
      },
      nutriblend: {
        en: 'NutriBlend',
        hi: 'न्यूट्रीब्लेंड',
        pa: 'ਨਿਊਟ੍ਰੀਬਲੈਂਡ'
      },
      ai: {
        en: 'AI Agent',
        hi: 'एआई मित्र',
        pa: 'ਏਆਈ ਮਿੱਤਰ'
      }
    };
    return labels[id]?.[language] || labels[id]?.['en'] || id;
  };

  const handleTabClick = (item: { id: AppTab; label: string }) => {
    speak(item.label);
    onTabChange(item.id);
  };

  const handleLangSelect = (lang: 'en' | 'hi' | 'pa') => {
    setLanguage(lang);
    const langNames = { en: 'English language selected', hi: 'हिंदी भाषा चुनी गई', pa: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ' };
    speak(langNames[lang], lang);
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
          <div className="md:hidden fixed bottom-20 left-4 right-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-1">
                {language === 'hi' ? 'अन्य सेवाएँ' : 'Other Features'}
              </h3>
              <div className="grid grid-cols-3 gap-2.5">
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
                      className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/40 font-extrabold shadow-sm'
                          : 'bg-slate-50 text-slate-650 hover:bg-slate-100 border border-slate-200/40'
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 mb-1 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span className="text-[10px] tracking-tight whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Settings Utilities Card inside Hamburger drawer */}
            <div className="pt-3.5 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                  {language === 'hi' ? 'भाषा' : 'Language'}
                </span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
                  {([
                    { code: 'en', display: 'EN' },
                    { code: 'hi', display: 'हिन्दी' },
                    { code: 'pa', display: 'ਪੰ' }
                  ] as const).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLangSelect(lang.code)}
                      className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                        language === lang.code
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      {lang.display}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={toggleVoice}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer ${
                    voiceEnabled
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-550 border-slate-200'
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span>{voiceEnabled ? (language === 'hi' ? 'आवाज़: ऑन' : 'Voice: ON') : (language === 'hi' ? 'आवाज़: ऑफ' : 'Voice: OFF')}</span>
                </button>

                {onOpenSettings && (
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Bottom Nav Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-40 px-2 py-2 shadow-lg"
      >
        <div className="flex items-center justify-between px-1.5 max-w-md mx-auto">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !isMenuOpen;
            const label = getShortLabel(item.id);
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                data-voice-text={label}
                onClick={() => {
                  handleTabClick({ id: item.id, label });
                  setIsMenuOpen(false);
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/40 font-extrabold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span className="text-[10px] tracking-tight whitespace-nowrap">{label}</span>
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
                ? 'bg-emerald-50 text-emerald-850 border border-emerald-200/40 font-extrabold shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
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
