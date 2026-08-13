import React, { useState } from 'react';
import { GovScheme } from '../types';
import { MOCK_SCHEMES } from '../data/mockData';
import { Landmark, Sparkles, CheckCircle2, FileText, ExternalLink, ShieldCheck, Search, Filter } from 'lucide-react';

interface SchemesViewProps {
  onAskAiForScheme?: (schemeTitle: string) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({ onAskAiForScheme }) => {
  const [schemes] = useState<GovScheme[]>(MOCK_SCHEMES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSchemeModal, setActiveSchemeModal] = useState<GovScheme | null>(null);

  const categories = ['All', 'Solar & Energy', 'Crop Insurance', 'Micro-Irrigation', 'Equipment & Machinery', 'Direct Income'];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="schemes-view-root" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#EAF5EC] border-2 border-[#A8D5A2] rounded-[24px] p-6 text-[#26332A] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none text-9xl">
          🏛️
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#6FAF78] text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <Landmark className="w-3.5 h-3.5" />
            <span>Government Subsidies & Schemes Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-[#26332A]">
            Smart Scheme Recommendation System
          </h2>
          <p className="text-sm text-[#68736B] leading-relaxed font-medium">
            AI matched subsidies for your 12.5 acre farm in Rajpura, Punjab — featuring PM-KUSUM 80% Solar pump subsidy, PMFBY crop insurance, and Drip Irrigation incentives.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="mt-6 pt-4 border-t border-[#A8D5A2] space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#68736B]" />
            <input
              type="text"
              placeholder="Search scheme name, subsidy, or document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E6E9E5] rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-[#26332A] placeholder-[#68736B] focus:outline-none focus:ring-2 focus:ring-[#6FAF78]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#6FAF78] text-white shadow-xs'
                    : 'bg-white text-[#26332A] border border-[#E6E9E5] hover:bg-[#F8F7EF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            id={`scheme-card-${scheme.id}`}
            className="bg-white border border-[#E6E9E5] rounded-[24px] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#A8D5A2] transition-all"
          >
            <div>
              {/* Category & Match Score */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-extrabold uppercase text-[#56965F] bg-[#EAF5EC] px-3 py-1 rounded-full border border-[#A8D5A2]">
                  {scheme.category}
                </span>

                <div className="flex items-center gap-1 text-xs font-black text-[#56965F] bg-[#EAF5EC] px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{scheme.matchScore}% AI Match</span>
                </div>
              </div>

              <h3 className="font-extrabold text-lg text-[#26332A] leading-snug mb-1">{scheme.title}</h3>

              <div className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black px-2.5 py-1 rounded-lg mb-3">
                💰 {scheme.subsidyPercentage}
              </div>

              <p className="text-xs text-[#68736B] leading-relaxed mb-4">{scheme.description}</p>

              {/* Documents Needed Snippet */}
              <div className="bg-[#F8F7EF] p-3 rounded-xl space-y-1.5">
                <p className="text-[10px] font-extrabold text-[#68736B] uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#56965F]" />
                  <span>Required Documents:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.requiredDocuments.slice(0, 3).map((doc, idx) => (
                    <span key={idx} className="bg-white border border-[#E6E9E5] text-[10px] font-semibold text-[#26332A] px-2 py-0.5 rounded-md">
                      {doc}
                    </span>
                  ))}
                  {scheme.requiredDocuments.length > 3 && (
                    <span className="text-[10px] text-[#68736B] font-bold">+{scheme.requiredDocuments.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#E6E9E5]">
              <button
                onClick={() => setActiveSchemeModal(scheme)}
                className="flex-1 bg-[#F8F7EF] hover:bg-[#E6E9E5] text-[#26332A] text-xs font-bold py-2.5 rounded-xl border border-[#E6E9E5] transition-all flex items-center justify-center gap-1"
              >
                <span>Check Eligibility & Docs</span>
              </button>

              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#6FAF78] hover:bg-[#56965F] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Apply Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail Modal */}
      {activeSchemeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#E6E9E5]">
            <div className="flex items-start justify-between gap-3 border-b border-[#E6E9E5] pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#56965F] bg-[#EAF5EC] px-2.5 py-0.5 rounded-full">
                  {activeSchemeModal.category}
                </span>
                <h3 className="text-xl font-extrabold text-[#26332A] mt-2">{activeSchemeModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveSchemeModal(null)}
                className="w-8 h-8 rounded-full bg-[#F8F7EF] text-[#68736B] font-bold text-sm flex items-center justify-center hover:bg-[#E6E9E5]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#26332A]">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-amber-800">Assistance Rate</p>
                  <p className="text-base font-black text-amber-900">{activeSchemeModal.subsidyPercentage}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-amber-800">State / Coverage</p>
                  <p className="text-xs font-bold text-amber-900">{activeSchemeModal.state}</p>
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-[#68736B] uppercase text-[10px] tracking-wider mb-1">
                  Scheme Overview
                </h4>
                <p className="leading-relaxed text-[#26332A] font-medium">{activeSchemeModal.description}</p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#68736B] uppercase text-[10px] tracking-wider mb-1">
                  Eligibility Criteria
                </h4>
                <p className="leading-relaxed text-[#26332A] font-medium">{activeSchemeModal.eligibility}</p>
              </div>

              <div>
                <h4 className="font-extrabold text-[#68736B] uppercase text-[10px] tracking-wider mb-2">
                  Complete Document Checklist
                </h4>
                <ul className="space-y-1.5">
                  {activeSchemeModal.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 bg-[#F8F7EF] p-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#56965F] shrink-0" />
                      <span className="font-semibold">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E6E9E5]">
              {onAskAiForScheme && (
                <button
                  onClick={() => {
                    const title = activeSchemeModal.title;
                    setActiveSchemeModal(null);
                    onAskAiForScheme(`How do I apply for ${title} in Rajpura, Punjab? What are the exact steps?`);
                  }}
                  className="flex-1 bg-[#F8F7EF] hover:bg-[#E6E9E5] text-[#26332A] text-xs font-bold py-2.5 rounded-xl border border-[#E6E9E5] transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-[#56965F]" />
                  <span>Ask AI How to Apply</span>
                </button>
              )}

              <a
                href={activeSchemeModal.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#6FAF78] hover:bg-[#56965F] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
