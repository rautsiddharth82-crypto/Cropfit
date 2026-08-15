import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X, ArrowRight, Sparkles, Sprout, FlaskConical, Camera, Landmark, CloudSun, Wallet, Bot } from 'lucide-react';
import { AppTab } from '../types';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface SearchBarProps {
  onNavigate: (tab: AppTab) => void;
  onAskAi: (question: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

interface SearchShortcut {
  id: string;
  titleKey: string;
  categoryKey: string;
  icon: React.ComponentType<{ className?: string }>;
  tab: AppTab;
  keywords: string[];
}

const SHORTCUTS: SearchShortcut[] = [
  {
    id: 's-farm',
    titleKey: 'nav_farm',
    categoryKey: 'feature_farm_title',
    icon: Sprout,
    tab: 'farm',
    keywords: ['farm', 'crops', 'wheat', 'paddy', 'field', 'acres', 'moisture', 'health', 'खेत', 'फसल', 'गेहूं', 'ਨਮੀ']
  },
  {
    id: 's-weather',
    titleKey: 'nav_climate',
    categoryKey: 'feature_climate_title',
    icon: CloudSun,
    tab: 'climate',
    keywords: ['weather', 'forecast', 'rain', 'temperature', 'clock', 'humidity', 'wind', 'heatwave', 'मौसम', 'बारिश', 'तापमान', 'ਮੌਸਮ']
  },
  {
    id: 's-disease',
    titleKey: 'nav_disease',
    categoryKey: 'feature_disease_title',
    icon: Camera,
    tab: 'disease',
    keywords: ['disease', 'scanner', 'leaf', 'yellow rust', 'fungus', 'pesticide', 'spray', 'camera', 'रोग', 'कीट', 'दवा', 'ਪੱਤਾ', 'ਬਿਮਾਰੀ']
  },
  {
    id: 's-soil',
    titleKey: 'nav_testing',
    categoryKey: 'feature_testing_title',
    icon: FlaskConical,
    tab: 'testing',
    keywords: ['soil', 'water', 'npk', 'ph', 'testing', 'fertilizer', 'urea', 'lab', 'report', 'मिट्टी', 'पानी', 'खाद', 'ਯੂਰੀਆ']
  },
  {
    id: 's-schemes',
    titleKey: 'nav_schemes',
    categoryKey: 'feature_schemes_title',
    icon: Landmark,
    tab: 'schemes',
    keywords: ['scheme', 'government', 'subsidy', 'pm kisan', 'solar', 'insurance', 'drip', 'money', 'योजना', 'सब्सिडी', 'ਸਕੀਮ']
  },
  {
    id: 's-financials',
    titleKey: 'nav_financials',
    categoryKey: 'feature_financials_title',
    icon: Wallet,
    tab: 'financials',
    keywords: ['cost', 'profit', 'roi', 'money', 'budget', 'income', 'expense', 'market price', 'मुनाफा', 'खर्च', 'आमदनी', 'ਖ਼ਰਚਾ']
  },
  {
    id: 's-ai',
    titleKey: 'nav_ai',
    categoryKey: 'feature_ai_title',
    icon: Bot,
    tab: 'ai',
    keywords: ['ai', 'voice', 'assistant', 'bot', 'question', 'help', 'advice', 'speak', 'सवाल', 'सलाह', 'ਕਿਸਾਨ']
  }
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onNavigate,
  onAskAi,
  placeholder,
  autoFocus = false,
}) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [, setVoiceSpeechSupported] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const defaultPlaceholder = placeholder || t('search_placeholder');

  const popularSearches = language === 'hi'
    ? [
        '⚡ हीटवेव से गेहूं की सुरक्षा कैसे करें?',
        '🧪 मिट्टी में NPK व जिंक की मात्रा कैसे जांचें?',
        '🔍 गेहूं में पीला रतुआ (Yellow Rust) का उपचार',
        '🏛️ पीएम-कुसुम सोलर पंप 75% सब्सिडी योजना',
        '💰 प्रति एकड़ गेहूं फसल लागत व शुद्ध मुनाफा'
      ]
    : language === 'pa'
    ? [
        '⚡ ਕਣਕ ਵਿੱਚ ਗਰਮੀ ਅਤੇ ਲੂ ਤੋਂ ਬਚਾਅ',
        '🧪 ਮਿੱਟੀ ਦੀ ਪਰਖ ਅਤੇ ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ',
        '🔍 ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਦੇਸੀ ਤੇ ਰਸਾਇਣਕ ਇਲਾਜ',
        '🏛️ ਸੋਲਰ ਪੰਪ ਸਬਸਿਡੀ ਯੋਜਨਾ ਪੰਜਾਬ',
        '💰 ਕਣਕ ਦੇ ਝਾੜ ਅਤੇ ਮੁਨਾਫ਼ੇ ਦਾ ਹਿਸਾਬ'
      ]
    : [
        '⚡ High heatwave warning protection',
        '🧪 How to check NPK levels in soil?',
        '🔍 Yellow rust on wheat leaves cure',
        '🏛️ Solar pump subsidy scheme eligibility',
        '💰 Crop expense and profit calculator'
      ];

  // Initialize Web Speech Recognition with dynamic language
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results || [])
          .map((result: any) => result?.[0])
          .filter(Boolean)
          .map((result: any) => result?.transcript || '')
          .join('');

        setQuery(transcript);
      };

      recognition.onerror = (err: any) => {
        console.log('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setVoiceSpeechSupported(false);
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setQuery('');
      setIsListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log('Speech start exception', e);
        }
      } else {
        // Fallback simulation
        setTimeout(() => {
          setQuery(language === 'hi' ? 'गेहूं में सिंचाई का सही समय' : 'Wheat irrigation schedule');
          setIsListening(false);
        }, 2000);
      }
    }
  };

  const cleanQuery = query.trim().toLowerCase();

  const filteredShortcuts = cleanQuery
    ? SHORTCUTS.filter((s) => {
        const title = t(s.titleKey as any).toLowerCase();
        const cat = t(s.categoryKey as any).toLowerCase();
        return (
          title.includes(cleanQuery) ||
          cat.includes(cleanQuery) ||
          s.keywords.some((k) => k.includes(cleanQuery))
        );
      })
    : SHORTCUTS.slice(0, 5);

  const handleSelectShortcut = (shortcut: SearchShortcut) => {
    const label = t(shortcut.titleKey as any);
    speak(label);
    setIsFocused(false);
    onNavigate(shortcut.tab);
  };

  const handleAskAiWithQuery = (textToAsk: string) => {
    speak(textToAsk);
    setIsFocused(false);
    onAskAi(textToAsk);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-30">
      {/* Search Input Box */}
      <div
        className={`flex items-center gap-2 bg-white rounded-2xl border-2 px-3.5 py-2.5 transition-all shadow-md ${
          isListening
            ? 'border-emerald-500 ring-4 ring-emerald-100'
            : isFocused
            ? 'border-emerald-500 ring-4 ring-emerald-50 shadow-lg'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoFocus={autoFocus}
          placeholder={isListening ? (language === 'hi' ? '🎙️ आपकी आवाज सुनी जा रही है... बोलिए...' : '🎙️ Listening... Speak now...') : defaultPlaceholder}
          className="w-full bg-transparent text-slate-900 font-semibold text-sm sm:text-base outline-none placeholder:text-slate-400"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Mic Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          }`}
          title={isListening ? 'Click to stop' : 'Speak with voice microphone'}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>{language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'hi' ? 'माइक (Voice)' : 'Voice Mic'}</span>
            </>
          )}
        </button>
      </div>

      {/* Voice Listening Overlay Banner */}
      {isListening && (
        <div className="mt-2 p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-between text-xs font-bold animate-fadeIn shadow-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span>{language === 'hi' ? 'बोलिए! आवाज से खोज सक्रिय है...' : 'Speak now! Voice search active...'}</span>
          </div>
          <button
            onClick={() => {
              setQuery(language === 'hi' ? 'गेहूं को लू और तेज धूप से कैसे बचाएं?' : 'How to protect crops from heatwave?');
              setIsListening(false);
            }}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] underline cursor-pointer"
          >
            {language === 'hi' ? 'नमूना: "लू से बचाव"' : 'Try: "Heatwave protection"'}
          </button>
        </div>
      )}

      {/* Dropdown Suggestions Menu */}
      {isFocused && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsFocused(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-20 overflow-hidden divide-y divide-slate-100 max-h-[80vh] overflow-y-auto">
            {/* Quick Suggestions list */}
            <div className="p-2">
              <p className="px-3 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                {cleanQuery ? (language === 'hi' ? 'मिलते-जुलते फीचर्स' : 'Matching Features') : (language === 'hi' ? 'त्वरित नेविगेशन शॉर्टकट' : 'Quick Navigation Shortcuts')}
              </p>

              {filteredShortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button
                    key={shortcut.id}
                    onClick={() => handleSelectShortcut(shortcut)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          {t(shortcut.titleKey as any)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          {t(shortcut.categoryKey as any)}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </button>
                );
              })}
            </div>

            {/* AI Assistant Quick Ask Option */}
            <div className="p-3 bg-emerald-50/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t('nav_ai')}</span>
                </span>
              </div>

              {cleanQuery ? (
                <button
                  onClick={() => handleAskAiWithQuery(query)}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-between transition-all shadow-xs cursor-pointer"
                >
                  <span>{t('ask_ai_btn')}: "{query}"</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[11px] text-slate-500 font-medium">
                    {language === 'hi' ? 'या लोकप्रिय सवाल चुनें:' : 'Or pick a popular query:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAskAiWithQuery(item)}
                        className="text-xs bg-white hover:bg-emerald-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold transition-all text-left cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
