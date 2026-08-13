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
  Sparkles,
  Droplets,
  Calendar,
  Clock,
  CheckCircle2,
  Bell,
  HelpCircle,
  Brain,
  History,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

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
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello Farmer ${profile.name}! 🌱\nI am your AI Climate Smart Assistant. I monitor your farm in Rajpura continuously.\n\nYour Wheat field (Field 01) is currently at 38% soil moisture and 36°C heat is forecasted for tomorrow. How can I help you today?`,
      timestamp: 'Just now',
      supportingData: {
        soilMoisture: '38% (Low)',
        temperature: '36°C (Peak tomorrow)',
        actionWindow: '6:00 AM - 8:00 AM tomorrow',
        confidence: '87%'
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
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting symbols for smooth speech synthesis
    const cleanText = text.replace(/[*_#•`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Slightly slower for crisp farmer comprehension
    utterance.pitch = 1.0;

    // Pick best natural sounding English / Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      v => v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.includes('Natural') || v.name.includes('Google')
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

  const suggestedQuestions = [
    "Should I irrigate today?",
    "What should I do if temperature increases?",
    "Why is my crop under stress?",
    "Which crop is suitable for my field?",
    "Will rain affect my crop?"
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
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          farmContext: {
            farmerName: profile.name,
            location: profile.location,
            crops: 'Wheat (4.5 Acres), Rice (5 Acres), Vegetables (3 Acres)',
            soilMoisture: '38%',
            forecastTemp: '36°C'
          }
        }),
      });

      const data = await res.json();
      let replyText = data.reply || "I recommend checking your root zone soil moisture in Field 01 and applying light early morning watering (6:00 AM - 8:00 AM).";
      let reasoningText = undefined;
      
      const reasoningMatch = replyText.match(/<reasoning>([\s\S]*?)<\/reasoning>/i);
      if (reasoningMatch) {
        reasoningText = reasoningMatch[1].trim();
        replyText = replyText.replace(/<reasoning>[\s\S]*?<\/reasoning>/i, '').trim();
      }

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        reasoning: reasoningText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportingData: {
          soilMoisture: '38%',
          temperature: '36°C tomorrow',
          actionWindow: '6:00 AM - 8:00 AM',
          confidence: '87%'
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
      console.error("Failed to send message to AI server:", e);
      // Local fallback message
      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `💧 **Irrigation Recommendation**:\n\n• **Action**: Apply light irrigation to Field 01 (Wheat).\n• **Best Window**: 6:00 AM – 8:00 AM tomorrow morning.\n• **Why**: Cools the root zone before peak 36°C afternoon heat and avoids evaporation.`,
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

    // Explicitly prompt user for microphone permission if supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        setSpeechStatusMsg('Requesting microphone permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release tracks right away as speech recognition will open its own microphone stream
        stream.getTracks().forEach((track) => track.stop());
      } catch (permissionErr) {
        console.warn('Microphone permission request error:', permissionErr);
        setSpeechStatusMsg('Microphone access denied or unpermitted. Added sample question.');
        setInput('Should I irrigate my wheat field today?');
        setVoiceModeActive(true);
        return;
      }
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechStatusMsg('Browser Speech API unavailable. Added sample voice question.');
      setInput('Should I irrigate my wheat field today?');
      setVoiceModeActive(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / Hindi recognition

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceModeActive(true);
        setSpeechStatusMsg('🎙️ Listening... Speak your farming question in English or Hindi now.');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
          setSpeechStatusMsg(`Recognized: "${transcript}"`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechStatusMsg('Microphone access blocked. Added sample voice question.');
          setInput('Should I irrigate my wheat field today?');
        } else {
          setSpeechStatusMsg('Voice recognized sample question.');
          setInput('Should I irrigate my wheat field today?');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognitionRef(recognition);
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
      setSpeechStatusMsg('Voice input sample loaded.');
      setInput('Should I irrigate my wheat field today?');
      setVoiceModeActive(true);
    }
  };

  return (
    <div id="ai-assistant-view-container" className="space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F7E7A8]/50 border border-[#F7E7A8] flex items-center justify-center text-2xl shadow-2xs">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-black text-[#26332A]">Ask Your Farm Assistant 🤖🌱</h2>
            <p className="text-xs text-[#68736B]">AI Climate & Agronomy Intelligence for Rajpura</p>
          </div>
        </div>
      </div>

      {/* SCREEN 10 — RECOMMENDED ACTION CARD */}
      <div id="ai-recommended-action-card" className="bg-[#EAF5EC] border-2 border-[#A8D5A2] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#A8D5A2]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#6FAF78] text-white flex items-center justify-center text-sm font-bold">
              💧
            </span>
            <div>
              <span className="text-[11px] font-extrabold text-[#56965F] uppercase tracking-wider">
                Recommended Action
              </span>
              <h3 className="text-lg font-black text-[#26332A]">IRRIGATION RECOMMENDED</h3>
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-[#E88B8B] text-white text-xs font-bold rounded-full uppercase">
            High Priority
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-2xl border border-[#A8D5A2]">
          <div>
            <span className="text-[#68736B] block font-semibold">Reason:</span>
            <span className="font-bold text-[#26332A]">Soil moisture declining (38%)</span>
          </div>
          <div>
            <span className="text-[#68736B] block font-semibold">Expected Heat:</span>
            <span className="font-bold text-[#C2410C]">36°C High tomorrow</span>
          </div>
          <div>
            <span className="text-[#68736B] block font-semibold">Suggested Window:</span>
            <span className="font-bold text-[#56965F]">6:00 AM – 8:00 AM</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            id="btn-mark-action-done"
            onClick={() => {
              setActionDoneState(true);
              if (onMarkActionDone) onMarkActionDone('Morning Irrigation in Field 01');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs ${
              actionDoneState
                ? 'bg-[#56965F] text-white'
                : 'bg-[#6FAF78] hover:bg-[#56965F] text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionDoneState ? '✓ Marked as Done' : 'Mark as Done'}</span>
          </button>

          <button
            id="btn-action-remind-me"
            onClick={() => setActionRemindedState(true)}
            className="px-4 py-2.5 bg-white hover:bg-[#F8F7EF] text-[#26332A] border border-[#E6E9E5] rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all"
          >
            <Bell className="w-4 h-4 text-[#F4B66A]" />
            <span>{actionRemindedState ? '✓ Reminder Set for 6 AM' : 'Remind Me'}</span>
          </button>

          <button
            id="btn-action-ask-ai-details"
            onClick={() => handleSendMessage("Why is early morning 6-8 AM the best irrigation window?")}
            className="px-4 py-2.5 bg-white hover:bg-[#F8F7EF] text-[#26332A] border border-[#E6E9E5] rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-[#3B82F6]" />
            <span>Ask AI Why</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div id="ai-suggested-questions-section" className="space-y-2">
        <span className="text-xs font-bold text-[#68736B] block">Suggested Farmer Questions:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              id={`btn-suggested-q-${idx}`}
              onClick={() => handleSendMessage(q)}
              className="px-3.5 py-2 bg-white hover:bg-[#EAF5EC] border border-[#E6E9E5] hover:border-[#6FAF78] text-[#26332A] text-xs font-bold rounded-2xl whitespace-nowrap transition-all shadow-2xs shrink-0"
            >
              🌱 "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div id="ai-chat-messages-container" className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs space-y-4">
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-[11px] text-[#68736B] px-1 w-full max-w-[88%] sm:max-w-[80%]">
                <span className="font-bold">{msg.sender === 'user' ? 'You (Gunjan)' : 'Kishan Mitra AI'}</span>
                
                {/* Voice Speaker Button for AI Assistant Messages */}
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.text, msg.id)}
                    className={`flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-all ${
                      speakingMessageId === msg.id
                        ? 'bg-[#E88B8B] text-white animate-pulse'
                        : 'bg-[#EAF5EC] text-[#56965F] hover:bg-[#6FAF78] hover:text-white'
                    }`}
                  >
                    {speakingMessageId === msg.id ? (
                      <>
                        <VolumeX className="w-3 h-3" />
                        <span>Stop Speech</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Listen AI Voice 🎙️</span>
                      </>
                    )}
                  </button>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#6FAF78] text-white rounded-tr-none shadow-2xs'
                    : 'bg-[#F8F7EF] text-[#26332A] border border-[#E6E9E5] rounded-tl-none shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {/* AI Reasoning Expander */}
                {msg.sender === 'assistant' && msg.reasoning && (
                  <div className="mt-3 pt-3 border-t border-[#E6E9E5] text-xs">
                    <button
                      onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                      className="text-[#68736B] font-bold flex items-center gap-1 hover:text-[#26332A]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{expandedMessageId === msg.id ? 'Hide AI Explainability' : 'View AI Explainability'}</span>
                      {expandedMessageId === msg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {expandedMessageId === msg.id && (
                      <div className="mt-2 bg-[#F8F7EF] p-3 rounded-2xl border border-[#E6E9E5] whitespace-pre-wrap font-mono text-[10px] text-[#56965F]">
                        {msg.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Supporting Data Expander for AI Messages */}
                {msg.sender === 'assistant' && msg.supportingData && (
                  <div className="mt-3 pt-3 border-t border-[#E6E9E5] text-xs">
                    <button
                      id={`btn-toggle-support-${msg.id}`}
                      onClick={() =>
                        setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)
                      }
                      className="text-[#56965F] font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>{expandedMessageId === msg.id ? 'Hide supporting data' : 'View supporting data'}</span>
                      {expandedMessageId === msg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {expandedMessageId === msg.id && (
                      <div className="mt-2 grid grid-cols-2 gap-2 bg-white p-3 rounded-2xl border border-[#E6E9E5] text-[11px]">
                        <div>Soil Moisture: <b className="text-[#26332A]">{msg.supportingData.soilMoisture}</b></div>
                        <div>Temperature: <b className="text-[#26332A]">{msg.supportingData.temperature}</b></div>
                        <div>Action Window: <b className="text-[#56965F]">{msg.supportingData.actionWindow}</b></div>
                        <div>Confidence: <b className="text-[#56965F]">{msg.supportingData.confidence}</b></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#56965F] font-bold p-3 bg-[#EAF5EC] rounded-2xl w-fit animate-pulse">
              <Bot className="w-4 h-4" />
              <span>Analyzing soil sensors & weather models...</span>
            </div>
          )}
        </div>

        {/* Speech Status Feedback Banner */}
        {speechStatusMsg && (
          <div className="text-xs font-bold text-[#56965F] bg-[#EAF5EC] border border-[#A8D5A2] p-2.5 rounded-2xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mic className="w-4 h-4 animate-pulse text-[#56965F]" />
              <span>{speechStatusMsg}</span>
            </span>
            <button
              onClick={() => setSpeechStatusMsg('')}
              className="text-xs text-[#68736B] hover:text-[#26332A] font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E6E9E5]">
          <button
            id="btn-voice-input"
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-2xl border transition-all ${
              isRecording
                ? 'bg-[#E88B8B] text-white border-[#E88B8B] animate-bounce'
                : 'bg-[#F8F7EF] hover:bg-[#EAF5EC] text-[#26332A] border-[#E6E9E5]'
            }`}
            title="Voice Input"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            id="input-ai-chat"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isRecording ? "Listening to your voice..." : "Ask your farm assistant anything..."}
            className="flex-1 bg-[#F8F7EF] border border-[#E6E9E5] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#26332A] placeholder-[#68736B] focus:outline-none focus:ring-2 focus:ring-[#6FAF78]"
          />

          <button
            id="btn-send-chat"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-[#6FAF78] hover:bg-[#56965F] disabled:bg-[#E6E9E5] text-white font-bold rounded-2xl shadow-xs transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SCREEN 11 — YOUR FIELD'S MEMORY 🧠 (AI Crop Memory) */}
      <div id="ai-crop-memory-section" className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-[#6FAF78]" />
            <div>
              <h3 className="text-lg font-black text-[#26332A]">Your Field's Memory 🧠</h3>
              <p className="text-xs text-[#68736B]">Historical log of climate events, farmer interventions & outcomes</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {farmMemory.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-[#26332A]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5EC] text-[#56965F] font-extrabold text-[11px]">
                    {item.date}
                  </span>
                  <span className="text-sm font-extrabold">{item.crop}</span>
                </div>
                <span className="text-[#C2410C] font-bold">{item.eventType}</span>
              </div>

              <p className="text-[#68736B] font-medium">{item.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E6E9E5]">
                <div className="p-2 bg-white rounded-xl border border-[#E6E9E5]">
                  <span className="text-[#68736B] block font-bold">Action Taken:</span>
                  <span className="text-[#26332A] font-semibold">{item.actionTaken}</span>
                </div>
                <div className="p-2 bg-[#EAF5EC] rounded-xl border border-[#A8D5A2]">
                  <span className="text-[#56965F] block font-bold">Outcome:</span>
                  <span className="text-[#26332A] font-extrabold">{item.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
