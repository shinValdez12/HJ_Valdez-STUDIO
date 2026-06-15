// Employee roles
export type EmployeeRole = 'crew' | 'crew_trainer';

// Holiday types
export type HolidayType = 'none' | 'special' | 'regular';

// Shift types
export type ShiftType = 'morning' | 'afternoon' | 'evening' | 'night' | 'custom';

// Attendance status
export type AttendanceStatus = 'present' | 'Restday' | 'holiday' | 'restday';

export interface EmployeeProfile {
  id: string;
  name: string;
  role: EmployeeRole;
  employeeId?: string;
  startDate: string; // ISO date string
  storeNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timeIn: string; // HH:MM (24h)
  timeOut: string; // HH:MM (24h)
  baseShiftHours: 5 | 6; // Base shift duration
  shiftType: ShiftType;
  holidayType: HolidayType;
  notes?: string;
  status: AttendanceStatus;
  // Calculated fields (stored for performance)
  hoursWorked: number;
  baseHours: number;
  extendedHours: number;
  overtimeHours: number;
  nightDiffHours: number;
  basePay: number;
  extendedPay: number;
  overtimePay: number;
  holidayPremium: number;
  nightDiffPay: number;
  totalPay: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollSummary {
  cutoffPeriod: CutoffPeriod;
  totalHoursWorked: number;
  totalBaseHours: number;
  totalExtendedHours: number;
  totalOvertimeHours: number;
  totalNightDiffHours: number;
  totalBasePay: number;
  totalExtendedPay: number;
  totalOvertimePay: number;
  totalHolidayPremium: number;
  totalNightDiffPay: number;
  totalEarnings: number;
  daysWorked: number;
  daysRestday: number;
  lateCount: number;
  // Legacy fields for backward compatibility
  totalRegularHours: number;
  totalHolidayPay: number;
}

export interface CutoffPeriod {
  year: number;
  month: number; // 1-12
  period: 1 | 2; // 1 = day 1-15, 2 = day 16-end
  startDay: number;
  endDay: number;
  label: string; // e.g. "June 1–15, 2025"
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  defaultShiftDuration: 5 | 6;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  entry?: TimeEntry;
  isToday: boolean;
  isCurrentMonth: boolean;
  holidayType: HolidayType;
  status: AttendanceStatus | null;
}

// Payroll rate
export const PAYROLL_RATES = {
  crew: {
    hourlyRate: 75,
    role: 'Crew' as const,
  },
  crew_trainer: {
    hourlyRate: 77,
    role: 'Crew Trainer' as const,
  },
  nightDiffPercent: 0.10,   // 10%
  otMultiplier: 1.30,       // 130%
  specialHolidayMultiplier: 1.30,  // 130%
  regularHolidayMultiplier: 2.00,  // 200%
  overtimeThreshold: 8,      // OT after 8 hours
} as const;

// Night shift hours: 10 PM - 6 AM
export const NIGHT_SHIFT_START = 22; // 10 PM
export const NIGHT_SHIFT_END = 6;    // 6 AM
