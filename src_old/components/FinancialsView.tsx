import React, { useState } from 'react';
import { SeasonFinancialRecord } from '../types';
import { MOCK_FINANCIALS } from '../data/mockData';
import { IndianRupee, TrendingUp, DollarSign, PieChart, Sparkles, CheckCircle, ArrowUpRight, Plus, ArrowDownRight, Wallet } from 'lucide-react';

interface FinancialsViewProps {
  onAskAiForProfit?: (query: string) => void;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({ onAskAiForProfit }) => {
  const [records] = useState<SeasonFinancialRecord[]>(MOCK_FINANCIALS);
  const [selectedRecord, setSelectedRecord] = useState<SeasonFinancialRecord>(MOCK_FINANCIALS[0]);

  const totalExpense =
    selectedRecord.expenses.seeds +
    selectedRecord.expenses.fertilizers +
    selectedRecord.expenses.pesticides +
    selectedRecord.expenses.labor +
    selectedRecord.expenses.irrigationEnergy +
    selectedRecord.expenses.machineryHarvesting;

  return (
    <div id="financials-view-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#EAF5EC] border-2 border-[#A8D5A2] rounded-[24px] p-6 text-[#26332A] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none text-9xl">
          💰
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#6FAF78] text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <Wallet className="w-3.5 h-3.5" />
            <span>Financial Ledger & Cost-to-Profit Memory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-[#26332A]">
            Cost to Profit Memory & ROI Optimizer
          </h2>
          <p className="text-sm text-[#68736B] leading-relaxed font-medium">
            Track seasonal input expenses against crop yield revenue. Discover cost-cutting opportunities in fertilizers and energy to maximize profit per acre.
          </p>
        </div>
      </div>

      {/* Seasonal History Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {records.map((rec) => {
          const isSelected = rec.id === selectedRecord.id;
          return (
            <button
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                isSelected
                  ? 'bg-[#6FAF78] text-white shadow-md'
                  : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:border-[#A8D5A2]'
              }`}
            >
              {rec.seasonName}
            </button>
          );
        })}
      </div>

      {/* Main Financial Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#68736B] uppercase">Gross Revenue</p>
          <p className="text-2xl font-black text-[#26332A] mt-1">₹{selectedRecord.grossRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-[#68736B] font-semibold mt-1">
            {selectedRecord.yieldQuintals} Quintals @ ₹{selectedRecord.sellingPricePerQuintal}/Qtl
          </p>
        </div>

        <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#68736B] uppercase">Total Input Expenses</p>
          <p className="text-2xl font-black text-red-600 mt-1">₹{totalExpense.toLocaleString()}</p>
          <p className="text-[11px] text-[#68736B] font-semibold mt-1">Seeds, Fertilizer, Energy & Labor</p>
        </div>

        <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#68736B] uppercase">Net Profit</p>
          <p className="text-2xl font-black text-[#56965F] mt-1">₹{selectedRecord.netProfit.toLocaleString()}</p>
          <p className="text-[11px] text-[#56965F] font-bold mt-1">Revenue minus total input cost</p>
        </div>

        <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-5 shadow-xs">
          <p className="text-xs font-bold text-[#68736B] uppercase">Profit Per Acre</p>
          <p className="text-2xl font-black text-[#26332A] mt-1">₹{selectedRecord.profitPerAcre.toLocaleString()}</p>
          <p className="text-[11px] text-[#68736B] font-semibold mt-1">Across {selectedRecord.areaAcres} Acres</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Expense Breakdown */}
        <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-lg text-[#26332A] border-b border-[#E6E9E5] pb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#6FAF78]" />
            <span>Input Expense Breakdown</span>
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-[#26332A]">
              <span>Fertilizers & Micronutrients</span>
              <span className="font-extrabold text-red-600">₹{selectedRecord.expenses.fertilizers.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#E6E9E5] h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(selectedRecord.expenses.fertilizers / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-[#26332A]">
              <span>Labor & Land Preparation</span>
              <span className="font-extrabold text-red-600">₹{selectedRecord.expenses.labor.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#E6E9E5] h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: `${(selectedRecord.expenses.labor / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-[#26332A]">
              <span>Machinery & Combine Harvesting</span>
              <span className="font-extrabold text-red-600">₹{selectedRecord.expenses.machineryHarvesting.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#E6E9E5] h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full" style={{ width: `${(selectedRecord.expenses.machineryHarvesting / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-[#26332A]">
              <span>Irrigation Diesel / Electricity</span>
              <span className="font-extrabold text-red-600">₹{selectedRecord.expenses.irrigationEnergy.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#E6E9E5] h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full" style={{ width: `${(selectedRecord.expenses.irrigationEnergy / totalExpense) * 100}%` }}></div>
            </div>

            <div className="flex justify-between text-xs font-bold text-[#26332A]">
              <span>High Quality Seeds</span>
              <span className="font-extrabold text-red-600">₹{selectedRecord.expenses.seeds.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#E6E9E5] h-2 rounded-full overflow-hidden">
              <div className="bg-[#6FAF78] h-full" style={{ width: `${(selectedRecord.expenses.seeds / totalExpense) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Right: AI ROI Optimization & "Recommend Best Ways" */}
        <div className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-lg text-[#26332A] border-b border-[#E6E9E5] pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6FAF78]" />
            <span>AI Recommended Ways to Boost Profit</span>
          </h3>

          <ul className="space-y-3">
            {selectedRecord.aiProfitTips.map((tip, idx) => (
              <li key={idx} className="p-3.5 bg-[#EAF5EC] border border-[#A8D5A2] rounded-2xl flex items-start gap-2.5 text-xs text-[#26332A] font-semibold">
                <CheckCircle className="w-4 h-4 text-[#56965F] shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {onAskAiForProfit && (
            <button
              onClick={() =>
                onAskAiForProfit(
                  `Analyze my financial ledger for ${selectedRecord.cropName} with expense ₹${totalExpense} and give me 3 specific ways to cut cost by 20%.`
                )
              }
              className="w-full mt-4 bg-[#6FAF78] hover:bg-[#56965F] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI for Custom Cost-Cutting Plan</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
