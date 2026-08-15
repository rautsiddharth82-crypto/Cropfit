import React from 'react';
import { HelpCircle, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

interface WhatWhyWhenHowProps {
  what: string;
  why: string;
  when: string;
  whatToDo: string;
  onActionClick?: () => void;
  actionText?: string;
  className?: string;
}

export const WhatWhyWhenHowCard: React.FC<WhatWhyWhenHowProps> = ({
  what,
  why,
  when,
  whatToDo,
  onActionClick,
  actionText = 'View Action Details',
  className = '',
}) => {
  return (
    <div
      id="what-why-when-how-card"
      className={`bg-white rounded-2xl p-5 border border-[#E6E9E5] shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E6E9E5]">
        <div className="w-8 h-8 rounded-full bg-[#F7E7A8] flex items-center justify-center text-[#26332A] font-bold text-sm">
          💡
        </div>
        <div>
          <h4 className="text-base font-bold text-[#26332A]">AI Explanation & Guidance</h4>
          <p className="text-xs text-[#68736B]">Clear breakdown for farmer decision-making</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {/* WHAT */}
        <div className="p-3 rounded-xl bg-[#F8F7EF] border border-[#E6E9E5]">
          <div className="flex items-center gap-1.5 font-bold text-[#E88B8B] mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="uppercase tracking-wide text-xs">WHAT IS HAPPENING?</span>
          </div>
          <p className="text-[#26332A] font-medium leading-snug">{what}</p>
        </div>

        {/* WHY */}
        <div className="p-3 rounded-xl bg-[#F8F7EF] border border-[#E6E9E5]">
          <div className="flex items-center gap-1.5 font-bold text-[#F4B66A] mb-1">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="uppercase tracking-wide text-xs">WHY IS THIS OCCURRING?</span>
          </div>
          <p className="text-[#26332A] leading-snug">{why}</p>
        </div>

        {/* WHEN */}
        <div className="p-3 rounded-xl bg-[#F8F7EF] border border-[#E6E9E5]">
          <div className="flex items-center gap-1.5 font-bold text-[#9CCFE5] mb-1">
            <Clock className="w-4 h-4 shrink-0 text-[#3B82F6]" />
            <span className="uppercase tracking-wide text-xs text-[#1D4ED8]">WHEN WILL IT HAPPEN?</span>
          </div>
          <p className="text-[#26332A] font-medium leading-snug">{when}</p>
        </div>

        {/* WHAT SHOULD I DO */}
        <div className="p-3 rounded-xl bg-[#EAF5EC] border border-[#A8D5A2]">
          <div className="flex items-center gap-1.5 font-bold text-[#56965F] mb-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="uppercase tracking-wide text-xs">WHAT SHOULD I DO?</span>
          </div>
          <p className="text-[#26332A] font-semibold leading-snug">{whatToDo}</p>
        </div>
      </div>

      {onActionClick && (
        <button
          id="btn-what-why-action"
          onClick={onActionClick}
          className="mt-4 w-full py-3 px-4 bg-[#6FAF78] hover:bg-[#56965F] text-white font-bold rounded-xl text-center text-sm transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
