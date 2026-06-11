import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, TrendingUp } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import StatBadge from '../ui/StatBadge';
import Button from '../ui/Button';
import {
  aggregatePayrollSummary, formatCurrency, getCurrentCutoff,
  getPreviousCutoff, getNextCutoff, getCutoffForDate, getDaysInMonth, getMonthName
} from '../../utils/payroll';
import { formatDate } from '../../utils/helpers';
import { CutoffPeriod } from '../../types';
import { exportData } from '../../services/storage';

type ReportView = 'cutoff' | 'monthly';

export default function ReportsPage() {
  const { entries, currentCutoff } = useApp();
  const [view, setView] = useState<ReportView>('cutoff');
  const [cutoff, setCutoff] = useState<CutoffPeriod>(currentCutoff);
  const [monthYear, setMonthYear] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

  const cutoffSummary = aggregatePayrollSummary(entries, cutoff);

  // Monthly entries
  const monthEntries = entries.filter(e => {
    const [y, m] = e.date.split('-').map(Number);
    return y === monthYear.year && m === monthYear.month && e.status === 'present';
  });
  const monthTotalHours = monthEntries.reduce((s, e) => s + e.hoursWorked, 0);
  const monthTotalEarnings = monthEntries.reduce((s, e) => s + e.totalPay, 0);
  const monthOTHours = monthEntries.reduce((s, e) => s + e.overtimeHours, 0);
  const monthNightHours = monthEntries.reduce((s, e) => s + e.nightDiffHours, 0);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcd-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const prevCutoff = () => setCutoff(getPreviousCutoff(cutoff));
  const nextCutoff = () => setCutoff(getNextCutoff(cutoff));
  const prevMonth = () => setMonthYear(m => {
    if (m.month === 1) return { year: m.year - 1, month: 12 };
    return { ...m, month: m.month - 1 };
  });
  const nextMonth = () => setMonthYear(m => {
    if (m.month === 12) return { year: m.year + 1, month: 1 };
    return { ...m, month: m.month + 1 };
  });

  return (
    <div className="flex flex-col gap-0 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payroll & attendance breakdown</p>
        </div>
        <Button size="sm" variant="ghost" onClick={handleExport}>
          <Download size={16} /> Export
        </Button>
      </div>

      {/* View Toggle */}
      <div className="mx-4 mb-3 flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
        {(['cutoff', 'monthly'] as ReportView[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
              view === v
                ? 'bg-white dark:bg-surface-card-dark text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {v === 'cutoff' ? 'Cutoff' : 'Monthly'}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {view === 'cutoff' ? (
          <>
            {/* Cutoff nav */}
            <div className="flex items-center justify-between">
              <button onClick={prevCutoff} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-base font-bold text-gray-900 dark:text-white text-center">{cutoff.label}</h2>
              <button onClick={nextCutoff} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Payroll Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-red to-brand-red-dark p-5 shadow-brand">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
              <p className="text-white/70 text-xs font-medium mb-1">Estimated Earnings</p>
              <p className="text-4xl font-bold text-white">{formatCurrency(cutoffSummary.totalEarnings)}</p>
              <p className="text-white/60 text-xs mt-1">Cutoff {cutoff.period} · {cutoff.label}</p>
            </div>

            {/* Pay breakdown */}
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Pay Breakdown</h3>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  { label: 'Basic Pay', value: cutoffSummary.totalBasicPay, color: 'text-gray-900 dark:text-white' },
                  { label: 'Overtime Pay', value: cutoffSummary.totalOvertimePay, color: 'text-purple-600 dark:text-purple-400' },
                  { label: 'Holiday Pay', value: cutoffSummary.totalHolidayPay, color: 'text-yellow-600 dark:text-yellow-400' },
                  { label: 'Night Diff Pay', value: cutoffSummary.totalNightDiffPay, color: 'text-blue-600 dark:text-blue-400' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-1 border-b border-surface-border dark:border-surface-border-dark last:border-0">
                    <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                    <span className={`font-semibold ${row.color}`}>{formatCurrency(row.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1 font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-brand-red">{formatCurrency(cutoffSummary.totalEarnings)}</span>
                </div>
              </div>
            </Card>

            {/* Hours breakdown */}
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Hours Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <StatBadge label="Regular Hours" value={`${cutoffSummary.totalRegularHours.toFixed(1)}h`} color="green" />
                <StatBadge label="OT Hours" value={`${cutoffSummary.totalOvertimeHours.toFixed(1)}h`} color="purple" />
                <StatBadge label="Night Diff Hours" value={`${cutoffSummary.totalNightDiffHours.toFixed(1)}h`} color="blue" />
                <StatBadge label="Holiday Hours" value={`${cutoffSummary.totalHolidayHours.toFixed(1)}h`} color="yellow" />
              </div>
            </Card>

            {/* Attendance */}
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Attendance</h3>
              <div className="grid grid-cols-3 gap-2">
                <StatBadge label="Days Worked" value={cutoffSummary.daysWorked} color="green" />
                <StatBadge label="Days Absent" value={cutoffSummary.daysAbsent} color="red" />
                <StatBadge label="Period Days" value={cutoff.endDay - cutoff.startDay + 1} color="gray" />
              </div>
            </Card>

            {/* Per-entry list */}
            {(() => {
              const periodEntries = entries.filter(e => {
                const [y, m, d] = e.date.split('-').map(Number);
                return y === cutoff.year && m === cutoff.month && d >= cutoff.startDay && d <= cutoff.endDay;
              });
              if (periodEntries.length === 0) return null;
              return (
                <Card>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Daily Entries</h3>
                  <div className="flex flex-col gap-2">
                    {periodEntries.map(entry => (
                      <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-surface-border dark:border-surface-border-dark last:border-0 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(entry.date)}</p>
                          <p className="text-xs text-gray-500">{entry.status === 'present' ? `${entry.hoursWorked.toFixed(1)}h worked` : entry.status}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(entry.totalPay)}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })()}
          </>
        ) : (
          <>
            {/* Monthly nav */}
            <div className="flex items-center justify-between">
              <button onClick={prevMonth} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {getMonthName(monthYear.month)} {monthYear.year}
              </h2>
              <button onClick={nextMonth} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 p-5">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
              <p className="text-white/60 text-xs font-medium mb-1">Monthly Earnings</p>
              <p className="text-4xl font-bold text-white">{formatCurrency(monthTotalEarnings)}</p>
              <p className="text-white/40 text-xs mt-1">{getMonthName(monthYear.month)} {monthYear.year}</p>
            </div>

            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Monthly Overview</h3>
              <div className="grid grid-cols-2 gap-2">
                <StatBadge label="Total Hours" value={`${monthTotalHours.toFixed(1)}h`} color="blue" />
                <StatBadge label="Days Worked" value={monthEntries.length} color="green" />
                <StatBadge label="OT Hours" value={`${monthOTHours.toFixed(1)}h`} color="purple" />
                <StatBadge label="Night Diff" value={`${monthNightHours.toFixed(1)}h`} color="blue" />
              </div>
            </Card>

            {monthEntries.length > 0 && (
              <Card>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">All Entries</h3>
                {monthEntries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-surface-border dark:border-surface-border-dark last:border-0 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDate(entry.date)}</p>
                      <p className="text-xs text-gray-500">{entry.hoursWorked.toFixed(1)}h{entry.overtimeHours > 0 ? ` · ${entry.overtimeHours.toFixed(1)}h OT` : ''}</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(entry.totalPay)}</p>
                  </div>
                ))}
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
