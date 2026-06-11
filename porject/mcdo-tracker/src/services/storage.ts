import { EmployeeProfile, TimeEntry, AppSettings } from '../types';

const KEYS = {
  PROFILE: 'mcd_employee_profile',
  ENTRIES: 'mcd_time_entries',
  SETTINGS: 'mcd_settings',
} as const;

// ─── Profile ────────────────────────────────────────────────────────────────

export function getProfile(): EmployeeProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: EmployeeProfile): void {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
}

// ─── Time Entries ────────────────────────────────────────────────────────────

export function getEntries(): TimeEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.ENTRIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: TimeEntry): void {
  const entries = getEntries();
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = { ...entry, updatedAt: new Date().toISOString() };
  } else {
    entries.push({ ...entry, updatedAt: new Date().toISOString() });
  }
  // Sort by date descending
  entries.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries));
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter(e => e.id !== id);
  localStorage.setItem(KEYS.ENTRIES, JSON.stringify(entries));
}

export function getEntryByDate(date: string): TimeEntry | null {
  return getEntries().find(e => e.date === date) ?? null;
}

export function getEntriesInRange(startDate: string, endDate: string): TimeEntry[] {
  return getEntries().filter(e => e.date >= startDate && e.date <= endDate);
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    theme: 'system',
    language: 'en',
    notificationsEnabled: true,
    defaultShiftDuration: 6,
  };
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function clearAllData(): void {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}

export function exportData(): string {
  return JSON.stringify({
    profile: getProfile(),
    entries: getEntries(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.profile) localStorage.setItem(KEYS.PROFILE, JSON.stringify(data.profile));
    if (data.entries) localStorage.setItem(KEYS.ENTRIES, JSON.stringify(data.entries));
    if (data.settings) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
    return true;
  } catch {
    return false;
  }
}
