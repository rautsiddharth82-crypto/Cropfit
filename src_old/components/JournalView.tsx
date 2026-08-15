import React, { useState } from 'react';
import { JournalEntry } from '../types';
import {
  BookOpen,
  Plus,
  Droplets,
  FlaskConical,
  ShieldAlert,
  CloudSun,
  Sprout,
  Wheat,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ThumbsUp,
  MessageSquare,
  Mic,
  Loader2
} from 'lucide-react';

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
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<JournalEntry['type']>('irrigation');
  const [fieldName, setFieldName] = useState<string>('Field 01 (Wheat)');
  const [notes, setNotes] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80');

  const photoPresets = [
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
  const [feedbackAction, setFeedbackAction] = useState<string>('Irrigation');

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
          title: newEntry.title || 'Voice Log',
          type: newEntry.type || 'observation',
          date: new Date().toISOString(),
          fieldName: 'Field 01 (Wheat)',
          notes: newEntry.notes || transcript,
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

    // Reset form
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

  const getTypeBadge = (t: JournalEntry['type']) => {
    switch (t) {
      case 'irrigation': return { label: '💧 Irrigation', bg: 'bg-[#9CCFE5]/30 text-[#0284C7]' };
      case 'fertilizer': return { label: '🧪 Fertilizer', bg: 'bg-[#F7E7A8] text-[#854D0E]' };
      case 'pesticide': return { label: '🛡️ Pesticide', bg: 'bg-[#F4B66A]/30 text-[#C2410C]' };
      case 'weather': return { label: '🌦️ Weather Event', bg: 'bg-[#9CCFE5]/40 text-[#0369A1]' };
      case 'observation': return { label: '🌱 Crop Observation', bg: 'bg-[#EAF5EC] text-[#56965F]' };
      case 'harvest': return { label: '🌾 Harvest', bg: 'bg-[#F7E7A8] text-[#854D0E]' };
      default: return { label: '📝 Note', bg: 'bg-[#F8F7EF] text-[#26332A]' };
    }
  };

  return (
    <div id="journal-view-container" className="space-y-6 pb-24 md:pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#EAF5EC] text-[#56965F] text-xs font-bold rounded-full">
              📖 Digital Farm Diary
            </span>
            <span className="text-xs text-[#68736B]">Rajpura Farm History</span>
          </div>
          <h2 className="text-2xl font-black text-[#26332A] mt-1">Farm Journal</h2>
        </div>

        <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            onClick={handleVoiceRecord}
            disabled={isRecording || isProcessing}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-2xl shadow-sm transition-all active:scale-95 ${
              isRecording 
                ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' 
                : isProcessing
                ? 'bg-gray-100 text-gray-500 border border-gray-200'
                : 'bg-[#56965F]/10 text-[#56965F] hover:bg-[#56965F]/20'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
            {isRecording ? 'Recording...' : isProcessing ? 'AI Processing...' : 'Voice Log'}
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#56965F] hover:bg-[#437A4B] text-white px-5 py-3 rounded-2xl font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Journal Entries Feed */}
      <div className="space-y-4">
        {entries.map((entry) => {
          const badge = getTypeBadge(entry.type);
          return (
            <div
              key={entry.id}
              id={`journal-card-${entry.id}`}
              className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E6E9E5]">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-xs font-bold text-[#68736B]">{entry.fieldName}</span>
                </div>
                <span className="text-xs text-[#68736B] font-medium">
                  {entry.date} at {entry.time}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {entry.photoUrl && (
                  <img
                    src={entry.photoUrl}
                    alt={entry.title}
                    className="w-full md:w-36 h-28 object-cover rounded-2xl border border-[#E6E9E5] shrink-0"
                  />
                )}

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-extrabold text-[#26332A]">{entry.title}</h3>
                  <p className="text-xs text-[#68736B] leading-relaxed">{entry.notes}</p>

                  {/* Feedback Status / Trigger */}
                  <div className="pt-2 border-t border-[#E6E9E5] flex flex-wrap items-center justify-between gap-2 text-xs">
                    {entry.observedStressFeedback ? (
                      <div className="p-2 bg-[#EAF5EC] rounded-xl text-[#56965F] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Observed: {entry.observedStressFeedback.toUpperCase()} | Action: {entry.actionFeedback}</span>
                      </div>
                    ) : (
                      <button
                        id={`btn-feedback-${entry.id}`}
                        onClick={() => setSelectedFeedbackEntry(entry)}
                        className="text-xs font-bold text-[#56965F] hover:underline flex items-center gap-1 bg-[#EAF5EC] px-3 py-1.5 rounded-xl"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>+ Record Farmer Feedback Loop</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ENTRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E6E9E5] shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
              <h3 className="text-lg font-black text-[#26332A]">Add Farm Journal Entry</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-[#F8F7EF] text-[#68736B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#26332A] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Irrigation in Field 01"
                  className="w-full bg-[#F8F7EF] border border-[#E6E9E5] rounded-xl p-3 text-xs text-[#26332A] focus:outline-none focus:ring-2 focus:ring-[#6FAF78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#26332A] mb-1">Activity Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as JournalEntry['type'])}
                    className="w-full bg-[#F8F7EF] border border-[#E6E9E5] rounded-xl p-3 text-xs text-[#26332A]"
                  >
                    <option value="irrigation">Irrigation</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="pesticide">Pesticide</option>
                    <option value="weather">Weather Event</option>
                    <option value="observation">Crop Observation</option>
                    <option value="harvest">Harvest</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#26332A] mb-1">Field</label>
                  <select
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="w-full bg-[#F8F7EF] border border-[#E6E9E5] rounded-xl p-3 text-xs text-[#26332A]"
                  >
                    <option value="Field 01 (Wheat)">Field 01 (Wheat)</option>
                    <option value="Field 02 (Rice)">Field 02 (Rice)</option>
                    <option value="Field 03 (Vegetables)">Field 03 (Vegetables)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#26332A] mb-1">Notes / Observations</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record crop leaves condition, soil feel, or input details..."
                  className="w-full bg-[#F8F7EF] border border-[#E6E9E5] rounded-xl p-3 text-xs text-[#26332A] focus:outline-none focus:ring-2 focus:ring-[#6FAF78]"
                />
              </div>

              {/* Photo Upload & Presets for Crop Journal */}
              <div className="space-y-2">
                <label className="block font-bold text-[#26332A]">📷 Attach Crop Field Photo</label>
                
                <div className="flex items-center gap-3">
                  {photoUrl && (
                    <img src={photoUrl} alt="Attached Preview" className="w-16 h-16 object-cover rounded-xl border border-[#E6E9E5]" />
                  )}
                  <label className="cursor-pointer bg-[#F8F7EF] hover:bg-[#E6E9E5] text-[#26332A] border border-[#E6E9E5] text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all">
                    <ImageIcon className="w-4 h-4 text-[#56965F]" />
                    <span>Upload Device Photo</span>
                    <input type="file" accept="image/*" onChange={handleJournalPhotoUpload} className="hidden" />
                  </label>
                </div>

                <p className="text-[10px] text-[#68736B] font-semibold">Or pick a preset sample crop photo:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {photoPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className={`text-[10px] font-bold p-1.5 rounded-lg border text-left truncate transition-all ${
                        photoUrl === preset.url
                          ? 'bg-[#EAF5EC] border-[#6FAF78] text-[#56965F]'
                          : 'bg-[#F8F7EF] border-[#E6E9E5] text-[#26332A]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E9E5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-[#F8F7EF] text-[#26332A] rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6FAF78] hover:bg-[#56965F] text-white rounded-xl font-extrabold shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 13 — FARMER FEEDBACK LOOP MODAL */}
      {selectedFeedbackEntry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6E9E5] shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
              <h3 className="text-lg font-black text-[#26332A]">Farmer Feedback Loop</h3>
              <button
                onClick={() => setSelectedFeedbackEntry(null)}
                className="p-1.5 rounded-xl bg-[#F8F7EF] text-[#68736B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                <span className="font-bold text-[#26332A] block mb-1">Did you observe the predicted stress?</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['yes', 'partially', 'no'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFeedbackStress(opt)}
                      className={`p-2.5 rounded-xl font-extrabold capitalize transition-all border ${
                        feedbackStress === opt
                          ? 'bg-[#6FAF78] text-white border-[#6FAF78]'
                          : 'bg-white text-[#26332A] border-[#E6E9E5]'
                      }`}
                    >
                      {opt === 'yes' ? '✅ Yes' : opt === 'partially' ? '⚠️ Partially' : '❌ No'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                <span className="font-bold text-[#26332A] block mb-1">What action did you take?</span>
                <select
                  value={feedbackAction}
                  onChange={(e) => setFeedbackAction(e.target.value)}
                  className="w-full bg-white border border-[#E6E9E5] rounded-xl p-2.5 text-xs text-[#26332A] font-bold mt-2"
                >
                  <option value="Irrigation">Irrigation</option>
                  <option value="Crop protection spray">Crop protection spray</option>
                  <option value="Changed activity timing">Changed activity timing</option>
                  <option value="No action">No action</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                onClick={handleSaveFeedback}
                className="w-full py-3 bg-[#6FAF78] hover:bg-[#56965F] text-white font-extrabold rounded-2xl text-xs shadow-xs transition-all"
              >
                Save Feedback to Farm Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
