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
import { TestingView, TestingSubOption } from './components/TestingView';
import { DiseaseView } from './components/DiseaseView';
import { NutriBlendView } from './components/NutriBlendView';
import { SchemesView, SchemesSubTab } from './components/SchemesView';
import { SimulatorView } from './components/SimulatorView';
import { FinancialsView } from './components/FinancialsView';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginPage } from './components/LoginPage';
import { useLanguage } from './i18n/translations';
import { VoiceProvider } from './utils/speech';

export interface HistorySnapshot {
  tab: AppTab;
  // Testing sub-states
  testingOption: TestingSubOption;
  testingSoilId: string;
  testingWaterId: string;
  testingReportsTab: 'all' | 'soil' | 'water';
  // Schemes sub-states
  schemesSubTab: SchemesSubTab;
  schemesCategory: string;
  schemesModalId: string | null;
  // Disease sub-states
  diseaseTab: 'sample' | 'custom';
  diseaseId: string;
  // Financials sub-states
  financialsRecordId: string;
  // Modals
  showWhyAlertModal: boolean;
  showNotificationsModal: boolean;
  showSettingsModal: boolean;
}

const INITIAL_NAV_SNAPSHOT: HistorySnapshot = {
  tab: 'home',
  testingOption: null,
  testingSoilId: 'st-1',
  testingWaterId: 'wt-1',
  testingReportsTab: 'all',
  schemesSubTab: 'eligible',
  schemesCategory: 'All',
  schemesModalId: null,
  diseaseTab: 'sample',
  diseaseId: 'dis-1',
  financialsRecordId: 'fin-1',
  showWhyAlertModal: false,
  showNotificationsModal: false,
  showSettingsModal: false,
};

