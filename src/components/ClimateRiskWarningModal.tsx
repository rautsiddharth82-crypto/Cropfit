import React, { useState } from 'react';
import { EarlyWarningAlert, SignalValidation } from '../types';
import {
  X,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Globe,
  Thermometer,
  Droplet,
  CloudOff,
  Sprout,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ClimateRiskWarningModalProps {
  alert: EarlyWarningAlert;
  onClose: () => void;
  onActionClick: () => void;
}

export const ClimateRiskWarningModal: React.FC<ClimateRiskWarningModalProps> = ({
  alert,
  onClose,
  onActionClick,
}) => {
  const [simulateConflict, setSimulateConflict] = useState<boolean>(false);
  const [selectedMapZone, setSelectedMapZone] = useState<number | null>(5);

  const confidenceScore = simulateConflict ? 54 : alert.confidencePercent;

  const currentSignals: SignalValidation[] = simulateConflict
    ? [
      { source: 'Weather Station', status: 'High Risk', level: 'red', details: '36°C forecast heat peak' },
      { source: 'Soil Sensors', status: 'Normal', level: 'green', details: 'Sensor reading 58% moisture (Calibrating)' },
      { source: 'Satellite Thermal', status: 'Moderate Stress', level: 'orange', details: 'Thermal variance observed' },
      { source: 'Farmer Field Observation', status: 'Disagrees', level: 'yellow', details: 'No visible wilting yet' }
    ]
    : alert.signals;

  const zones2D = [
    { id: 1, name: 'Zone 1', status: 'green', label: '🟢 Zone 1', moisture: '52%', temp: '28°C', rec: 'Normal monitoring' },
    { id: 2, name: 'Zone 2', status: 'green', label: '🟢 Zone 2', moisture: '48%', temp: '29°C', rec: 'Stable soil moisture' },
    { id: 3, name: 'Zone 3', status: 'yellow', label: '🟡 Zone 3', moisture: '38%', temp: '32°C', rec: 'Monitor moisture levels' },
    { id: 4, name: 'Zone 4', status: 'orange', label: '🟠 Zone 4', moisture: '31%', temp: '34°C', rec: 'Prepare for watering' },
    { id: 5, name: 'Zone 5', status: 'red', label: '🔴 Zone 5', moisture: '26%', temp: '36°C', rec: 'Prioritize early morning irrigation' },
  ];

  const activeZone = zones2D.find((z) => z.id === selectedMapZone) || zones2D[4];

  return (
    <div
      id="climate-risk-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#E6E9E5] shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Modal Header */}
        <div className="bg-[#E88B8B]/15 border-b border-[#E88B8B] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E88B8B] text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-[#E88B8B] uppercase tracking-wider">
                Climate Risk Intelligence
              </span>
              <h2 className="text-xl font-black text-[#26332A]">🔴 HIGH CLIMATE STRESS RISK</h2>
            </div>
          </div>

          <button
            id="btn-close-risk-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-white text-[#68736B] hover:text-[#26332A] border border-[#E6E9E5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Risk Summary Card */}
          <div className="bg-[#F8F7EF] rounded-2xl p-4 border border-[#E6E9E5] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#68736B] block">Expected Timeline:</span>
              <span className="font-extrabold text-[#26332A] text-sm">{alert.timeframe}</span>
            </div>
            <div>
              <span className="text-[#68736B] block">Crop Affected:</span>
              <span className="font-extrabold text-[#26332A] text-sm">{alert.crop}</span>
            </div>
            <div>
              <span className="text-[#68736B] block">Growth Stage:</span>
              <span className="font-extrabold text-[#26332A] text-sm">{alert.growthStage}</span>
            </div>
            <div>
              <span className="text-[#68736B] block">Risk Rating:</span>
              <span className="font-extrabold text-[#E88B8B] text-sm uppercase">HIGH STRESS</span>
            </div>
          </div>

          {/* RISK TIMELINE CHART */}
          <div className="bg-white rounded-2xl p-4 border border-[#E6E9E5] space-y-3">
            <h3 className="text-sm font-extrabold text-[#26332A] flex items-center justify-between">
              <span>Risk Progression Timeline</span>
              <span className="text-xs text-[#68736B]">Peak at +24H (36°C)</span>
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-[#EAF5EC] rounded-xl border border-[#A8D5A2]">
                <span className="font-bold text-[#68736B] block">NOW</span>
                <span className="text-base font-black text-[#56965F]">28°C</span>
                <span className="text-[10px] text-[#56965F] font-bold block">Low Risk</span>
              </div>
              <div className="p-3 bg-[#F4B66A]/30 rounded-xl border border-[#F4B66A]">
                <span className="font-bold text-[#68736B] block">+24H (Peak)</span>
                <span className="text-base font-black text-[#C2410C]">36°C</span>
                <span className="text-[10px] text-[#C2410C] font-bold block">🔴 HIGH RISK</span>
              </div>
              <div className="p-3 bg-[#F4B66A]/20 rounded-xl border border-[#F4B66A]">
                <span className="font-bold text-[#68736B] block">+48H</span>
                <span className="text-base font-black text-[#854D0E]">33°C</span>
                <span className="text-[10px] text-[#854D0E] font-bold block">Medium Risk</span>
              </div>
              <div className="p-3 bg-[#EAF5EC] rounded-xl border border-[#A8D5A2]">
                <span className="font-bold text-[#68736B] block">+72H</span>
                <span className="text-base font-black text-[#56965F]">29°C</span>
                <span className="text-[10px] text-[#56965F] font-bold block">Cooling Down</span>
              </div>
            </div>
          </div>

          {/* WHY THIS ALERT? EXPLAINABLE AI CARD */}
          <div className="bg-[#F8F7EF] rounded-2xl p-5 border border-[#E6E9E5] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E6E9E5]">
              <HelpCircle className="w-5 h-5 text-[#6FAF78]" />
              <h3 className="font-extrabold text-[#26332A] text-base">
                Why are we giving this warning? (Evidence Breakdown)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {alert.evidenceList.map((ev, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-[#E6E9E5] flex items-center justify-between">
                  <span className="text-[#68736B] font-semibold">{ev.label}:</span>
                  <span className="font-extrabold text-[#26332A]">{ev.value}</span>
                </div>
              ))}
            </div>

            {/* Confidence Score Indicator */}
            <div className="p-4 bg-white rounded-xl border border-[#E6E9E5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#26332A]">AI Model Confidence Score:</span>
                <span className="font-extrabold text-[#56965F] text-sm">{confidenceScore}%</span>
              </div>
              <div className="w-full bg-[#E6E9E5] h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${confidenceScore >= 75 ? 'bg-[#6FAF78]' : 'bg-[#F4B66A]'
                    }`}
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* MULTI-SOURCE VALIDATION & CONFLICTING SIGNALS */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6E9E5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E6E9E5]">
              <div>
                <h3 className="font-extrabold text-[#26332A] text-base">Multi-Source Signal Validation</h3>
                <p className="text-xs text-[#68736B]">Cross-referencing satellite, sensors, weather, and observation</p>
              </div>

              <button
                id="btn-toggle-conflicting-signals"
                onClick={() => setSimulateConflict(!simulateConflict)}
                className="text-xs font-extrabold px-3 py-1.5 rounded-xl border border-[#E6E9E5] bg-[#F8F7EF] hover:bg-[#EAF5EC] text-[#26332A] transition-all"
              >
                {simulateConflict ? 'Reset to High Agreement' : 'Simulate Conflicting Signals'}
              </button>
            </div>

            {/* Signal Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {currentSignals.map((sig) => (
                <div key={sig.source} className="p-3 bg-[#F8F7EF] rounded-xl border border-[#E6E9E5] space-y-1">
                  <span className="text-[11px] text-[#68736B] block font-semibold">{sig.source}</span>
                  <span
                    className={`font-extrabold block text-xs ${sig.level === 'red'
                        ? 'text-[#E88B8B]'
                        : sig.level === 'orange'
                          ? 'text-[#C2410C]'
                          : sig.level === 'yellow'
                            ? 'text-[#854D0E]'
                            : 'text-[#56965F]'
                      }`}
                  >
                    {sig.status}
                  </span>
                  <span className="text-[10px] text-[#A3A3A3] block line-clamp-1">{sig.details}</span>
                </div>
              ))}
            </div>

            {/* Signal Agreement Status Banner */}
            {simulateConflict ? (
              <div className="p-3.5 bg-[#F7E7A8]/50 border border-[#F4B66A] rounded-xl flex items-center gap-3 text-xs text-[#26332A]">
                <AlertCircle className="w-5 h-5 text-[#854D0E] shrink-0" />
                <div>
                  <span className="font-extrabold text-[#854D0E] block">⚠️ Conflicting Signals Detected</span>
                  <span>Some data sources show different conditions. Model confidence has been reduced to 54%.</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-[#EAF5EC] border border-[#A8D5A2] rounded-xl flex items-center gap-3 text-xs text-[#26332A]">
                <ShieldCheck className="w-5 h-5 text-[#56965F] shrink-0" />
                <div>
                  <span className="font-extrabold text-[#56965F] block">Most Signals Agree</span>
                  <span>3 out of 4 independent data sources confirm thermal heat stress risk. High confidence (87%).</span>
                </div>
              </div>
            )}
          </div>

          {/* SCREEN 6 — 2D FIELD RISK MAP */}
          <div className="bg-[#F8F7EF] rounded-2xl p-5 border border-[#E6E9E5] space-y-4">
            <h3 className="font-extrabold text-[#26332A] text-base">2D Spatial Field Risk Map</h3>

            {/* 2D Zone Grid */}
            <div className="grid grid-cols-5 gap-2">
              {zones2D.map((z) => (
                <button
                  key={z.id}
                  id={`btn-2d-zone-${z.id}`}
                  onClick={() => setSelectedMapZone(z.id)}
                  className={`p-3 rounded-xl font-extrabold text-xs text-center transition-all border ${selectedMapZone === z.id ? 'ring-2 ring-[#26332A] scale-105 shadow-xs' : ''
                    } ${z.status === 'green'
                      ? 'bg-[#EAF5EC] text-[#56965F] border-[#A8D5A2]'
                      : z.status === 'yellow'
                        ? 'bg-[#F7E7A8] text-[#854D0E] border-[#F4B66A]'
                        : z.status === 'orange'
                          ? 'bg-[#F4B66A]/30 text-[#C2410C] border-[#F4B66A]'
                          : 'bg-[#E88B8B] text-white border-[#E88B8B]'
                    }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            {/* Selected Zone Card details */}
            {activeZone && (
              <div className="p-4 bg-white rounded-xl border border-[#E6E9E5] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#26332A]">
                  <span className="text-sm">{activeZone.name} Details</span>
                  <span className="text-[#E88B8B] uppercase">{activeZone.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[#68736B]">
                  <div>Soil Moisture: <b className="text-[#26332A]">{activeZone.moisture}</b></div>
                  <div>Temperature: <b className="text-[#26332A]">{activeZone.temp}</b></div>
                </div>
                <p className="text-[#26332A] font-semibold pt-1 border-t border-[#E6E9E5]">
                  Recommendation: {activeZone.rec}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-[#F8F7EF] border-t border-[#E6E9E5] flex flex-col sm:flex-row gap-3">
          <button
            id="btn-modal-view-action"
            onClick={() => {
              onClose();
              onActionClick();
            }}
            className="w-full py-3.5 px-4 bg-[#6FAF78] hover:bg-[#56965F] text-white font-black rounded-2xl text-center text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>View Recommended Preventive Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
