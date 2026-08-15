import React, { useState } from 'react';
import { CropDisease } from '../types';
import { MOCK_DISEASES } from '../data/mockData';
import { Camera, Upload, AlertCircle, CheckCircle, Sparkles, ShieldAlert, ArrowUpRight, FileCheck, RefreshCw } from 'lucide-react';

interface DiseaseViewProps {
  onAskAiForDisease?: (query: string) => void;
}

export const DiseaseView: React.FC<DiseaseViewProps> = ({ onAskAiForDisease }) => {
  const [diseases] = useState<CropDisease[]>(MOCK_DISEASES);
  const [selectedDisease, setSelectedDisease] = useState<CropDisease>(MOCK_DISEASES[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sample' | 'custom'>('sample');

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
    <div id="disease-view-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#EAF5EC] border-2 border-[#A8D5A2] rounded-[24px] p-6 text-[#26332A] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none text-9xl">
          🔍
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#6FAF78] text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>AI Crop Health & Disease Scanner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-[#26332A]">
            Photo Disease Diagnosis & Spray Advisor
          </h2>
          <p className="text-sm text-[#68736B] leading-relaxed font-medium">
            Snap or upload a photo of affected crop leaves to instantly detect fungal, bacterial, or pest infestations with 95%+ confidence and tailored pesticide dosage.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#A8D5A2]">
          <button
            onClick={() => {
              setActiveTab('sample');
              setUploadedImage(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'sample'
                ? 'bg-[#6FAF78] text-white shadow-xs'
                : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:bg-[#F8F7EF]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Sample Disease Library</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'bg-[#6FAF78] text-white shadow-xs'
                : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:bg-[#F8F7EF]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scan My Crop Photo</span>
          </button>
        </div>
      </div>

      {/* CUSTOM SCANNER OR SAMPLE SELECTOR */}
      {activeTab === 'custom' && (
        <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs text-center space-y-4">
          <h3 className="text-lg font-extrabold text-[#26332A]">Upload or Snap Affected Leaf Photo</h3>
          <p className="text-xs text-[#68736B] max-w-md mx-auto">
            Take a clear photo of the leaf symptoms under bright sunlight for accurate computer vision detection.
          </p>

          <div className="max-w-md mx-auto border-2 border-dashed border-[#A8D5A2] bg-[#F8F7EF] rounded-2xl p-6 relative flex flex-col items-center justify-center space-y-3">
            {uploadedImage ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#E6E9E5]">
                <img src={uploadedImage} alt="Crop Scan" className="w-full h-full object-cover" />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#6FAF78]" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Vision Model Analyzing Rust Pustules...</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#EAF5EC] text-[#56965F] flex items-center justify-center text-2xl">
                  📷
                </div>
                <label className="cursor-pointer bg-[#6FAF78] hover:bg-[#56965F] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </>
            )}
          </div>
        </div>
      )}

      {/* SAMPLE SELECTOR CARDS */}
      {activeTab === 'sample' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {diseases.map((dis) => {
            const isSelected = dis.id === selectedDisease.id;
            return (
              <div
                key={dis.id}
                onClick={() => setSelectedDisease(dis)}
                className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#6FAF78] shadow-md ring-2 ring-[#6FAF78]/20'
                    : 'border-[#E6E9E5] hover:border-[#A8D5A2]'
                }`}
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100 relative">
                  <img src={dis.imageUrl} alt={dis.diseaseName} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    {dis.severityPercent}% Severity
                  </span>
                </div>
                <p className="text-[10px] font-bold text-[#56965F] uppercase">{dis.cropName}</p>
                <h4 className="font-extrabold text-sm text-[#26332A] truncate">{dis.diseaseName}</h4>
                <p className="text-[11px] text-[#68736B] italic">{dis.scientificName}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* DIAGNOSTIC DETAILS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Disease Photo & Bounding Box */}
        <div className="lg:col-span-1 bg-white border border-[#E6E9E5] rounded-[24px] p-5 shadow-xs space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-[#E6E9E5] aspect-square">
            <img
              src={uploadedImage || selectedDisease.imageUrl}
              alt={selectedDisease.diseaseName}
              className="w-full h-full object-cover"
            />

            {/* Simulated Bounding Box */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-500 bg-red-500/10 rounded-lg flex items-start justify-start p-1">
              <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                Pustule Spot (96%)
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#F8F7EF] rounded-xl text-center">
            <p className="text-xs text-[#68736B] font-bold">AI Diagnosis Confidence</p>
            <p className="text-xl font-black text-[#26332A] mt-0.5">{selectedDisease.confidencePercent}%</p>
          </div>
        </div>

        {/* Right: Symptoms, Treatments & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E9E5] pb-4">
              <div>
                <span className="text-xs font-bold text-[#56965F] uppercase tracking-wider">
                  {selectedDisease.cropName} Disease Report
                </span>
                <h3 className="text-xl font-extrabold text-[#26332A]">{selectedDisease.diseaseName}</h3>
                <p className="text-xs text-[#68736B] italic">{selectedDisease.scientificName}</p>
              </div>
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>{selectedDisease.severityPercent}% Foliar Damage</span>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#68736B] mb-2">
                Identified Symptoms
              </h4>
              <ul className="space-y-1.5">
                {selectedDisease.symptoms.map((symptom, i) => (
                  <li key={i} className="text-xs text-[#26332A] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chemical vs Organic Treatment Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl">
                <p className="text-xs font-black uppercase text-red-800 mb-1">
                  🧪 Chemical Fungicide Spray
                </p>
                <p className="text-xs text-[#26332A] leading-relaxed font-semibold">
                  {selectedDisease.chemicalTreatment}
                </p>
              </div>

              <div className="p-4 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl">
                <p className="text-xs font-black uppercase text-[#56965F] mb-1">
                  🌿 Organic / Bio-Control Solution
                </p>
                <p className="text-xs text-[#26332A] leading-relaxed font-semibold">
                  {selectedDisease.organicTreatment}
                </p>
              </div>
            </div>

            {/* Preventive measures */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#68736B] mb-2">
                Preventive Agronomic Measures
              </h4>
              <ul className="space-y-1.5">
                {selectedDisease.preventiveMeasures.map((measure, i) => (
                  <li key={i} className="text-xs text-[#26332A] flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#56965F] shrink-0 mt-0.5" />
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ask AI Assistant */}
            {onAskAiForDisease && (
              <button
                onClick={() =>
                  onAskAiForDisease(
                    `How to treat ${selectedDisease.diseaseName} in my ${selectedDisease.cropName} crop under current temperature?`
                  )
                }
                className="w-full bg-[#6FAF78] hover:bg-[#56965F] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Assistant for Custom Spray Window</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
