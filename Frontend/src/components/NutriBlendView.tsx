import React, { useState } from 'react';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';
import { 
  Scale, 
  Volume2, 
  VolumeX,
  Printer, 
  ShieldCheck, 
  Leaf, 
  Calculator, 
  Sprout, 
  Sparkles, 
  TrendingDown,
  Info,
  Mic,
  Clock,
  ArrowRight,
  Sun,
  MessageSquare,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  Activity,
  Bot,
  AlertTriangle,
  X,
  TrendingUp,
  Coins
} from 'lucide-react';

interface CropOption {
  id: string;
  category: string;
  name: string;
  stageOptions: { id: string; label: string }[];
  needs: string;
  needsAttention: boolean;
  whatToApply: {
    title: string;
    desc: string;
  };
  howMuchPerAcre: number;
  howMuchUnit: string;
  mixDesc: string;
  bestTime: string;
  bestTimeSub: string;
  bestTimeTip: string;
  steps: string[];
  nitrogenStatus: 'low' | 'adequate' | 'healthy';
  phosphorusStatus: 'low' | 'adequate' | 'healthy';
  potassiumStatus: 'low' | 'adequate' | 'healthy';
  costPerAcre: number;
  savesPerAcre: number;
  accuracyScore: number;
}

const CROP_OPTIONS: CropOption[] = [
  {
    id: 'wheat',
    category: 'CEREAL',
    name: 'Wheat (HD-2967 / गेहूं)',
    stageOptions: [
      { id: 'tillering', label: 'Tillering / Flowering (45 days)' },
      { id: 'germination', label: 'Germination / Seedling (15 days)' },
      { id: 'milking', label: 'Milking Stage (75 days)' }
    ],
    needs: 'Nitrogen Boost',
    needsAttention: true,
    whatToApply: {
      title: 'NutriBlend A (Balanced Nitro-Mix)',
      desc: 'Promotes strong tillering, deep green leaves, and +12% biomass vigor.'
    },
    howMuchPerAcre: 2.5,
    howMuchUnit: 'kg / acre',
    mixDesc: 'Mix with 150L water per acre',
    bestTime: 'Tomorrow',
    bestTimeSub: '6:00 AM – 8:00 AM',
    bestTimeTip: 'Low wind & zero leaf-burn risk',
    steps: [
      'Mix 10.0 kg blend thoroughly with 600L clean water (150L/acre).',
      'Apply evenly using flat-fan spray nozzle across wheat tillering rows.',
      'Avoid midday heat (11 AM–3 PM) to prevent rapid evaporation.',
      'Give light moisture / irrigation within 24 hours if topsoil is dry.'
    ],
    nitrogenStatus: 'low',
    phosphorusStatus: 'adequate',
    potassiumStatus: 'healthy',
    costPerAcre: 850,
    savesPerAcre: 420,
    accuracyScore: 94
  },
  {
    id: 'paddy',
    category: 'CEREAL',
    name: 'Paddy / Basmati Rice',
    stageOptions: [
      { id: 'vegetative', label: 'Active Vegetative (30 DAT)' },
      { id: 'panicle', label: 'Panicle Initiation (55 DAT)' }
    ],
    needs: 'Phosphorus Support',
    needsAttention: true,
    whatToApply: {
      title: 'NutriBlend P (Super-Phos Active)',
      desc: 'Strengthens root anchorage, speeds up panicle emergence, and boosts grain count.'
    },
    howMuchPerAcre: 3.0,
    howMuchUnit: 'kg / acre',
    mixDesc: 'Mix with 120L water per acre',
    bestTime: 'This Weekend',
    bestTimeSub: '7:00 AM – 9:00 AM',
    bestTimeTip: 'Ideal soil saturation levels',
    steps: [
      'Mix 12.0 kg blend with 480L water for transplanting fields.',
      'Apply directly to standing water or saturated puddle beds.',
      'Maintain 2-3 cm water level for 48 hours post application.',
      'Do not apply during heavy showers to avoid wash-off.'
    ],
    nitrogenStatus: 'adequate',
    phosphorusStatus: 'low',
    potassiumStatus: 'healthy',
    costPerAcre: 920,
    savesPerAcre: 380,
    accuracyScore: 91
  },
  {
    id: 'mustard',
    category: 'OILSEED',
    name: 'Mustard / सरसों',
    stageOptions: [
      { id: 'branching', label: 'Secondary Branching (35 DAS)' },
      { id: 'flowering', label: 'Peak Flowering (60 DAS)' }
    ],
    needs: 'Sulphur & Nitrogen Boost',
    needsAttention: true,
    whatToApply: {
      title: 'NutriBlend S (Sulfur Plus)',
      desc: 'Enhances oil content extraction rates and improves cold-frost resistance.'
    },
    howMuchPerAcre: 2.0,
    howMuchUnit: 'kg / acre',
    mixDesc: 'Mix with 180L water per acre',
    bestTime: 'Tomorrow',
    bestTimeSub: '8:00 AM – 10:00 AM',
    bestTimeTip: 'Dry weather window confirmed',
    steps: [
      'Mix 8.0 kg blend with 720L water for full coverage.',
      'Apply thoroughly onto foliage during secondary branching.',
      'Ensure soil has light basal moisture prior to spray.',
      'Avoid spraying on fully open flowers to protect pollinators.'
    ],
    nitrogenStatus: 'low',
    phosphorusStatus: 'healthy',
    potassiumStatus: 'adequate',
    costPerAcre: 790,
    savesPerAcre: 350,
    accuracyScore: 92
  }
];