export default function App() {
  const [navHistory, setNavHistory] = useState<HistorySnapshot[]>([INITIAL_NAV_SNAPSHOT]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const { language: currentLang, setLanguage: setCurrentLang } = useLanguage();

  const currentNav = navHistory[historyIndex] || INITIAL_NAV_SNAPSHOT;
  const activeTab = currentNav.tab;

  const pushNavState = (partial: Partial<HistorySnapshot>) => {
    const current = navHistory[historyIndex] || INITIAL_NAV_SNAPSHOT;
    const isChanged = Object.entries(partial).some(
      ([key, val]) => current[key as keyof HistorySnapshot] !== val
    );
    if (!isChanged) return;

    const nextSnapshot: HistorySnapshot = {
      ...current,
      ...partial,
    };

    const truncated = navHistory.slice(0, historyIndex + 1);
    const updated = [...truncated, nextSnapshot];
    setNavHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const navigateToTab = (newTab: AppTab) => {
    pushNavState({ tab: newTab });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < navHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  };

  // Keyboard shortcut listener for Ctrl+Z (Undo) and Ctrl+Y / Ctrl+Shift+Z (Redo)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, navHistory]);

  // App Data States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [profile, setProfile] = useState<FarmerProfile>(INITIAL_FARMER_PROFILE);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [fields] = useState<CropField[]>(DEMO_FIELDS);
  const [clockHours] = useState<ClockHourData[]>(CLOCKWISE_HOURS);
  const [forecast] = useState<ForecastDay[]>(FORECAST_5DAYS);
  const [alert] = useState<EarlyWarningAlert>(DEMO_EARLY_WARNING);
  const [crops] = useState<RecommendedCrop[]>(RECOMMENDED_CROPS);
  const [farmMemory, setFarmMemory] = useState<FarmMemoryItem[]>(DEMO_AI_MEMORY);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [aiCustomQuestion, setAiCustomQuestion] = useState<string>('');

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = (updatedData?: Partial<FarmerProfile>) => {
    if (updatedData) {
      setProfile((prev) => ({ ...prev, ...updatedData }));
    }
    setIsLoggedIn(true);
  };

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
    navigateToTab('ai');
  };

  if (!isLoggedIn) {
    return (
      <VoiceProvider currentLang={currentLang}>
        <LoginPage
          onLogin={handleLogin}
          defaultLocation={profile.location}
        />
      </VoiceProvider>
    );
  }

  return (
    <VoiceProvider currentLang={currentLang}>
      <div id="app-root-container" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white">
        {/* Desktop Sidebar Nav */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => navigateToTab(tab)}
          profile={profile}
          onLogout={handleLogout}
        />

        {/* Right Main Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header
            profile={profile}
            unreadCount={unreadCount}
            currentLang={currentLang}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < navHistory.length - 1}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onOpenNotifications={() => pushNavState({ showNotificationsModal: true })}
            onOpenSettings={() => pushNavState({ showSettingsModal: true })}
            onLanguageChange={(lang) => setCurrentLang(lang)}
            onNavigate={(tab) => navigateToTab(tab)}
            onAskAi={handleAskAiForZone}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {activeTab === 'home' && (
              <HomeView
                profile={profile}
                weather={weather}
                alert={alert}
                crops={fields}
                onNavigate={(tab) => navigateToTab(tab)}
                onOpenWhyAlert={() => pushNavState({ showWhyAlertModal: true })}
                onOpenActionAlert={() => navigateToTab('ai')}
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
                  onOpenEarlyWarning={() => pushNavState({ showWhyAlertModal: true })}
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
              <TestingView
                selectedOption={currentNav.testingOption}
                onSelectOption={(opt) => pushNavState({ tab: 'testing', testingOption: opt })}
                selectedSoilId={currentNav.testingSoilId}
                onSelectSoilId={(id) => pushNavState({ tab: 'testing', testingSoilId: id })}
                selectedWaterId={currentNav.testingWaterId}
                onSelectWaterId={(id) => pushNavState({ tab: 'testing', testingWaterId: id })}
                reportsFilterTab={currentNav.testingReportsTab}
                onSelectReportsFilterTab={(filterTab) => pushNavState({ tab: 'testing', testingReportsTab: filterTab })}
                onAskAiForTest={handleAskAiForZone}
              />
            )}

            {activeTab === 'disease' && (
              <DiseaseView
                activeTab={currentNav.diseaseTab}
                onTabChange={(tab) => pushNavState({ tab: 'disease', diseaseTab: tab })}
                selectedDiseaseId={currentNav.diseaseId}
                onSelectDiseaseId={(id) => pushNavState({ tab: 'disease', diseaseId: id })}
                onAskAiForDisease={handleAskAiForZone}
              />
            )}

            {activeTab === 'schemes' && (
              <SchemesView
                activeSubTab={currentNav.schemesSubTab}
                onSelectSubTab={(subTab) => pushNavState({ tab: 'schemes', schemesSubTab: subTab })}
                selectedCategory={currentNav.schemesCategory}
                onSelectCategory={(cat) => pushNavState({ tab: 'schemes', schemesCategory: cat })}
                activeSchemeModalId={currentNav.schemesModalId}
                onSetActiveSchemeModalId={(modalId) => pushNavState({ tab: 'schemes', schemesModalId: modalId })}
                onAskAiForScheme={handleAskAiForZone}
              />
            )}

            {activeTab === 'simulator' && (
              <SimulatorView onAskAiForScenario={handleAskAiForZone} />
            )}

            {activeTab === 'financials' && (
              <FinancialsView
                selectedRecordId={currentNav.financialsRecordId}
                onSelectRecordId={(recId) => pushNavState({ tab: 'financials', financialsRecordId: recId })}
                onAskAiForProfit={handleAskAiForZone}
              />
            )}

            {activeTab === 'journal' && (
              <JournalView
                entries={journalEntries}
                onAddEntry={handleAddJournalEntry}
                onUpdateFeedback={handleUpdateFeedback}
              />
            )}

            {activeTab === 'nutriblend' && (
              <NutriBlendView />
            )}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => navigateToTab(tab)}
          onOpenSettings={() => pushNavState({ showSettingsModal: true })}
        />

        {/* Climate Risk Why Alert Modal (Screen 5 & Screen 6) */}
        {currentNav.showWhyAlertModal && (
          <ClimateRiskWarningModal
            alert={alert}
            onClose={() => pushNavState({ showWhyAlertModal: false })}
            onActionClick={() => {
              pushNavState({ showWhyAlertModal: false, tab: 'ai' });
            }}
          />
        )}

        {/* Notifications Modal (Screen 14) */}
        {currentNav.showNotificationsModal && (
          <NotificationsModal
            notifications={notifications}
            onClose={() => pushNavState({ showNotificationsModal: false })}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
          />
        )}

        {/* Settings Modal (Screen 15) */}
        {currentNav.showSettingsModal && (
          <SettingsModal
            profile={profile}
            currentLang={currentLang}
            onLanguageChange={(lang) => setCurrentLang(lang)}
            onClose={() => pushNavState({ showSettingsModal: false })}
          />
        )}
      </div>
    </VoiceProvider>
  );
}
