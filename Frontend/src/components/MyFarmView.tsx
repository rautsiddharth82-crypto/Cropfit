import React, { useState } from 'react';
import {
  CropField,
  FieldZone,
  FarmerProfile
} from '../types';
import { ThreeFieldView } from './ThreeFieldView';
import {
  Sprout,
  Droplets,
  Thermometer,
  CloudRain,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Layers,
  X,
  CheckCircle2,
  Sparkles,
  Compass,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';

interface MyFarmViewProps {
  profile: FarmerProfile;
  fields: CropField[];
  onOpenAskAiForField?: (fieldName: string) => void;
}

export const MyFarmView: React.FC<MyFarmViewProps> = ({
  profile,
  fields,
  onOpenAskAiForField,
}) => {
  const { language, t } = useLanguage();
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || 'field-1');
  const [selectedZone, setSelectedZone] = useState<FieldZone | null>(null);
  const [show3DModal, setShow3DModal] = useState<boolean>(false);

  const activeField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  const fieldImages: Record<string, string> = {
    'field-1': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', // Wheat
    'field-2': 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=800&q=80', // Rice
    'field-3': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80', // Mustard / Veg
  };

  return (
    <div id="my-farm-view-container" className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      <div className="border border-emerald-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/crop_and_farm.png"
            alt="My Farm Theme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span>{language === 'hi' ? 'खेत बुद्धिमत्ता मानचित्र' : 'Farm Intelligence Map'}</span>
              </span>
              <span className="text-xs text-emerald-100 font-extrabold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" /> {profile.location}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'hi' ? 'मेरे खेत एवं फसलें' : language === 'pa' ? 'ਮੇਰੇ ਖੇਤ ਅਤੇ ਫ਼ਸਲਾਂ' : 'My Farm Fields & Crops'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
              {language === 'hi' ? 'खेतों की निगरानी, फसल वृद्धि चरण और स्वास्थ्य का संपूर्ण विश्लेषण।' : 'Visual field scouting, live growth stages, and high-resolution crop health overview.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-950/60 border border-emerald-600/40 px-3.5 py-2 rounded-2xl text-center">
              <span className="text-[11px] text-emerald-200 block font-semibold">{language === 'hi' ? 'कुल रकबा' : 'Total Land'}</span>
              <span className="text-base font-black text-white">{profile.totalAreaAcres} {language === 'hi' ? 'एकड़' : 'Acres'}</span>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-600/40 px-3.5 py-2 rounded-2xl text-center">
              <span className="text-[11px] text-emerald-200 block font-semibold">{language === 'hi' ? 'सक्रिय खेत' : 'Active Fields'}</span>
              <span className="text-base font-black text-white">{profile.totalFields} {language === 'hi' ? 'खेत' : 'Fields'}</span>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-600/40 px-3.5 py-2 rounded-2xl text-center">
              <span className="text-[11px] text-emerald-200 block font-semibold">{language === 'hi' ? 'सीजन' : 'Season'}</span>
              <span className="text-base font-black text-emerald-300">{profile.season}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Field Cards Row with High Quality Images & Clean Glanceable Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map((f) => {
          const isSelected = f.id === selectedFieldId;
          const bgImg = fieldImages[f.id] || fieldImages['field-1'];

          return (
            <div
              key={f.id}
              id={`btn-select-field-${f.id}`}
              onClick={() => {
                setSelectedFieldId(f.id);
                setSelectedZone(null);
              }}
              className={`rounded-3xl border overflow-hidden cursor-pointer transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-lg ring-2 ring-emerald-500/30'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              {/* Photo Header */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={bgImg}
                  alt={f.cropName}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isSelected ? 'scale-105' : 'hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-xs font-black rounded-full border border-white/20">
                    {f.name}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-black shadow-xs ${
                      f.climateRiskLevel === 'high'
                        ? 'bg-rose-500 text-white'
                        : f.climateRiskLevel === 'medium'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {f.climateRiskLevel === 'high'
                      ? (language === 'hi' ? '⚠️ उच्च जोखिम' : '⚠️ High Risk')
                      : f.climateRiskLevel === 'medium'
                      ? (language === 'hi' ? '⚡ निगरानी' : '⚡ Monitor')
                      : (language === 'hi' ? '✅ स्वस्थ' : '✅ Healthy')}
                  </span>
                </div>

                {/* Crop Name & Area Overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-black drop-shadow-md">{f.cropName}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-200 mt-0.5">
                    <span>{f.areaAcres} {language === 'hi' ? 'एकड़' : 'Acres'} • {f.growthStage}</span>
                    <span className="font-bold text-emerald-300">{language === 'hi' ? 'स्वास्थ्य' : 'Health'}: {f.healthPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Minimal Clean Metrics */}
              <div className="p-4 bg-slate-50/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span>{language === 'hi' ? 'नमी:' : 'Moisture:'} <b className="text-slate-900">{f.soilMoisturePercent}%</b></span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Thermometer className="w-4 h-4 text-amber-500" />
                  <span>{language === 'hi' ? 'तापमान:' : 'Temp:'} <b className="text-slate-900">{f.temperatureC}°C</b></span>
                </div>
                <div className={`text-xs font-black ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isSelected ? (language === 'hi' ? '● चयनित खेत' : '● Active Field') : (language === 'hi' ? 'चुनें →' : 'Select →')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Field Focus Section - Streamlined & Visual */}
      {activeField && (
        <div id="selected-field-details" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {activeField.name}: {activeField.cropName}
                </h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-extrabold">
                  {activeField.areaAcres} {language === 'hi' ? 'एकड़' : 'Acres'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-3">
                <span>🗓️ {language === 'hi' ? 'बुवाई:' : 'Sown:'} <b>{activeField.sowingDate}</b></span>
                <span>•</span>
                <span>🌱 {language === 'hi' ? 'चरण:' : 'Stage:'} <b className="text-emerald-700">{activeField.growthStage}</b></span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-3d-view"
                onClick={() => setShow3DModal(!show3DModal)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>
                  {show3DModal
                    ? (language === 'hi' ? '3D मैप छुपाएं' : 'Hide 3D Field Map')
                    : (language === 'hi' ? '3D फील्ड मैप देखें' : 'View 3D Field Map')}
                </span>
              </button>

              {onOpenAskAiForField && (
                <button
                  onClick={() => onOpenAskAiForField(`Provide agronomy advice for ${activeField.name} (${activeField.cropName})`)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'hi' ? 'AI से पूछें' : 'Ask AI'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 3D Field Map (Optional Collapsible) */}
          {show3DModal && (
            <ThreeFieldView
              field={activeField}
              onZoneSelect={(zone) => setSelectedZone(zone)}
              selectedZone={selectedZone}
            />
          )}

          {/* Field Zones Visual Strip */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>{language === 'hi' ? `खेत के क्षेत्र एवं खंड (${activeField.zones.length} खंड)` : `Field Zones & Scouting Spots (${activeField.zones.length} Zones)`}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeField.zones.map((zone) => {
                const isZoneSelected = selectedZone?.id === zone.id;
                return (
                  <div
                    key={zone.id}
                    id={`zone-card-${zone.id}`}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isZoneSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/60 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-sm text-slate-900">{zone.name}</span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-black ${
                          zone.health === 'healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : zone.health === 'monitor'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {zone.health === 'healthy'
                          ? (language === 'hi' ? '🟢 स्वस्थ' : '🟢 Healthy')
                          : zone.health === 'monitor'
                          ? (language === 'hi' ? '🟡 निगरानी' : '🟡 Watch')
                          : (language === 'hi' ? '🔴 अलर्ट' : '🔴 Alert')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1">
                      {zone.riskReason}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <span>{language === 'hi' ? 'नमी:' : 'Moisture:'} <b className="text-slate-800">{zone.moisturePercent}%</b></span>
                      <span>{language === 'hi' ? 'नाइट्रोजन:' : 'Nitrogen:'} <b className="text-slate-800">{zone.nitrogenLevel}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Zone Quick Recommendation */}
          {selectedZone && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                  📍
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900">
                    {selectedZone.name} {language === 'hi' ? 'सलाह:' : 'Advisory:'} {selectedZone.recommendation}
                  </h5>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    {language === 'hi' ? 'मिट्टी प्रकार:' : 'Soil Type:'} {selectedZone.soilType} • {language === 'hi' ? 'सटीकता:' : 'Confidence:'} {selectedZone.confidence}%
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedZone(null)}
                className="self-end sm:self-center text-xs text-slate-500 hover:text-slate-900 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
              >
                {language === 'hi' ? 'बंद करें' : 'Dismiss'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

