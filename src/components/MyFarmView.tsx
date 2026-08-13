import React, { useState } from 'react';
import {
  CropField,
  FieldZone,
  FarmerProfile
} from '../types';
import { ThreeFieldView } from './ThreeFieldView';
import { WhatWhyWhenHowCard } from './WhatWhyWhenHowCard';
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
  CheckCircle2
} from 'lucide-react';

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
  const [selectedFieldId, setSelectedFieldId] = useState<string>(fields[0]?.id || 'field-1');
  const [selectedZone, setSelectedZone] = useState<FieldZone | null>(null);
  const [show3DModal, setShow3DModal] = useState<boolean>(true);

  const activeField = fields.find((f) => f.id === selectedFieldId) || fields[0];

  return (
    <div id="my-farm-view-container" className="space-y-6 pb-24 md:pb-12">
      {/* Farm Overview Top Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9E5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#EAF5EC] text-[#56965F] text-xs font-bold rounded-full">
                🌾 Digital Farm Map
              </span>
              <span className="text-xs text-[#68736B] font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6FAF78]" /> {profile.location}
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#26332A] mt-1">My Farm Overview</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F8F7EF] px-4 py-2 rounded-2xl border border-[#E6E9E5] text-center">
              <span className="text-xs text-[#68736B] block">Total Area</span>
              <span className="text-base font-extrabold text-[#26332A]">{profile.totalAreaAcres} Acres</span>
            </div>
            <div className="bg-[#F8F7EF] px-4 py-2 rounded-2xl border border-[#E6E9E5] text-center">
              <span className="text-xs text-[#68736B] block">Fields</span>
              <span className="text-base font-extrabold text-[#26332A]">{profile.totalFields} Fields</span>
            </div>
            <div className="bg-[#F8F7EF] px-4 py-2 rounded-2xl border border-[#E6E9E5] text-center">
              <span className="text-xs text-[#68736B] block">Season</span>
              <span className="text-base font-extrabold text-[#56965F]">{profile.season}</span>
            </div>
          </div>
        </div>

        {/* Field Selection Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {fields.map((f) => {
            const isSelected = f.id === selectedFieldId;
            return (
              <button
                key={f.id}
                id={`btn-select-field-${f.id}`}
                onClick={() => {
                  setSelectedFieldId(f.id);
                  setSelectedZone(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-[#EAF5EC] border-[#6FAF78] ring-2 ring-[#6FAF78]/30 shadow-xs'
                    : 'bg-white border-[#E6E9E5] hover:border-[#6FAF78]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#68736B]">{f.name}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      f.climateRiskLevel === 'high'
                        ? 'bg-[#E88B8B] text-white'
                        : f.climateRiskLevel === 'medium'
                        ? 'bg-[#F4B66A] text-[#26332A]'
                        : 'bg-[#6FAF78] text-white'
                    }`}
                  >
                    {f.climateRiskLevel === 'high'
                      ? '🔴 High Risk'
                      : f.climateRiskLevel === 'medium'
                      ? '🟡 Monitor'
                      : '🟢 Healthy'}
                  </span>
                </div>

                <h3 className="font-extrabold text-[#26332A] text-lg">{f.cropName}</h3>
                <div className="flex items-center justify-between mt-2 text-xs text-[#68736B]">
                  <span>{f.areaAcres} Acres</span>
                  <span>Moisture: <b className="text-[#26332A]">{f.soilMoisturePercent}%</b></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Field Details Dashboard */}
      {activeField && (
        <div id="selected-field-details" className="space-y-6">
          {/* Header Bar for Active Field */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-[#26332A]">{activeField.name}: {activeField.cropName}</h3>
                <span className="text-xs font-bold px-3 py-1 bg-[#F8F7EF] border border-[#E6E9E5] rounded-full text-[#68736B]">
                  {activeField.areaAcres} Acres
                </span>
              </div>
              <p className="text-xs text-[#68736B] mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#6FAF78]" /> Sowing Date: <b>{activeField.sowingDate}</b>
                <span>•</span>
                Growth Stage: <b className="text-[#56965F]">{activeField.growthStage}</b>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-3d-view"
                onClick={() => setShow3DModal(!show3DModal)}
                className="px-4 py-2.5 bg-[#6FAF78] hover:bg-[#56965F] text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>{show3DModal ? 'Hide 3D View' : 'Open 3D Field View'}</span>
              </button>
            </div>
          </div>

          {/* Key Field Condition Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#E6E9E5] shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#56965F] text-xs font-bold mb-1">
                <Sprout className="w-4 h-4" /> Crop Health
              </div>
              <span className="text-2xl font-black text-[#26332A]">{activeField.healthPercent}%</span>
              <span className="text-[11px] text-[#68736B] block mt-0.5">Overall Canopy Index</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6E9E5] shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#3B82F6] text-xs font-bold mb-1">
                <Droplets className="w-4 h-4" /> Soil Moisture
              </div>
              <span className="text-2xl font-black text-[#26332A]">{activeField.soilMoisturePercent}%</span>
              <span className="text-[11px] text-[#E88B8B] font-bold block mt-0.5">Low (Needs Irrigation)</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6E9E5] shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#F4B66A] text-xs font-bold mb-1">
                <Thermometer className="w-4 h-4" /> Temp
              </div>
              <span className="text-2xl font-black text-[#26332A]">{activeField.temperatureC}°C</span>
              <span className="text-[11px] text-[#68736B] block mt-0.5">Root zone temperature</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6E9E5] shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#0284C7] text-xs font-bold mb-1">
                <CloudRain className="w-4 h-4" /> Rainfall
              </div>
              <span className="text-2xl font-black text-[#26332A]">{activeField.rainfallMm} mm</span>
              <span className="text-[11px] text-[#68736B] block mt-0.5">Last 24 hours</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6E9E5] shadow-2xs col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[#E88B8B] text-xs font-bold mb-1">
                <ShieldAlert className="w-4 h-4" /> Climate Risk
              </div>
              <span className="text-2xl font-black text-[#E88B8B] uppercase">{activeField.climateRiskLevel}</span>
              <span className="text-[11px] text-[#68736B] block mt-0.5">Heat stress warning</span>
            </div>
          </div>

          {/* Interactive 3D Field View Component */}
          {show3DModal && (
            <ThreeFieldView
              field={activeField}
              onZoneSelect={(zone) => setSelectedZone(zone)}
              selectedZone={selectedZone}
            />
          )}

          {/* Field Zones List & Details */}
          <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-[#26332A]">
              Field Zone Breakdown ({activeField.zones.length} Zones)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeField.zones.map((zone) => {
                const isZoneSelected = selectedZone?.id === zone.id;
                return (
                  <div
                    key={zone.id}
                    id={`zone-card-${zone.id}`}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isZoneSelected
                        ? 'bg-[#EAF5EC] border-[#6FAF78] ring-2 ring-[#6FAF78]/40'
                        : 'bg-white border-[#E6E9E5] hover:border-[#6FAF78]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-extrabold text-[#26332A] text-sm">{zone.name}</h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          zone.health === 'healthy'
                            ? 'bg-[#EAF5EC] text-[#56965F]'
                            : zone.health === 'monitor'
                            ? 'bg-[#F7E7A8] text-[#854D0E]'
                            : 'bg-[#E88B8B] text-white'
                        }`}
                      >
                        {zone.health === 'healthy' ? '🟢 Healthy' : zone.health === 'monitor' ? '🟡 Watch' : '🔴 High Risk'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#68736B]">
                      <div>Moisture: <b className="text-[#26332A]">{zone.moisturePercent}%</b></div>
                      <div>Temp: <b className="text-[#26332A]">{zone.temperatureC}°C</b></div>
                      <div>Nitrogen: <b className="text-[#26332A]">{zone.nitrogenLevel}</b></div>
                      <div>Confidence: <b className="text-[#56965F]">{zone.confidence}%</b></div>
                    </div>

                    <p className="text-xs text-[#26332A] font-medium mt-2 pt-2 border-t border-[#E6E9E5] line-clamp-2">
                      {zone.riskReason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Zone Detail Card / Drawer */}
          {selectedZone && (
            <div className="bg-[#F8F7EF] rounded-3xl p-5 border-2 border-[#6FAF78] shadow-md space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#6FAF78] text-white flex items-center justify-center font-bold text-sm">
                    📍
                  </span>
                  <div>
                    <h3 className="font-black text-lg text-[#26332A]">{selectedZone.name} Details</h3>
                    <p className="text-xs text-[#68736B]">Soil Type: {selectedZone.soilType}</p>
                  </div>
                </div>

                <button
                  id="btn-close-zone-modal"
                  onClick={() => setSelectedZone(null)}
                  className="p-2 rounded-xl bg-white text-[#68736B] hover:text-[#26332A] border border-[#E6E9E5]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* What / Why / When / How for Zone */}
              <WhatWhyWhenHowCard
                what={`Zone Climate Risk: ${selectedZone.health.toUpperCase().replace('_', ' ')}`}
                why={selectedZone.riskReason}
                when="Next 24 Hours during heat wave window"
                whatToDo={selectedZone.recommendation}
                actionText="Ask AI Assistant About This Zone"
                onActionClick={() => {
                  if (onOpenAskAiForField) {
                    onOpenAskAiForField(`How should I treat ${selectedZone.name} in ${activeField.name}?`);
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
