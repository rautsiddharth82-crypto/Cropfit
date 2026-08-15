import React, { useState, useEffect } from 'react';
import {
  AiChatMessage,
  FarmMemoryItem,
  FarmerProfile
} from '../types';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  Bell,
  HelpCircle,
  Brain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';

interface AiAssistantViewProps {
  profile: FarmerProfile;
  initialQuestion?: string;
  farmMemory: FarmMemoryItem[];
  onMarkActionDone?: (actionTitle: string) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  profile,
  initialQuestion = '',
  farmMemory,
  onMarkActionDone,
}) => {
  const { t, language } = useLanguage();

  const getInitialAssistantGreeting = () => {
    if (language === 'hi') {
      return `नमस्ते किसान ${profile.name} जी! 🌱\nमैं आपका एआई कृषि सलाहकार हूँ। मैं राजपुरा में आपके खेतों की 24 घंटे निगरानी करता हूँ।\n\nआपके गेहूं के खेत (खेत 01) में मिट्टी की नमी 38% है और कल 36°C की तेज धूप व लू का अनुमान है। आज मैं आपकी क्या सहायता करूँ?`;
    } else if (language === 'pa') {
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ${profile.name} ਜੀ! 🌱\nਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀ ਮਾਹਿਰ ਹਾਂ।\n\nਤੁਹਾਡੇ ਕਣਕ ਦੇ ਖੇਤ ਵਿੱਚ ਨਮੀ 38% ਹੈ ਅਤੇ ਕੱਲ੍ਹ 36°C ਗਰਮੀ ਦੀ ਲਹਿਰ ਦਾ ਅਨੁਮਾਨ ਹੈ। ਅੱਜ ਤੁਸੀਂ ਕੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦੇ ਹੋ?`;
    } else {
      return `Hello Farmer ${profile.name}! 🌱\nI am your AI Climate Smart Assistant. I monitor your farm in Rajpura continuously.\n\nYour Wheat field (Field 01) is currently at 38% soil moisture and 36°C heat is forecasted for tomorrow. How can I help you today?`;
    }
  };

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: getInitialAssistantGreeting(),
      timestamp: 'Just now',
      supportingData: {
        soilMoisture: '38% (Low)',
        temperature: '36°C (Peak tomorrow)',
        actionWindow: '6:00 AM - 8:00 AM',
        confidence: '89%'
      }
    }
  ]);

  const [input, setInput] = useState<string>(initialQuestion);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceModeActive, setVoiceModeActive] = useState<boolean>(false);
  const [speechStatusMsg, setSpeechStatusMsg] = useState<string>('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>('msg-1');
  const [actionDoneState, setActionDoneState] = useState<boolean>(false);
  const [actionRemindedState, setActionRemindedState] = useState<boolean>(false);
  const [recognitionRef, setRecognitionRef] = useState<any>(null);

  // Update initial message if language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg-1') {
        return [
          {
            ...prev[0],
            text: getInitialAssistantGreeting()
          }
        ];
      }
      return prev;
    });
  }, [language]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = language === 'hi' ? 'hi' : language === 'pa' ? 'pa' : 'en';
    const naturalVoice = voices.find(
      v => v.lang.includes(targetLang) || v.name.includes('Google') || v.name.includes('Natural')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const suggestedQuestions = language === 'hi'
    ? [
        "क्या मुझे आज गेहूं में पानी लगाना चाहिए?",
        "कल तापमान 36°C होने पर फसल कैसे बचाएं?",
        "गेहूं की पत्तियों में पीलापन आने का क्या कारण है?",
        "इस मौसम में कौन सी नई फसल लगाना लाभदायक होगा?",
        "क्या अगले 3 दिन में बारिश होने का अनुमान है?"
      ]
    : language === 'pa'
    ? [
        "ਕੀ ਮੈਨੂੰ ਅੱਜ ਕਣਕ ਨੂੰ ਪਾਣੀ ਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
        "ਕੱਲ੍ਹ 36°C ਗਰਮੀ ਤੋਂ ਫ਼ਸਲ ਕਿਵੇਂ ਬਚਾਈਏ?",
        "ਕਣਕ ਦੇ ਪੱਤੇ ਪੀਲੇ ਪੈਣ ਦਾ ਕੀ ਕਾਰਨ ਹੈ?",
        "ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਕਿਹੜੀ ਫ਼ਸਲ ਲਾਉਣੀ ਠੀਕ ਰਹੇਗੀ?",
        "ਕੀ ਅਗਲੇ ਦਿਨਾਂ ਵਿੱਚ ਮੀਂਹ ਪਵੇਗਾ?"
      ]
    : [
        "Should I irrigate my wheat today?",
        "How to protect crops from 36°C heat tomorrow?",
        "Why are wheat leaves turning yellow?",
        "Which high-value crop is suitable for this soil?",
        "Is there any rain forecasted this week?"
      ];

  const handleSendMessage = async (customText?: string, wasVoiceQuery = false) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setSpeechStatusMsg('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: language,
          farmContext: {
            farmerName: profile.name,
            location: profile.location,
            crops: 'Wheat (4.5 Acres), Mustard (2.5 Acres), Gram (2 Acres)',
            soilMoisture: '38%',
            forecastTemp: '36°C'
          }
        }),
      });

      const data = await res.json();
      const replyText = data.reply || (language === 'hi' 
        ? "मैं सुझाव देता हूँ कि खेत 01 (गेहूं) में कल सुबह 6:00 से 8:00 बजे के बीच हल्की सिंचाई करें। इससे दोपहर में 36°C तापमान के दौरान जड़ों में ठंडक रहेगी और दानों का आकार अच्छा बनेगा।"
        : "I recommend applying light irrigation to Field 01 (Wheat) tomorrow morning between 6:00 AM - 8:00 AM to buffer against the forecasted 36°C heatwave.");

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportingData: {
          soilMoisture: '38%',
          temperature: '36°C tomorrow',
          actionWindow: '6:00 AM - 8:00 AM',
          confidence: '89%'
        }
      };

      setMessages((prev) => [...prev, aiMsg]);
      setExpandedMessageId(aiMsg.id);

      if (wasVoiceQuery || voiceModeActive) {
        setTimeout(() => {
          speakText(replyText, aiMsg.id);
        }, 300);
      }
    } catch (e) {
      console.error("AI chat error:", e);
      const fallbackText = language === 'hi'
        ? "💧 **सिंचाई परामर्श**:\n\n• **कार्य**: खेत 01 (गेहूं) में हल्की सिंचाई करें।\n• **सही समय**: कल सुबह 6:00 बजे से 8:00 बजे के बीच।\n• **कारण**: दोपहर में 36°C धूप आने से पहले जड़ों को सुरक्षित करना और वाष्पीकरण से बचाव।"
        : `💧 **Irrigation Recommendation**:\n\n• **Action**: Apply light irrigation to Field 01 (Wheat).\n• **Best Window**: 6:00 AM – 8:00 AM tomorrow morning.\n• **Why**: Cools the root zone before peak 36°C afternoon heat.`;

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (wasVoiceQuery || voiceModeActive) {
        speakText(aiMsg.text, aiMsg.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = async () => {
    if (isRecording) {
      if (recognitionRef) {
        recognitionRef.stop();
      }
      setIsRecording(false);
      setSpeechStatusMsg('');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechStatusMsg(language === 'hi' ? 'माइक एक्टिव किया गया।' : 'Microphone simulated.');
      setInput(language === 'hi' ? 'क्या मुझे आज गेहूं में पानी लगाना चाहिए?' : 'Should I irrigate my wheat field today?');
      setVoiceModeActive(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceModeActive(true);
        setSpeechStatusMsg(language === 'hi' ? '🎙️ आवाज सुनी जा रही है... बोलिए...' : '🎙️ Listening... Speak now.');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        if (event.results) {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i]?.[0]?.transcript || '';
          }
        }
        if (transcript) {
          setInput(transcript);
          setSpeechStatusMsg(`Recognized: "${transcript}"`);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setInput(language === 'hi' ? 'क्या मुझे आज गेहूं में पानी लगाना चाहिए?' : 'Should I irrigate my wheat field today?');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognitionRef(recognition);
      recognition.start();
    } catch {
      setIsRecording(false);
      setInput(language === 'hi' ? 'क्या मुझे आज गेहूं में पानी लगाना चाहिए?' : 'Should I irrigate my wheat field today?');
      setVoiceModeActive(true);
    }
  };

  return (
    <div id="ai-assistant-view-container" className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl shadow-2xs">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{t('ai_title')}</h2>
            <p className="text-xs text-slate-600">{t('ai_desc')}</p>
          </div>
        </div>
      </div>

      {/* RECOMMENDED ACTION CARD */}
      <div id="ai-recommended-action-card" className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
              💧
            </span>
            <div>
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                {t('action_required')}
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {language === 'hi' ? 'सुबह हल्की सिंचाई की तत्काल सिफारिश' : 'EARLY MORNING IRRIGATION RECOMMENDED'}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full uppercase">
            {language === 'hi' ? 'उच्च प्राथमिकता' : 'High Priority'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-2xl border border-emerald-200">
          <div>
            <span className="text-slate-500 block font-semibold">
              {language === 'hi' ? 'मुख्य कारण:' : 'Reason:'}
            </span>
            <span className="font-bold text-slate-900">
              {language === 'hi' ? 'मिट्टी में नमी कम (38%)' : 'Soil moisture declining (38%)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">
              {language === 'hi' ? 'आगामी तापमान:' : 'Expected Heat:'}
            </span>
            <span className="font-bold text-rose-600">
              {language === 'hi' ? 'कल दोपहर 36°C लू' : '36°C High tomorrow'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block font-semibold">
              {language === 'hi' ? 'उपयुक्त समय चक्र:' : 'Suggested Window:'}
            </span>
            <span className="font-bold text-emerald-700">
              {language === 'hi' ? 'सुबह 6:00 – 8:00 बजे' : '6:00 AM – 8:00 AM'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            id="btn-mark-action-done"
            onClick={() => {
              setActionDoneState(true);
              if (onMarkActionDone) onMarkActionDone(language === 'hi' ? 'खेत 01 में सुबह की सिंचाई' : 'Morning Irrigation in Field 01');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
              actionDoneState
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionDoneState ? (language === 'hi' ? '✓ कार्य पूरा दर्ज हुआ' : '✓ Marked as Done') : (language === 'hi' ? 'पूरा हुआ चिह्नित करें' : 'Mark as Done')}</span>
          </button>

          <button
            id="btn-action-remind-me"
            onClick={() => setActionRemindedState(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>{actionRemindedState ? (language === 'hi' ? '✓ सुबह 6 बजे का रिमाइंडर सेट' : '✓ Reminder Set for 6 AM') : (language === 'hi' ? 'रिमाइंडर लगाएं' : 'Remind Me')}</span>
          </button>

          <button
            id="btn-action-ask-ai-details"
            onClick={() => handleSendMessage(language === 'hi' ? 'सुबह 6 से 8 बजे पानी लगाना सबसे सही क्यों है?' : "Why is early morning 6-8 AM the best irrigation window?")}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>{language === 'hi' ? 'कारण विस्तार से पूछें' : 'Ask AI Why'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div id="ai-suggested-questions-section" className="space-y-2">
        <span className="text-xs font-bold text-slate-600 block">
          {language === 'hi' ? 'किसानों द्वारा अक्सर पूछे जाने वाले सवाल:' : 'Suggested Farmer Questions:'}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              id={`btn-suggested-q-${idx}`}
              onClick={() => handleSendMessage(q)}
              className="px-3.5 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-500 text-slate-800 text-xs font-bold rounded-2xl whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
            >
              🌱 "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div id="ai-chat-messages-container" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-[11px] text-slate-500 px-1 w-full max-w-[88%] sm:max-w-[80%]">
                <span className="font-bold">{msg.sender === 'user' ? (language === 'hi' ? 'आप (किसान)' : 'You') : 'AgriSmart AI'}</span>
                
                {/* Voice Speaker Button */}
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.text, msg.id)}
                    className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                      speakingMessageId === msg.id
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    {speakingMessageId === msg.id ? (
                      <>
                        <VolumeX className="w-3 h-3" />
                        <span>{language === 'hi' ? 'आवाज रोकें' : 'Stop'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>{language === 'hi' ? 'आवाज में सुनें 🎙️' : 'Listen Voice 🎙️'}</span>
                      </>
                    )}
                  </button>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-2xs'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {/* Supporting Data Expander */}
                {msg.sender === 'assistant' && msg.supportingData && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs">
                    <button
                      id={`btn-toggle-support-${msg.id}`}
                      onClick={() =>
                        setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)
                      }
                      className="text-emerald-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{expandedMessageId === msg.id ? (language === 'hi' ? 'सेंसर डेटा छुपाएं' : 'Hide supporting data') : (language === 'hi' ? 'सेंसर व मौसम डेटा देखें' : 'View supporting data')}</span>
                      {expandedMessageId === msg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {expandedMessageId === msg.id && (
                      <div className="mt-2 grid grid-cols-2 gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-[11px]">
                        <div>{language === 'hi' ? 'मिट्टी नमी:' : 'Soil Moisture:'} <b className="text-slate-900">{msg.supportingData.soilMoisture}</b></div>
                        <div>{language === 'hi' ? 'तापमान:' : 'Temperature:'} <b className="text-slate-900">{msg.supportingData.temperature}</b></div>
                        <div>{language === 'hi' ? 'कार्य समय:' : 'Action Window:'} <b className="text-emerald-700">{msg.supportingData.actionWindow}</b></div>
                        <div>{language === 'hi' ? 'सटीकता:' : 'Confidence:'} <b className="text-emerald-700">{msg.supportingData.confidence}</b></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold p-3 bg-emerald-50 rounded-2xl w-fit animate-pulse">
              <Bot className="w-4 h-4" />
              <span>{language === 'hi' ? 'मौसम मॉडल एवं खेत सेंसर का विश्लेषण जारी...' : 'Analyzing soil sensors & weather models...'}</span>
            </div>
          )}
        </div>

        {/* Speech Status Feedback Banner */}
        {speechStatusMsg && (
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mic className="w-4 h-4 animate-pulse text-emerald-600" />
              <span>{speechStatusMsg}</span>
            </span>
            <button
              onClick={() => setSpeechStatusMsg('')}
              className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
          <button
            id="btn-voice-input"
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-500 animate-bounce'
                : 'bg-slate-100 hover:bg-emerald-50 text-slate-800 border-slate-200'
            }`}
            title="Voice Input"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-700" />}
          </button>

          <input
            id="input-ai-chat"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isRecording ? (language === 'hi' ? 'आपकी आवाज सुनी जा रही है...' : 'Listening to your voice...') : t('ask_ai_placeholder')}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            id="btn-send-chat"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* YOUR FIELD'S MEMORY 🧠 (AI Crop Memory) */}
      <div id="ai-crop-memory-section" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-lg font-black text-slate-900">{t('memory_title')}</h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'मौसम की घटनाएं, किसान द्वारा उठाए गए कदम और उनसे हुए फायदे' : 'Historical log of climate events, farmer interventions & outcomes'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {farmMemory.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                    {item.date}
                  </span>
                  <span className="text-sm font-extrabold">{item.crop}</span>
                </div>
                <span className="text-rose-600 font-bold">{item.eventType}</span>
              </div>

              <p className="text-slate-600 font-medium">{item.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-bold">
                    {language === 'hi' ? 'किया गया कार्य:' : 'Action Taken:'}
                  </span>
                  <span className="text-slate-900 font-semibold">{item.actionTaken}</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 block font-bold">
                    {language === 'hi' ? 'परिणाम व लाभ:' : 'Outcome:'}
                  </span>
                  <span className="text-slate-900 font-extrabold">{item.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
