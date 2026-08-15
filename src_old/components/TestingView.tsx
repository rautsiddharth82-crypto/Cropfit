import React, { useState } from 'react';
import { SoilTestRecord, WaterTestRecord } from '../types';
import { MOCK_SOIL_TESTS, MOCK_WATER_TESTS } from '../data/mockData';
import { TestTube, Droplets, AlertTriangle, CheckCircle, Plus, FileText, Sparkles, Download, ArrowUpRight } from 'lucide-react';

interface TestingViewProps {
  onAskAiForTest?: (query: string) => void;
}

export const TestingView: React.FC<TestingViewProps> = ({ onAskAiForTest }) => {
  const [activeSubTab, setActiveSubTab] = useState<'soil' | 'water'>('soil');
  const [soilTests, setSoilTests] = useState<SoilTestRecord[]>(MOCK_SOIL_TESTS);
  const [waterTests, setWaterTests] = useState<WaterTestRecord[]>(MOCK_WATER_TESTS);
  const [selectedSoilId, setSelectedSoilId] = useState<string>(MOCK_SOIL_TESTS[0]?.id || 'st-1');
  const [selectedWaterId, setSelectedWaterId] = useState<string>(MOCK_WATER_TESTS[0]?.id || 'wt-1');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('Field 03 (Vegetable)');
  const [newPh, setNewPh] = useState('7.5');
  const [newOrganic, setNewOrganic] = useState('0.55');
  const [newN, setNewN] = useState('210');
  const [newP, setNewP] = useState('25');
  const [newK, setNewK] = useState('290');
  const [newZinc, setNewZinc] = useState('0.5');

  const activeSoil = soilTests.find((s) => s.id === selectedSoilId) || soilTests[0];
  const activeWater = waterTests.find((w) => w.id === selectedWaterId) || waterTests[0];

  const handleAddSoilTest = (e: React.FormEvent) => {
    e.preventDefault();
    const phVal = parseFloat(newPh) || 7.5;
    const orgVal = parseFloat(newOrganic) || 0.5;
    const nVal = parseFloat(newN) || 200;
    const pVal = parseFloat(newP) || 20;
    const kVal = parseFloat(newK) || 280;
    const znVal = parseFloat(newZinc) || 0.5;

    const newRecord: SoilTestRecord = {
      id: `st-${Date.now()}`,
      fieldId: `field-${Date.now()}`,
      fieldName: newFieldName,
      sampleDate: 'Today',
      ph: phVal,
      phStatus: phVal > 7.5 ? 'Slightly Alkaline' : phVal < 6.5 ? 'Acidic' : 'Optimal',
      ec: 0.58,
      organicCarbon: orgVal,
      nitrogen: nVal,
      nitrogenStatus: nVal < 200 ? 'Low' : nVal > 300 ? 'High' : 'Medium',
      phosphorus: pVal,
      phosphorusStatus: pVal < 20 ? 'Low' : pVal > 35 ? 'High' : 'Medium',
      potassium: kVal,
      potassiumStatus: kVal < 200 ? 'Low' : 'High',
      zincPpm: znVal,
      ironPpm: 5.2,
      sulfurPpm: 15.0,
      overallHealthScore: Math.min(95, Math.max(40, Math.round((orgVal / 0.8) * 40 + (nVal / 250) * 30 + 25))),
      aiCorrectionAdvice: [
        `Soil test logged for ${newFieldName}.`,
        phVal > 7.5 ? 'Apply Gypsum (200 kg/acre) to optimize alkaline pH.' : 'pH is balanced.',
        znVal < 0.6 ? 'Zinc level is low. Spray 0.5% Zinc Sulphate prior to panicle initiation.' : 'Micro-nutrients optimal.'
      ]
    };

    setSoilTests([newRecord, ...soilTests]);
    setSelectedSoilId(newRecord.id);
    setShowAddModal(false);
  };

  return (
    <div id="testing-view-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#EAF5EC] border-2 border-[#A8D5A2] rounded-[24px] p-6 text-[#26332A] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none text-9xl">
          🧪
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#6FAF78] text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soil & Water Diagnostics Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-[#26332A]">
            Soil Testing & Water Quality Memory
          </h2>
          <p className="text-sm text-[#68736B] leading-relaxed font-medium">
            Analyze soil NPK balances, pH levels, organic carbon, and tube-well water salinity to generate precision fertilizer dosing and water treatment recommendations.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-[#A8D5A2]">
          <button
            id="btn-subtab-soil"
            onClick={() => setActiveSubTab('soil')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeSubTab === 'soil'
                ? 'bg-[#6FAF78] text-white shadow-xs'
                : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:bg-[#F8F7EF]'
            }`}
          >
            <TestTube className="w-4 h-4" />
            <span>Soil Health Cards ({soilTests.length})</span>
          </button>
          <button
            id="btn-subtab-water"
            onClick={() => setActiveSubTab('water')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              activeSubTab === 'water'
                ? 'bg-[#6FAF78] text-white shadow-xs'
                : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:bg-[#F8F7EF]'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Water Salinity Tests ({waterTests.length})</span>
          </button>

          <button
            id="btn-open-add-soil-modal"
            onClick={() => setShowAddModal(true)}
            className="ml-auto bg-[#6FAF78] hover:bg-[#56965F] text-white text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Soil Test Log</span>
          </button>
        </div>
      </div>

      {/* SOIL TESTING TAB */}
      {activeSubTab === 'soil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List of Soil Reports */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#68736B]">
              Recorded Soil Test Reports
            </h3>

            {soilTests.map((test) => {
              const isSelected = test.id === activeSoil?.id;
              return (
                <div
                  key={test.id}
                  id={`soil-card-item-${test.id}`}
                  onClick={() => setSelectedSoilId(test.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#6FAF78] shadow-md ring-2 ring-[#6FAF78]/20'
                      : 'bg-white border-[#E6E9E5] hover:border-[#A8D5A2]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-extrabold text-sm text-[#26332A]">{test.fieldName}</p>
                      <p className="text-xs text-[#68736B]">Sampled: {test.sampleDate}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        test.overallHealthScore >= 80
                          ? 'bg-[#EAF5EC] text-[#56965F]'
                          : test.overallHealthScore >= 60
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      Score: {test.overallHealthScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center bg-[#F8F7EF] p-2 rounded-xl text-xs">
                    <div>
                      <p className="text-[10px] text-[#68736B] uppercase font-bold">pH</p>
                      <p className="font-extrabold text-[#26332A]">{test.ph}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#68736B] uppercase font-bold">N-P-K</p>
                      <p className="font-extrabold text-[#26332A]">
                        {test.nitrogenStatus[0]}-{test.phosphorusStatus[0]}-{test.potassiumStatus[0]}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#68736B] uppercase font-bold">Organic C</p>
                      <p className="font-extrabold text-[#26332A]">{test.organicCarbon}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Soil Health Card & AI Diagnosis */}
          {activeSoil && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs">
                {/* Title */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E9E5] pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#56965F] uppercase tracking-wider">
                      Official Soil Health Card
                    </span>
                    <h3 className="text-xl font-extrabold text-[#26332A]">{activeSoil.fieldName}</h3>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Downloading PDF Soil Health Card for ${activeSoil.fieldName}`);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold bg-[#F8F7EF] hover:bg-[#E6E9E5] text-[#26332A] px-3.5 py-2 rounded-xl border border-[#E6E9E5] transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[#56965F]" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">pH Level</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeSoil.ph}</p>
                    <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
                      {activeSoil.phStatus}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">Organic Carbon</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeSoil.organicCarbon}%</p>
                    <span className="text-[11px] font-semibold text-red-600 mt-1 block">
                      {activeSoil.organicCarbon < 0.5 ? 'Low (Needs Organic)' : 'Optimal'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">EC (Salinity)</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeSoil.ec} <span className="text-xs font-normal">dS/m</span></p>
                    <span className="text-[11px] font-semibold text-[#56965F] mt-1 block">Normal</span>
                  </div>

                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">Zinc (Zn)</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeSoil.zincPpm} <span className="text-xs font-normal">ppm</span></p>
                    <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
                      {activeSoil.zincPpm < 0.6 ? 'Deficient' : 'Adequate'}
                    </span>
                  </div>
                </div>

                {/* Macro Nutrients (N-P-K) Bars */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#68736B]">
                    Primary Nutrient Balance (N - P - K)
                  </h4>

                  {/* Nitrogen */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#26332A]">
                      <span>Nitrogen (N): {activeSoil.nitrogen} kg/ha</span>
                      <span className="text-amber-700">Status: {activeSoil.nitrogenStatus}</span>
                    </div>
                    <div className="w-full bg-[#E6E9E5] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (activeSoil.nitrogen / 300) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Phosphorus */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#26332A]">
                      <span>Phosphorus (P): {activeSoil.phosphorus} kg/ha</span>
                      <span className="text-[#56965F]">Status: {activeSoil.phosphorusStatus}</span>
                    </div>
                    <div className="w-full bg-[#E6E9E5] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#6FAF78] h-full rounded-full"
                        style={{ width: `${Math.min(100, (activeSoil.phosphorus / 40) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Potassium */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#26332A]">
                      <span>Potassium (K): {activeSoil.potassium} kg/ha</span>
                      <span className="text-[#56965F]">Status: {activeSoil.potassiumStatus}</span>
                    </div>
                    <div className="w-full bg-[#E6E9E5] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#56965F] h-full rounded-full"
                        style={{ width: `${Math.min(100, (activeSoil.potassium / 350) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* AI Correction Advice Box */}
                <div className="p-4 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl">
                  <div className="flex items-center gap-2 text-[#56965F] font-extrabold text-sm mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Recommended Soil Amendments</span>
                  </div>
                  <ul className="space-y-2">
                    {activeSoil.aiCorrectionAdvice.map((advice, i) => (
                      <li key={i} className="text-xs text-[#26332A] flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#56965F] shrink-0 mt-0.5" />
                        <span>{advice}</span>
                      </li>
                    ))}
                  </ul>

                  {onAskAiForTest && (
                    <button
                      onClick={() =>
                        onAskAiForTest(
                          `Explain soil test correction for ${activeSoil.fieldName} with pH ${activeSoil.ph} and Nitrogen ${activeSoil.nitrogen} kg/ha.`
                        )
                      }
                      className="mt-4 w-full bg-[#6FAF78] hover:bg-[#56965F] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Ask AI Assistant for Dosing Schedule</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WATER TESTING TAB */}
      {activeSubTab === 'water' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Water Test Reports List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#68736B]">
              Tube-well & Water Source Tests
            </h3>

            {waterTests.map((wt) => {
              const isSelected = wt.id === activeWater?.id;
              return (
                <div
                  key={wt.id}
                  id={`water-card-item-${wt.id}`}
                  onClick={() => setSelectedWaterId(wt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#6FAF78] shadow-md ring-2 ring-[#6FAF78]/20'
                      : 'bg-white border-[#E6E9E5] hover:border-[#A8D5A2]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-extrabold text-sm text-[#26332A]">{wt.sourceName}</p>
                      <p className="text-xs text-[#68736B]">Tested: {wt.sampleDate}</p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        wt.salinityEc > 1.5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#EAF5EC] text-[#56965F]'
                      }`}
                    >
                      EC {wt.salinityEc} dS/m
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#26332A] truncate mt-1">{wt.suitability}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Water Quality Breakdown */}
          {activeWater && (
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E6E9E5] pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#56965F] uppercase tracking-wider">
                      Irrigation Water Diagnostic Report
                    </span>
                    <h3 className="text-xl font-extrabold text-[#26332A]">{activeWater.sourceName}</h3>
                  </div>
                  <span className="bg-[#EAF5EC] text-[#56965F] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#A8D5A2]">
                    {activeWater.suitability}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">Salinity EC</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeWater.salinityEc} <span className="text-xs font-normal">dS/m</span></p>
                  </div>

                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">TDS Count</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeWater.tdsPpm} <span className="text-xs font-normal">ppm</span></p>
                  </div>

                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">SAR Ratio</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeWater.sar}</p>
                  </div>

                  <div className="p-3.5 bg-[#F8F7EF] rounded-2xl border border-[#E6E9E5]">
                    <p className="text-xs text-[#68736B] font-bold uppercase">Water pH</p>
                    <p className="text-xl font-black text-[#26332A] mt-1">{activeWater.ph}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F7EF] border border-[#E6E9E5] rounded-2xl">
                  <h4 className="font-extrabold text-sm text-[#26332A] mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#6FAF78]" />
                    <span>AI Agronomist Water Quality Verdict</span>
                  </h4>
                  <p className="text-xs text-[#68736B] leading-relaxed">{activeWater.aiRecommendation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add New Soil Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E6E9E5]">
            <h3 className="text-lg font-extrabold text-[#26332A]">Log New Soil Test Report</h3>

            <form onSubmit={handleAddSoilTest} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#68736B] block mb-1">Field Name</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E6E9E5] text-sm font-semibold focus:outline-none focus:border-[#6FAF78]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#68736B] block mb-1">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPh}
                    onChange={(e) => setNewPh(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E6E9E5] text-sm font-semibold focus:outline-none focus:border-[#6FAF78]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#68736B] block mb-1">Organic Carbon %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newOrganic}
                    onChange={(e) => setNewOrganic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E6E9E5] text-sm font-semibold focus:outline-none focus:border-[#6FAF78]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#68736B] block mb-1">N (kg/ha)</label>
                  <input
                    type="number"
                    value={newN}
                    onChange={(e) => setNewN(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E6E9E5] text-xs font-semibold focus:outline-none focus:border-[#6FAF78]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#68736B] block mb-1">P (kg/ha)</label>
                  <input
                    type="number"
                    value={newP}
                    onChange={(e) => setNewP(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E6E9E5] text-xs font-semibold focus:outline-none focus:border-[#6FAF78]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#68736B] block mb-1">K (kg/ha)</label>
                  <input
                    type="number"
                    value={newK}
                    onChange={(e) => setNewK(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E6E9E5] text-xs font-semibold focus:outline-none focus:border-[#6FAF78]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6E9E5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#68736B] bg-[#F8F7EF] hover:bg-[#E6E9E5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#6FAF78] hover:bg-[#56965F]"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
