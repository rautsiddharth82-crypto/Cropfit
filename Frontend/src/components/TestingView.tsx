import React, { useState } from 'react';
import { SoilTestRecord, WaterTestRecord } from '../types';
import { MOCK_SOIL_TESTS, MOCK_WATER_TESTS } from '../data/mockData';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';
import {
  TestTube,
  Droplets,
  FlaskConical,
  Sparkles,
  Send,
  Building2,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Search,
  FileCheck,
  Calendar,
  Layers,
  CheckCircle,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  Info,
  ShieldCheck,
  Printer,
  Compass,
  MapPin,
  Clock,
  Check,
  RefreshCw,
  PlusCircle
} from 'lucide-react';

export type TestingSubOption = 'apply-soil' | 'apply-water' | 'govt-report' | 'all-reports' | null;

interface TestingViewProps {
  soilTests?: SoilTestRecord[];
  waterTests?: WaterTestRecord[];
  selectedOption?: TestingSubOption;
  onSelectOption?: (option: TestingSubOption) => void;
  selectedSoilId?: string;
  onSelectSoilId?: (id: string) => void;
  selectedWaterId?: string;
  onSelectWaterId?: (id: string) => void;
  reportsFilterTab?: 'all' | 'soil' | 'water';
  onSelectReportsFilterTab?: (tab: 'all' | 'soil' | 'water') => void;
  onAddSoilTest?: (test: SoilTestRecord) => void;
  onAddWaterTest?: (test: WaterTestRecord) => void;
  onAskAiForTest?: (prompt: string) => void;
}

