import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  // Simple clsx without tailwind-merge to avoid dependency issues
  return clsx(inputs);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { weekday: 'short' });
}

export function getWeekDates(weekOffset = 0): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1 + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function getCurrentWeekDates(): string[] {
  return getWeekDates(0);
}
