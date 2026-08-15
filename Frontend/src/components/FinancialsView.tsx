import React, { useState } from 'react';
import { SeasonFinancialRecord } from '../types';
import { MOCK_FINANCIALS } from '../data/mockData';
import { PieChart, Sparkles, CheckCircle, ArrowUpRight, Wallet } from 'lucide-react';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

interface FinancialsViewProps {
  selectedRecordId?: string;
  onSelectRecordId?: (id: string) => void;
  onAskAiForProfit?: (query: string) => void;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({
  selectedRecordId: propRecordId,
  onSelectRecordId,
  onAskAiForProfit
}) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const [records] = useState<SeasonFinancialRecord[]>(MOCK_FINANCIALS);
  const [internalRecordId, setInternalRecordId] = useState<string>(MOCK_FINANCIALS[0].id);
  const activeRecordId = propRecordId !== undefined ? propRecordId : internalRecordId;
  const selectedRecord = records.find((r) => r.id === activeRecordId) || records[0];

  const handleSelectRecord = (id: string) => {
    const rec = records.find((r) => r.id === id);
    if (rec) {
      speak(`${rec.season} ${rec.year}, ${rec.cropName}`);
    }
    if (onSelectRecordId) onSelectRecordId(id);
    else setInternalRecordId(id);
  };

  const totalExpense =
    selectedRecord.expenses.seeds +
    selectedRecord.expenses.fertilizers +
    selectedRecord.expenses.pesticides +
    selectedRecord.expenses.labor +
    selectedRecord.expenses.irrigationEnergy +
    selectedRecord.expenses.machineryHarvesting;

  return (
    <div id="financials-view-root" className="space-y-6 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Header Banner matching whole website theme */}
      <div className="border border-emerald-800 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/financials_banner.jpg"
            alt="Financials Theme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <Wallet className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'hi' ? 'खेत का आय-व्यय बहीखाता एवं मुनाफा विश्लेषण' : 'Financial Ledger & Cost-to-Profit Memory'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('financials_title')}
          </h2>
        </div>
      </div>

      {/* Seasonal History Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {records.map((rec) => {
          const isSelected = rec.id === selectedRecord.id;
          return (
            <button
              key={rec.id}
              onClick={() => handleSelectRecord(rec.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              {rec.seasonName}
            </button>
          );
        })}
      </div>

      {/* Main Financial Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">{t('gross_revenue')}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{selectedRecord.grossRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {selectedRecord.yieldQuintals} {language === 'hi' ? 'क्विंटल' : 'Quintals'} @ ₹{selectedRecord.sellingPricePerQuintal}/Qtl
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">{t('total_expenses')}</p>
          <p className="text-2xl font-black text-rose-600 mt-1">₹{totalExpense.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {language === 'hi' ? 'बीज, खाद, बिजली व मजदूरी' : 'Seeds, Fertilizer, Energy & Labor'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">{t('net_profit')}</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹{selectedRecord.netProfit.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-700 font-bold mt-1">
            {language === 'hi' ? 'कुल लागत घटाकर शुद्ध आय' : 'Revenue minus total input cost'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase">{t('profit_per_acre')}</p>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{selectedRecord.profitPerAcre.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {selectedRecord.areaAcres} {language === 'hi' ? 'एकड़ रकबा' : 'Acres Area'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Expense Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'लागत खर्च विवरण' : 'Input Expense Breakdown'}</span>
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>{language === 'hi' ? 'खाद एवं सूक्ष्म पोषक तत्व' : 'Fertilizers & Micronutrients'}</span>
              <span className="font-extrabold text-rose-600">₹{selectedRecord.expenses.fertilizers.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(selectedRecord.expenses.fertilizers / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>{language === 'hi' ? 'मजदूरी एवं खेत तैयारी' : 'Labor & Land Preparation'}</span>
              <span className="font-extrabold text-rose-600">₹{selectedRecord.expenses.labor.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full" style={{ width: `${(selectedRecord.expenses.labor / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>{language === 'hi' ? 'ट्रैक्टर, कंबाइन व कटाई मशीनरी' : 'Machinery & Combine Harvesting'}</span>
              <span className="font-extrabold text-rose-600">₹{selectedRecord.expenses.machineryHarvesting.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full" style={{ width: `${(selectedRecord.expenses.machineryHarvesting / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>{language === 'hi' ? 'सिंचाई ऊर्जा / ट्यूबवेल बिजली व डीजल' : 'Irrigation Diesel / Electricity'}</span>
              <span className="font-extrabold text-rose-600">₹{selectedRecord.expenses.irrigationEnergy.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full" style={{ width: `${(selectedRecord.expenses.irrigationEnergy / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>{language === 'hi' ? 'उन्नत बीज' : 'High Quality Seeds'}</span>
              <span className="font-extrabold text-rose-600">₹{selectedRecord.expenses.seeds.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full" style={{ width: `${(selectedRecord.expenses.seeds / totalExpense) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Right: AI ROI Optimization */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>{language === 'hi' ? 'मुनाफा बढ़ाने के एआई सुझाव' : 'AI Recommended Ways to Boost Profit'}</span>
          </h3>

          <ul className="space-y-3">
            {selectedRecord.aiProfitTips.map((tip, idx) => (
              <li key={idx} className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-900 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {onAskAiForProfit && (
            <button
              onClick={() =>
                onAskAiForProfit(
                  language === 'hi'
                    ? `मेरी ${selectedRecord.cropName} फसल का कुल खर्च ₹${totalExpense} है। लागत को 20% तक कम करने और मुनाफा बढ़ाने की रणनीति बताएं?`
                    : `Analyze my financial ledger for ${selectedRecord.cropName} with expense ₹${totalExpense} and give me 3 specific ways to cut cost by 20%.`
                )
              }
              className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'एआई सहायक से लागत घटाने की योजना पूछें' : 'Ask AI for Custom Cost-Cutting Plan'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
