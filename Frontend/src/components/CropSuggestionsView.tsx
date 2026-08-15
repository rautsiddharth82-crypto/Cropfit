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
  Table
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';

interface CropSuggestionsViewProps {
  crops: RecommendedCrop[];
  onSelectCropForDetails?: (crop: RecommendedCrop) => void;
}

export const CropSuggestionsView: React.FC<CropSuggestionsViewProps> = ({
  crops,
  onSelectCropForDetails,
}) => {
  const { language } = useLanguage();
  const [showComparison, setShowComparison] = useState<boolean>(false);

  return (
    <div id="crop-suggestions-container" className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
              {language === 'hi' ? '🌱 जलवायु अनुकूल फसल सिफारिशें' : language === 'pa' ? '🌱 ਮੌਸਮ ਅਨੁਕੂਲ ਫ਼ਸਲੀ ਸਿਫ਼ਾਰਸ਼ਾਂ' : '🌱 Climate Smart Recommendations'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'स्मार्ट फसल सुझाव एवं किस्में' : language === 'pa' ? 'ਸਮਾਰਟ ਫ਼ਸਲ ਸੁਝਾਅ' : 'Smart Crop Suggestions'}
          </h2>
        </div>

        <button
          id="btn-toggle-crop-compare"
          type="button"
          onClick={() => setShowComparison(!showComparison)}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            showComparison
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>
            {showComparison
              ? (language === 'hi' ? 'कार्ड वापस देखें' : 'Back to Cards')
              : (language === 'hi' ? 'फसलों की तुलना करें' : 'Compare Crops')}
          </span>
        </button>
      </div>

      {/* Current Conditions Context Box */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
          {language === 'hi' ? 'वर्तमान एवं आगामी मौसमी परिस्थितियां' : 'Current Expected Climate Conditions'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🌡️</span>
            <div>
              <span className="font-black text-slate-900 block">
                {language === 'hi' ? 'उच्च तापमान' : 'High Temperature'}
              </span>
              <span className="text-slate-500 font-medium">
                {language === 'hi' ? 'अधिकतम 34°C - 36°C की संभावना' : 'Peak 34°C - 36°C expected'}
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">🌦️</span>
            <div>
              <span className="font-black text-slate-900 block">
                {language === 'hi' ? 'कम वर्षा का पूर्वानुमान' : 'Low Rainfall Forecast'}
              </span>
              <span className="text-slate-500 font-medium">
                {language === 'hi' ? 'सामान्य से कम मौसमी बारिश' : 'Below seasonal average'}
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <div>
              <span className="font-black text-slate-900 block">
                {language === 'hi' ? 'सीमित पानी की उपलब्धता' : 'Limited Water Availability'}
              </span>
              <span className="text-slate-500 font-medium">
                {language === 'hi' ? 'सटीक सिंचाई की आवश्यकता' : 'Optimized irrigation needed'}
              </span>
            </div>
          </div>
        </div>

        {/* Climate Statement Box */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-slate-800 flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <b>{language === 'hi' ? 'जलवायु बुद्धिमत्ता नोट:' : 'Climate Intelligence Note:'}</b> {language === 'hi' ? 'ये सुझाई गई फसल किस्में गर्मी सहने और कम पानी में अधिक उपज देने में सक्षम हैं।' : 'These suggested varieties are "More suitable for the expected climate" based on local thermal resilience and water savings.'}
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
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-500 transition-all space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      {language === 'hi' ? '🌱 उत्तम मौसम अनुकूलता' : '🌱 High Climate Fit'}
                    </span>
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                      {crop.durationDays} {language === 'hi' ? 'दिन' : 'Days'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">{crop.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{crop.localName}</p>

                  <p className="text-xs text-slate-700 mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                    {crop.notes}
                  </p>

                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-bold">{language === 'hi' ? 'जलवायु उपयुक्तता:' : 'Climate Suitability:'}</span>
                      <span className="font-black text-emerald-700">{crop.suitability}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-bold">{language === 'hi' ? 'पानी की जरूरत:' : 'Water Need:'}</span>
                      <span className="font-black text-sky-600">{crop.waterNeed}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 font-bold">{language === 'hi' ? 'जोखिम स्तर:' : 'Risk Level:'}</span>
                      <span className="font-black text-emerald-700">{crop.riskLevel}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-emerald-950 font-bold">{language === 'hi' ? 'मुनाफा संभावना:' : 'Profit Potential:'}</span>
                      <span className="font-black text-emerald-800">{crop.profitPotential}</span>
                    </div>
                  </div>
                </div>

                <button
                  id={`btn-view-crop-${crop.id}`}
                  type="button"
                  onClick={() => onSelectCropForDetails && onSelectCropForDetails(crop)}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-900 hover:text-emerald-950 font-black rounded-2xl text-xs border border-slate-200 hover:border-emerald-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{language === 'hi' ? 'किस्म का विवरण देखें' : 'View Variety Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CROP COMPARISON MATRIX */}
      {showComparison && (
        <div id="crop-comparison-table-card" className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900">{language === 'hi' ? 'फसल तुलना तालिका' : 'Crop Comparison Matrix'}</h3>
            <span className="text-xs text-slate-500 font-medium">
              {language === 'hi' ? '* स्थानीय क्षेत्रीय बाजार और उपज के आधार पर' : '* Indicative estimates based on regional grain trends'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-black">
                  <th className="p-3.5 rounded-tl-2xl">{language === 'hi' ? 'फसल किस्म' : 'Crop Variety'}</th>
                  <th className="p-3.5">{language === 'hi' ? 'जलवायु उपयुक्तता' : 'Climate Suitability'}</th>
                  <th className="p-3.5">{language === 'hi' ? 'पानी की आवश्यकता' : 'Water Need'}</th>
                  <th className="p-3.5">{language === 'hi' ? 'फसल अवधि' : 'Duration'}</th>
                  <th className="p-3.5">{language === 'hi' ? 'जलवायु जोखिम' : 'Climate Risk'}</th>
                  <th className="p-3.5 rounded-tr-2xl">{language === 'hi' ? 'मुनाफा संभावना' : 'Profit Potential'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crops.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-black text-slate-900 text-sm">
                      {c.name}
                      <span className="block text-[11px] font-normal text-slate-500">{c.localName}</span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 font-black">🟢 {c.suitability}</span>
                    </td>
                    <td className="p-3.5 font-black text-sky-600">{c.waterNeed}</td>
                    <td className="p-3.5 font-bold text-slate-800">{c.durationDays} {language === 'hi' ? 'दिन' : 'Days'}</td>
                    <td className="p-3.5 font-bold text-emerald-700">{c.riskLevel}</td>
                    <td className="p-3.5 font-black text-emerald-800 bg-emerald-50/60 rounded-r-xl">
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

