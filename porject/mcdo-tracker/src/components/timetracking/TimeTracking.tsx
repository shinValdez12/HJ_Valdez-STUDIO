import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Input, Select } from '../ui/FormElements';
import { formatCurrency, calculateEntryPayroll, formatTime } from '../../utils/payroll';
import { formatDate, todayStr } from '../../utils/helpers';
import { generateId } from '../../services/storage';
import { TimeEntry, HolidayType, ShiftType, AttendanceStatus, EmployeeRole } from '../../types';

const HOLIDAY_OPTIONS = [
  { value: 'none', label: 'Regular Day' },
  { value: 'special', label: 'Special Holiday (+30%)' },
  { value: 'regular', label: 'Regular Holiday (Double Pay)' },
];

const SHIFT_OPTIONS = [
  { value: 'morning', label: 'Morning (6AM–2PM)' },
  { value: 'afternoon', label: 'Afternoon (2PM–10PM)' },
  { value: 'evening', label: 'Evening (4PM–12AM)' },
  { value: 'night', label: 'Night (10PM–6AM)' },
  { value: 'custom', label: 'Custom' },
];

const SHIFT_DEFAULTS: Record<string, { timeIn: string; timeOut: string }> = {
  morning: { timeIn: '06:00', timeOut: '14:00' },
  afternoon: { timeIn: '14:00', timeOut: '22:00' },
  evening: { timeIn: '16:00', timeOut: '00:00' },
  night: { timeIn: '22:00', timeOut: '06:00' },
  custom: { timeIn: '08:00', timeOut: '14:00' },
};

interface TimeTrackingProps {}

export default function TimeTracking(_: TimeTrackingProps) {
  const { profile, entries, addOrUpdateEntry, deleteEntry } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    date: todayStr(),
    timeIn: '08:00',
    timeOut: '14:00',
    shiftType: 'morning' as ShiftType,
    holidayType: 'none' as HolidayType,
    notes: '',
    status: 'present' as AttendanceStatus,
  });

  const openAdd = () => {
    setEditEntry(null);
    setForm({
      date: todayStr(),
      timeIn: '08:00',
      timeOut: '14:00',
      shiftType: 'morning',
      holidayType: 'none',
      notes: '',
      status: 'present',
    });
    setModalOpen(true);
  };

  const openEdit = (entry: TimeEntry) => {
    setEditEntry(entry);
    setForm({
      date: entry.date,
      timeIn: entry.timeIn,
      timeOut: entry.timeOut,
      shiftType: entry.shiftType,
      holidayType: entry.holidayType,
      notes: entry.notes || '',
      status: entry.status,
    });
    setModalOpen(true);
  };

  const handleShiftChange = (shiftType: ShiftType) => {
    const defaults = SHIFT_DEFAULTS[shiftType];
    setForm(f => ({ ...f, shiftType, ...defaults }));
  };

  const handleSave = () => {
    if (!profile) return;
    const calc = form.status === 'present'
      ? calculateEntryPayroll(profile.role as EmployeeRole, form.timeIn, form.timeOut, form.holidayType as HolidayType)
      : { hoursWorked: 0, regularHours: 0, overtimeHours: 0, nightDiffHours: 0, basicPay: 0, overtimePay: 0, holidayPay: 0, nightDiffPay: 0, totalPay: 0 };

    const entry: TimeEntry = {
      id: editEntry?.id || generateId(),
      date: form.date,
      timeIn: form.timeIn,
      timeOut: form.timeOut,
      shiftType: form.shiftType,
      holidayType: form.holidayType as HolidayType,
      notes: form.notes,
      status: form.status,
      ...calc,
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
    if (entry.status === 'absent') return 'bg-red-500';
    if (entry.holidayType === 'regular') return 'bg-yellow-500';
    if (entry.holidayType === 'special') return 'bg-amber-400';
    if (entry.overtimeHours > 0) return 'bg-purple-500';
    if (entry.nightDiffHours > 0) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getStatusLabel = (entry: TimeEntry) => {
    if (entry.status === 'absent') return { label: 'Absent', color: 'text-red-500 bg-red-50 dark:bg-red-950/40' };
    if (entry.holidayType === 'regular') return { label: 'Holiday', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40' };
    if (entry.holidayType === 'special') return { label: 'Sp. Holiday', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' };
    if (entry.overtimeHours > 0) return { label: 'OT', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' };
    if (entry.nightDiffHours > 0) return { label: 'Night', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' };
    return { label: 'Present', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' };
  };

  return (
    <div className="flex flex-col gap-0 pb-4">
      {/* Header */}
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
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(entry)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{formatDate(entry.date)}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.status === 'present'
                        ? `${formatTime(entry.timeIn)} – ${formatTime(entry.timeOut)} · ${entry.hoursWorked.toFixed(1)}h`
                        : 'Absent'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{formatCurrency(entry.totalPay)}</p>
                    {expanded ? <ChevronUp size={14} className="text-gray-400 ml-auto mt-0.5" /> : <ChevronDown size={14} className="text-gray-400 ml-auto mt-0.5" />}
                  </div>
                </div>

                {expanded && (
                  <div className="mt-3 pt-3 border-t border-surface-border dark:border-surface-border-dark animate-fade-in">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Regular</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.regularHours.toFixed(1)}h</p>
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
                        <span className="text-gray-500">Basic Pay</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(entry.basicPay)}</span>
                      </div>
                      {entry.overtimePay > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">OT Pay</span>
                          <span className="font-medium text-purple-600">{formatCurrency(entry.overtimePay)}</span>
                        </div>
                      )}
                      {entry.holidayPay > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Holiday Pay</span>
                          <span className="font-medium text-yellow-600">{formatCurrency(entry.holidayPay)}</span>
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

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editEntry ? 'Edit Entry' : 'New Entry'}>
        <div className="flex flex-col gap-4 pb-6">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            max={todayStr()}
          />

          <Select
            label="Status"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as AttendanceStatus }))}
            options={[
              { value: 'present', label: 'Present' },
              { value: 'absent', label: 'Absent' },
              { value: 'restday', label: 'Rest Day' },
            ]}
          />

          {form.status === 'present' && (
            <>
              <Select
                label="Shift"
                value={form.shiftType}
                onChange={e => handleShiftChange(e.target.value as ShiftType)}
                options={SHIFT_OPTIONS}
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

              <Select
                label="Holiday Type"
                value={form.holidayType}
                onChange={e => setForm(f => ({ ...f, holidayType: e.target.value as HolidayType }))}
                options={HOLIDAY_OPTIONS}
              />

              {/* Live calculation preview */}
              {profile && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20">
                  {(() => {
                    const calc = calculateEntryPayroll(profile.role as EmployeeRole, form.timeIn, form.timeOut, form.holidayType as HolidayType);
                    return (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Hours:</span>
                          <span className="font-semibold text-gray-900 dark:text-white ml-1">{calc.hoursWorked.toFixed(2)}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">OT:</span>
                          <span className="font-semibold text-purple-600 ml-1">{calc.overtimeHours.toFixed(2)}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Night Diff:</span>
                          <span className="font-semibold text-blue-600 ml-1">{calc.nightDiffHours.toFixed(2)}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-semibold">Total Pay:</span>
                          <span className="font-bold text-emerald-600 ml-1">{formatCurrency(calc.totalPay)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}

          <Input
            label="Notes (optional)"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Any notes about this shift…"
          />

          <Button fullWidth size="lg" onClick={handleSave} disabled={!profile}>
            {editEntry ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
