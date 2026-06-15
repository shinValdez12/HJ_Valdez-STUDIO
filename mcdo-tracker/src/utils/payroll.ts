import {
  EmployeeRole,
  HolidayType,
  TimeEntry,
  CutoffPeriod,
  PayrollSummary,
  PAYROLL_RATES,
  NIGHT_SHIFT_START,
  NIGHT_SHIFT_END,
} from '../types';

/**
 * Get hourly rate for a role
 */
export function getHourlyRate(role: EmployeeRole): number {
  return PAYROLL_RATES[role].hourlyRate;
}

/**
 * Parse time string HH:MM to decimal hours from midnight
 */
export function parseTimeToHours(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

/**
 * Calculate total hours worked between timeIn and timeOut
 * Handles overnight shifts
 */
export function calculateHoursWorked(timeIn: string, timeOut: string): number {
  let inHours = parseTimeToHours(timeIn);
  let outHours = parseTimeToHours(timeOut);
  if (outHours <= inHours) {
    outHours += 24; // overnight
  }
  return Math.max(0, outHours - inHours);
}

/**
 * Calculate night differential hours (10PM - 6AM)
 */
export function calculateNightDiffHours(timeIn: string, timeOut: string): number {
  let inH = parseTimeToHours(timeIn);
  let outH = parseTimeToHours(timeOut);
  if (outH <= inH) outH += 24;

  // Night window: 22:00 to 30:00 (6AM next day = 30h in 24+6 terms)
  const nightStart = NIGHT_SHIFT_START; // 22
  const nightEnd = NIGHT_SHIFT_END + 24; // 30

  // Also check for 0-6 window on the same day
  let nightHours = 0;

  // Segment 1: 22:00 to 24:00
  const seg1Start = nightStart;
  const seg1End = 24;
  const overlap1Start = Math.max(inH, seg1Start);
  const overlap1End = Math.min(outH, seg1End);
  if (overlap1End > overlap1Start) nightHours += overlap1End - overlap1Start;

  // Segment 2: 0:00 (24h) to 6:00 (30h)
  const seg2Start = 24;
  const seg2End = nightEnd;
  const overlap2Start = Math.max(inH, seg2Start);
  const overlap2End = Math.min(outH, seg2End);
  if (overlap2End > overlap2Start) nightHours += overlap2End - overlap2Start;

  return Math.max(0, nightHours);
}

/**
 * Calculate overtime hours (after 8 hours total)
 */
export function calculateOvertimeHours(totalHours: number): number {
  return Math.max(0, totalHours - PAYROLL_RATES.overtimeThreshold);
}

/**
 * Calculate regular (non-OT) hours
 */
export function calculateRegularHours(totalHours: number): number {
  return Math.min(totalHours, PAYROLL_RATES.overtimeThreshold);
}

/**
 * Full payroll calculation with base shift hours (new logic)
 */
export function calculateEntryPayrollWithBaseShift(
  role: EmployeeRole,
  timeIn: string,
  timeOut: string,
  baseShiftHours: 5 | 6,
  holidayType: HolidayType
): {
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
} {
  const rate = getHourlyRate(role);
  const hoursWorked = calculateHoursWorked(timeIn, timeOut);
  const nightDiffHours = calculateNightDiffHours(timeIn, timeOut);

  // Break down hours: base + extended + overtime
  const baseHours = Math.min(hoursWorked, baseShiftHours);
  const hoursAfterBase = Math.max(0, hoursWorked - baseShiftHours);
  const hoursUpTo8 = Math.min(hoursAfterBase, Math.max(0, 8 - baseShiftHours));
  const extendedHours = hoursUpTo8;
  const overtimeHours = Math.max(0, hoursWorked - 8);

  // Apply holiday multiplier
  let holidayMultiplier = 1;
  let holidayPremium = 0;

  if (holidayType === 'special') {
    holidayMultiplier = PAYROLL_RATES.specialHolidayMultiplier;
    holidayPremium = rate * (PAYROLL_RATES.specialHolidayMultiplier - 1) * (baseHours + extendedHours);
  } else if (holidayType === 'regular') {
    holidayMultiplier = PAYROLL_RATES.regularHolidayMultiplier;
    holidayPremium = rate * (PAYROLL_RATES.regularHolidayMultiplier - 1) * (baseHours + extendedHours);
  }

  const effectiveRate = rate * holidayMultiplier;

  // Calculate pays
  const basePay = effectiveRate * baseHours;
  const extendedPay = effectiveRate * extendedHours;
  const overtimePay = effectiveRate * PAYROLL_RATES.otMultiplier * overtimeHours;
  const nightDiffPay = rate * PAYROLL_RATES.nightDiffPercent * nightDiffHours;
  const totalPay = basePay + extendedPay + overtimePay + nightDiffPay;

  return {
    hoursWorked: Math.round(hoursWorked * 100) / 100,
    baseHours: Math.round(baseHours * 100) / 100,
    extendedHours: Math.round(extendedHours * 100) / 100,
    overtimeHours: Math.round(overtimeHours * 100) / 100,
    nightDiffHours: Math.round(nightDiffHours * 100) / 100,
    basePay: Math.round(basePay * 100) / 100,
    extendedPay: Math.round(extendedPay * 100) / 100,
    overtimePay: Math.round(overtimePay * 100) / 100,
    holidayPremium: Math.round(holidayPremium * 100) / 100,
    nightDiffPay: Math.round(nightDiffPay * 100) / 100,
    totalPay: Math.round(totalPay * 100) / 100,
  };
}

/**
 * Full payroll calculation for a single time entry
 */
export function calculateEntryPayroll(
  role: EmployeeRole,
  timeIn: string,
  timeOut: string,
  holidayType: HolidayType
): {
  hoursWorked: number;
  regularHours: number;
  overtimeHours: number;
  nightDiffHours: number;
  basicPay: number;
  overtimePay: number;
  holidayPay: number;
  nightDiffPay: number;
  totalPay: number;
} {
  const rate = getHourlyRate(role);
  const hoursWorked = calculateHoursWorked(timeIn, timeOut);
  const regularHours = calculateRegularHours(hoursWorked);
  const overtimeHours = calculateOvertimeHours(hoursWorked);
  const nightDiffHours = calculateNightDiffHours(timeIn, timeOut);

  // Apply holiday multiplier to base rate
  let effectiveRate = rate;
  let holidayPay = 0;

  if (holidayType === 'special') {
    effectiveRate = rate * PAYROLL_RATES.specialHolidayMultiplier;
    holidayPay = rate * (PAYROLL_RATES.specialHolidayMultiplier - 1) * regularHours;
  } else if (holidayType === 'regular') {
    effectiveRate = rate * PAYROLL_RATES.regularHolidayMultiplier;
    holidayPay = rate * (PAYROLL_RATES.regularHolidayMultiplier - 1) * regularHours;
  }

  const basicPay = effectiveRate * regularHours;
  const overtimePay = effectiveRate * PAYROLL_RATES.otMultiplier * overtimeHours - effectiveRate * overtimeHours;
  // OT pay = (effectiveRate × 1.25 × OT hours) - basicPay for those hours
  // Simpler: extra 25% on top of regular rate for OT hours
  const otPay = rate * 0.25 * overtimeHours + (effectiveRate - rate) * overtimeHours;
  const otBasePay = effectiveRate * overtimeHours * PAYROLL_RATES.otMultiplier;

  const nightDiffPay = rate * PAYROLL_RATES.nightDiffPercent * nightDiffHours;
  const totalPay = basicPay + otBasePay + nightDiffPay;

  return {
    hoursWorked: Math.round(hoursWorked * 100) / 100,
    regularHours: Math.round(regularHours * 100) / 100,
    overtimeHours: Math.round(overtimeHours * 100) / 100,
    nightDiffHours: Math.round(nightDiffHours * 100) / 100,
    basicPay: Math.round(basicPay * 100) / 100,
    overtimePay: Math.round(otBasePay * 100) / 100,
    holidayPay: Math.round(holidayPay * 100) / 100,
    nightDiffPay: Math.round(nightDiffPay * 100) / 100,
    totalPay: Math.round(totalPay * 100) / 100,
  };
}

/**
 * Get current cutoff period
 */
export function getCurrentCutoff(): CutoffPeriod {
  const now = new Date();
  return getCutoffForDate(now);
}

/**
 * Get cutoff period for a given date
 */
export function getCutoffForDate(date: Date): CutoffPeriod {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const lastDay = getDaysInMonth(year, month);

  if (day <= 15) {
    return {
      year,
      month,
      period: 1,
      startDay: 1,
      endDay: 15,
      label: `${getMonthName(month)} 1–15, ${year}`,
    };
  } else {
    return {
      year,
      month,
      period: 2,
      startDay: 16,
      endDay: lastDay,
      label: `${getMonthName(month)} 16–${lastDay}, ${year}`,
    };
  }
}

/**
 * Get days in a month (handles leap years)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Get month name
 */
export function getMonthName(month: number): string {
  const names = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return names[month];
}

/**
 * Get date range for a cutoff period
 */
export function getCutoffDateRange(cutoff: CutoffPeriod): { start: Date; end: Date } {
  const start = new Date(cutoff.year, cutoff.month - 1, cutoff.startDay);
  const end = new Date(cutoff.year, cutoff.month - 1, cutoff.endDay, 23, 59, 59);
  return { start, end };
}

/**
 * Check if a date string falls within a cutoff period
 */
export function isInCutoff(dateStr: string, cutoff: CutoffPeriod): boolean {
  const date = new Date(dateStr);
  const { start, end } = getCutoffDateRange(cutoff);
  return date >= start && date <= end;
}

/**
 * Aggregate payroll summary for a set of entries
 */
export function aggregatePayrollSummary(
  entries: TimeEntry[],
  cutoff: CutoffPeriod
): PayrollSummary {
  const cutoffEntries = entries.filter(e => isInCutoff(e.date, cutoff) && e.status === 'present');

  const summary: PayrollSummary = {
    cutoffPeriod: cutoff,
    totalHoursWorked: 0,
    totalBaseHours: 0,
    totalExtendedHours: 0,
    totalOvertimeHours: 0,
    totalNightDiffHours: 0,
    totalBasePay: 0,
    totalExtendedPay: 0,
    totalOvertimePay: 0,
    totalHolidayPremium: 0,
    totalNightDiffPay: 0,
    totalEarnings: 0,
    daysWorked: 0,
    daysRestday: 0,
    lateCount: 0,
    // Legacy field for backward compatibility
    totalRegularHours: 0,
    totalHolidayPay: 0,
  };

  for (const entry of cutoffEntries) {
    summary.totalHoursWorked += entry.hoursWorked;
    summary.totalBaseHours += entry.baseHours;
    summary.totalExtendedHours += entry.extendedHours;
    summary.totalOvertimeHours += entry.overtimeHours;
    summary.totalNightDiffHours += entry.nightDiffHours;
    summary.totalBasePay += entry.basePay;
    summary.totalExtendedPay += entry.extendedPay;
    summary.totalOvertimePay += entry.overtimePay;
    summary.totalHolidayPremium += entry.holidayPremium;
    summary.totalNightDiffPay += entry.nightDiffPay;
    summary.totalEarnings += entry.totalPay;
    summary.daysWorked++;
    // Legacy fields
    summary.totalRegularHours += entry.baseHours;
    summary.totalHolidayPay += entry.holidayPremium;
  }

  // Round all values
  summary.totalHoursWorked = Math.round(summary.totalHoursWorked * 100) / 100;
  summary.totalBaseHours = Math.round(summary.totalBaseHours * 100) / 100;
  summary.totalExtendedHours = Math.round(summary.totalExtendedHours * 100) / 100;
  summary.totalOvertimeHours = Math.round(summary.totalOvertimeHours * 100) / 100;
  summary.totalNightDiffHours = Math.round(summary.totalNightDiffHours * 100) / 100;
  summary.totalBasePay = Math.round(summary.totalBasePay * 100) / 100;
  summary.totalExtendedPay = Math.round(summary.totalExtendedPay * 100) / 100;
  summary.totalOvertimePay = Math.round(summary.totalOvertimePay * 100) / 100;
  summary.totalHolidayPremium = Math.round(summary.totalHolidayPremium * 100) / 100;
  summary.totalNightDiffPay = Math.round(summary.totalNightDiffPay * 100) / 100;
  summary.totalEarnings = Math.round(summary.totalEarnings * 100) / 100;
  summary.totalRegularHours = Math.round(summary.totalRegularHours * 100) / 100;
  summary.totalHolidayPay = Math.round(summary.totalHolidayPay * 100) / 100;

  return summary;
}

/**
 * Format currency in PHP
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format time for display (24h -> 12h)
 */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get previous cutoff
 */
export function getPreviousCutoff(cutoff: CutoffPeriod): CutoffPeriod {
  if (cutoff.period === 2) {
    return {
      year: cutoff.year,
      month: cutoff.month,
      period: 1,
      startDay: 1,
      endDay: 15,
      label: `${getMonthName(cutoff.month)} 1–15, ${cutoff.year}`,
    };
  } else {
    const prevMonth = cutoff.month === 1 ? 12 : cutoff.month - 1;
    const prevYear = cutoff.month === 1 ? cutoff.year - 1 : cutoff.year;
    const lastDay = getDaysInMonth(prevYear, prevMonth);
    return {
      year: prevYear,
      month: prevMonth,
      period: 2,
      startDay: 16,
      endDay: lastDay,
      label: `${getMonthName(prevMonth)} 16–${lastDay}, ${prevYear}`,
    };
  }
}

/**
 * Get next cutoff
 */
export function getNextCutoff(cutoff: CutoffPeriod): CutoffPeriod {
  if (cutoff.period === 1) {
    const lastDay = getDaysInMonth(cutoff.year, cutoff.month);
    return {
      year: cutoff.year,
      month: cutoff.month,
      period: 2,
      startDay: 16,
      endDay: lastDay,
      label: `${getMonthName(cutoff.month)} 16–${lastDay}, ${cutoff.year}`,
    };
  } else {
    const nextMonth = cutoff.month === 12 ? 1 : cutoff.month + 1;
    const nextYear = cutoff.month === 12 ? cutoff.year + 1 : cutoff.year;
    return {
      year: nextYear,
      month: nextMonth,
      period: 1,
      startDay: 1,
      endDay: 15,
      label: `${getMonthName(nextMonth)} 1–15, ${nextYear}`,
    };
  }
}
