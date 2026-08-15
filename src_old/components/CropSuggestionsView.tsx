import React, { useState } from 'react';
import { RecommendedCrop } from '../types';
import {
  Sprout,
  Droplets,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Table
} from 'lucide-react';

interface CropSuggestionsViewProps {
  crops: RecommendedCrop[];
  onSelectCropForDetails?: (crop: RecommendedCrop) => void;
}

export const CropSuggestionsView: React.FC<CropSuggestionsViewProps> = ({
  crops,
  onSelectCropForDetails,
}) => {
  const [showComparison, setShowComparison] = useState<boolean>(false);

  return (
    <div id="crop-suggestions-container" className="space-y-6 pb-24 md:pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E9E5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#EAF5EC] text-[#56965F] text-xs font-bold rounded-full">
              🌱 Climate Smart Recommendations
            </span>
            <span className="text-xs text-[#68736B]">Rajpura Micro-climate</span>
          </div>
          <h2 className="text-2xl font-black text-[#26332A] mt-1">Smart Crop Suggestions</h2>
        </div>

        <button
          id="btn-toggle-crop-compare"
          onClick={() => setShowComparison(!showComparison)}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            showComparison
              ? 'bg-[#26332A] text-white shadow-xs'
              : 'bg-[#6FAF78] hover:bg-[#56965F] text-white shadow-xs'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>{showComparison ? 'Back to Cards' : 'Compare Crops'}</span>
        </button>
      </div>

      {/* Current Conditions Context Box */}
      <div className="bg-[#F8F7EF] rounded-3xl p-5 border border-[#E6E9E5] space-y-3">
        <h3 className="text-xs font-extrabold text-[#68736B] uppercase tracking-wider">
          CURRENT EXPECTED CLIMATE CONDITIONS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-2xl border border-[#E6E9E5] flex items-center gap-2.5">
            <span className="text-xl">🌡️</span>
            <div>
              <span className="font-bold text-[#26332A] block">High Temperature</span>
              <span className="text-[#68736B]">Peak 34°C - 36°C expected</span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#E6E9E5] flex items-center gap-2.5">
            <span className="text-xl">🌦️</span>
            <div>
              <span className="font-bold text-[#26332A] block">Low Rainfall Forecast</span>
              <span className="text-[#68736B]">Below seasonal average</span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-[#E6E9E5] flex items-center gap-2.5">
            <span className="text-xl">💧</span>
            <div>
              <span className="font-bold text-[#26332A] block">Limited Water Availability</span>
              <span className="text-[#68736B]">Optimized irrigation needed</span>
            </div>
          </div>
        </div>

        {/* Mandatory Prompt Statement Box */}
        <div className="p-3 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl text-xs text-[#26332A] flex items-center gap-2 font-semibold">
          <Sparkles className="w-4 h-4 text-[#56965F] shrink-0" />
          <span>
            <b>Climate Intelligence Note:</b> These suggested varieties are <i>"More suitable for the expected climate"</i> based on local thermal resilience and water savings.
          </span>
        </div>
      </div>

      {/* VIEW 1: SUGGESTED CROP CARDS */}
      {!showComparison && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {crops.map((crop) => (
              <div
                key={crop.id}
                id={`crop-card-${crop.id}`}
                className="bg-white rounded-3xl p-5 border border-[#E6E9E5] hover:border-[#6FAF78] transition-all space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#56965F] bg-[#EAF5EC] px-3 py-1 rounded-full">
                      🌱 High Climate Fit
                    </span>
                    <span className="text-xs font-extrabold text-[#26332A] bg-[#F8F7EF] px-2.5 py-1 rounded-xl border border-[#E6E9E5]">
                      {crop.durationDays} Days
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#26332A]">{crop.name}</h3>
                  <p className="text-xs text-[#68736B] font-medium">{crop.localName}</p>

                  <p className="text-xs text-[#26332A] mt-3 p-3 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5] leading-relaxed">
                    {crop.notes}
                  </p>

                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#E6E9E5]">
                      <span className="text-[#68736B]">Climate Suitability:</span>
                      <span className="font-extrabold text-[#56965F]">{crop.suitability}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#E6E9E5]">
                      <span className="text-[#68736B]">Water Need:</span>
                      <span className="font-extrabold text-[#3B82F6]">{crop.waterNeed}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#E6E9E5]">
                      <span className="text-[#68736B]">Risk Level:</span>
                      <span className="font-extrabold text-[#56965F]">{crop.riskLevel}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#EAF5EC] rounded-xl border border-[#A8D5A2]">
                      <span className="text-[#26332A] font-bold">Profit Potential:</span>
                      <span className="font-black text-[#56965F]">{crop.profitPotential}</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-view-crop-${crop.id}`}
                  onClick={() => onSelectCropForDetails && onSelectCropForDetails(crop)}
                  className="w-full py-2.5 px-4 bg-[#F8F7EF] hover:bg-[#EAF5EC] text-[#26332A] font-extrabold rounded-2xl text-xs border border-[#E6E9E5] flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>View Variety Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CROP COMPARISON MATRIX (SCREEN 8) */}
      {showComparison && (
        <div id="crop-comparison-table-card" className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6E9E5] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E9E5]">
            <h3 className="text-lg font-black text-[#26332A]">Crop Comparison Matrix</h3>
            <span className="text-xs text-[#68736B] font-medium">
              * Profit values are <i>indicative estimates</i> based on regional grain trends
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F7EF] border-b border-[#E6E9E5] text-[#26332A] font-extrabold">
                  <th className="p-3 rounded-tl-2xl">Crop Variety</th>
                  <th className="p-3">Climate Suitability</th>
                  <th className="p-3">Water Need</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Climate Risk</th>
                  <th className="p-3 rounded-tr-2xl">Profit Potential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E5]">
                {crops.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F7EF]/60 transition-colors">
                    <td className="p-3 font-extrabold text-[#26332A] text-sm">
                      {c.name}
                      <span className="block text-[11px] font-normal text-[#68736B]">{c.localName}</span>
                    </td>
                    <td className="p-3 font-bold text-[#56965F]">
                      <span className="px-2 py-0.5 rounded-full bg-[#EAF5EC]">🟢 {c.suitability}</span>
                    </td>
                    <td className="p-3 font-bold text-[#3B82F6]">{c.waterNeed}</td>
                    <td className="p-3 font-bold text-[#26332A]">{c.durationDays} Days</td>
                    <td className="p-3 font-bold text-[#56965F]">{c.riskLevel}</td>
                    <td className="p-3 font-black text-[#56965F] bg-[#EAF5EC]/40 rounded-r-xl">
                      {c.profitPotential}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
