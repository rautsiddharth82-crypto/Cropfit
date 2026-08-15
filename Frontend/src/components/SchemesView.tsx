import React, { useState } from 'react';
import { GovScheme } from '../types';
import { MOCK_SCHEMES } from '../data/mockData';
import {
  Landmark,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Search,
  ArrowRight,
  X,
  Layers
} from 'lucide-react';
import { useLanguage } from '../i18n/translations';
import { useVoice } from '../utils/speech';

export type SchemesSubTab = 'eligible' | 'all';

interface SchemesViewProps {
  activeSubTab?: SchemesSubTab;
  onSelectSubTab?: (subTab: SchemesSubTab) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  activeSchemeModalId?: string | null;
  onSetActiveSchemeModalId?: (schemeId: string | null) => void;
  onAskAiForScheme?: (schemeTitle: string) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({
  activeSubTab: propSubTab,
  onSelectSubTab,
  selectedCategory: propCategory,
  onSelectCategory,
  activeSchemeModalId: propModalId,
  onSetActiveSchemeModalId,
  onAskAiForScheme
}) => {
  const { t, language } = useLanguage();
  const { speak } = useVoice();
  const [schemes] = useState<GovScheme[]>(MOCK_SCHEMES);
  
  const [internalSubTab, setInternalSubTab] = useState<SchemesSubTab>('eligible');
  const activeSubTab = propSubTab !== undefined ? propSubTab : internalSubTab;

  const handleSubTabChange = (tab: SchemesSubTab) => {
    speak(tab === 'eligible' ? t('eligible_schemes') : t('all_schemes'));
    if (onSelectSubTab) onSelectSubTab(tab);
    else setInternalSubTab(tab);
  };

  const [internalCategory, setInternalCategory] = useState<string>('All');
  const selectedCategory = propCategory !== undefined ? propCategory : internalCategory;

  const handleCategoryChange = (cat: string) => {
    speak(cat === 'All' ? (language === 'hi' ? 'सभी योजनाएं' : 'All Schemes') : cat);
    if (onSelectCategory) onSelectCategory(cat);
    else setInternalCategory(cat);
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalModal, setInternalModal] = useState<GovScheme | null>(null);

  const activeSchemeModal = propModalId !== undefined
    ? schemes.find((s) => s.id === propModalId) || null
    : internalModal;

  const handleSetModal = (scheme: GovScheme | null) => {
    if (scheme) {
      speak(scheme.title);
    }
    if (onSetActiveSchemeModalId) {
      onSetActiveSchemeModalId(scheme ? scheme.id : null);
    } else {
      setInternalModal(scheme);
    }
  };

  const categories = [
    { id: 'All', label: language === 'hi' ? 'सभी' : 'All' },
    { id: 'Solar & Energy', label: language === 'hi' ? 'सोलर व ऊर्जा' : 'Solar & Energy' },
    { id: 'Crop Insurance', label: language === 'hi' ? 'फसल बीमा' : 'Crop Insurance' },
    { id: 'Micro-Irrigation', label: language === 'hi' ? 'ड्रिप व सूक्ष्म सिंचाई' : 'Micro-Irrigation' },
    { id: 'Equipment & Machinery', label: language === 'hi' ? 'कृषि यंत्र व मशीनरी' : 'Equipment & Machinery' },
    { id: 'Direct Income', label: language === 'hi' ? 'प्रत्यक्ष आय' : 'Direct Income' }
  ];

  // Filter schemes
  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subsidyPercentage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Split into Eligible (high match score >= 85%) vs All
  const eligibleSchemes = filteredSchemes.filter((s) => s.matchScore >= 85);
  const allSchemes = filteredSchemes;

  // Active list based on chosen sub-tab
  const currentDisplaySchemes = activeSubTab === 'eligible' ? eligibleSchemes : allSchemes;

  return (
    <div id="schemes-view-root" className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header Banner */}
      <div className="border border-emerald-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Full Image Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/schemes_banner.jpg"
            alt="Government Schemes Theme"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5 text-emerald-300" />
            <span>{language === 'hi' ? 'सरकारी अनुदान, योजनाएं व लाभ' : 'Government Subsidies & Benefits'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('schemes_title')}
          </h2>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="mt-5 pt-4 border-t border-emerald-700/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-300" />
            <input
              id="schemes-search-input"
              type="text"
              placeholder={language === 'hi' ? 'योजना का नाम, सब्सिडी दर या श्रेणी खोजें...' : 'Search scheme name, subsidy rate, or category...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-950/60 border border-emerald-600/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`scheme-category-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-xs'
                    : 'bg-emerald-950/50 text-emerald-100 border border-emerald-700/50 hover:bg-emerald-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2 SUB TABS: ELIGIBLE SCHEMES VS ALL SCHEMES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            id="subtab-eligible-schemes"
            onClick={() => handleSubTabChange('eligible')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'eligible'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeSubTab === 'eligible' ? 'text-emerald-300' : 'text-slate-400'}`} />
            <span>{t('eligible_schemes')}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeSubTab === 'eligible'
                  ? 'bg-emerald-800 text-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {eligibleSchemes.length}
            </span>
          </button>

          <button
            id="subtab-all-schemes"
            onClick={() => handleSubTabChange('all')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className={`w-4 h-4 ${activeSubTab === 'all' ? 'text-slate-300' : 'text-slate-400'}`} />
            <span>{t('all_schemes')}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeSubTab === 'all'
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {allSchemes.length}
            </span>
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-500 px-3 hidden sm:block">
          {activeSubTab === 'eligible'
            ? (language === 'hi' ? 'आपकी भूमि व फसलों के अनुसार पात्र सरकारी योजनाएं' : 'Showing subsidies tailored to your landholding & crops')
            : (language === 'hi' ? 'केंद्र एवं राज्य सरकार के सभी कृषि कार्यक्रम' : 'Complete directory of Central and State agricultural programs')}
        </div>
      </div>

      {/* SCHEMES CARDS LIST */}
      <div>
        {currentDisplaySchemes.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-400 text-sm space-y-2">
            <p className="font-bold text-slate-600">{language === 'hi' ? 'कोई योजना नहीं मिली।' : 'No schemes found matching your criteria.'}</p>
            <p className="text-xs text-slate-400">{language === 'hi' ? 'खोज शब्द बदलें या "सभी" फ़िल्टर चुनें।' : "Try clearing the search query or selecting 'All' category filter."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDisplaySchemes.map((scheme) => {
              const isEligible = scheme.matchScore >= 85;
              return (
                <div
                  key={scheme.id}
                  id={`scheme-card-${scheme.id}`}
                  onClick={() => handleSetModal(scheme)}
                  className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-4 ${
                    activeSubTab === 'eligible' || isEligible
                      ? 'border-emerald-200 hover:border-emerald-500'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                          {scheme.category}
                        </span>
                        <span className="text-[10px] font-black text-slate-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                          💰 {scheme.subsidyPercentage} {language === 'hi' ? 'सब्सिडी' : 'Subsidy'}
                        </span>
                      </div>

                      {isEligible ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>{scheme.matchScore}% {language === 'hi' ? 'मैच' : 'Match'}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                          {scheme.state}
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {scheme.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {scheme.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500">
                      {language === 'hi' ? 'राज्य क्षेत्र:' : 'Coverage:'} <strong className="text-slate-800">{scheme.state}</strong>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetModal(scheme);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 font-bold text-xs transition-all border border-slate-200 group-hover:border-emerald-600 cursor-pointer"
                    >
                      <span>{t('view_details')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SCHEME DETAIL MODAL */}
      {activeSchemeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                  {activeSchemeModal.category}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2 leading-snug">{activeSchemeModal.title}</h3>
              </div>
              <button
                id="close-scheme-modal-btn"
                onClick={() => handleSetModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-800">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-amber-800">{language === 'hi' ? 'सब्सिडी / वित्तीय सहायता' : 'Subsidy / Assistance'}</p>
                  <p className="text-base font-black text-amber-900">{activeSchemeModal.subsidyPercentage}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-amber-800">{language === 'hi' ? 'क्षेत्र' : 'Jurisdiction'}</p>
                  <p className="text-xs font-bold text-amber-900">{activeSchemeModal.state}</p>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-500 uppercase text-[10px] tracking-wider mb-1">
                  {language === 'hi' ? 'योजना का विवरण' : 'Scheme Overview'}
                </h4>
                <p className="leading-relaxed text-slate-800 font-medium">{activeSchemeModal.description}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-500 uppercase text-[10px] tracking-wider mb-1">
                  {t('eligibility')}
                </h4>
                <p className="leading-relaxed text-slate-800 font-medium">{activeSchemeModal.eligibility}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-500 uppercase text-[10px] tracking-wider mb-1.5">
                  {t('documents_required')}
                </h4>
                <ul className="space-y-1">
                  {activeSchemeModal.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              {onAskAiForScheme && (
                <button
                  id="ask-ai-scheme-btn"
                  onClick={() => {
                    const sTitle = activeSchemeModal.title;
                    handleSetModal(null);
                    onAskAiForScheme(
                      language === 'hi'
                        ? `${sTitle} योजना में आवेदन करने की पूरी प्रक्रिया और आवश्यक दस्तावेज क्या हैं?`
                        : `How do I apply for ${sTitle} in Rajpura, Punjab? What are the exact steps and documents needed?`
                    );
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold py-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'एआई से आवेदन प्रक्रिया पूछें' : 'Ask AI How to Apply'}</span>
                </button>
              )}

              <a
                id="official-portal-link"
                href={activeSchemeModal.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>{language === 'hi' ? 'आधिकारिक पोर्टल' : 'Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
