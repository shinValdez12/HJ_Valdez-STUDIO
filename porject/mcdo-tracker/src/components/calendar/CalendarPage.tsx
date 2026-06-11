import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import { formatCurrency, formatTime, getDaysInMonth, getMonthName } from '../../utils/payroll';
import { formatDate } from '../../utils/helpers';
import { TimeEntry, HolidayType } from '../../types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { entries } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12
  const [selected, setSelected] = useState<string | null>(null);

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
    if (entry.status === 'absent') return 'bg-red-500 text-white';
    if (entry.holidayType === 'regular') return 'bg-yellow-500 text-white';
    if (entry.holidayType === 'special') return 'bg-amber-400 text-white';
    if (entry.overtimeHours > 0) return 'bg-purple-500 text-white';
    if (entry.nightDiffHours > 0) return 'bg-blue-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;

  // Build calendar grid
  const cells: Array<{ day: number | null; dateStr: string | null }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, dateStr: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr });
  }

  const selectedEntry = selected ? entryMap[selected] : null;

  // Legend
  const legend = [
    { color: 'bg-emerald-500', label: 'Present' },
    { color: 'bg-red-500', label: 'Absent' },
    { color: 'bg-yellow-500', label: 'Holiday' },
    { color: 'bg-purple-500', label: 'OT' },
    { color: 'bg-blue-500', label: 'Night Shift' },
  ];

  return (
    <div className="flex flex-col gap-0 pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Attendance overview</p>
      </div>

      <div className="px-4 flex flex-col gap-3">
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
            {cells.map((cell, idx) => {
              if (!cell.day || !cell.dateStr) {
                return <div key={idx} className="aspect-square" />;
              }
              const dateStr = cell.dateStr;
              const isToday = isCurrentMonth && cell.day === today.getDate();
              const isSelected = selected === dateStr;
              const colorClass = getDayColor(dateStr);
              const isFuture = dateStr > (today.toISOString().slice(0, 10));

              return (
                <button
                  key={idx}
                  onClick={() => setSelected(isSelected ? null : dateStr)}
                  className={`
                    relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium
                    transition-all duration-150 touch-manipulation
                    ${colorClass || (isFuture ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10')}
                    ${isToday && !colorClass ? 'ring-2 ring-brand-red text-brand-red font-bold' : ''}
                    ${isSelected ? 'ring-2 ring-offset-1 ring-gray-400' : ''}
                  `}
                >
                  {cell.day}
                  {/* Dot indicators */}
                  {entryMap[dateStr]?.overtimeHours > 0 && !colorClass.includes('purple') && (
                    <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-purple-500" />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 px-1">
          {legend.map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Selected day detail */}
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
    </div>
  );
}
