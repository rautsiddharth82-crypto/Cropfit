import React from 'react';
import { Language, FarmerProfile } from '../types';
import { X, Globe, MapPin, Sliders, Volume2, HelpCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/translations';

interface SettingsModalProps {
  profile: FarmerProfile;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  currentLang: propLang,
  onLanguageChange,
  onClose,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const currentLang = propLang || language;

  const handleSelectLang = (code: Language) => {
    setLanguage(code);
    if (onLanguageChange) onLanguageChange(code);
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-lg font-black text-slate-900">
            {language === 'hi' ? 'सेटिंग्स एवं प्राथमिकताएं' : 'Settings & Preferences'}
          </h3>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Multilingual Selector */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Language / भाषा / ਭਾਸ਼ਾ</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleSelectLang(item.code as Language)}
                  className={`p-2.5 rounded-xl font-extrabold transition-all border cursor-pointer ${
                    currentLang === item.code
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Farm Details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'खेत का विवरण' : 'Farm Profile'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>{language === 'hi' ? 'किसान का नाम:' : 'Farmer Name:'} <b className="text-slate-900">{profile.name}</b></div>
              <div>{language === 'hi' ? 'स्थान:' : 'Location:'} <b className="text-slate-900">{profile.location}</b></div>
              <div>{language === 'hi' ? 'कुल रकबा:' : 'Total Area:'} <b className="text-slate-900">{profile.totalAreaAcres} {language === 'hi' ? 'एकड़' : 'Acres'}</b></div>
              <div>{language === 'hi' ? 'सक्रिय खेत:' : 'Active Fields:'} <b className="text-slate-900">{profile.totalFields} {language === 'hi' ? 'खेत' : 'Fields'}</b></div>
            </div>
          </div>

          {/* Units & Sensor Settings */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'इकाइयां एवं सेंसर सेटिंग्स' : 'Units & Sensor Settings'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>{language === 'hi' ? 'तापमान:' : 'Temperature:'} <b className="text-slate-900">सेल्सियस (°C)</b></div>
              <div>{language === 'hi' ? 'वर्षा:' : 'Rainfall:'} <b className="text-slate-900">मिलीमीटर (mm)</b></div>
              <div>{language === 'hi' ? 'मिट्टी नमी:' : 'Soil Moisture:'} <b className="text-slate-900">प्रतिशत (%)</b></div>
              <div>{language === 'hi' ? 'गहराई:' : 'Soil Depth:'} <b className="text-slate-900">15 सेमी & 30 सेमी</b></div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-slate-900">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="font-extrabold block">{language === 'hi' ? 'किसान हेल्पलाइन एवं सहायता' : 'Farmer Helpline & Support'}</span>
                <span className="text-[11px] text-slate-600">{language === 'hi' ? 'किसान कॉल सेंटर:' : 'Kisan Call Center:'} 1800-180-1551</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
