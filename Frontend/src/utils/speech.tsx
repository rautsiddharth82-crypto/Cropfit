import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '../types';

interface VoiceContextType {
  speak: (text: string, customLang?: Language) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  toggleVoice: () => void;
  currentSpeechText: string | null;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// Clean text for speech synthesis (strip emoji, markdown, weird symbols)
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu, '') // Emojis
    .replace(/[*_#`~[\]()<>]/g, ' ') // Markdown symbols
    .replace(/\s+/g, ' ')
    .trim();
}

export function speakWithBrowser(
  text: string,
  lang: Language = 'hi',
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  const clean = cleanTextForSpeech(text);
  if (!clean) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior audio

    const utterance = new SpeechSynthesisUtterance(clean);

    // Set locale code
    let langCode = 'hi-IN';
    if (lang === 'en') langCode = 'en-IN';
    else if (lang === 'pa') langCode = 'pa-IN';
    else langCode = 'hi-IN';

    utterance.lang = langCode;
    utterance.rate = 0.95; // Clear and easily audible
    utterance.pitch = 1.0;

    // Pick best voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      let matchedVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.slice(0, 2)));
      if (!matchedVoice && lang === 'pa') {
        // Fallback for Punjabi if not present on system
        matchedVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('Hindi'));
      }
      if (!matchedVoice && lang === 'hi') {
        matchedVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('Hindi') || v.lang.includes('India'));
      }
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}

export const VoiceProvider: React.FC<{ children: React.ReactNode; currentLang: Language }> = ({
  children,
  currentLang,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('agrismart_voice_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [currentSpeechText, setCurrentSpeechText] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('agrismart_voice_enabled', JSON.stringify(voiceEnabled));
    } catch {}
  }, [voiceEnabled]);

  // Load voices early
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentSpeechText(null);
  }, []);

  const speak = useCallback(
    (text: string, customLang?: Language) => {
      if (!voiceEnabled) return;
      const targetLang = customLang || currentLang;
      const clean = cleanTextForSpeech(text);
      if (!clean) return;

      setCurrentSpeechText(clean);
      speakWithBrowser(
        clean,
        targetLang,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          setCurrentSpeechText(null);
        }
      );
    },
    [voiceEnabled, currentLang]
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      const next = !prev;
      if (!next) {
        stopSpeaking();
      } else {
        const msg = currentLang === 'hi' ? 'आवाज़ गाइड चालू है' : currentLang === 'pa' ? 'ਅਵਾਜ਼ ਗਾਈਡ ਚਾਲੂ ਹੈ' : 'Voice guide enabled';
        speakWithBrowser(msg, currentLang);
      }
      return next;
    });
  }, [currentLang, stopSpeaking]);

  // Global Click Listener for any icon / button with icon click
  useEffect(() => {
    if (!voiceEnabled) return;

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Check if user clicked an input/textarea/select or is typing
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      // Find closest voice target or button / icon container
      const voiceTarget = target.closest<HTMLElement>(
        '[data-voice-text], button, a, [role="button"], .voiceable-card, svg'
      );

      if (!voiceTarget) return;

      // 1. Check explicit data-voice-text
      let textToSpeak = voiceTarget.getAttribute('data-voice-text');

      // 2. If not found and target is or contains an SVG / icon or button with SVG
      if (!textToSpeak) {
        const isSvgOrHasSvg = voiceTarget.tagName.toLowerCase() === 'svg' || voiceTarget.querySelector('svg') !== null;
        if (isSvgOrHasSvg) {
          // Check title, aria-label
          textToSpeak =
            voiceTarget.getAttribute('aria-label') ||
            voiceTarget.getAttribute('title') ||
            voiceTarget.innerText?.trim() ||
            '';
        }
      }

      // If this element didn't have explicit text, check parent button/card
      if (!textToSpeak) {
        const parentBtn = target.closest<HTMLElement>('button, [role="button"]');
        if (parentBtn) {
          textToSpeak =
            parentBtn.getAttribute('data-voice-text') ||
            parentBtn.getAttribute('aria-label') ||
            parentBtn.getAttribute('title') ||
            parentBtn.innerText?.trim() ||
            '';
        }
      }

      if (textToSpeak) {
        const clean = cleanTextForSpeech(textToSpeak);
        // Avoid speaking extremely long paragraphs on generic clicks, keep to concise label/heading (< 120 chars)
        if (clean && clean.length <= 160) {
          speak(clean, currentLang);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [voiceEnabled, currentLang, speak]);

  return (
    <VoiceContext.Provider
      value={{
        speak,
        stopSpeaking,
        isSpeaking,
        voiceEnabled,
        setVoiceEnabled,
        toggleVoice,
        currentSpeechText,
      }}
    >
      {children}
      {/* Floating Speaking Indicator Badge */}
      {isSpeaking && currentSpeechText && (
        <div
          id="voice-active-indicator"
          className="fixed top-4 right-4 sm:top-20 sm:right-6 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/95 text-white border border-emerald-500/50 shadow-2xl backdrop-blur-md animate-bounce"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black text-emerald-300">🔊 बोल रहा है:</span>
          <span className="text-xs font-bold max-w-[180px] sm:max-w-[260px] truncate text-slate-100">
            "{currentSpeechText}"
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              stopSpeaking();
            }}
            title="Stop audio"
            className="ml-1 text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
