import React, { useState, useEffect } from 'react';
import {
  AppTab,
  Language,
  FarmerProfile,
  WeatherData,
  CropField,
  ClockHourData,
  ForecastDay,
  EarlyWarningAlert,
  RecommendedCrop,
  FarmMemoryItem,
  JournalEntry,
  AppNotification
} from './types';
import {
  INITIAL_FARMER_PROFILE,
  INITIAL_WEATHER,
  DEMO_FIELDS,
  CLOCKWISE_HOURS,
  FORECAST_5DAYS,
  DEMO_EARLY_WARNING,
  RECOMMENDED_CROPS,
  DEMO_AI_MEMORY,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { MyFarmView } from './components/MyFarmView';
import { ClimateView } from './components/ClimateView';
import { ClimateRiskWarningModal } from './components/ClimateRiskWarningModal';
import { CropSuggestionsView } from './components/CropSuggestionsView';
import { AiAssistantView } from './components/AiAssistantView';
import { JournalView } from './components/JournalView';
import { TestingView } from './components/TestingView';
import { DiseaseView } from './components/DiseaseView';
import { SchemesView } from './components/SchemesView';
import { SimulatorView } from './components/SimulatorView';
import { FinancialsView } from './components/FinancialsView';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { ApiTesterView } from './components/ApiTesterView';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // App Data States
  const [profile] = useState<FarmerProfile>(INITIAL_FARMER_PROFILE);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [fields] = useState<CropField[]>(DEMO_FIELDS);
  const [clockHours] = useState<ClockHourData[]>(CLOCKWISE_HOURS);
  const [forecast] = useState<ForecastDay[]>(FORECAST_5DAYS);
  const [alert] = useState<EarlyWarningAlert>(DEMO_EARLY_WARNING);
  const [crops] = useState<RecommendedCrop[]>(RECOMMENDED_CROPS);
  const [farmMemory, setFarmMemory] = useState<FarmMemoryItem[]>(DEMO_AI_MEMORY);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals & Drawers State
  const [showWhyAlertModal, setShowWhyAlertModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [aiCustomQuestion, setAiCustomQuestion] = useState<string>('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    // Fetch live weather from backend
    fetch('/api/weather/current?lat=30.4764&lon=76.5927')
      .then(res => res.json())
      .then(data => {
        if (data.current) {
          setWeather({
            tempC: data.current.tempC,
            condition: data.current.condition,
            humidityPercent: data.current.humidity,
            rainChancePercent: data.current.precipitationMm > 0 ? 70 : 10,
            windSpeedKmh: data.current.windSpeedKmh,
            uvIndex: data.current.uvIndex,
            solarRad: '6.2 kWh/m²',
            anomaly: data.anomaly,
          });
        }
      })
      .catch(err => console.error('Failed to fetch weather from backend:', err));
  }, []);

  const handleAddJournalEntry = (newEntry: Omit<JournalEntry, 'id'>) => {
    const created: JournalEntry = {
      ...newEntry,
      id: `j-${Date.now()}`
    };
    setJournalEntries((prev) => [created, ...prev]);
  };

  const handleUpdateFeedback = (entryId: string, stress: 'yes' | 'partially' | 'no', action: string) => {
    setJournalEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, observedStressFeedback: stress, actionFeedback: action }
          : e
      )
    );

    // Save feedback to AI Farm Memory
    const newMemoryItem: FarmMemoryItem = {
      id: `mem-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      crop: 'Wheat (Field 01)',
      eventType: 'Farmer Feedback Recorded',
      description: `Observed stress: ${stress.toUpperCase()}. Action taken: ${action}.`,
      actionTaken: action,
      outcome: 'Logged to digital farm history for continuous AI model tuning.',
      severity: 'info'
    };
    setFarmMemory((prev) => [newMemoryItem, ...prev]);
  };

  const handleAskAiForZone = (promptText: string) => {
    setAiCustomQuestion(promptText);
    setActiveTab('ai');
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#F8F7EF] text-[#26332A] flex flex-col md:flex-row font-sans selection:bg-[#6FAF78] selection:text-white">
      {/* Desktop Sidebar Nav */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        profile={profile}
      />

      {/* Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          profile={profile}
          unreadCount={unreadCount}
          currentLang={currentLang}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onLanguageChange={(lang) => setCurrentLang(lang)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && (
            <HomeView
              profile={profile}
              weather={weather}
              alert={alert}
              crops={fields}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenWhyAlert={() => setShowWhyAlertModal(true)}
              onOpenActionAlert={() => setActiveTab('ai')}
            />
          )}

          {activeTab === 'farm' && (
            <MyFarmView
              profile={profile}
              fields={fields}
              onOpenAskAiForField={handleAskAiForZone}
            />
          )}

          {activeTab === 'climate' && (
            <div className="space-y-6">
              <ClimateView
                weather={weather}
                clockHours={clockHours}
                forecast={forecast}
                onOpenEarlyWarning={() => setShowWhyAlertModal(true)}
              />

              {/* Smart Crop Recommendations Sub-section embedded inside Climate & Agriculture */}
              <CropSuggestionsView
                crops={crops}
                onSelectCropForDetails={(crop) => {
                  handleAskAiForZone(`Tell me more about growing ${crop.name} in Rajpura, Punjab.`);
                }}
              />
            </div>
          )}

          {activeTab === 'ai' && (
            <AiAssistantView
              profile={profile}
              initialQuestion={aiCustomQuestion}
              farmMemory={farmMemory}
              onMarkActionDone={(title) => {
                handleAddJournalEntry({
                  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: 'irrigation',
                  title: `Completed Action: ${title}`,
                  fieldName: 'Field 01 (Wheat)',
                  notes: 'Action marked as completed from AI Assistant recommendation card.',
                  observedStressFeedback: 'yes',
                  actionFeedback: 'Irrigated early morning window'
                });
              }}
            />
          )}

          {activeTab === 'testing' && (
            <TestingView onAskAiForTest={handleAskAiForZone} />
          )}

          {activeTab === 'disease' && (
            <DiseaseView onAskAiForDisease={handleAskAiForZone} />
          )}

          {activeTab === 'schemes' && (
            <SchemesView onAskAiForScheme={handleAskAiForZone} />
          )}

          {activeTab === 'simulator' && (
            <SimulatorView onAskAiForScenario={handleAskAiForZone} />
          )}

          {activeTab === 'financials' && (
            <FinancialsView onAskAiForProfit={handleAskAiForZone} />
          )}

          {activeTab === 'journal' && (
            <JournalView
              entries={journalEntries}
              onAddEntry={handleAddJournalEntry}
              onUpdateFeedback={handleUpdateFeedback}
            />
          )}
          {activeTab === 'api-tester' && (
            <ApiTesterView />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Climate Risk Why Alert Modal (Screen 5 & Screen 6) */}
      {showWhyAlertModal && (
        <ClimateRiskWarningModal
          alert={alert}
          onClose={() => setShowWhyAlertModal(false)}
          onActionClick={() => {
            setShowWhyAlertModal(false);
            setActiveTab('ai');
          }}
        />
      )}

      {/* Notifications Modal (Screen 14) */}
      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
        />
      )}

      {/* Settings Modal (Screen 15) */}
      {showSettingsModal && (
        <SettingsModal
          profile={profile}
          currentLang={currentLang}
          onLanguageChange={(lang) => setCurrentLang(lang)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
