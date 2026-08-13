import React from 'react';
import { AppTab, FarmerProfile } from '../types';
import { Home, Sprout, CloudSun, Bot, BookOpen, MapPin, FlaskConical, Camera, Landmark, Sliders, Wallet, Database } from 'lucide-react';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  profile: FarmerProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  profile,
}) => {
  const navItems: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }>; emoji: string }[] = [
    { id: 'home', label: 'Home', icon: Home, emoji: '🏠' },
    { id: 'farm', label: 'My Farm', icon: Sprout, emoji: '🌾' },
    { id: 'climate', label: 'Climate & Clock', icon: CloudSun, emoji: '🌦️' },
    { id: 'testing', label: 'Soil & Water Test', icon: FlaskConical, emoji: '🧪' },
    { id: 'disease', label: 'Disease Scanner', icon: Camera, emoji: '🔍' },
    { id: 'schemes', label: 'Gov Schemes', icon: Landmark, emoji: '🏛️' },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders, emoji: '🔮' },
    { id: 'financials', label: 'Cost & Profit ROI', icon: Wallet, emoji: '💰' },
    { id: 'ai', label: 'AI Voice Assistant', icon: Bot, emoji: '🤖' },
    { id: 'journal', label: 'Farm Journal', icon: BookOpen, emoji: '📖' },
    { id: 'api-tester', label: 'API Testing', icon: Database, emoji: '⚡' },
  ];

  return (
    <aside
      id="desktop-sidebar-nav"
      className="w-64 bg-white border-r border-[#E6E9E5] hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 z-30 overflow-y-auto"
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#6FAF78] rounded-2xl flex items-center justify-center text-white text-xl shadow-xs">
          🌱
        </div>
        <div>
          <h1 className="font-extrabold text-xl tracking-tight text-[#26332A]">AgriSmart</h1>
          <p className="text-[10px] text-[#56965F] font-bold uppercase tracking-wider">Climate Assistant</p>
        </div>
      </div>

      {/* Farmer Profile Badge */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 p-3 bg-[#F8F7EF] border border-[#E6E9E5] rounded-2xl">
          <div className="w-11 h-11 rounded-full bg-slate-200 border-2 border-white shadow-xs overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1595273670150-db0a3d39074c?auto=format&fit=crop&w=100"
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] text-[#68736B] font-medium">Welcome,</p>
            <p className="font-extrabold text-sm text-[#26332A] truncate">{profile.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all text-left ${
                isActive
                  ? 'bg-[#6FAF78] text-white shadow-xs'
                  : 'text-[#68736B] hover:bg-[#A8D5A2]/15 hover:text-[#26332A]'
              }`}
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Location Footer */}
      <div className="p-6 mt-auto border-t border-[#E6E9E5]">
        <p className="text-[10px] text-[#68736B] uppercase tracking-widest font-extrabold mb-1">
          Location
        </p>
        <p className="text-sm flex items-center gap-1.5 font-bold text-[#26332A]">
          <MapPin className="w-4 h-4 text-[#6FAF78]" />
          <span>{profile.location}</span>
        </p>
      </div>
    </aside>
  );
};
