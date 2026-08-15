import React from 'react';
import { Home, Sprout, CloudSun, Bot, BookOpen, FlaskConical, Camera, Landmark, Sliders, Wallet } from 'lucide-react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  unreadNotificationsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'farm', label: 'My Farm', icon: Sprout },
    { id: 'testing', label: 'Soil/Water', icon: FlaskConical },
    { id: 'disease', label: 'Disease AI', icon: Camera },
    { id: 'schemes', label: 'Schemes', icon: Landmark },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'financials', label: 'Profit ROI', icon: Wallet },
    { id: 'climate', label: 'Climate', icon: CloudSun },
    { id: 'ai', label: 'Assistant', icon: Bot },
    { id: 'journal', label: 'Diary', icon: BookOpen },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6E9E5] z-40 px-2 py-1.5 shadow-lg overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center gap-1.5 min-w-max px-2 mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#EAF5EC] text-[#56965F] font-extrabold scale-105 border border-[#A8D5A2]'
                  : 'text-[#68736B] hover:text-[#26332A]'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#56965F]' : 'text-[#68736B]'}`} />
              <span className="text-[10px] tracking-tight whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