export const NutriBlendView: React.FC = () => {
  const { language } = useLanguage();
  const { speak } = useVoice();
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [selectedField, setSelectedField] = useState<string>('field2');
  const [selectedStage, setSelectedStage] = useState<string>('tillering');
  const [acresInput, setAcresInput] = useState<number>(4);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isBlenderOpen, setIsBlenderOpen] = useState<boolean>(false);
  const [blenderN, setBlenderN] = useState<number>(45);
  const [blenderP, setBlenderP] = useState<number>(15);
  const [blenderK, setBlenderK] = useState<number>(20);
  const [customBlenderSaved, setCustomBlenderSaved] = useState<boolean>(false);

  // Modal display states
  const [whyModalContent, setWhyModalContent] = useState<string | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [showCostModal, setShowCostModal] = useState<boolean>(false);

  // Local active alternative blends
  const [customBlends, setCustomBlends] = useState<Record<string, { title: string; desc: string }>>({});

  const selectedCrop = CROP_OPTIONS.find(c => c.id === selectedCropId) || CROP_OPTIONS[0];

  const displayTitle = customBlends[selectedCropId]?.title || selectedCrop.whatToApply.title;
  const displayDesc = customBlends[selectedCropId]?.desc || selectedCrop.whatToApply.desc;

  // Dynamic calculations based on acres
  const totalAmount = selectedCrop.howMuchPerAcre * acresInput;
  const totalCost = selectedCrop.costPerAcre * acresInput;
  const totalSavings = selectedCrop.savesPerAcre * acresInput;

  const handleVoiceAsk = () => {
    speak(language === 'hi' 
      ? 'कृपया अपनी फसल के पोषक तत्वों की आवश्यकताओं के बारे में पूछें।' 
      : 'Please ask your question regarding crop nutrition requirements.');
  };

  const handleReadAloud = () => {
    const text = language === 'hi'
      ? `फसल पोषण योजना: ${selectedCrop.name} के लिए आवश्यक खुराक ${selectedCrop.howMuchPerAcre} किलोग्राम प्रति एकड़ है। इसे लगाने का सही समय कल सुबह 6 से 8 बजे के बीच है।`
      : `Crop Nutrition Plan: Recommended dosage for ${selectedCrop.name} is ${selectedCrop.howMuchPerAcre} kilograms per acre. Best time is tomorrow between 6 to 8 AM.`;
    speak(text);
  };

  const handleVoicePromptClick = (prompt: string) => {
    speak(prompt);
  };

  const handleSelectAlternative = (title: string, desc: string) => {
    setCustomBlends(prev => ({
      ...prev,
      [selectedCropId]: { title, desc }
    }));
    setShowOptionsModal(false);
    speak(language === 'hi' ? 'वैकल्पिक पोषण मिश्रण चुना गया।' : `Selected alternative blend: ${title}`);
  };

  const openWhyModal = (type: 'agronomic' | 'ai') => {
    if (type === 'agronomic') {
      setWhyModalContent(
        language === 'hi'
          ? `आपके खेत का नाइट्रोजन स्तर कम (35%) आंका गया है। गेहूं में टिलरिंग चरण में वानस्पतिक विकास को सहारा देने के लिए अतिरिक्त नाइट्रोजन की आवश्यकता होती है। यह मिश्रण 12% उत्पादकता बढ़ाएगा।`
          : `Your field soil has estimated low Nitrogen levels (35%). During the wheat tillering stage, nitrogen is crucial to support rapid tiller elongation and chlorophyll synthesis, preventing yield loss.`
      );
    } else {
      setWhyModalContent(
        language === 'hi'
          ? `यह एआई विश्लेषण 94% सटीक है। हालिया उपग्रह वनस्पति चित्र (NDVI), बीते 48 घंटों की मिट्टी की नमी, और राजपुरा मौसम विज्ञान डेटा को जोड़कर यह निष्कर्ष निकाला गया है।`
          : `This recommendation is based on a multi-modal analysis with a 94% accuracy score. Data sources include recent Sentinel-2 NDVI satellite indices, localized Meteoblue soil parameters, and ICAR baseline models.`
      );
    }
  };

  return (
    <div id="nutriblend-view-root" className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12 text-[#26332A] font-sans">
      
      {/* 1. TOP TITLE BANNER CARD */}
      <div
        className="rounded-3xl p-6 shadow-md relative overflow-hidden border border-emerald-900/20"
        style={{
          backgroundImage: `url('/images/nutriblend_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-800/30 to-transparent rounded-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>NUTRIBLEND™ • SMART CROP NUTRITION PLAN</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              Crop Nutrition Plan
            </h2>
            <p className="text-sm text-emerald-100/90 font-medium leading-relaxed">
              What to give your crop, how much to apply, and the exact best time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <button 
              type="button"
              onClick={handleVoiceAsk}
              className="px-4 py-2.5 bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 border border-amber-300/40 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>Voice Ask</span>
            </button>
            <button 
              type="button"
              onClick={handleReadAloud}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs backdrop-blur-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud (सुनें)</span>
            </button>
          </div>
        </div>
      </div>


      {/* 2. DYNAMIC INPUT SELECTORS BAR */}
      <div className="bg-white border border-slate-200/85 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Crop Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              🌱 CROP
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 cursor-pointer"
            >
              {CROP_OPTIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Field Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              📍 FIELD
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 cursor-pointer"
            >
              <option value="field1">Field 01 • Main Plot</option>
              <option value="field2">Field 02 • Tubewell Plot</option>
              <option value="field3">Field 03 • Canal Side</option>
            </select>
          </div>

          {/* Crop Stage Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              📈 CROP STAGE
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 cursor-pointer"
            >
              {selectedCrop.stageOptions.map(st => (
                <option key={st.id} value={st.id}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Area Text/Number Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              📐 AREA
            </label>
            <div className="flex items-center bg-slate-55 border border-slate-200 rounded-xl px-3 py-1.5">
              <input
                type="number"
                min="0.5"
                max="100"
                value={acresInput}
                onChange={(e) => setAcresInput(Math.max(0.5, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-black text-slate-800 bg-transparent focus:outline-none"
              />
              <span className="text-xs font-bold text-slate-500 ml-2">Acres</span>
            </div>
          </div>
        </div>

        {/* Bottom Alert/History Subbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-100/50">
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold">
              Good Weather: Ideal application window tomorrow 6:00–8:00 AM (Low wind: 4 km/h).
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-505">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Last application: <strong className="text-slate-700 font-bold">Nitrogen blend 12 days ago</strong>
            </span>
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="text-emerald-700 font-extrabold hover:underline ml-1 cursor-pointer"
            >
              History →
            </button>
          </div>
        </div>
      </div>

      {/* 3. WHAT YOUR CROP NEEDS CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
              WHAT YOUR CROP NEEDS
            </span>
            <div className="flex items-center gap-1.5 text-lg font-black text-slate-900">
              <span>🌱 {selectedCrop.needs}</span>
              {selectedCrop.needsAttention && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-xs border border-amber-200/55 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Needs Attention
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={() => openWhyModal('agronomic')}
            className="text-emerald-805 text-xs font-bold hover:underline flex items-center gap-1 bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-1.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why this recommendation?</span>
          </button>
        </div>

        {/* 3 Recommendation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: What to apply */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-emerald-800 tracking-wider block uppercase">
                1. WHAT TO APPLY
              </span>
              <h4 className="text-base font-black text-emerald-955 mt-2">
                {displayTitle}
              </h4>
              <p className="text-xs text-emerald-800/80 font-medium mt-1 leading-relaxed">
                {displayDesc}
              </p>
            </div>
            <button 
              onClick={() => setShowOptionsModal(true)}
              className="text-emerald-700 text-xs font-black hover:underline text-left mt-3 flex items-center gap-1 cursor-pointer"
            >
              <span>🔄 See Other Blend Options</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2: How much */}
          <div className="bg-slate-50 border border-slate-200/85 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">
                2. HOW MUCH
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{selectedCrop.howMuchPerAcre}</span>
                <span className="text-xs font-bold text-slate-500">{selectedCrop.howMuchUnit}</span>
              </div>
              <p className="text-xs text-emerald-750 font-bold mt-1">
                Total: {totalAmount.toFixed(1)} kg for {acresInput} acres
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium block">
              {selectedCrop.mixDesc}
            </span>
          </div>

          {/* Card 3: Best time */}
          <div className="bg-amber-50/40 border border-amber-200/50 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-amber-800 tracking-wider block uppercase">
                3. BEST TIME
              </span>
              <div className="mt-2 flex items-center gap-1.5 text-2xl font-black text-amber-950">
                <Clock className="w-5 h-5 text-amber-650" />
                <span>{selectedCrop.bestTime}</span>
              </div>
              <p className="text-xs text-amber-900/90 font-bold mt-1">
                {selectedCrop.bestTimeSub}
              </p>
            </div>
            <span className="text-xs text-amber-850 font-black flex items-center gap-1">
              <span>✓</span>
              <span>{selectedCrop.bestTimeTip}</span>
            </span>
          </div>
        </div>

        {/* 4 Application Steps */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5 space-y-3">
          <h4 className="text-[11px] font-black text-slate-655 tracking-wider uppercase">
            🚜 HOW TO APPLY (SIMPLE 4 STEPS):
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCrop.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-105">
          <button
            type="button"
            onClick={() => {
              setIsApplied(!isApplied);
              speak(isApplied ? "Recommendation cancelled" : "Applied Smart Nutrition Recommendation");
            }}
            className={`px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
              isApplied 
                ? 'bg-emerald-800 text-white shadow-xs' 
                : 'bg-emerald-600 hover:bg-emerald-705 text-white shadow-md'
            }`}
          >
            {isApplied ? <Check className="w-4 h-4" /> : null}
            <span>{isApplied ? 'Applied Recommendation' : '✓ Apply Recommendation'}</span>
          </button>

          <button 
            onClick={() => openWhyModal('agronomic')}
            className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700 cursor-pointer"
          >
            Why this recommendation?
          </button>

          <button 
            onClick={handleVoiceAsk}
            className="px-5 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-black text-emerald-805 flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Bot className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* 4. NUTRIENT STATUS SUMMARY */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">
              Nutrient Status Summary
            </h3>
            <p className="text-xs text-slate-505 font-medium">
              Simple color indicators for your field
            </p>
          </div>
          <button 
            onClick={() => setShowAnalysisModal(true)}
            className="text-emerald-700 text-xs font-black hover:underline cursor-pointer"
          >
            View Detailed Nutrient Analysis →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nitrogen N */}
          <div className="bg-amber-50/20 border border-amber-200/50 rounded-2xl p-4 flex flex-col justify-between min-h-[90px] shadow-2xs">
            <div>
              <h4 className="text-sm font-black text-slate-900">Nitrogen (N)</h4>
              <p className="text-[11px] text-slate-550 font-medium">Leaf & Tiller Growth</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2 py-0.5 rounded-full self-start mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Low / Needs Attention
            </span>
          </div>

          {/* Phosphorus P */}
          <div className="bg-emerald-50/10 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[90px] shadow-2xs">
            <div>
              <h4 className="text-sm font-black text-slate-900">Phosphorus (P)</h4>
              <p className="text-[11px] text-slate-550 font-medium">Root Development</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-850 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full self-start mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Good (Adequate)
            </span>
          </div>

          {/* Potassium K */}
          <div className="bg-emerald-50/10 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[90px] shadow-2xs">
            <div>
              <h4 className="text-sm font-black text-slate-900">Potassium (K)</h4>
              <p className="text-[11px] text-slate-550 font-medium">Disease Resistance</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-850 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full self-start mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Good (Healthy)
            </span>
          </div>
        </div>

        {/* Cost & Savings and AI Confidence grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          
          {/* Estimated Cost */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <span className="absolute top-4 right-4 bg-emerald-55 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
              Saves ~₹{(totalSavings).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">
              💰 ESTIMATED COST & SAVINGS
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-black text-slate-900">₹{selectedCrop.costPerAcre}</span>
              <span className="text-xs font-bold text-slate-500">/ acre</span>
              <span className="text-xs text-slate-555 font-medium ml-1">
                (Total ₹{totalCost.toLocaleString('en-IN')} for {acresInput} acres)
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Eliminates over-fertilization, saving up to ₹1,200 per application.
            </p>
            <button 
              onClick={() => setShowCostModal(true)}
              className="text-emerald-700 text-xs font-black hover:underline block cursor-pointer"
            >
              View Cost Breakdown →
            </button>
          </div>

          {/* AI Recommendation Confidence */}
          <div className="bg-slate-55 border border-slate-200 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <span className="absolute top-4 right-4 bg-emerald-55 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
              {selectedCrop.accuracyScore}% Accuracy Score
            </span>
            <span className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">
              🛡️ AI RECOMMENDATION CONFIDENCE
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-2xl font-black text-slate-900">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>High Confidence</span>
            </div>
            <p className="text-xs text-slate-650 font-medium leading-relaxed">
              Backed by recent soil lab tests, 48-hr weather radar, and local ICAR crop models.
            </p>
            <button 
              onClick={() => openWhyModal('ai')}
              className="text-emerald-700 text-xs font-black hover:underline block cursor-pointer"
            >
              How confident is this recommendation? →
            </button>
          </div>
        </div>
      </div>

      {/* 5. 1-CLICK VOICE PROMPTS CARD */}
      <div className="bg-amber-50/20 border border-amber-200/50 rounded-3xl p-6 shadow-xs space-y-4">
        <span className="text-[10px] font-black text-amber-800 tracking-wider block uppercase flex items-center gap-1">
          <Mic className="w-3.5 h-3.5 text-amber-605" />
          <span>ASK ABOUT NUTRIBLEND (1-CLICK VOICE PROMPTS)</span>
        </span>
        <div className="flex flex-wrap gap-2.5">
          {[
            'What should I apply?',
            'Why do I need nitrogen?',
            'How much should I use?',
            'Is it safe to apply today?',
            'Can I reduce the cost?'
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleVoicePromptClick(prompt)}
              className="bg-white hover:bg-amber-50 text-slate-800 border border-amber-200/60 rounded-xl px-4 py-2.5 text-xs font-black shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>💬</span>
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. ADVANCED CUSTOM BLENDER CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">
            🎛️ ADVANCED CUSTOM BLENDER & CHEMICAL RATIO
          </span>
          <h4 className="text-lg font-black text-slate-900">
            View Advanced Analysis & Custom Blender
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Customize organic FYM vs chemical ratios, exact NPK ppm values, and dosage calculators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBlenderOpen(true)}
          className="px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>Open Custom Blender</span>
        </button>
      </div>

      {/* 7. CUSTOM BLENDER MODAL — PRECISION ENGINE */}
      {isBlenderOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col">

            {/* Dark Green Header */}
            <div className="bg-[#1a3326] rounded-t-3xl px-6 py-5 flex items-start justify-between shrink-0">
              <div>
                <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-0.5">NUTRIBLEND™ PRECISION ENGINE</p>
                <h3 className="text-white text-lg font-black leading-tight">Custom Nutrient Blender &amp; Ratios</h3>
              </div>
              <button
                type="button"
                onClick={() => { setIsBlenderOpen(false); setCustomBlenderSaved(false); }}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white font-black text-base transition-all cursor-pointer shrink-0 ml-3 mt-0.5"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 space-y-5">

              {/* Organic / Chemical Slider */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-emerald-700 flex items-center gap-1">🍃 Organic Share: <span className="text-emerald-800">{blenderN}%</span></span>
                  <span className="text-blue-700">Chemical Share: {100 - blenderN}%</span>
                </div>

                {/* Gradient track slider */}
                <div className="relative">
                  <div className="w-full h-3 rounded-full" style={{ background: `linear-gradient(to right, #16a34a ${blenderN}%, #93c5fd ${blenderN}%)` }} />
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={blenderN}
                    onChange={(e) => setBlenderN(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
                    style={{ zIndex: 2 }}
                  />
                  {/* Custom thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-700 border-2 border-white shadow-lg pointer-events-none transition-all"
                    style={{ left: `calc(${((blenderN - 10) / 80) * 100}% - 10px)`, zIndex: 3 }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>10% Low Organic</span>
                  <span className="text-emerald-700 font-black flex items-center gap-1">
                    40% Balanced (Recommended <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />)
                  </span>
                  <span>90% Pure Organic</span>
                </div>
              </div>

              {/* Dosage Cards Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    ⚖️ CALCULATED INGREDIENT DOSAGES ({acresInput} ACRES):
                  </h4>
                  <span className="text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                    🪙 Saves ₹{(selectedCrop.savesPerAcre * acresInput).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* FYM / Desi Compost */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1.5">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">FYM / DESI COMPOST</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-emerald-700">{(blenderN / 100 * acresInput * 1.6).toFixed(1)}</span>
                      <span className="text-xs font-black text-emerald-600">Tons</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold">Pre-ploughing basal</p>
                  </div>

                  {/* Bio-Fertilizer */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1.5">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">BIO-FERTILIZER (PSB)</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-emerald-700">{(blenderN / 100 * acresInput * 2.5).toFixed(1)}</span>
                      <span className="text-xs font-black text-emerald-600">kg</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold">Seed / soil booster</p>
                  </div>

                  {/* Neem-Coated Urea */}
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-1.5">
                    <p className="text-[10px] font-black text-blue-800 uppercase tracking-wide">NEEM-COATED UREA</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-blue-700">{((100 - blenderN) / 100 * acresInput * 1.33).toFixed(1)}</span>
                      <span className="text-xs font-black text-blue-600">Bags</span>
                    </div>
                    <p className="text-[11px] text-blue-700 font-semibold">Split into 2 doses</p>
                  </div>

                  {/* DAP / SSP */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1.5">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-wide">DAP / SSP</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-amber-700">{((100 - blenderN) / 100 * acresInput * 0.725).toFixed(1)}</span>
                      <span className="text-xs font-black text-amber-600">Bags</span>
                    </div>
                    <p className="text-[11px] text-amber-700 font-semibold">Basal root starter</p>
                  </div>
                </div>
              </div>

              {/* Scientific Blend Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
                <p className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  ⚗️ Scientific Blend Formulation:
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {blenderN >= 40
                    ? 'Combining organic compost with neem-coated urea slows down nitrogen volatilization by up to 35%, ensuring gradual root feeding during the critical 15-day tillering period.'
                    : 'High chemical share delivers faster nutrient uptake but may risk leaf burn. Consider increasing organic ratio to ≥40% for long-term soil health and balanced NPK release.'}
                </p>
              </div>

              {/* Agronomic Safety Alert */}
              {blenderN > 70 && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-amber-600 text-sm">⚠️</span>
                  <p className="text-xs text-amber-800 font-bold leading-relaxed">Very high organic ratio may slow nitrogen availability in cold soils. Ensure soil temperature is above 18°C before application.</p>
                </div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="px-5 pb-5 pt-2 flex items-center gap-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => { setIsBlenderOpen(false); setCustomBlenderSaved(false); }}
                className="flex-1 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomBlenderSaved(true);
                  setTimeout(() => { setIsBlenderOpen(false); setCustomBlenderSaved(false); }, 1300);
                }}
                className="flex-1 py-3 bg-[#1a3326] hover:bg-emerald-900 text-white rounded-2xl text-xs font-black cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {customBlenderSaved ? <Check className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
                <span>{customBlenderSaved ? '✓ Recipe Saved!' : 'Save Recipe'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* WHY THIS RECOMMENDATION MODAL */}
      {whyModalContent && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-600" />
                <span>Agronomic Advisory Notes</span>
              </h3>
              <button
                onClick={() => setWhyModalContent(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {whyModalContent}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setWhyModalContent(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 cursor-pointer shadow-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALTERNATIVE OPTIONS MODAL */}
      {showOptionsModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-lg space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span>Alternative Nutrient Options</span>
              </h3>
              <button
                onClick={() => setShowOptionsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  title: 'Option A: Bio-NPK compost tea',
                  desc: 'Rich in active microbes and potassium humates. Boosts nitrogen organic uptake without salt stress.'
                },
                {
                  title: 'Option B: Dry Neem-Coated Urea 46%',
                  desc: 'Slow-release granules that reduce nitrate leaching by 30%. Best applied right before light watering.'
                },
                {
                  title: 'Option C: Foliar NPK (19-19-19) Spray',
                  desc: 'Immediate leaf absorption for swift nutrient recovery. Use 1.5kg/acre mixed in 200L water.'
                }
              ].map((opt, idx) => (
                <div key={idx} className="p-4 bg-slate-50 hover:bg-emerald-50/20 border border-slate-200/80 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800">{opt.title}</h4>
                    <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">{opt.desc}</p>
                  </div>
                  <button
                    onClick={() => handleSelectAlternative(opt.title, opt.desc)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shrink-0 cursor-pointer shadow-2xs"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Field Nutrition History</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { date: '03 Aug 2026', title: 'Nitrogen Blend (basal)', qty: '10.0 kg', status: 'Completed' },
                { date: '18 Jul 2026', title: 'Single Superphosphate (SSP)', qty: '12.5 kg', status: 'Completed' },
                { date: '25 Jun 2026', title: 'Organic FYM Manure tilling', qty: '400 kg', status: 'Completed' }
              ].map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 border-l-2 border-emerald-500 pl-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-bold">{hist.date}</p>
                    <p className="text-xs font-black text-slate-800">{hist.title}</p>
                    <p className="text-[11px] text-emerald-700 font-bold">Qty: {hist.qty} • {hist.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANALYSIS MODAL */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span>Detailed Leaf Tissue Report</span>
              </h3>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {[
                { name: 'Nitrogen (N)', percent: 35, color: 'bg-amber-500', note: 'Deficient' },
                { name: 'Phosphorus (P)', percent: 68, color: 'bg-emerald-600', note: 'Adequate' },
                { name: 'Potassium (K)', percent: 84, color: 'bg-emerald-600', note: 'Optimal' },
                { name: 'Sulphur (S)', percent: 42, color: 'bg-amber-500', note: 'Low' },
                { name: 'Zinc (Zn)', percent: 76, color: 'bg-emerald-600', note: 'Optimal' }
              ].map((nut, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{nut.name}</span>
                    <span>{nut.percent}% ({nut.note})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${nut.color} rounded-full`} style={{ width: `${nut.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COST BREAKDOWN MODAL */}
      {showCostModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <span>Cost & Savings Ledger</span>
              </h3>
              <button
                onClick={() => setShowCostModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between font-bold text-slate-655">
                <span>Fertilizer inputs ({totalAmount.toFixed(1)} kg):</span>
                <span>₹{(selectedCrop.costPerAcre * acresInput * 0.7).toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-655">
                <span>Labor / spray hire:</span>
                <span>₹{(selectedCrop.costPerAcre * acresInput * 0.2).toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-655">
                <span>Water / diesel pumping:</span>
                <span>₹{(selectedCrop.costPerAcre * acresInput * 0.1).toFixed(0)}</span>
              </div>
              <div className="border-t border-slate-150 pt-2 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Budget Estimate:</span>
                <span>₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-emerald-900 font-bold flex justify-between">
                <span>Estimated Yield Profit Saved:</span>
                <span>+ ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCostModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
