import React, { useState } from 'react';
import { SimulatorInputs, SimulationResult } from '../types';
import { Sliders, Thermometer, Droplets, Zap, Sparkles, TrendingUp, TrendingDown, ShieldAlert, CheckCircle, RotateCcw, ArrowUpRight, Loader2 } from 'lucide-react';

interface SimulatorViewProps {
  onAskAiForScenario?: (query: string) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onAskAiForScenario }) => {
  const [inputs, setInputs] = useState<SimulatorInputs>({
    tempDeltaC: 3, // +3°C Heatwave
    rainDeltaPercent: -25, // -25% Dry spell
    fertilizerDeltaPercent: 10,
    irrigationMethod: 'Flood',
    pestRisk: 'Medium'
  });

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleAskAi = async () => {
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Explain how to mitigate a +${inputs.tempDeltaC}°C heatwave for my Wheat field with ${inputs.irrigationMethod} irrigation.`,
        }),
      });
      const data = await res.json();
      setAiResponse(data.reply);
    } catch (e) {
      console.error(e);
      setAiResponse('Failed to fetch AI response.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Dynamic simulation engine calculations
  const calculateResult = (inp: SimulatorInputs): SimulationResult => {
    // Temperature effect: each +1°C drops yield by 5% unless drip irrigation offsets it
    let yieldChange = inp.tempDeltaC * -5.5;

    // Rain effect
    yieldChange += inp.rainDeltaPercent * 0.25;

    // Irrigation method mitigation offset
    let waterLiters = 4500; // Base flood
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

    // Fertilizer effect
    if (inp.fertilizerDeltaPercent < -15) {
      yieldChange -= 8.0;
    } else if (inp.fertilizerDeltaPercent > 20) {
      // Burn effect during heatwave
      yieldChange -= inp.tempDeltaC > 2 ? 4.0 : 0;
    }

    // Pest risk
    if (inp.pestRisk === 'High') yieldChange -= 12.0;
    if (inp.pestRisk === 'Medium') yieldChange -= 4.0;

    const yieldPercentClamped = Math.round(yieldChange * 10) / 10;
    const netProfitShift = Math.round(yieldPercentClamped * 1850); // ₹1,850 per % yield

    let heatRiskScore: 'Low' | 'Moderate' | 'Severe' | 'Critical' = 'Low';
    if (inp.tempDeltaC >= 4 || (inp.tempDeltaC >= 2 && inp.rainDeltaPercent <= -30 && inp.irrigationMethod === 'Flood')) {
      heatRiskScore = 'Critical';
    } else if (inp.tempDeltaC >= 2) {
      heatRiskScore = 'Severe';
    } else if (inp.tempDeltaC >= 1) {
      heatRiskScore = 'Moderate';
    }

    const soilHealthIndex = Math.max(30, Math.min(95, Math.round(80 - inp.tempDeltaC * 5 + (inp.irrigationMethod === 'Drip' ? 15 : 0))));

    let verdict = `Under a +${inp.tempDeltaC}°C heatwave with ${inp.rainDeltaPercent}% rainfall deficit, standard flood irrigation results in a severe ${Math.abs(yieldPercentClamped)}% crop yield loss due to rapid surface evaporation.`;
    if (inp.irrigationMethod === 'Drip' || inp.irrigationMethod === 'Sub-surface Drip') {
      verdict = `Switching to ${inp.irrigationMethod} creates a cool root-zone microclimate, shielding flowering wheat kernels from heat shock and reducing water use by 50%+!`;
    }

    return {
      projectedYieldChangePercent: yieldPercentClamped,
      waterConsumptionLitersPerAcre: waterLiters,
      soilHealthIndex,
      netProfitShiftPerAcre: netProfitShift,
      heatStressRiskScore: heatRiskScore,
      aiAgronomistVerdict: verdict,
      mitigationActions: [
        inp.irrigationMethod === 'Flood' ? 'Transition from Flood to Micro Drip fertigation to prevent 45% water evaporation.' : 'Maintain current Drip watering schedule.',
        inp.tempDeltaC > 2 ? 'Apply 1% Potassium Nitrate foliar spray to strengthen osmotic pressure against thermal shock.' : 'Foliar spray not urgently needed.',
        'Apply straw mulching between crop rows to retain soil moisture and reduce root temperature by 3°C.'
      ]
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
    <div id="simulator-view-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#EAF5EC] border-2 border-[#A8D5A2] rounded-[24px] p-6 text-[#26332A] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none text-9xl">
          🔮
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#6FAF78] text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Crop & Climate Physics Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-[#26332A]">
            "What-If" Agronomic Scenario Simulator
          </h2>
          <p className="text-sm text-[#68736B] leading-relaxed font-medium">
            Simulate heatwaves (+1°C to +5°C), rainfall deficits, and irrigation upgrades to predict real-time crop yields, water savings, and acre profits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E9E5] pb-4">
            <h3 className="font-extrabold text-[#26332A] text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#6FAF78]" />
              <span>Simulation Controls</span>
            </h3>
            <button
              onClick={resetInputs}
              className="text-xs font-bold text-[#68736B] hover:text-[#26332A] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Temperature Shift */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-[#26332A]">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-600" />
                Temperature Shift:
              </span>
              <span className={inputs.tempDeltaC > 0 ? 'text-red-600' : 'text-[#56965F]'}>
                {inputs.tempDeltaC > 0 ? `+${inputs.tempDeltaC}°C Heatwave` : `${inputs.tempDeltaC}°C Normal`}
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="5"
              step="1"
              value={inputs.tempDeltaC}
              onChange={(e) => setInputs({ ...inputs, tempDeltaC: parseInt(e.target.value) })}
              className="w-full accent-[#6FAF78] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#68736B] font-bold">
              <span>-2°C Cool</span>
              <span>0°C Normal</span>
              <span>+5°C Severe Heatwave</span>
            </div>
          </div>

          {/* Slider 2: Rainfall Variation */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-[#26332A]">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-600" />
                Rainfall Variation:
              </span>
              <span className={inputs.rainDeltaPercent < 0 ? 'text-amber-700' : 'text-[#56965F]'}>
                {inputs.rainDeltaPercent > 0 ? `+${inputs.rainDeltaPercent}% Rain` : `${inputs.rainDeltaPercent}% Deficit`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={inputs.rainDeltaPercent}
              onChange={(e) => setInputs({ ...inputs, rainDeltaPercent: parseInt(e.target.value) })}
              className="w-full accent-[#6FAF78] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#68736B] font-bold">
              <span>-50% Drought</span>
              <span>0% Normal</span>
              <span>+50% High Monsoon</span>
            </div>
          </div>

          {/* Radio / Select: Irrigation Method */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#26332A] block">
              Irrigation System Upgrade:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Flood', 'Sprinkler', 'Drip', 'Sub-surface Drip'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setInputs({ ...inputs, irrigationMethod: method })}
                  className={`p-2.5 rounded-xl text-xs font-extrabold text-left border transition-all ${
                    inputs.irrigationMethod === method
                      ? 'bg-[#6FAF78] text-white border-[#6FAF78] shadow-xs'
                      : 'bg-[#F8F7EF] text-[#26332A] border-[#E6E9E5] hover:bg-[#E6E9E5]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Select: Pest Outbreak Risk */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#26332A] block">
              Pest & Fungal Risk Level:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((risk) => (
                <button
                  key={risk}
                  onClick={() => setInputs({ ...inputs, pestRisk: risk })}
                  className={`py-2 rounded-xl text-xs font-extrabold border text-center transition-all ${
                    inputs.pestRisk === risk
                      ? 'bg-[#26332A] text-white border-[#26332A]'
                      : 'bg-[#F8F7EF] text-[#26332A] border-[#E6E9E5]'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulation Results Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E9E5] pb-4">
              <div>
                <span className="text-xs font-bold text-[#56965F] uppercase tracking-wider">
                  Real-time Simulation Output
                </span>
                <h3 className="text-xl font-extrabold text-[#26332A]">Wheat Yield & Profit Impact</h3>
              </div>
              <span
                className={`text-xs font-extrabold px-3 py-1.5 rounded-xl ${
                  result.heatStressRiskScore === 'Critical'
                    ? 'bg-red-100 text-red-800'
                    : result.heatStressRiskScore === 'Severe'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#EAF5EC] text-[#56965F]'
                }`}
              >
                {result.heatStressRiskScore} Climate Risk
              </span>
            </div>

            {/* Main Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Projected Yield */}
              <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                <p className="text-[11px] text-[#68736B] font-extrabold uppercase">Yield Change</p>
                <div className="flex items-center gap-1 mt-1">
                  {result.projectedYieldChangePercent >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-[#56965F]" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`text-xl font-black ${
                      result.projectedYieldChangePercent >= 0 ? 'text-[#56965F]' : 'text-red-600'
                    }`}
                  >
                    {result.projectedYieldChangePercent > 0 ? `+${result.projectedYieldChangePercent}%` : `${result.projectedYieldChangePercent}%`}
                  </span>
                </div>
              </div>

              {/* Water Use */}
              <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                <p className="text-[11px] text-[#68736B] font-extrabold uppercase">Water Needed</p>
                <p className="text-xl font-black text-[#26332A] mt-1">
                  {result.waterConsumptionLitersPerAcre.toLocaleString()}{' '}
                  <span className="text-[10px] font-normal">L/Acre</span>
                </p>
              </div>

              {/* Net Profit Impact */}
              <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                <p className="text-[11px] text-[#68736B] font-extrabold uppercase">Profit Shift</p>
                <p
                  className={`text-xl font-black mt-1 ${
                    result.netProfitShiftPerAcre >= 0 ? 'text-[#56965F]' : 'text-red-600'
                  }`}
                >
                  {result.netProfitShiftPerAcre >= 0 ? `+₹${result.netProfitShiftPerAcre}` : `-₹${Math.abs(result.netProfitShiftPerAcre)}`}
                </p>
              </div>

              {/* Soil Health */}
              <div className="p-4 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                <p className="text-[11px] text-[#68736B] font-extrabold uppercase">Soil Health</p>
                <p className="text-xl font-black text-[#26332A] mt-1">{result.soilHealthIndex}/100</p>
              </div>
            </div>

            {/* AI Verdict */}
            <div className="p-4 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl">
              <div className="flex items-center gap-2 text-[#56965F] font-extrabold text-sm mb-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Agronomist Verdict & Physics Explanation</span>
              </div>
              <p className="text-xs text-[#26332A] font-medium leading-relaxed">{result.aiAgronomistVerdict}</p>
            </div>

            {/* Actions list */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#68736B] mb-2">
                Recommended Adaptation Actions
              </h4>
              <ul className="space-y-2">
                {result.mitigationActions.map((act, i) => (
                  <li key={i} className="text-xs text-[#26332A] flex items-start gap-2 bg-[#F8F7EF] p-2.5 rounded-xl border border-[#E6E9E5]">
                    <CheckCircle className="w-4 h-4 text-[#56965F] shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ask AI Button & Inline Response */}
            <div className="mt-4">
              {aiResponse ? (
                <div className="p-4 bg-gradient-to-br from-[#EAF5EC] to-white border border-[#A8D5A2] rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 text-[#56965F] font-extrabold text-sm mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Implementation Plan</span>
                  </div>
                  <div className="text-sm text-[#26332A] whitespace-pre-wrap leading-relaxed">
                    {aiResponse}
                  </div>
                  <button
                    onClick={() => setAiResponse(null)}
                    className="mt-4 text-xs font-bold text-[#68736B] hover:text-[#26332A] transition-colors"
                  >
                    Close Plan
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAskAi}
                  disabled={isAiLoading}
                  className="w-full bg-[#6FAF78] hover:bg-[#56965F] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {isAiLoading ? 'Generating Implementation Plan...' : 'Ask AI Assistant to Generate Implementation Plan'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