export const TestingView: React.FC<TestingViewProps> = ({
  soilTests = MOCK_SOIL_TESTS,
  waterTests = MOCK_WATER_TESTS,
  selectedOption = null,
  onSelectOption,
  selectedSoilId,
  onSelectSoilId,
  selectedWaterId,
  onSelectWaterId,
  reportsFilterTab = 'all',
  onSelectReportsFilterTab,
  onAddSoilTest,
  onAddWaterTest,
  onAskAiForTest,
}) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const currentSoilTests = soilTests && soilTests.length > 0 ? soilTests : MOCK_SOIL_TESTS;
  const currentWaterTests = waterTests && waterTests.length > 0 ? waterTests : MOCK_WATER_TESTS;

  // Internal fallback state if uncontrolled
  const [internalOption, setInternalOption] = useState<TestingSubOption>(selectedOption || 'all-reports');
  const activeOption = selectedOption !== undefined ? selectedOption : internalOption;

  const handleOptionChange = (opt: TestingSubOption) => {
    if (opt === 'apply-soil') speak(t('opt_apply_soil'));
    else if (opt === 'apply-water') speak(t('opt_apply_water'));
    else if (opt === 'govt-report') speak(t('opt_govt_soil_report'));
    else if (opt === 'all-reports') speak(t('opt_all_reports'));
    else if (opt === null) speak(language === 'hi' ? 'परीक्षण मुख्य सूची' : 'Diagnostic Menu');

    if (onSelectOption) {
      onSelectOption(opt);
    } else {
      setInternalOption(opt);
    }
  };

  // Selected Soil & Water Report IDs
  const [internalSoilId, setInternalSoilId] = useState<string>(currentSoilTests[0]?.id || 'st-1');
  const activeSoilId = selectedSoilId || internalSoilId;
  const handleSoilIdChange = (id: string) => {
    if (onSelectSoilId) onSelectSoilId(id);
    else setInternalSoilId(id);
  };

  const [internalWaterId, setInternalWaterId] = useState<string>(currentWaterTests[0]?.id || 'wt-1');
  const activeWaterId = selectedWaterId || internalWaterId;
  const handleWaterIdChange = (id: string) => {
    if (onSelectWaterId) onSelectWaterId(id);
    else setInternalWaterId(id);
  };

  // Reports Filter Tab
  const [internalFilterTab, setInternalFilterTab] = useState<'all' | 'soil' | 'water'>(reportsFilterTab);
  const activeFilterTab = reportsFilterTab || internalFilterTab;
  const handleFilterTabChange = (tab: 'all' | 'soil' | 'water') => {
    if (onSelectReportsFilterTab) onSelectReportsFilterTab(tab);
    else setInternalFilterTab(tab);
  };

  // Form 1: Apply for Soil Testing State
  const [soilField, setSoilField] = useState<string>('Field 01 - North Acre (Wheat)');
  const [soilDepth, setSoilDepth] = useState<'0-15cm' | '15-30cm'>('0-15cm');
  const [soilPackage, setSoilPackage] = useState<'basic' | 'comprehensive'>('comprehensive');
  const [soilNextCrop, setSoilNextCrop] = useState<string>('Paddy (PR-126)');
  const [soilDate, setSoilDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [soilTimeSlot, setSoilTimeSlot] = useState<string>('08:00 AM - 11:00 AM (Morning)');
  const [soilFarmerName, setSoilFarmerName] = useState<string>('Gunjan');
  const [soilPhone, setSoilPhone] = useState<string>('+91 98765 43210');
  const [soilAddress, setSoilAddress] = useState<string>('Village Sukhmander, Tehsil Rajpura, District Patiala, Punjab');
  const [soilSuccessRef, setSoilSuccessRef] = useState<string | null>(null);

  // Form 2: Apply for Water Quality Test State
  const [waterSourceType, setWaterSourceType] = useState<'borewell' | 'canal' | 'openwell' | 'drip'>('borewell');
  const [waterDepth, setWaterDepth] = useState<string>('320 ft Deep Submersible Tubewell');
  const [waterConcern, setWaterConcern] = useState<string>('Salinity / Salt Crust on Soil');
  const [waterDate, setWaterDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [waterTimeSlot, setWaterTimeSlot] = useState<string>('09:00 AM - 12:00 PM (Morning)');
  const [waterSuccessRef, setWaterSuccessRef] = useState<string | null>(null);

  // Option 3: Govt Soil Health Card Portal Search State
  const [govtSearchQuery, setGovtSearchQuery] = useState<string>('SHC-PB-2026-489102');
  const [govtDistrict, setGovtDistrict] = useState<string>('Patiala');
  const [govtState, setGovtState] = useState<string>('Punjab');
  const [hasSearchedGovt, setHasSearchedGovt] = useState<boolean>(true);

  // Reports Search in Option 4
  const [reportsSearchQuery, setReportsSearchQuery] = useState<string>('');

  const activeSoil = currentSoilTests.find((t) => t.id === activeSoilId) || currentSoilTests[0];
  const activeWater = currentWaterTests.find((w) => w.id === activeWaterId) || currentWaterTests[0];

  const handleApplySoilSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `SHC-SOIL-${Math.floor(100000 + Math.random() * 900000)}`;
    setSoilSuccessRef(refId);
  };

  const handleApplyWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `WQT-WATER-${Math.floor(100000 + Math.random() * 900000)}`;
    setWaterSuccessRef(refId);
  };

  // Filtered reports for Option 4
  const filteredSoilReports = currentSoilTests.filter(
    (t) =>
      t.fieldName.toLowerCase().includes(reportsSearchQuery.toLowerCase()) ||
      t.sampleDate.toLowerCase().includes(reportsSearchQuery.toLowerCase()) ||
      t.phStatus.toLowerCase().includes(reportsSearchQuery.toLowerCase())
  );

  const filteredWaterReports = currentWaterTests.filter(
    (w) =>
      w.sourceName.toLowerCase().includes(reportsSearchQuery.toLowerCase()) ||
      w.sampleDate.toLowerCase().includes(reportsSearchQuery.toLowerCase()) ||
      w.suitability.toLowerCase().includes(reportsSearchQuery.toLowerCase())
  );

  return (
    <div id="testing-view-root" className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-12">
      {/* 1. TOP COLUMN HEADING - Signature Emerald/Teal Gradient Banner */}
      <div className="border border-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/water_and_soiltest.png"
            alt="Testing Theme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'hi' ? 'प्रयोगशाला एवं मिट्टी-पानी परीक्षण' : 'Diagnostic Laboratory & Testing'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('testing_title')}
          </h2>
        </div>

        {/* Return Button if an Option is Open */}
        {activeOption && activeOption !== 'all-reports' && (
          <button
            id="btn-testing-back-all-options"
            type="button"
            onClick={() => handleOptionChange('all-reports')}
            className="relative z-10 flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl transition-all cursor-pointer self-start sm:self-center backdrop-blur-sm shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'रिपोर्ट्स डेटाबेस पर वापस जाएं' : 'Back to Reports Database'}</span>
          </button>
        )}
      </div>

      {/* 2. THE 4 PRIMARY OPTIONS OVERVIEW (Visible when no option is opened) */}
      {!activeOption && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
              {language === 'hi' ? 'परीक्षण सेवा चुनें' : 'Select Testing Service'}
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {language === 'hi' ? '4 परीक्षण सेवाएं उपलब्ध' : '4 Diagnostic Services Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPTION 1: Apply for Soil Testing */}
            <div
              id="option-apply-soil-testing"
              onClick={() => handleOptionChange('apply-soil')}
              className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between hover:bg-emerald-50/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <FlaskConical className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {language === 'hi' ? 'घर से सैंपल पिकअप' : 'Doorstep Pickup'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t('opt_apply_soil')}
                </h3>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'hi' ? '48 घंटे में लैब रिपोर्ट' : '48-hr Lab Turnaround'}
                </span>
                <span className="text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {language === 'hi' ? 'मिट्टी जांच बुक करें' : 'Book Soil Test'} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* OPTION 2: Apply for Water Quality Test */}
            <div
              id="option-apply-water-test"
              onClick={() => handleOptionChange('apply-water')}
              className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-teal-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between hover:bg-teal-50/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-teal-100/80 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Droplets className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {language === 'hi' ? 'सिंचाई सुरक्षा' : 'Irrigation Safety'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                  {t('opt_apply_water')}
                </h3>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  {language === 'hi' ? 'ट्यूबवेल व नहर पानी' : 'Tubewell & Canal Kits'}
                </span>
                <span className="text-xs font-black text-teal-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {language === 'hi' ? 'पानी जांच बुक करें' : 'Book Water Test'} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* OPTION 3: Soil Report by Government */}
            <div
              id="option-govt-soil-report"
              onClick={() => handleOptionChange('govt-report')}
              className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between hover:bg-emerald-50/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {language === 'hi' ? 'सरकारी पोर्टल' : 'Official Govt Portal'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t('opt_govt_soil_report')}
                </h3>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'hi' ? 'सरकारी सत्यापित कार्ड' : 'Govt Verified Card'}
                </span>
                <span className="text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {language === 'hi' ? 'कार्ड देखें' : 'View Govt Report'} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* OPTION 4: All the Reports Data */}
            <div
              id="option-all-reports-data"
              onClick={() => handleOptionChange('all-reports')}
              className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between hover:bg-emerald-50/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {language === 'hi' ? 'पुराने रिकॉर्ड्स' : 'Historical Database'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t('opt_all_reports')}
                </h3>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  {currentSoilTests.length} {language === 'hi' ? 'मिट्टी' : 'Soil'} • {currentWaterTests.length} {language === 'hi' ? 'पानी रिपोर्ट' : 'Water Tests'}
                </span>
                <span className="text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {language === 'hi' ? 'सभी रिपोर्ट देखें' : 'Browse All Reports'} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. OPTION 1 SUBFEATURE: APPLY FOR SOIL TESTING                            */}
      {/* ========================================================================= */}
      {activeOption === 'apply-soil' && (
        <div id="subfeature-apply-soil" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Apply for Soil Health Testing
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
                Subsidized Testing: ₹0 (Free under SHC Scheme)
              </span>
            </div>

            {soilSuccessRef ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-emerald-900">
                      Soil Testing Request Booked Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 font-bold">
                      Booking Reference ID: <span className="underline font-mono">{soilSuccessRef}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 p-4 rounded-xl border border-emerald-200/60">
                  <div>
                    <span className="text-slate-500 font-medium block">Selected Field:</span>
                    <strong className="text-slate-900">{soilField}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Pickup Date & Time:</span>
                    <strong className="text-slate-900">{soilDate} ({soilTimeSlot.split(' ')[0]})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Assigned Lab:</span>
                    <strong className="text-slate-900">KVK Ludhiana District Lab</strong>
                  </div>
                </div>

                <p className="text-xs text-emerald-800">
                  A certified field technician will arrive with sampling tools. Keep 500g of representative soil ready from 5 field spots.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSoilSuccessRef(null);
                      handleOptionChange('all-reports');
                    }}
                    className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition-all cursor-pointer"
                  >
                    View All Reports
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoilSuccessRef(null)}
                    className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    Book Another Test
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySoilSubmit} className="space-y-5">
                {/* Field & Depth Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Target Field *
                    </label>
                    <select
                      id="select-soil-field"
                      value={soilField}
                      onChange={(e) => setSoilField(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Field 01 - North Acre (Wheat)">Field 01 - North Acre (Wheat, 4.5 Acres)</option>
                      <option value="Field 02 - Canal Side (Rice)">Field 02 - Canal Side (Rice, 5.0 Acres)</option>
                      <option value="Field 03 - East Orchard (Mustard)">Field 03 - East Orchard (Mustard, 3.0 Acres)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Soil Sampling Depth *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSoilDepth('0-15cm')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          soilDepth === '0-15cm'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        0-15 cm (Topsoil)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSoilDepth('15-30cm')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          soilDepth === '15-30cm'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        15-30 cm (Root Zone)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Package & Next Crop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Diagnostic Package *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSoilPackage('basic')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-left ${
                          soilPackage === 'basic'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">6-Parameter</span>
                        <span className="text-[10px] opacity-90">NPK, pH, EC, Carbon</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSoilPackage('comprehensive')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-left ${
                          soilPackage === 'comprehensive'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-black">12-Parameter</span>
                        <span className="text-[10px] opacity-90">+ Zn, Fe, Cu, Mn, B, S</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Next Planned Crop *
                    </label>
                    <input
                      type="text"
                      required
                      value={soilNextCrop}
                      onChange={(e) => setSoilNextCrop(e.target.value)}
                      placeholder="e.g. Paddy (PR-126) / Mustard"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pickup Date & Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Pickup Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={soilDate}
                      onChange={(e) => setSoilDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Time Slot *
                    </label>
                    <select
                      value={soilTimeSlot}
                      onChange={(e) => setSoilTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="08:00 AM - 11:00 AM (Morning)">08:00 AM - 11:00 AM (Morning)</option>
                      <option value="02:00 PM - 05:00 PM (Afternoon)">02:00 PM - 05:00 PM (Afternoon)</option>
                    </select>
                  </div>
                </div>

                {/* Farmer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Farmer Name & Phone *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={soilFarmerName}
                        onChange={(e) => setSoilFarmerName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={soilPhone}
                        onChange={(e) => setSoilPhone(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Pickup Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={soilAddress}
                      onChange={(e) => setSoilAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Sampling Guide Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-1">Quick Soil Sampling Instructions:</strong>
                    <ol className="list-decimal list-inside space-y-0.5">
                      <li>Dig a V-shaped hole (15 cm depth) at 5 random spots in the field.</li>
                      <li>Scrape a 1-inch slice of soil from the wall of the hole.</li>
                      <li>Mix all 5 samples in a clean plastic container, air-dry in shade, and pack 500g in a clean pouch.</li>
                    </ol>
                  </div>
                </div>

                <button
                  id="btn-submit-soil-test"
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Schedule Free Doorstep Soil Sample Pickup
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. OPTION 2 SUBFEATURE: APPLY FOR WATER QUALITY TEST                      */}
      {/* ========================================================================= */}
      {activeOption === 'apply-water' && (
        <div id="subfeature-apply-water" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Apply for Water Quality Test
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 self-start sm:self-center">
                Subsidized Testing: ₹0 (Govt Irrigation Health Program)
              </span>
            </div>

            {waterSuccessRef ? (
              <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200 text-teal-950 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-teal-900">
                      Water Testing Request Booked Successfully!
                    </h4>
                    <p className="text-xs text-teal-700 font-bold">
                      Booking Reference ID: <span className="underline font-mono">{waterSuccessRef}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 p-4 rounded-xl border border-teal-200/60">
                  <div>
                    <span className="text-slate-500 font-medium block">Water Source:</span>
                    <strong className="text-slate-900 uppercase">{waterSourceType} ({waterDepth})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Pickup Schedule:</span>
                    <strong className="text-slate-900">{waterDate} ({waterTimeSlot.split(' ')[0]})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Key Parameters:</span>
                    <strong className="text-slate-900">EC, TDS, SAR, pH & Boron</strong>
                  </div>
                </div>

                <p className="text-xs text-teal-800">
                  Technician will arrive with a sterilized sampling container. Let the tubewell run for 15 minutes before filling the bottle.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWaterSuccessRef(null);
                      handleOptionChange('all-reports');
                    }}
                    className="px-4 py-2 bg-teal-700 text-white font-bold text-xs rounded-xl hover:bg-teal-800 transition-all cursor-pointer"
                  >
                    View All Reports
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterSuccessRef(null)}
                    className="px-4 py-2 bg-white text-teal-800 font-bold text-xs rounded-xl border border-teal-300 hover:bg-teal-100 transition-all cursor-pointer"
                  >
                    Book Another Water Test
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyWaterSubmit} className="space-y-5">
                {/* Source Selection */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Select Water Source Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'borewell', label: 'Borewell / Tubewell' },
                      { id: 'canal', label: 'Canal Feeder' },
                      { id: 'openwell', label: 'Open Dug Well' },
                      { id: 'drip', label: 'Drip Storage Pond' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setWaterSourceType(s.id as any)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                          waterSourceType === s.id
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source Depth & Observed Problem */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Source Depth / Location Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={waterDepth}
                      onChange={(e) => setWaterDepth(e.target.value)}
                      placeholder="e.g. 320 ft Submersible, North boundary"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Observed Concern / Reason for Test *
                    </label>
                    <select
                      value={waterConcern}
                      onChange={(e) => setWaterConcern(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-teal-500 focus:outline-none"
                    >
                      <option value="Salinity / Salt Crust on Soil">Salinity / Salt Crust on Soil</option>
                      <option value="White powdery layer on beds">White powdery layer on beds</option>
                      <option value="Leaf tip burning & yellowing">Leaf tip burning & yellowing</option>
                      <option value="Dripper / nozzle chalking and clogging">Dripper / nozzle chalking and clogging</option>
                      <option value="Routine Seasonal Quality Check">Routine Seasonal Quality Check</option>
                    </select>
                  </div>
                </div>

                {/* Pickup Date & Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Pickup Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={waterDate}
                      onChange={(e) => setWaterDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={waterTimeSlot}
                      onChange={(e) => setWaterTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-bold focus:border-teal-500 focus:outline-none"
                    >
                      <option value="09:00 AM - 12:00 PM (Morning)">09:00 AM - 12:00 PM (Morning)</option>
                      <option value="02:00 PM - 05:00 PM (Afternoon)">02:00 PM - 05:00 PM (Afternoon)</option>
                    </select>
                  </div>
                </div>

                {/* Water Sampling Guide */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                  <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block mb-1">Water Collection Guidelines:</strong>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>For tubewells: run pump for 15-20 minutes before sampling.</li>
                      <li>Use a clean 1-litre plastic bottle; rinse it twice with sample water.</li>
                      <li>Fill to the brim to eliminate air bubbles and seal cap tightly.</li>
                    </ul>
                  </div>
                </div>

                <button
                  id="btn-submit-water-test"
                  type="submit"
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Schedule Water Quality Test Pickup
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. OPTION 3 SUBFEATURE: SOIL REPORT BY GOVERNMENT                         */}
      {/* ========================================================================= */}
      {activeOption === 'govt-report' && (
        <div id="subfeature-govt-report" className="space-y-6">
          {/* Government Portal Search & Status Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Government Soil Health Card (SHC) Portal
                  </h3>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Official Govt Registry Sync
              </span>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setHasSearchedGovt(true);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="input-govt-shc-search"
                  type="text"
                  value={govtSearchQuery}
                  onChange={(e) => setGovtSearchQuery(e.target.value)}
                  placeholder="Enter SHC Number (e.g. SHC-PB-2026-489102) or Farmer Aadhaar/Mobile"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={govtDistrict}
                  onChange={(e) => setGovtDistrict(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-slate-900 font-bold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Patiala">Patiala District</option>
                  <option value="Ludhiana">Ludhiana District</option>
                  <option value="Fatehgarh Sahib">Fatehgarh Sahib</option>
                  <option value="Sangrur">Sangrur District</option>
                </select>

                <button
                  id="btn-search-govt-shc"
                  type="submit"
                  className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  Search Card
                </button>
              </div>
            </form>
          </div>

          {/* OFFICIAL SOIL HEALTH CARD CERTIFICATE DISPLAY */}
          {hasSearchedGovt && (
            <div className="bg-white rounded-3xl border-2 border-emerald-700/80 shadow-md overflow-hidden">
              {/* Official Certificate Header */}
              <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 p-6 text-white border-b-2 border-amber-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shrink-0">
                      🇮🇳
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
                        Government of India • Ministry of Agriculture & Farmers Welfare
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                        SOIL HEALTH CARD
                      </h3>
                      <p className="text-xs text-emerald-200 font-medium">
                        Department of Agriculture & Farmers Welfare, Punjab
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
                    <span className="text-[10px] text-emerald-200 block font-medium">SHC Certificate No.</span>
                    <span className="font-mono text-sm font-black text-amber-300">
                      {govtSearchQuery || 'SHC-PB-2026-489102'}
                    </span>
                    <span className="text-[10px] text-emerald-200 block mt-0.5">Valid: 2026 – 2029 (Cycle IV)</span>
                  </div>
                </div>
              </div>

              {/* Farmer & Land Metadata */}
              <div className="p-6 bg-slate-50/80 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Farmer Name:</span>
                  <strong className="text-slate-900 text-sm font-black">Gunjan</strong>
                  <span className="text-[10px] text-slate-500 block">Reg ID: PB-PAT-84920</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Village / Tehsil:</span>
                  <strong className="text-slate-900 font-bold">Sukhmander, Rajpura</strong>
                  <span className="text-[10px] text-slate-500 block">District: Patiala, Punjab</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Survey / Khasra No:</span>
                  <strong className="text-slate-900 font-bold">Khasra 84/12 & 85/1</strong>
                  <span className="text-[10px] text-slate-500 block">Area: 4.5 Acres (Field 01)</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Soil Testing Lab:</span>
                  <strong className="text-slate-900 font-bold">KVK Patiala Central Lab</strong>
                  <span className="text-[10px] text-emerald-700 font-black block">Sample Verified 01 Aug 2026</span>
                </div>
              </div>

              {/* 12 Soil Parameters Official Grid */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-700" />
                    I. Primary Soil Physical & Chemical Parameters
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">1. Soil pH (Reaction)</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-black text-slate-900">7.8</span>
                        <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Slightly Alkaline
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Target Range: 6.5 - 7.5</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">2. Electrical Conductivity (EC)</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-black text-slate-900">0.65 <span className="text-xs font-normal">dS/m</span></span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Normal (Non-Saline)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">&lt; 1.0 dS/m Safe</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">3. Organic Carbon (OC)</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-black text-rose-700">0.42 %</span>
                        <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Low (&lt; 0.50%)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Target: &gt; 0.75%</span>
                    </div>
                  </div>
                </div>

                {/* Macro Nutrients N-P-K */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-700" />
                    II. Available Macro Nutrients (kg/hectare)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Available Nitrogen (N)</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-black text-rose-700">185 <span className="text-xs font-normal">kg/ha</span></span>
                        <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Low Deficit
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Standard: 280 - 560 kg/ha</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Available Phosphorus (P)</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-black text-amber-700">22 <span className="text-xs font-normal">kg/ha</span></span>
                        <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Medium
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Standard: 23 - 56 kg/ha</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Available Potassium (K)</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-black text-emerald-700">310 <span className="text-xs font-normal">kg/ha</span></span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          High (Optimal)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Standard: 140 - 280 kg/ha</span>
                    </div>
                  </div>
                </div>

                {/* Micronutrients Table */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    III. Secondary & Micronutrient Status (ppm)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Zinc (Zn):</span>
                      <strong className="text-rose-700 font-black text-sm">0.45 ppm</strong>
                      <span className="text-[10px] text-rose-700 block font-bold mt-0.5">Deficient (&lt;0.6)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Iron (Fe):</span>
                      <strong className="text-emerald-700 font-black text-sm">4.8 ppm</strong>
                      <span className="text-[10px] text-emerald-700 block font-bold mt-0.5">Sufficient (&gt;4.5)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Sulphur (S):</span>
                      <strong className="text-amber-700 font-black text-sm">12.5 ppm</strong>
                      <span className="text-[10px] text-amber-700 block font-bold mt-0.5">Moderate (10-20)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Boron (B):</span>
                      <strong className="text-emerald-700 font-black text-sm">0.55 ppm</strong>
                      <span className="text-[10px] text-emerald-700 block font-bold mt-0.5">Adequate (&gt;0.5)</span>
                    </div>
                  </div>
                </div>

                {/* Official Fertilizer Advisory Box */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-950 font-black flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Official Government Fertilizer Advisory (for Wheat / Paddy)
                    </strong>
                    <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                      PAU Ludhiana Recommendation
                    </span>
                  </div>
                  <ul className="text-emerald-900 space-y-1 pl-4 list-disc font-medium">
                    <li><strong>Urea:</strong> 90 kg/acre split into 3 doses (1/3 basal, 1/3 at 1st irrigation, 1/3 at 2nd irrigation).</li>
                    <li><strong>DAP:</strong> 55 kg/acre as basal dose at the time of sowing.</li>
                    <li><strong>Zinc Sulphate (21% Zn):</strong> Apply 25 kg/acre once every 3 crop seasons to rectify zinc deficit.</li>
                    <li><strong>Farmyard Manure / Vermicompost:</strong> Incorporate 4 tons/acre to build soil organic carbon.</li>
                  </ul>
                </div>

                {/* Certificate Action Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Digitally Signed by District Soil Analyst, Govt of Punjab</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert('Official Soil Health Card PDF downloaded!')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF Card
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. OPTION 4 SUBFEATURE: ALL THE REPORTS DATA                              */}
      {/* ========================================================================= */}
      {activeOption === 'all-reports' && (
        <div id="subfeature-all-reports" className="space-y-6">
          {/* Top Filter Bar & Search */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h3 className="text-lg font-black text-slate-900">
                  {language === 'hi' ? 'सभी विश्लेषणात्मक रिपोर्ट डेटा' : 'All Analytical Reports Data'}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleOptionChange('apply-soil')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-black rounded-xl transition-all cursor-pointer"
                  >
                    + {language === 'hi' ? 'मिट्टी जांच' : 'Book Soil Test'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange('apply-water')}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-[10px] font-black rounded-xl transition-all cursor-pointer"
                  >
                    + {language === 'hi' ? 'पानी जांच' : 'Book Water Test'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange('govt-report')}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-black rounded-xl transition-all cursor-pointer"
                  >
                    🏛️ {language === 'hi' ? 'सरकारी पोर्टल' : 'Govt Portal Sync'}
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => handleFilterTabChange('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'all'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({currentSoilTests.length + currentWaterTests.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterTabChange('soil')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'soil'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Soil ({currentSoilTests.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterTabChange('water')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilterTab === 'water'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Water ({currentWaterTests.length})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search report by field name, date, or parameter status..."
                value={reportsSearchQuery}
                onChange={(e) => setReportsSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Master Detail Interface: List on Left, Active Report Detail on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Report Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {/* Soil Reports Section */}
              {(activeFilterTab === 'all' || activeFilterTab === 'soil') && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 block">
                    Soil Health Reports ({filteredSoilReports.length})
                  </span>
                  {filteredSoilReports.map((test) => {
                    const isSelected = activeSoil?.id === test.id;
                    return (
                      <div
                        key={test.id}
                        id={`report-soil-${test.id}`}
                        onClick={() => handleSoilIdChange(test.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                            {test.fieldName}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            Score: {test.overallHealthScore}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Date: {test.sampleDate}</span>
                          <span className="font-bold text-slate-700">pH {test.ph} ({test.phStatus})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Water Reports Section */}
              {(activeFilterTab === 'all' || activeFilterTab === 'water') && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 block">
                    Water Quality Reports ({filteredWaterReports.length})
                  </span>
                  {filteredWaterReports.map((wTest) => {
                    const isSelected = activeWater?.id === wTest.id;
                    return (
                      <div
                        key={wTest.id}
                        id={`report-water-${wTest.id}`}
                        onClick={() => handleWaterIdChange(wTest.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50/80 border-teal-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-teal-700" />
                            {wTest.sourceName}
                          </span>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
                            EC: {wTest.salinityEc} dS/m
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Date: {wTest.sampleDate}</span>
                          <span className="font-bold text-slate-700">TDS: {wTest.tdsPpm} ppm</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Detailed View of Selected Report */}
            <div className="lg:col-span-7 space-y-4">
              {activeFilterTab !== 'water' && activeSoil && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                        Soil Health Analysis
                      </span>
                      <h4 className="text-base font-black text-slate-900">{activeSoil.fieldName}</h4>
                      <span className="text-xs text-slate-500">Tested on {activeSoil.sampleDate}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-700 block">
                        {activeSoil.overallHealthScore}<span className="text-xs text-slate-400">/100</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">Health Index</span>
                    </div>
                  </div>

                  {/* 4 Core Parameter Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Soil pH</span>
                      <strong className="text-slate-900 text-sm font-black">{activeSoil.ph}</strong>
                      <span className="text-[10px] text-amber-700 font-bold block">{activeSoil.phStatus}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Organic Carbon</span>
                      <strong className="text-slate-900 text-sm font-black">{activeSoil.organicCarbon}%</strong>
                      <span className="text-[10px] text-rose-700 font-bold block">Low Deficit</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Nitrogen (N)</span>
                      <strong className="text-slate-900 text-sm font-black">{activeSoil.nitrogen} kg/ha</strong>
                      <span className="text-[10px] text-rose-700 font-bold block">{activeSoil.nitrogenStatus}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Potassium (K)</span>
                      <strong className="text-slate-900 text-sm font-black">{activeSoil.potassium} kg/ha</strong>
                      <span className="text-[10px] text-emerald-700 font-bold block">{activeSoil.potassiumStatus}</span>
                    </div>
                  </div>

                  {/* AI Correction Plan */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        AI Agronomist Action Plan
                      </span>
                      {onAskAiForTest && (
                        <button
                          type="button"
                          onClick={() => onAskAiForTest(`Explain the soil test report for ${activeSoil.fieldName} (pH ${activeSoil.ph}, Nitrogen ${activeSoil.nitrogen} kg/ha, Zinc ${activeSoil.zincPpm} ppm) and suggest exact fertilizer split timings.`)}
                          className="text-[10px] font-black text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer"
                        >
                          Ask AI Assistant →
                        </button>
                      )}
                    </div>
                    <ul className="text-emerald-900 space-y-1.5 pl-4 list-disc font-medium">
                      {activeSoil.aiCorrectionAdvice.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Water Quality Detailed Card */}
              {(activeFilterTab === 'water' || activeFilterTab === 'all') && activeWater && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider block">
                        Water Salinity & Suitability
                      </span>
                      <h4 className="text-base font-black text-slate-900">{activeWater.sourceName}</h4>
                      <span className="text-xs text-slate-500">Sample Date: {activeWater.sampleDate}</span>
                    </div>

                    <span className="text-xs font-black text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                      {activeWater.suitability}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Salinity (EC)</span>
                      <strong className="text-slate-900 text-sm font-black">{activeWater.salinityEc} dS/m</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Total Solids (TDS)</span>
                      <strong className="text-slate-900 text-sm font-black">{activeWater.tdsPpm} ppm</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">SAR Ratio</span>
                      <strong className="text-slate-900 text-sm font-black">{activeWater.sar}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Water pH</span>
                      <strong className="text-slate-900 text-sm font-black">{activeWater.ph}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-950 space-y-1">
                    <strong className="block font-black text-teal-900">Salinity Management Verdict:</strong>
                    <p className="text-teal-900 font-medium leading-relaxed">{activeWater.aiRecommendation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
