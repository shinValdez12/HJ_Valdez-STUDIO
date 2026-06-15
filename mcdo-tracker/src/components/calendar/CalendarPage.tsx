import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import { formatCurrency, formatTime, getDaysInMonth, getMonthName, aggregatePayrollSummary, getCurrentCutoff, getNextCutoff, getPreviousCutoff } from '../../utils/payroll';
import { formatDate } from '../../utils/helpers';
import { TimeEntry } from '../../types';
import { exportData } from '../../services/storage';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type ReportView = 'cutoff' | 'monthly';

export default function CalendarPage() {
  const { entries } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<ReportView>('cutoff');
  const [cutoff, setCutoff] = useState(getCurrentCutoff());
  const [monthYear, setMonthYear] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun

  // Build a map of date -> entry
  const entryMap: Record<string, TimeEntry> = {};
  entries.forEach(e => { entryMap[e.date] = e; });

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  const getDayColor = (dateStr: string) => {
    const entry = entryMap[dateStr];
    if (!entry) return '';
    if (entry.status === 'Restday') return 'bg-red-500 text-white';
    if (entry.holidayType === 'regular') return 'bg-yellow-500 text-white';
    if (entry.holidayType === 'special') return 'bg-amber-400 text-white';
    if (entry.overtimeHours > 0) return 'bg-purple-500 text-white';
    if (entry.nightDiffHours > 0) return 'bg-blue-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;

  const selectedEntry = selected ? entryMap[selected] : null;
  const cutoffSummary = aggregatePayrollSummary(entries, cutoff);

  const monthEntries = entries.filter(e => {
    const [y, m] = e.date.split('-').map(Number);
    return y === monthYear.year && m === monthYear.month && e.status === 'present';
  });
  const monthTotalHours = monthEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const monthTotalEarnings = monthEntries.reduce((sum, entry) => sum + entry.totalPay, 0);
  const monthOTHours = monthEntries.reduce((sum, entry) => sum + entry.overtimeHours, 0);
  const monthNightHours = monthEntries.reduce((sum, entry) => sum + entry.nightDiffHours, 0);

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
  const prevReportMonth = () => setMonthYear(m => {
    if (m.month === 1) return { year: m.year - 1, month: 12 };
    return { ...m, month: m.month - 1 };
  });
  const nextReportMonth = () => setMonthYear(m => {
    if (m.month === 12) return { year: m.year + 1, month: 1 };
    return { ...m, month: m.month + 1 };
  });

  const periodEntries = entries.filter(entry => {
    const [y, m, d] = entry.date.split('-').map(Number);
    return y === cutoff.year && m === cutoff.month && d >= cutoff.startDay && d <= cutoff.endDay;
  });

  const legend = [
    { color: 'bg-emerald-500', label: 'Present' },
    { color: 'bg-red-500', label: 'Restday' },
    { color: 'bg-yellow-500', label: 'Holiday' },
    { color: 'bg-purple-500', label: 'OT' },
    { color: 'bg-blue-500', label: 'Night Shift' },
  ];

  return (
    <div className="flex flex-col gap-0 pb-28">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Attendance overview</p>
      </div>

      <div className="px-4 flex flex-col gap-4 lg:grid lg:grid-cols-[1.35fr_0.95fr] lg:items-start">
        <div className="flex flex-col gap-3">
          <Card>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {getMonthName(month)} {year}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = isCurrentMonth && day === today.getDate();
                const isSelected = selected === dateStr;
                const colorClass = getDayColor(dateStr);
                const isFuture = dateStr > today.toISOString().slice(0, 10);

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelected(isSelected ? null : dateStr)}
                    className={`
                      relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium
                      transition-all duration-150 touch-manipulation
                      ${colorClass || (isFuture ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10')}
                      ${isToday && !colorClass ? 'ring-2 ring-brand-red text-brand-red font-bold' : ''}
                      ${isSelected ? 'ring-2 ring-offset-1 ring-gray-400' : ''}
                    `}
                  >
                    {day}
                    {entryMap[dateStr]?.overtimeHours > 0 && !colorClass.includes('purple') && (
                      <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-purple-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2 px-1">
            {legend.map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{l.label}</span>
              </div>
            ))}
          </div>

          {selected && (
            <Card className="animate-slide-up">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">{formatDate(selected)}</h3>
              {selectedEntry ? (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{selectedEntry.status}</p>
                    </div>
                    {selectedEntry.status === 'present' && (
                      <>
                        <div>
                          <p className="text-gray-500 text-xs">Hours</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{selectedEntry.hoursWorked.toFixed(2)}h</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Time In</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatTime(selectedEntry.timeIn)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Time Out</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatTime(selectedEntry.timeOut)}</p>
                        </div>
                        {selectedEntry.overtimeHours > 0 && (
                          <div>
                            <p className="text-purple-500 text-xs">OT Hours</p>
                            <p className="font-semibold text-purple-700 dark:text-purple-400">{selectedEntry.overtimeHours.toFixed(2)}h</p>
                          </div>
                        )}
                        {selectedEntry.nightDiffHours > 0 && (
                          <div>
                            <p className="text-blue-500 text-xs">Night Diff</p>
                            <p className="font-semibold text-blue-700 dark:text-blue-400">{selectedEntry.nightDiffHours.toFixed(2)}h</p>
                          </div>
                        )}
                        {selectedEntry.holidayType !== 'none' && (
                          <div>
                            <p className="text-yellow-500 text-xs">Holiday</p>
                            <p className="font-semibold text-yellow-700 dark:text-yellow-400 capitalize">{selectedEntry.holidayType}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {selectedEntry.status === 'present' && (
                    <div className="pt-2 border-t border-surface-border dark:border-surface-border-dark flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(selectedEntry.totalPay)}</span>
                    </div>
                  )}
                  {selectedEntry.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">"{selectedEntry.notes}"</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No entry for this day.</p>
              )}
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reports</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payroll and attendance insights</p>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card-dark px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white transition hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <Download size={16} /> Export
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
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
          </Card>

          {view === 'cutoff' ? (
            <>
              <Card>
                <div className="flex items-center justify-between">
                  <button onClick={prevCutoff} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    <ChevronLeft size={18} />
                  </button>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white text-center">{cutoff.label}</h3>
                  <button onClick={nextCutoff} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Pay Overview</h3>
                <div className="grid gap-3">
                  <div className="rounded-3xl bg-gradient-to-br from-brand-red to-brand-red-dark p-5 shadow-brand text-white">
                    <p className="text-white/70 text-xs font-medium mb-1">Estimated Earnings</p>
                    <p className="text-3xl font-bold">{formatCurrency(cutoffSummary.totalEarnings)}</p>
                    <p className="text-white/60 text-xs mt-1">Cutoff {cutoff.period}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Base Pay', value: cutoffSummary.totalBasePay },
                      { label: 'Extended Pay', value: cutoffSummary.totalExtendedPay },
                      { label: 'Overtime Pay', value: cutoffSummary.totalOvertimePay },
                      { label: 'Holiday Premium', value: cutoffSummary.totalHolidayPremium },
                      { label: 'Night Diff Pay', value: cutoffSummary.totalNightDiffPay },
                      { label: 'Total Earnings', value: cutoffSummary.totalEarnings },
                    ].map(item => (
                      <div key={item.label} className="rounded-3xl bg-gray-50 dark:bg-white/5 p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Hours Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-3xl bg-gray-50 dark:bg-white/5 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Base Hours</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{cutoffSummary.totalBaseHours.toFixed(1)}h</p>
                  </div>
                  <div className="rounded-3xl bg-gray-50 dark:bg-white/5 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Extended Hours</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{cutoffSummary.totalExtendedHours.toFixed(1)}h</p>
                  </div>
                  <div className="rounded-3xl bg-purple-50 dark:bg-purple-950/20 p-3">
                    <p className="text-xs text-purple-600">OT Hours</p>
                    <p className="font-semibold text-purple-700 dark:text-purple-400">{cutoffSummary.totalOvertimeHours.toFixed(1)}h</p>
                  </div>
                  <div className="rounded-3xl bg-blue-50 dark:bg-blue-950/20 p-3">
                    <p className="text-xs text-blue-600">Night Diff Hours</p>
                    <p className="font-semibold text-blue-700 dark:text-blue-400">{cutoffSummary.totalNightDiffHours.toFixed(1)}h</p>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Daily Entries</h3>
                {periodEntries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No entries in this period.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {periodEntries.map(entry => (
                      <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-surface-border dark:border-surface-border-dark last:border-0 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(entry.date)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{entry.status === 'present' ? `${entry.hoursWorked.toFixed(1)}h worked` : entry.status}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(entry.totalPay)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          ) : (
            <>
              <Card>
                <div className="flex items-center justify-between">
                  <button onClick={prevReportMonth} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    <ChevronLeft size={18} />
                  </button>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white text-center">{getMonthName(monthYear.month)} {monthYear.year}</h3>
                  <button onClick={nextReportMonth} className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Monthly Overview</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-3xl bg-blue-50 dark:bg-blue-950/20 p-3">
                    <p className="text-xs text-blue-600">Total Hours</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{monthTotalHours.toFixed(1)}h</p>
                  </div>
                  <div className="rounded-3xl bg-green-50 dark:bg-emerald-950/20 p-3">
                    <p className="text-xs text-green-600">Days Worked</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{monthEntries.length}</p>
                  </div>
                  <div className="rounded-3xl bg-purple-50 dark:bg-purple-950/20 p-3">
                    <p className="text-xs text-purple-600">OT Hours</p>
                    <p className="font-semibold text-purple-700 dark:text-purple-400">{monthOTHours.toFixed(1)}h</p>
                  </div>
                  <div className="rounded-3xl bg-blue-50 dark:bg-blue-950/20 p-3">
                    <p className="text-xs text-blue-600">Night Diff</p>
                    <p className="font-semibold text-blue-700 dark:text-blue-400">{monthNightHours.toFixed(1)}h</p>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">All Entries</h3>
                {monthEntries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No entries for this month.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {monthEntries.map(entry => (
                      <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-surface-border dark:border-surface-border-dark last:border-0 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(entry.date)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{entry.hoursWorked.toFixed(1)}h{entry.overtimeHours > 0 ? ` · ${entry.overtimeHours.toFixed(1)}h OT` : ''}</p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(entry.totalPay)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
