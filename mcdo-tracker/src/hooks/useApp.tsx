import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EmployeeProfile, TimeEntry, AppSettings, CutoffPeriod } from '../types';
import * as storage from '../services/storage';
import { getCurrentCutoff } from '../utils/payroll';

interface AppContextValue {
  profile: EmployeeProfile | null;
  entries: TimeEntry[];
  settings: AppSettings;
  currentCutoff: CutoffPeriod;
  isDark: boolean;
  setProfile: (p: EmployeeProfile) => void;
  addOrUpdateEntry: (e: TimeEntry) => void;
  deleteEntry: (id: string) => void;
  updateSettings: (s: AppSettings) => void;
  toggleTheme: () => void;
  refreshEntries: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<EmployeeProfile | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(storage.getSettings());
  const [currentCutoff] = useState<CutoffPeriod>(getCurrentCutoff());

  // Derive dark mode
  const isDark = settings.theme === 'dark' ||
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Apply dark class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load from storage on mount
  useEffect(() => {
    setProfileState(storage.getProfile());
    setEntries(storage.getEntries());
  }, []);

  const setProfile = useCallback((p: EmployeeProfile) => {
    storage.saveProfile(p);
    setProfileState(p);
  }, []);

  const addOrUpdateEntry = useCallback((entry: TimeEntry) => {
    storage.saveEntry(entry);
    setEntries(storage.getEntries());
  }, []);

  const deleteEntry = useCallback((id: string) => {
    storage.deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateSettings = useCallback((s: AppSettings) => {
    storage.saveSettings(s);
    setSettingsState(s);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    const updated = { ...settings, theme: next as 'light' | 'dark' };
    storage.saveSettings(updated);
    setSettingsState(updated);
  }, [isDark, settings]);

  const refreshEntries = useCallback(() => {
    setEntries(storage.getEntries());
  }, []);

  return (
    <AppContext.Provider value={{
      profile, entries, settings, currentCutoff, isDark,
      setProfile, addOrUpdateEntry, deleteEntry, updateSettings, toggleTheme, refreshEntries
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
