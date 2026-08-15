import React, { useState } from 'react';
import { JournalEntry } from '../types';
import {
  BookOpen,
  Droplets,
  FlaskConical,
  ShieldAlert,
  CloudSun,
  Sprout,
  Wheat,
  FileText,
  CheckCircle2,
  X,
  MessageSquare,
  PenTool,
  Calendar,
  Clock,
  Filter,
  Bookmark,
  Check,
  Mic,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';

interface JournalViewProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  onUpdateFeedback?: (entryId: string, stress: 'yes' | 'partially' | 'no', action: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onAddEntry,
  onUpdateFeedback,
}) => {
  const { t, language } = useLanguage();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<JournalEntry['type']>('irrigation');
  const [fieldName, setFieldName] = useState<string>(
    language === 'hi' ? 'खेत 01 (गेहूं)' : 'Field 01 (Wheat)'
  );
  const [notes, setNotes] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80');

  // AI Voice Log States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleVoiceRecord = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recording. Please use Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      setIsProcessing(true);
      
      try {
        const res = await fetch('/api/journal/voice-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmerId: 'gunjan',
            fieldId: 'field-1',
            text: transcript,
          }),
        });
        
        if (!res.ok) throw new Error('Failed to process log');
        const newEntry = await res.json();
        
        onAddEntry({
          title: newEntry.title || (language === 'hi' ? 'आवाज लॉग' : 'Voice Log'),
          type: newEntry.type || 'observation',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fieldName: fieldName,
          notes: newEntry.notes || transcript,
          photoUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
        });
      } catch (e) {
        console.error(e);
        alert('Failed to process voice log');
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      alert("Error recording voice. Please try again.");
    };

    recognition.start();
  };

  const photoPresets = language === 'hi'
    ? [
        { label: '🌱 गेहूं फूल अवस्था', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80' },
        { label: '💧 सुबह की सिंचाई', url: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80' },
        { label: '🍂 पत्ती पर पीलापन', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
        { label: '🌾 पकी हुई फसल', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80' }
      ]
    : [
        { label: '🌱 Wheat Flowering Stage', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80' },
        { label: '💧 Post Irrigation Field', url: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80' },
        { label: '🍂 Leaf Yellowing Spot', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
        { label: '🌾 Golden Harvest Canopy', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80' }
      ];

  const handleJournalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Feedback state modal
  const [selectedFeedbackEntry, setSelectedFeedbackEntry] = useState<JournalEntry | null>(null);
  const [feedbackStress, setFeedbackStress] = useState<'yes' | 'partially' | 'no'>('yes');
  const [feedbackAction, setFeedbackAction] = useState<string>(
    language === 'hi' ? 'सुबह 6 बजे हल्की सिंचाई' : 'Morning light irrigation'
  );

  const handleSubmitNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEntry({
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      title,
      fieldName,
      notes,
      photoUrl,
    });

    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleSaveFeedback = () => {
    if (selectedFeedbackEntry && onUpdateFeedback) {
      onUpdateFeedback(selectedFeedbackEntry.id, feedbackStress, feedbackAction);
      setSelectedFeedbackEntry(null);
    }
  };

  const getTypeBadge = (tType: JournalEntry['type']) => {
    switch (tType) {
      case 'irrigation':
        return {
          label: language === 'hi' ? '💧 सिंचाई' : language === 'pa' ? '💧 ਸਿੰਚਾਈ' : '💧 Irrigation',
          icon: Droplets,
          color: 'bg-sky-50 text-sky-800 border-sky-200'
        };
      case 'fertilizer':
        return {
          label: language === 'hi' ? '🧪 पोषक तत्व / खाद' : language === 'pa' ? '🧪 ਖਾਦ' : '🧪 Nutrients',
          icon: FlaskConical,
          color: 'bg-amber-50 text-amber-800 border-amber-200'
        };
      case 'pesticide':
        return {
          label: language === 'hi' ? '🛡️ फसल सुरक्षा / स्प्रे' : language === 'pa' ? '🛡️ ਸਪਰੇਅ' : '🛡️ Crop Protection',
          icon: ShieldAlert,
          color: 'bg-rose-50 text-rose-800 border-rose-200'
        };
      case 'weather':
        return {
          label: language === 'hi' ? '🌦️ मौसम नोट' : language === 'pa' ? '🌦️ ਮੌਸਮ' : '🌦️ Weather Note',
          icon: CloudSun,
          color: 'bg-teal-50 text-teal-800 border-teal-200'
        };
      case 'observation':
        return {
          label: language === 'hi' ? '🌱 फसल विकास नोट' : language === 'pa' ? '🌱 ਫ਼ਸਲ ਨੋਟ' : '🌱 Scouting & Growth',
          icon: Sprout,
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
        };
      case 'harvest':
        return {
          label: language === 'hi' ? '🌾 फसल कटाई' : language === 'pa' ? '🌾 ਵਾਢੀ' : '🌾 Harvest Log',
          icon: Wheat,
          color: 'bg-yellow-50 text-yellow-900 border-yellow-200'
        };
      default:
        return {
          label: language === 'hi' ? '📝 सामान्य नोट' : '📝 Farm Note',
          icon: FileText,
          color: 'bg-slate-50 text-slate-800 border-slate-200'
        };
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (selectedFilter === 'all') return true;
    return entry.type === selectedFilter;
  });

  return (
    <div id="journal-view-container" className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="border border-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/journal_banner.jpg"
            alt="Journal Theme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'hi' ? 'डिजिटल किसान डायरी एवं फील्ड रिकॉर्ड' : 'Farm Diary & Field Log'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{t('journal_title')}</span>
          </h2>
        </div>

        <div className="flex gap-2.5 items-center flex-wrap sm:flex-nowrap">
          <button
            onClick={handleVoiceRecord}
            disabled={isRecording || isProcessing}
            className={`relative z-10 px-5 py-3 font-semibold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer shrink-0 border ${
              isRecording 
                ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' 
                : isProcessing
                ? 'bg-slate-100 text-slate-500 border-slate-200'
                : 'bg-emerald-500/10 text-emerald-100 border border-emerald-400/20 hover:bg-emerald-500/20'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <Mic className={`w-4 h-4 ${isRecording ? 'text-rose-600' : 'text-emerald-300'}`} />
            )}
            <span>
              {isRecording ? (language === 'hi' ? 'रिकॉर्डिंग...' : 'Recording...') : isProcessing ? (language === 'hi' ? 'प्रोसेसिंग...' : 'AI Processing...') : (language === 'hi' ? 'आवाज लॉग' : 'Voice Log')}
            </span>
          </button>

          <button
            id="btn-open-add-journal"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="relative z-10 px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <PenTool className="w-4 h-4 text-emerald-800" />
            <span>{t('write_entry')}</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pl-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-700" />
          {t('filter')}:
        </span>
        {[
          { id: 'all', label: language === 'hi' ? 'सभी डायरी पन्ने' : 'All Journal Pages' },
          { id: 'irrigation', label: language === 'hi' ? '💧 सिंचाई' : '💧 Irrigation' },
          { id: 'fertilizer', label: language === 'hi' ? '🧪 खाद व पोषण' : '🧪 Nutrients' },
          { id: 'pesticide', label: language === 'hi' ? '🛡️ फसल सुरक्षा' : '🛡️ Crop Sprays' },
          { id: 'observation', label: language === 'hi' ? '🌱 खेत निरीक्षण' : '🌱 Field Notes' },
          { id: 'harvest', label: language === 'hi' ? '🌾 कटाई' : '🌾 Harvest' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
              selectedFilter === cat.id
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Journal Diary Entries Feed */}
      <div className="space-y-5">
        {filteredEntries.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-2xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">
              {language === 'hi' ? 'डायरी में कोई नोट नहीं मिला' : 'No Journal Entries Found'}
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              {t('write_entry')}
            </button>
          </div>
        ) : (
          filteredEntries.map((entry, idx) => {
            const badge = getTypeBadge(entry.type);
            const BadgeIcon = badge.icon;
            return (
              <div
                key={entry.id}
                id={`journal-card-${entry.id}`}
                className="relative bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all space-y-4 overflow-hidden"
              >
                {/* Diary Left Binder Perforation / Ruled Margin Line */}
                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-emerald-600 rounded-l-3xl" />
                <div className="absolute left-4 top-0 bottom-0 w-px border-r border-dashed border-emerald-200 hidden sm:block pointer-events-none" />

                {/* Bookmark Ribbon on top-right */}
                <div className="absolute -top-1 right-6">
                  <div className="bg-emerald-700 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-b-md shadow-xs flex items-center gap-1">
                    <Bookmark className="w-2.5 h-2.5 text-emerald-200 fill-emerald-200" />
                    <span>{language === 'hi' ? `पृष्ठ #${idx + 1}` : `Page #${idx + 1}`}</span>
                  </div>
                </div>

                {/* Entry Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 sm:pl-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-xl font-bold border ${badge.color}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                      📍 {entry.fieldName}
                    </span>
                  </div>

                  {/* Date Stamp */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{entry.date}</span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{entry.time}</span>
                  </div>
                </div>

                {/* Entry Body with Diary Feel */}
                <div className="flex flex-col md:flex-row gap-5 items-start sm:pl-4">
                  {/* Attached photo with photo-corners clip style */}
                  {entry.photoUrl && (
                    <div className="relative shrink-0 self-center md:self-start p-1.5 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
                      <img
                        src={entry.photoUrl}
                        alt={entry.title}
                        className="w-40 sm:w-44 h-32 object-cover rounded-xl border border-slate-100"
                      />
                      <span className="text-[10px] text-center text-slate-500 font-bold block mt-1">
                        📷 {language === 'hi' ? 'संलग्न फोटो' : 'Attached Photo'}
                      </span>
                    </div>
                  )}

                  {/* Ruled Notebook Notes Content */}
                  <div className="flex-1 space-y-2.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{entry.title}</span>
                    </h3>

                    {/* Ruled lines background for journal text */}
                    <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 relative">
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                        {entry.notes}
                      </p>
                    </div>

                    {/* Feedback / Outcome Section */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {entry.observedStressFeedback ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-bold flex items-center gap-2 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>
                            {language === 'hi'
                              ? `प्रभाव देखा गया: ${entry.observedStressFeedback.toUpperCase()} • किया गया कार्य: ${entry.actionFeedback}`
                              : `Observed Impact: ${entry.observedStressFeedback.toUpperCase()} • Action Taken: ${entry.actionFeedback}`}
                          </span>
                        </div>
                      ) : (
                        <button
                          id={`btn-feedback-${entry.id}`}
                          type="button"
                          onClick={() => setSelectedFeedbackEntry(entry)}
                          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{language === 'hi' ? '+ परिणाम या अनुभव दर्ज करें' : '+ Note Result / Action Outcome'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Write Journal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <PenTool className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">{t('journal_title')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('entry_title')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? 'उदा. गेहूं में फूल आने से पहले जिंक स्प्रे किया' : 'e.g. Applied Pre-Flowering Zinc Spray'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    {t('entry_type')}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as JournalEntry['type'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="irrigation">💧 {language === 'hi' ? 'सिंचाई' : 'Irrigation'}</option>
                    <option value="fertilizer">🧪 {language === 'hi' ? 'खाद व पोषण' : 'Nutrients'}</option>
                    <option value="pesticide">🛡️ {language === 'hi' ? 'फसल स्प्रे' : 'Crop Spray'}</option>
                    <option value="weather">🌦️ {language === 'hi' ? 'मौसम नोट' : 'Weather Note'}</option>
                    <option value="observation">🌱 {language === 'hi' ? 'निरीक्षण' : 'Scouting'}</option>
                    <option value="harvest">🌾 {language === 'hi' ? 'कटाई' : 'Harvest'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                    {t('target_field')}
                  </label>
                  <select
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value={language === 'hi' ? 'खेत 01 (गेहूं)' : 'Field 01 (Wheat)'}>
                      {language === 'hi' ? 'खेत 01 (गेहूं)' : 'Field 01 (Wheat)'}
                    </option>
                    <option value={language === 'hi' ? 'खेत 02 (सरसों)' : 'Field 02 (Mustard)'}>
                      {language === 'hi' ? 'खेत 02 (सरसों)' : 'Field 02 (Mustard)'}
                    </option>
                    <option value={language === 'hi' ? 'खेत 03 (चना)' : 'Field 03 (Gram)'}>
                      {language === 'hi' ? 'खेत 03 (चना)' : 'Field 03 (Gram)'}
                    </option>
                    <option value={language === 'hi' ? 'सभी खेत' : 'All Farm Plots'}>
                      {language === 'hi' ? 'सभी खेत' : 'All Farm Plots'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('field_notes')}
                </label>
                <textarea
                  rows={3}
                  placeholder={language === 'hi' ? 'नमी का स्तर, पत्तों का रंग, दवा की मात्रा या मौसम की स्थिति दर्ज करें...' : 'Record moisture levels, leaf color, dosage, or weather during operation...'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('attach_photo')}
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photoPresets.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoUrl(preset.url)}
                        className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-bold shrink-0 cursor-pointer ${
                          photoUrl === preset.url
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleJournalPhotoUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{t('save')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Feedback Outcome Modal */}
      {selectedFeedbackEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {language === 'hi' ? 'कार्य परिणाम एवं फसल फीडबैक' : 'Log Action Result / Feedback'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedFeedbackEntry(null)}
                className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {language === 'hi' ? 'प्रविष्टि' : 'Entry'}
                </span>
                <span className="font-bold text-slate-900">{selectedFeedbackEntry.title}</span>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'क्या फसल पर लू या कीट का असर देखा गया?' : 'Did you observe crop heat / pest stress?'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['yes', 'partially', 'no'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFeedbackStress(opt)}
                      className={`py-2 px-3 rounded-xl font-bold uppercase text-[11px] border cursor-pointer ${
                        feedbackStress === opt
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt === 'yes' ? (language === 'hi' ? 'हाँ' : 'Yes') : opt === 'partially' ? (language === 'hi' ? 'आंशिक' : 'Partially') : (language === 'hi' ? 'नहीं' : 'No')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'hi' ? 'आपने क्या कदम उठाया?' : 'What action did you take?'}
                </label>
                <input
                  type="text"
                  value={feedbackAction}
                  onChange={(e) => setFeedbackAction(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. सुबह 6 बजे हल्की सिंचाई की' : 'e.g. Irrigated early morning 6 AM'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedFeedbackEntry(null)}
                  className="px-4 py-2 text-slate-600 font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeedback}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-xs cursor-pointer"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
