import React, { useState } from 'react';
import { CropDisease } from '../types';
import { MOCK_DISEASES } from '../data/mockData';
import {
  Camera,
  Upload,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface DiseaseViewProps {
  activeTab?: 'sample' | 'custom';
  onTabChange?: (tab: 'sample' | 'custom') => void;
  selectedDiseaseId?: string;
  onSelectDiseaseId?: (id: string) => void;
  onAskAiForDisease?: (query: string) => void;
}

export const DiseaseView: React.FC<DiseaseViewProps> = ({
  activeTab: propTab,
  onTabChange,
  selectedDiseaseId: propId,
  onSelectDiseaseId,
  onAskAiForDisease
}) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const [diseases] = useState<CropDisease[]>(MOCK_DISEASES);

  const [internalId, setInternalId] = useState<string>(MOCK_DISEASES[0].id);
  const activeId = propId !== undefined ? propId : internalId;
  const selectedDisease = diseases.find((d) => d.id === activeId) || diseases[0];

  const handleSelectDisease = (dis: CropDisease) => {
    speak(`${dis.diseaseName}, ${dis.cropName}`);
    if (onSelectDiseaseId) onSelectDiseaseId(dis.id);
    else setInternalId(dis.id);
  };

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const [internalTab, setInternalTab] = useState<'sample' | 'custom'>('sample');
  const activeTab = propTab !== undefined ? propTab : internalTab;

  const handleTabSwitch = (tab: 'sample' | 'custom') => {
    if (onTabChange) onTabChange(tab);
    else setInternalTab(tab);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        triggerAiScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div id="disease-view-root" className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="border border-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/disease_banner.jpg"
            alt="Disease Scanner Theme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'hi' ? 'एआई फसल स्वास्थ्य एवं रोग जांच' : 'AI Crop Health & Disease Scanner'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{t('disease_title')}</span>
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10 shrink-0">
          <button
            id="btn-disease-tab-sample"
            type="button"
            data-voice-text={language === 'hi' ? 'नमूना रोग लाइब्रेरी' : 'Sample Disease Library'}
            onClick={() => {
              speak(language === 'hi' ? 'नमूना रोग लाइब्रेरी' : 'Sample Disease Library');
              handleTabSwitch('sample');
              setUploadedImage(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-white text-emerald-950 shadow-md scale-102'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'नमूना रोग लाइब्रेरी' : 'Sample Disease Library'}</span>
          </button>
          <button
            id="btn-disease-tab-custom"
            type="button"
            data-voice-text={language === 'hi' ? 'पत्ती की फोटो स्कैन करें' : 'Scan Crop Photo'}
            onClick={() => {
              speak(language === 'hi' ? 'पत्ती की फोटो स्कैन करें' : 'Scan Crop Photo');
              handleTabSwitch('custom');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-white text-emerald-950 shadow-md scale-102'
                : 'text-emerald-100 hover:bg-white/10'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'पत्ती की फोटो स्कैन करें' : 'Scan Crop Photo'}</span>
          </button>
        </div>
      </div>

      {/* 2. Custom Scanner Upload Area */}
      {activeTab === 'custom' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            {language === 'hi' ? 'प्रभावित पत्ते की फोटो अपलोड करें या खींचें' : 'Upload or Snap Affected Leaf Photo'}
          </h3>

          <div className="max-w-xl mx-auto border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-3xl p-8 relative flex flex-col items-center justify-center space-y-4 transition-all">
            {uploadedImage ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img src={uploadedImage} alt="Crop Scan" className="w-full h-full object-cover" />
                {isScanning && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      {language === 'hi' ? 'एआई विज़न मॉडल रतुआ व फफूंद का विश्लेषण कर रहा है...' : 'AI Vision Model Analyzing Rust & Foliar Pustules...'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl shadow-sm">
                  📷
                </div>
                <label className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md transition-all inline-flex items-center gap-2 hover:scale-105 active:scale-95">
                  <Upload className="w-4 h-4" />
                  <span>{language === 'hi' ? 'फोटो चुनें / कैमरा खोलें' : 'Choose Photo / Open Camera'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. Sample Disease Grid */}
      {activeTab === 'sample' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {diseases.map((dis) => {
            const isSelected = dis.id === selectedDisease.id;
            return (
              <div
                key={dis.id}
                id={`disease-card-${dis.id}`}
                onClick={() => handleSelectDisease(dis)}
                className={`bg-white border rounded-3xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.01]'
                    : 'border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-3 bg-slate-100 relative">
                  <img src={dis.imageUrl} alt={dis.diseaseName} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                    {dis.severityPercent}% {language === 'hi' ? 'गंभीरता' : 'Severity'}
                  </span>
                </div>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">{dis.cropName}</p>
                <h4 className="font-black text-sm text-slate-900 truncate">{dis.diseaseName}</h4>
                <p className="text-[11px] text-slate-500 italic truncate">{dis.scientificName}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Diagnostic Details & Treatment Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Visual Scan & Confidence Card */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square shadow-inner">
            <img
              src={uploadedImage || selectedDisease.imageUrl}
              alt={selectedDisease.diseaseName}
              className="w-full h-full object-cover"
            />

            {/* AI Bounding Box Spot Indicator */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-rose-500 bg-rose-500/15 rounded-xl flex items-start justify-start p-1.5">
              <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                {language === 'hi' ? 'रोग धब्बा क्षेत्र (96%)' : 'Pustule Spot (96%)'}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
              {language === 'hi' ? 'एआई रोग पहचान सटीकता' : 'AI Diagnosis Confidence'}
            </p>
            <p className="text-2xl font-black text-emerald-950 mt-0.5">{selectedDisease.confidencePercent}%</p>
          </div>
        </div>

        {/* Right: Symptoms & Chemical vs Organic Treatments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                  {selectedDisease.cropName} {language === 'hi' ? 'रोग रिपोर्ट' : 'Disease Report'}
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedDisease.diseaseName}</h3>
                <p className="text-xs text-slate-500 italic">{selectedDisease.scientificName}</p>
              </div>
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{selectedDisease.severityPercent}% {language === 'hi' ? 'पत्तियों को नुकसान' : 'Foliar Damage'}</span>
              </div>
            </div>

            {/* Symptoms list */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
                {t('symptoms')}
              </h4>
              <ul className="space-y-2">
                {selectedDisease.symptoms.map((symptom, i) => (
                  <li key={i} className="text-xs text-slate-800 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chemical vs Organic Treatment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
                <p className="text-xs font-black uppercase text-rose-900">
                  🧪 {t('chemical_spray')}
                </p>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  {selectedDisease.chemicalTreatment}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-1">
                <p className="text-xs font-black uppercase text-emerald-900">
                  🌿 {t('organic_remedy')}
                </p>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                  {selectedDisease.organicTreatment}
                </p>
              </div>
            </div>

            {/* Preventive measures */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
                {t('preventive_measures')}
              </h4>
              <ul className="space-y-2">
                {selectedDisease.preventiveMeasures.map((measure, i) => (
                  <li key={i} className="text-xs text-slate-800 flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ask AI Assistant */}
            {onAskAiForDisease && (
              <button
                id="btn-disease-ask-ai"
                type="button"
                onClick={() =>
                  onAskAiForDisease(
                    language === 'hi'
                      ? `मेरी ${selectedDisease.cropName} फसल में ${selectedDisease.diseaseName} रोग के उपचार के लिए सही दवा और स्प्रे का समय बताएं?`
                      : `How to treat ${selectedDisease.diseaseName} in my ${selectedDisease.cropName} crop under current temperature?`
                  )
                }
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'hi' ? 'एआई सहायक से स्प्रे का सर्वोत्तम समय पूछें' : 'Ask AI Assistant for Custom Spray Window'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
