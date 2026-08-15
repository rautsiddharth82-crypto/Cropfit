import React from 'react';
import { CropField, FieldZone } from '../types';
import { useLanguage } from '../i18n/translations';

interface ThreeFieldViewProps {
  field: CropField;
  onZoneSelect: (zone: FieldZone) => void;
  selectedZone: FieldZone | null;
}

export const ThreeFieldView: React.FC<ThreeFieldViewProps> = ({ field }) => {
  const { language } = useLanguage();

  const labels = {
    title: {
      en: `3D Field View: ${field.name}`,
      hi: `3D खेत दृश्य: ${field.name}`,
      pa: `3D ਖੇਤ ਨਕਸ਼ਾ: ${field.name}`
    },
    badge: {
      en: 'Live 3D Model',
      hi: 'सजीव 3D मॉडल',
      pa: 'ਸਜੀਵ 3D ਮਾਡਲ'
    },
    desc: {
      en: 'Interactive 3D Corn Farm',
      hi: 'मक्के के खेत का इंटरैक्टिव 3D मॉडल',
      pa: 'ਮੱਕੀ ਦੇ ਖੇਤ ਦਾ 3D ਮਾਡਲ'
    }
  };

  const getLabel = (key: 'title' | 'badge' | 'desc') => {
    return labels[key][language] || labels[key]['en'];
  };

  return (
    <div id="three-field-container" className="bg-white rounded-3xl border border-[#E6E9E5] overflow-hidden shadow-sm">
      {/* 3D View Header Controls */}
      <div className="p-4 bg-[#F8F7EF] border-b border-[#E6E9E5] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-[#26332A] text-base flex items-center gap-2">
            <span>{getLabel('title')}</span>
            <span className="text-xs font-bold text-[#56965F] bg-[#EAF5EC] px-2.5 py-0.5 rounded-full">
              {getLabel('badge')}
            </span>
          </h3>
          <p className="text-xs text-[#68736B] mt-0.5">
            {getLabel('desc')}
          </p>
        </div>
      </div>

      {/* 3D Sketchfab Embed Iframe Area */}
      <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-900">
        <iframe
          title="Corn Farm"
          frameBorder="0"
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/4024ce2b72f543c5926e0317335f5661/embed"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
