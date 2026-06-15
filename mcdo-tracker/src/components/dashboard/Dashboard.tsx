import React from 'react';
import { Sun, Moon, TrendingUp, Clock, Zap, CalendarDays, ChevronRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import StatBadge from '../ui/StatBadge';
import Button from '../ui/Button';
import { formatCurrency, aggregatePayrollSummary, getCurrentCutoff, isInCutoff } from '../../utils/payroll';
import { todayStr, getCurrentWeekDates, formatDate } from '../../utils/helpers';
import { PAYROLL_RATES } from '../../types';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profile, entries, currentCutoff, isDark, toggleTheme } = useApp();
  const today = todayStr();
  const weekDates = getCurrentWeekDates();

  const summary = aggregatePayrollSummary(entries, currentCutoff);

  const todayEntry = entries.find(e => e.date === today);

  // Weekly stats
  const weekEntries = entries.filter(e => weekDates.includes(e.date) && e.status === 'present');
  const weekHours = weekEntries.reduce((s, e) => s + e.hoursWorked, 0);
  const weekEarnings = weekEntries.reduce((s, e) => s + e.totalPay, 0);
  const weekAttendanceRate = weekDates.length > 0
    ? Math.round((weekEntries.length / weekDates.filter(d => d <= today).length) * 100) || 0
    : 0;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const roleName = profile ? PAYROLL_RATES[profile.role].role : 'Employee';
  const hourlyRate = profile ? PAYROLL_RATES[profile.role].hourlyRate : 0;

  // Check if clocked in today
  const isClockedIn = todayEntry && todayEntry.timeIn && !todayEntry.timeOut;

  return (
    <div className="flex flex-col gap-4 pb-28">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-14 pb-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {profile?.name || 'Set up profile'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{roleName} · ₱{hourlyRate}/hr</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors mt-1"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* No profile prompt */}
        {!profile && (
          <Card className="border-2 border-dashed border-brand-red/30 bg-brand-red/5 dark:bg-brand-red/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                <AlertCircle size={20} className="text-brand-red" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Set up your profile</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Add your name and role to get started</p>
              </div>
              <Button size="sm" onClick={() => onNavigate('profile')}>Set up</Button>
            </div>
          </Card>
        )}

        {/* Payroll Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-brand-red p-5 shadow-brand">
          {/* Background decoration */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -right-2 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wide">Est. Earnings</p>
                <p className="text-white/60 text-[11px] mt-0.5">{currentCutoff.label}</p>
              </div>
              <div className="bg-white/20 rounded-2xl px-3 py-1.5">
                <p className="text-white text-xs font-semibold">Cutoff {currentCutoff.period}</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              {formatCurrency(summary.totalEarnings)}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-white/60 text-[10px]">Regular</p>
                <p className="text-white text-sm font-semibold">{summary.totalBaseHours.toFixed(1)}h</p>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div>
                <p className="text-white/60 text-[10px]">Ext</p>
                <p className="text-white text-sm font-semibold">{summary.totalExtendedHours.toFixed(1)}h</p>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div>
                <p className="text-white/60 text-[10px]">OT</p>
                <p className="text-white text-sm font-semibold">{summary.totalOvertimeHours.toFixed(1)}h</p>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div>
                <p className="text-white/60 text-[10px]">Days</p>
                <p className="text-white text-sm font-semibold">{summary.daysWorked}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today Status */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                todayEntry ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-gray-100 dark:bg-white/5'
              }`}>
                <Clock size={18} className={todayEntry ? 'text-emerald-600' : 'text-gray-400'} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Today</p>
                {todayEntry ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {todayEntry.timeIn} → {todayEntry.timeOut || 'In progress'} · {todayEntry.hoursWorked.toFixed(1)}h
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No entry yet · {formatDate(today)}</p>
                )}
              </div>
            </div>
            <Button size="sm" onClick={() => onNavigate('time')}>
              {todayEntry ? 'View' : 'Add'}
            </Button>
          </div>
        </Card>

        {/* Weekly Overview */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-red" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">This Week</h3>
            </div>
            <button
              onClick={() => onNavigate('calendar')}
              className="flex items-center gap-1 text-xs text-brand-red font-medium"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StatBadge label="Hours" value={weekHours.toFixed(1)} color="blue" />
            <StatBadge label="Earnings" value={`₱${weekEarnings.toFixed(0)}`} color="green" />
            <StatBadge label="Attendance" value={`${weekAttendanceRate}%`} color="yellow" />
          </div>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={16} className="text-brand-red" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Cutoff Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBadge label="Days Worked" value={summary.daysWorked} color="green" />
            <StatBadge label="OT Hours" value={summary.totalOvertimeHours.toFixed(1)} color="purple" />
            <StatBadge label="Holiday Pay" value={formatCurrency(summary.totalHolidayPay)} color="yellow" />
            <StatBadge label="Night Diff" value={formatCurrency(summary.totalNightDiffPay)} color="blue" />
          </div>
        </Card>

        {/* Recent entries */}
        {entries.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Recent Entries</h3>
              <button
                onClick={() => onNavigate('time')}
                className="text-xs text-brand-red font-medium flex items-center gap-1"
              >
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {entries.slice(0, 3).map(entry => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b border-surface-border dark:border-surface-border-dark last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      entry.status === 'present' ? 'bg-emerald-500' :
                      entry.status === 'Restday' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(entry.date)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.timeIn} – {entry.timeOut} · {entry.hoursWorked.toFixed(1)}h
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(entry.totalPay)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
