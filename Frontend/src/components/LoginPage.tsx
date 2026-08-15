import React, { useState } from 'react';
import { FarmerProfile, Language } from '../types';
import {
  MapPin,
  ArrowRight,
  Sparkles,
  Globe
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface LoginPageProps {
  onLogin: (profile?: Partial<FarmerProfile>) => void;
  defaultLocation?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  defaultLocation = 'Rajpura, Punjab'
}) => {
  const { language, setLanguage } = useLanguage();
  const { speak } = useVoice();
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [farmerName, setFarmerName] = useState<string>(
    language === 'hi' ? 'गुरप्रीत सिंह' : 'Gurpreet Singh'
  );
  const [location, setLocation] = useState<string>(defaultLocation);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    speak(language === 'hi' ? `स्वागत है ${farmerName}` : `Welcome ${farmerName}`);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: farmerName,
        location: location
      });
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    speak(language === 'hi' ? 'डेमो लॉगिन सफल' : 'Demo login successful');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 400);
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-white"
    >
      {/* Background Atmospheric Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6">
          {/* Top Language Toggle on Login Page */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'भाषा चुनें' : language === 'pa' ? 'ਭਾਸ਼ਾ ਚੁਣੋ' : 'Choose Language'}</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
              {(['en', 'hi', 'pa'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLanguage(lang);
                    speak(lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ');
                  }}
                  className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ਪੰਜਾਬੀ'}
                </button>
              ))}
            </div>
          </div>

          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-emerald-500/30">
              🌱
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AgriSmart
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'hi'
                  ? 'स्मार्ट कृषि एवं जलवायु सुरक्षा मंच'
                  : language === 'pa'
                  ? 'ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਅਤੇ ਮੌਸਮ ਸੁਰੱਖਿਆ'
                  : 'Climate-Smart Agronomy Platform'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'hi' ? 'किसान मोबाइल नंबर' : language === 'pa' ? 'ਕਿਸਾਨ ਮੋਬਾਈਲ ਨੰਬਰ' : 'Farmer Mobile Number'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'hi' ? 'किसान का नाम' : language === 'pa' ? 'ਕਿਸਾਨ ਦਾ ਨਾਮ' : 'Farmer Name'}
              </label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-3 px-4 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Farmer Full Name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'hi' ? 'स्थान / जिला व राज्य' : language === 'pa' ? 'ਜ਼ਿਲ੍ਹਾ ਅਤੇ ਪਿੰਡ' : 'Farm Region / Location'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="e.g. Rajpura, Punjab"
                />
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span>{language === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging In...'}</span>
              ) : (
                <>
                  <span>
                    {language === 'hi'
                      ? 'AgriSmart में प्रवेश करें'
                      : language === 'pa'
                      ? 'AgriSmart ਵਿੱਚ ਲਾਗਇਨ ਕਰੋ'
                      : 'Sign In to AgriSmart'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo One-Click Access */}
          <div className="pt-4 border-t border-slate-700/60 text-center space-y-2.5">
            <button
              id="btn-quick-demo-login"
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-3 px-4 bg-slate-700/60 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border border-slate-600 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'hi'
                  ? 'एक क्लिक में डेमो किसान लॉगिन'
                  : language === 'pa'
                  ? 'ਸਿੱਧਾ ਕਿਸਾਨ ਡੈਮੋ ਲਾਗਇਨ'
                  : 'One-Click Farmer Demo Login'}
              </span>
            </button>
            <p className="text-[11px] text-slate-400">
              {language === 'hi'
                ? 'राजपुरा, पंजाब जलवायु प्रोफाइल के साथ तुरंत प्रवेश'
                : 'Instant access with Punjab farm profile'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
