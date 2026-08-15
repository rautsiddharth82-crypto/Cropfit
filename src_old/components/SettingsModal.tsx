import React from 'react';
import { Language, FarmerProfile } from '../types';
import { X, Globe, MapPin, Sliders, Volume2, HelpCircle, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  profile: FarmerProfile;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  currentLang,
  onLanguageChange,
  onClose,
}) => {
  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E6E9E5] shadow-2xl space-y-5 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
          <h3 className="text-lg font-black text-[#26332A]">Settings & Preferences</h3>
          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F8F7EF] text-[#68736B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Multilingual Selector */}
          <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5] space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-[#26332A] text-sm">
              <Globe className="w-4 h-4 text-[#6FAF78]" />
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
                  onClick={() => onLanguageChange(item.code as Language)}
                  className={`p-2.5 rounded-xl font-extrabold transition-all border ${
                    currentLang === item.code
                      ? 'bg-[#6FAF78] text-white border-[#6FAF78] shadow-xs'
                      : 'bg-white text-[#26332A] border-[#E6E9E5]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Farm Details */}
          <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5] space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-[#26332A] text-sm">
              <MapPin className="w-4 h-4 text-[#6FAF78]" />
              <span>Farm Profile</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#68736B] pt-1">
              <div>Farmer Name: <b className="text-[#26332A]">{profile.name}</b></div>
              <div>Location: <b className="text-[#26332A]">{profile.location}</b></div>
              <div>Total Area: <b className="text-[#26332A]">{profile.totalAreaAcres} Acres</b></div>
              <div>Active Fields: <b className="text-[#26332A]">{profile.totalFields} Fields</b></div>
            </div>
          </div>

          {/* Units & Voice Preferences */}
          <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5] space-y-2">
            <div className="flex items-center gap-2 font-extrabold text-[#26332A] text-sm">
              <Sliders className="w-4 h-4 text-[#6FAF78]" />
              <span>Units & Sensor Settings</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#68736B] pt-1">
              <div>Temperature: <b className="text-[#26332A]">Celsius (°C)</b></div>
              <div>Rainfall: <b className="text-[#26332A]">Millimeters (mm)</b></div>
              <div>Soil Moisture: <b className="text-[#26332A]">Volumetric %</b></div>
              <div>Soil Depth: <b className="text-[#26332A]">15 cm & 30 cm</b></div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="p-4 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl flex items-center justify-between text-[#26332A]">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#56965F]" />
              <div>
                <span className="font-extrabold block">Farmer Helpline & Support</span>
                <span className="text-[11px] text-[#68736B]">Kisan Call Center: 1800-180-1551</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
