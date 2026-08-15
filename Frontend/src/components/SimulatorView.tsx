import React, { useState } from 'react';
import { SimulatorInputs, SimulationResult } from '../types';
import {
  Sliders,
  Thermometer,
  Droplets,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  RotateCcw,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface SimulatorViewProps {
  onAskAiForScenario?: (query: string) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onAskAiForScenario }) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const [inputs, setInputs] = useState<SimulatorInputs>({
    tempDeltaC: 3,
    rainDeltaPercent: -25,
    fertilizerDeltaPercent: 10,
    irrigationMethod: 'Flood',
    pestRisk: 'Medium'
  });

  const calculateResult = (inp: SimulatorInputs): SimulationResult => {
    let yieldChange = inp.tempDeltaC * -5.5;
    yieldChange += inp.rainDeltaPercent * 0.25;

    let waterLiters = 4500;
    if (inp.irrigationMethod === 'Sprinkler') {
      yieldChange += 4.0;
      waterLiters = 3100;
    } else if (inp.irrigationMethod === 'Drip') {
      yieldChange += 9.5;
      waterLiters = 2100;
    } else if (inp.irrigationMethod === 'Sub-surface Drip') {
      yieldChange += 12.0;
      waterLiters = 1800;
    }

    if (inp.fertilizerDeltaPercent < -15) {
      yieldChange -= 8.0;
    } else if (inp.fertilizerDeltaPercent > 20) {
      yieldChange -= inp.tempDeltaC > 2 ? 4.0 : 0;
    }

    if (inp.pestRisk === 'High') yieldChange -= 12.0;
    if (inp.pestRisk === 'Medium') yieldChange -= 4.0;

    const yieldPercentClamped = Math.round(yieldChange * 10) / 10;
    const netProfitShift = Math.round(yieldPercentClamped * 1850);

    let heatRiskScore: 'Low' | 'Moderate' | 'Severe' | 'Critical' = 'Low';
    if (inp.tempDeltaC >= 4 || (inp.tempDeltaC >= 2 && inp.rainDeltaPercent <= -30 && inp.irrigationMethod === 'Flood')) {
      heatRiskScore = 'Critical';
    } else if (inp.tempDeltaC >= 2) {
      heatRiskScore = 'Severe';
    } else if (inp.tempDeltaC >= 1) {
      heatRiskScore = 'Moderate';
    }

    const soilHealthIndex = Math.max(30, Math.min(95, Math.round(80 - inp.tempDeltaC * 5 + (inp.irrigationMethod === 'Drip' ? 15 : 0))));

    let verdict = language === 'hi'
      ? `+${inp.tempDeltaC}°C तापमान वृद्धि और ${inp.rainDeltaPercent}% कम बारिश में फ्लड (खुली) सिंचाई से सतह से पानी उड़ने के कारण पैदावार में ${Math.abs(yieldPercentClamped)}% की भारी कमी आएगी।`
      : `Under a +${inp.tempDeltaC}°C heatwave with ${inp.rainDeltaPercent}% rainfall deficit, standard flood irrigation results in a severe ${Math.abs(yieldPercentClamped)}% crop yield loss due to rapid surface evaporation.`;

    if (inp.irrigationMethod === 'Drip' || inp.irrigationMethod === 'Sub-surface Drip') {
      verdict = language === 'hi'
        ? `ड्रिप / सूक्ष्म सिंचाई अपनाने से जड़ों के पास नमी का ठंडा वातावरण बनता है, जिससे गेहूं के दानों को गर्मी के झटके से सुरक्षा मिलती है और 50%+ पानी की बचत होती है!`
        : `Switching to ${inp.irrigationMethod} creates a cool root-zone microclimate, shielding flowering wheat kernels from heat shock and reducing water use by 50%+!`;
    }

    const mitigationActions = language === 'hi'
      ? [
          inp.irrigationMethod === 'Flood' ? 'खुली सिंचाई की जगह ड्रिप फर्टिगेशन अपनाएं ताकि 45% वाष्पीकरण से बचाव हो।' : 'वर्तमान ड्रिप सिंचाई कार्यक्रम जारी रखें।',
          inp.tempDeltaC > 2 ? 'गर्मी से बचाव हेतु 1% पोटेशियम नाइट्रेट का पत्तों पर छिड़काव करें।' : 'अतिरिक्त पर्णीय छिड़काव की तत्काल आवश्यकता नहीं।',
          'फसल की कतारों के बीच पुआल / मल्चिंग बिछाएं ताकि मिट्टी में नमी बनी रहे और तापमान 3°C कम रहे।'
        ]
      : [
          inp.irrigationMethod === 'Flood' ? 'Transition from Flood to Micro Drip fertigation to prevent 45% water evaporation.' : 'Maintain current Drip watering schedule.',
          inp.tempDeltaC > 2 ? 'Apply 1% Potassium Nitrate foliar spray to strengthen osmotic pressure against thermal shock.' : 'Foliar spray not urgently needed.',
          'Apply straw mulching between crop rows to retain soil moisture and reduce root temperature by 3°C.'
        ];

    return {
      projectedYieldChangePercent: yieldPercentClamped,
      waterConsumptionLitersPerAcre: waterLiters,
      soilHealthIndex,
      netProfitShiftPerAcre: netProfitShift,
      heatStressRiskScore: heatRiskScore,
      aiAgronomistVerdict: verdict,
      mitigationActions
    };
  };

  const result = calculateResult(inputs);

  const resetInputs = () => {
    setInputs({
      tempDeltaC: 0,
      rainDeltaPercent: 0,
      fertilizerDeltaPercent: 0,
      irrigationMethod: 'Drip',
      pestRisk: 'Low'
    });
  };

  return (
    <div id="simulator-view-root" className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="border border-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/simulator_banner.jpg"
            alt="Simulator Theme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'hi' ? 'इंटरैक्टिव फसल एवं मौसम सिम्युलेटर' : 'Interactive Crop & Climate Simulator'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{t('simulator_title')}</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={resetInputs}
          className="relative z-10 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center border border-white/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'रीसेट करें' : 'Reset Defaults'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <span>{t('sim_controls')}</span>
            </h3>
          </div>

          {/* Slider 1: Temperature Shift */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black text-slate-900">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-600" />
                {t('temp_shift')}:
              </span>
              <span className={inputs.tempDeltaC > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                {inputs.tempDeltaC > 0 
                  ? `+${inputs.tempDeltaC}°C ${language === 'hi' ? 'गर्मी/लू' : 'Heatwave'}` 
                  : `${inputs.tempDeltaC}°C ${language === 'hi' ? 'सामान्य' : 'Normal'}`}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="5"
              step="1"
              value={inputs.tempDeltaC}
              onChange={(e) => setInputs({ ...inputs, tempDeltaC: parseInt(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>-2°C {language === 'hi' ? 'ठंडा' : 'Cool'}</span>
              <span>0°C {language === 'hi' ? 'सामान्य' : 'Normal'}</span>
              <span>+5°C {language === 'hi' ? 'भीषण लू' : 'Severe Heat'}</span>
            </div>
          </div>

          {/* Slider 2: Rainfall Variation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black text-slate-900">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                {t('rain_shift')}:
              </span>
              <span className={inputs.rainDeltaPercent < 0 ? 'text-amber-700' : 'text-emerald-700'}>
                {inputs.rainDeltaPercent > 0 
                  ? `+${inputs.rainDeltaPercent}% ${language === 'hi' ? 'अधिक वर्षा' : 'Rain'}` 
                  : `${inputs.rainDeltaPercent}% ${language === 'hi' ? 'कम वर्षा / सूखा' : 'Deficit'}`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={inputs.rainDeltaPercent}
              onChange={(e) => setInputs({ ...inputs, rainDeltaPercent: parseInt(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>-50% {language === 'hi' ? 'सूखा' : 'Drought'}</span>
              <span>0% {language === 'hi' ? 'सामान्य' : 'Normal'}</span>
              <span>+50% {language === 'hi' ? 'भारी मानसून' : 'High Rain'}</span>
            </div>
          </div>

          {/* Radio / Select: Irrigation Method */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 block">
              {t('irrigation_system')}:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Flood', 'Sprinkler', 'Drip', 'Sub-surface Drip'] as const).map((method) => {
                const displayMethod = language === 'hi'
                  ? method === 'Flood' ? 'खुली / क्यारी सिंचाई' : method === 'Sprinkler' ? 'फव्वारा (स्प्रिंकलर)' : method === 'Drip' ? 'ड्रिप (टपक) सिंचाई' : 'भूमिगत ड्रिप'
                  : method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setInputs({ ...inputs, irrigationMethod: method })}
                    className={`p-2.5 rounded-xl text-xs font-black text-left border transition-all cursor-pointer ${
                      inputs.irrigationMethod === method
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {displayMethod}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select: Pest Outbreak Risk */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 block">
              {t('pest_risk_level')}:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((risk) => {
                const displayRisk = language === 'hi'
                  ? risk === 'Low' ? 'कम' : risk === 'Medium' ? 'मध्यम' : 'अधिक'
                  : risk;
                return (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => setInputs({ ...inputs, pestRisk: risk })}
                    className={`py-2 rounded-xl text-xs font-black border text-center transition-all cursor-pointer ${
                      inputs.pestRisk === risk
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {displayRisk}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulation Results Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                  {language === 'hi' ? 'सिम्युलेटर परिणाम एवं प्रभाव' : 'Real-time Simulation Output'}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {language === 'hi' ? 'गेहूं पैदावार व किसान बचत पर असर' : 'Wheat Yield & Profit Impact'}
                </h3>
              </div>
              <span
                className={`text-xs font-black px-3.5 py-1.5 rounded-2xl ${
                  result.heatStressRiskScore === 'Critical'
                    ? 'bg-rose-100 text-rose-900 border border-rose-200'
                    : result.heatStressRiskScore === 'Severe'
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                {result.heatStressRiskScore} {language === 'hi' ? 'जलवायु जोखिम' : 'Climate Risk'}
              </span>
            </div>

            {/* Main Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Projected Yield */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[11px] text-slate-500 font-black uppercase">{t('yield_change')}</p>
                <div className="flex items-center gap-1 mt-1">
                  {result.projectedYieldChangePercent >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-rose-600" />
                  )}
                  <span
                    className={`text-xl font-black ${
                      result.projectedYieldChangePercent >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {result.projectedYieldChangePercent > 0 ? `+${result.projectedYieldChangePercent}%` : `${result.projectedYieldChangePercent}%`}
                  </span>
                </div>
              </div>

              {/* Water Use */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[11px] text-slate-500 font-black uppercase">{t('water_needed')}</p>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {result.waterConsumptionLitersPerAcre.toLocaleString()}{' '}
                  <span className="text-[10px] font-normal text-slate-500">{language === 'hi' ? 'ली./एकड़' : 'L/Acre'}</span>
                </p>
              </div>

              {/* Net Profit Impact */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[11px] text-slate-500 font-black uppercase">{t('profit_shift')}</p>
                <p
                  className={`text-xl font-black mt-1 ${
                    result.netProfitShiftPerAcre >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {result.netProfitShiftPerAcre >= 0 ? `+₹${result.netProfitShiftPerAcre}` : `-₹${Math.abs(result.netProfitShiftPerAcre)}`}
                </p>
              </div>

              {/* Soil Health */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[11px] text-slate-500 font-black uppercase">{t('soil_health')}</p>
                <p className="text-xl font-black text-slate-900 mt-1">{result.soilHealthIndex}/100</p>
              </div>
            </div>

            {/* AI Verdict */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? 'एआई कृषि वैज्ञानिक विश्लेषण एवं प्रभाव' : 'AI Agronomist Physics Explanation'}</span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">{result.aiAgronomistVerdict}</p>
            </div>

            {/* Actions list */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                {t('adaptation_actions')}
              </h4>
              <ul className="space-y-2">
                {result.mitigationActions.map((act, i) => (
                  <li key={i} className="text-xs text-slate-800 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ask AI Button */}
            {onAskAiForScenario && (
              <button
                type="button"
                onClick={() =>
                  onAskAiForScenario(
                    language === 'hi'
                      ? `मेरे गेहूं के खेत में +${inputs.tempDeltaC}°C तापमान और ${inputs.irrigationMethod} सिंचाई के साथ फसल सुरक्षा और सिंचाई की कार्य योजना बताएं?`
                      : `Explain how to mitigate a +${inputs.tempDeltaC}°C heatwave for my Wheat field with ${inputs.irrigationMethod} irrigation.`
                  )
                }
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'hi' ? 'एआई सहायक से संपूर्ण कार्य योजना तैयार कराएं' : 'Ask AI Assistant to Generate Implementation Plan'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
