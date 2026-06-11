import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Input } from '../ui/FormElements';
import { formatCurrency, calculateEntryPayrollWithBaseShift, calculateHoursWorked, formatTime } from '../../utils/payroll';
import { formatDate, todayStr } from '../../utils/helpers';
import { generateId } from '../../services/storage';
import { TimeEntry, AttendanceStatus, EmployeeRole, HolidayType } from '../../types';

interface TimeTrackingProps {
  openOnAdd?: boolean;
  onOpenHandled?: () => void;
}

export default function TimeTracking({ openOnAdd, onOpenHandled }: TimeTrackingProps) {
  const { profile, entries, settings, addOrUpdateEntry, deleteEntry } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: todayStr(),
    timeIn: '08:00',
    timeOut: '14:00',
    notes: '',
    baseShiftHours: (settings.defaultShiftDuration || 6) as 5 | 6,
    holidayType: 'none' as HolidayType,
  });

  useEffect(() => {
    if (openOnAdd) {
      openAdd();
      onOpenHandled?.();
    }
  }, [openOnAdd, onOpenHandled]);

  const openAdd = () => {
    setEditEntry(null);
    setForm({
      date: todayStr(),
      timeIn: '08:00',
      timeOut: '14:00',
      notes: '',
      baseShiftHours: (settings.defaultShiftDuration || 6) as 5 | 6,
      holidayType: 'none',
    });
    setModalOpen(true);
  };

  const openEdit = (entry: TimeEntry) => {
    setEditEntry(entry);
    setForm({
      date: entry.date,
      timeIn: entry.timeIn,
      timeOut: entry.timeOut,
      notes: entry.notes || '',
      baseShiftHours: entry.baseShiftHours,
      holidayType: entry.holidayType,
    });
    setModalOpen(true);
  };

  const isTimeValid = form.timeIn && form.timeOut && form.timeIn !== form.timeOut;
  const timeError = !isTimeValid ? 'Please enter a valid time range' : null;
  const previewPayroll = profile && isTimeValid
    ? calculateEntryPayrollWithBaseShift(profile.role as EmployeeRole, form.timeIn, form.timeOut, form.baseShiftHours, form.holidayType)
    : {
      hoursWorked: 0,
      baseHours: 0,
      extendedHours: 0,
      overtimeHours: 0,
      nightDiffHours: 0,
      basePay: 0,
      extendedPay: 0,
      overtimePay: 0,
      holidayPremium: 0,
      nightDiffPay: 0,
      totalPay: 0,
    };

  const handleSave = () => {
    if (!profile) return;
    if (!isTimeValid) return;

    const payroll = calculateEntryPayrollWithBaseShift(profile.role as EmployeeRole, form.timeIn, form.timeOut, form.baseShiftHours, form.holidayType);

    const entry: TimeEntry = {
      id: editEntry?.id || generateId(),
      date: form.date,
      timeIn: form.timeIn,
      timeOut: form.timeOut,
      baseShiftHours: form.baseShiftHours,
      shiftType: 'custom',
      holidayType: form.holidayType,
      notes: form.notes,
      status: 'present',
      ...payroll,
      createdAt: editEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrUpdateEntry(entry);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this entry?')) {
      deleteEntry(id);
    }
  };

  const getStatusColor = (entry: TimeEntry) => {
    if (entry.holidayType === 'regular') return 'bg-yellow-500';
    if (entry.holidayType === 'special') return 'bg-amber-400';
    if (entry.overtimeHours > 0) return 'bg-purple-500';
    if (entry.nightDiffHours > 0) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getStatusLabel = (entry: TimeEntry) => {
    if (entry.holidayType === 'regular') return { label: 'Holiday', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40' };
    if (entry.holidayType === 'special') return { label: 'Sp. Holiday', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' };
    if (entry.overtimeHours > 0) return { label: 'OT', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' };
    if (entry.nightDiffHours > 0) return { label: 'Night', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' };
    return { label: 'Present', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' };
  };

  return (
    <div className="flex flex-col gap-0 pb-28">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Time Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{entries.length} entries total</p>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus size={16} /> Add Entry
        </Button>
      </div>

      {!profile && (
        <div className="mx-4 mb-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-sm">
          Set up your profile first to log entries correctly.
        </div>
      )}

      <div className="px-4 flex flex-col gap-2">
        {entries.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-8 gap-3 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Clock size={28} className="text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">No time entries yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tap "Add Entry" to log your first shift</p>
              </div>
              <Button onClick={openAdd}><Plus size={16} /> Add Entry</Button>
            </div>
          </Card>
        ) : (
          entries.map(entry => {
            const status = getStatusLabel(entry);
            const expanded = expandedId === entry.id;
            return (
              <Card key={entry.id} className="overflow-hidden">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpandedId(expanded ? null : entry.id)}>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(entry)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{formatDate(entry.date)}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.status === 'present' ? `${formatTime(entry.timeIn)} – ${formatTime(entry.timeOut)} · ${entry.hoursWorked.toFixed(1)}h` : 'Absent'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{formatCurrency(entry.totalPay)}</p>
                    {expanded ? <ChevronUp size={14} className="text-gray-400 ml-auto mt-0.5" /> : <ChevronDown size={14} className="text-gray-400 ml-auto mt-0.5" />}
                  </div>
                </div>

                {expanded && (
                  <div className="mt-3 pt-3 border-t border-surface-border dark:border-surface-border-dark animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Base</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.baseHours.toFixed(1)}h</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Extended</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.extendedHours.toFixed(1)}h</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-purple-50 dark:bg-purple-950/20">
                        <p className="text-[10px] text-purple-500">Overtime</p>
                        <p className="text-sm font-bold text-purple-700 dark:text-purple-400">{entry.overtimeHours.toFixed(1)}h</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20">
                        <p className="text-[10px] text-blue-500">Night Diff</p>
                        <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{entry.nightDiffHours.toFixed(1)}h</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Base Pay</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(entry.basePay)}</span>
                      </div>
                      {entry.extendedHours > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Extended Pay</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(entry.extendedPay)}</span>
                        </div>
                      )}
                      {entry.overtimePay > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">OT Pay</span>
                          <span className="font-medium text-purple-600">{formatCurrency(entry.overtimePay)}</span>
                        </div>
                      )}
                      {entry.holidayPremium > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Holiday Premium</span>
                          <span className="font-medium text-yellow-600">{formatCurrency(entry.holidayPremium)}</span>
                        </div>
                      )}
                      {entry.nightDiffPay > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Night Diff Pay</span>
                          <span className="font-medium text-blue-600">{formatCurrency(entry.nightDiffPay)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1 border-t border-surface-border dark:border-surface-border-dark font-semibold">
                        <span className="text-gray-700 dark:text-gray-300">Total</span>
                        <span className="text-gray-900 dark:text-white">{formatCurrency(entry.totalPay)}</span>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-3">"{entry.notes}"</p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(entry)} className="flex-1">
                        <Edit2 size={14} /> Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(entry.id)} className="flex-1">
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editEntry ? 'Edit Entry' : 'New Entry'}>
        <div className="flex flex-col gap-4 pb-6">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            max={todayStr()}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Time In"
              type="time"
              value={form.timeIn}
              onChange={e => setForm(f => ({ ...f, timeIn: e.target.value }))}
            />
            <Input
              label="Time Out"
              type="time"
              value={form.timeOut}
              onChange={e => setForm(f => ({ ...f, timeOut: e.target.value }))}
            />
          </div>

          {/* Base Shift Hours Selector */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">Base Shift Hours</label>
            <div className="flex gap-2">
              {[5, 6].map(hours => (
                <button
                  key={hours}
                  onClick={() => setForm(f => ({ ...f, baseShiftHours: hours as 5 | 6 }))}
                  className={`flex-1 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                    form.baseShiftHours === hours
                      ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-300 border border-transparent'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>

          {/* Holiday Type Selector */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">Holiday Type</label>
            <div className="flex flex-col gap-2">
              {[
                { value: 'none', label: 'Regular Day', multiplier: 'normal pay' },
                { value: 'special', label: 'Special Holiday', multiplier: '+30%' },
                { value: 'regular', label: 'Regular Holiday', multiplier: '×2x' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setForm(f => ({ ...f, holidayType: option.value as HolidayType }))}
                  className={`p-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                    form.holidayType === option.value
                      ? 'border-brand-red bg-brand-red/10 dark:bg-brand-red/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold ${form.holidayType === option.value ? 'text-brand-red' : 'text-gray-900 dark:text-white'}`}>
                      {option.label}
                    </p>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{option.multiplier}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Preview Card */}
          {isTimeValid && (
            <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 p-4 text-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Hours Breakdown</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded-xl bg-white/60 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{previewPayroll.hoursWorked.toFixed(2)}h</p>
                </div>
                <div className="p-2 rounded-xl bg-white/60 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Base</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{previewPayroll.baseHours.toFixed(2)}h</p>
                </div>
                <div className="p-2 rounded-xl bg-white/60 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Extended</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{previewPayroll.extendedHours.toFixed(2)}h</p>
                </div>
                <div className="p-2 rounded-xl bg-white/60 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">OT</p>
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{previewPayroll.overtimeHours.toFixed(2)}h</p>
                </div>
                {previewPayroll.nightDiffHours > 0 && (
                  <div className="p-2 rounded-xl bg-white/60 dark:bg-white/5 col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Night Differential</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{previewPayroll.nightDiffHours.toFixed(2)}h</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payroll Breakdown */}
          {isTimeValid && profile && (
            <div className="rounded-3xl bg-blue-50 dark:bg-blue-950/20 p-4 text-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payroll Breakdown</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Base Pay</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(previewPayroll.basePay)}</span>
                </div>
                {previewPayroll.extendedHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Extended Pay</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(previewPayroll.extendedPay)}</span>
                  </div>
                )}
                {previewPayroll.overtimeHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Overtime Pay</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(previewPayroll.overtimePay)}</span>
                  </div>
                )}
                {previewPayroll.holidayPremium > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Holiday Premium</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">{formatCurrency(previewPayroll.holidayPremium)}</span>
                  </div>
                )}
                {previewPayroll.nightDiffPay > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Night Diff Pay</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(previewPayroll.nightDiffPay)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-900">
                  <span className="font-bold text-gray-900 dark:text-white">Total Earnings</span>
                  <span className="font-bold text-lg text-brand-red">{formatCurrency(previewPayroll.totalPay)}</span>
                </div>
              </div>
            </div>
          )}

          <Input
            label="Notes (optional)"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Any notes about this shift…"
          />

          <Button fullWidth size="lg" onClick={handleSave} disabled={!profile || !isTimeValid}>
            {editEntry ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
