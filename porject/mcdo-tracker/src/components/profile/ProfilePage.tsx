import React, { useState, useEffect } from 'react';
import { User, Moon, Sun, Trash2, Download, Upload, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Input, Select } from '../ui/FormElements';
import { generateId, exportData, importData, clearAllData } from '../../services/storage';
import { PAYROLL_RATES, EmployeeRole } from '../../types';

export default function ProfilePage() {
  const { profile, setProfile, settings, updateSettings, isDark, toggleTheme } = useApp();

  const [form, setForm] = useState({
    name: profile?.name || '',
    role: (profile?.role || 'crew') as EmployeeRole,
    employeeId: profile?.employeeId || '',
    storeNumber: profile?.storeNumber || '',
    startDate: profile?.startDate || new Date().toISOString().slice(0, 10),
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        role: profile.role,
        employeeId: profile.employeeId,
        storeNumber: profile.storeNumber || '',
        startDate: profile.startDate,
      });
    }
  }, [profile]);

  const handleSave = () => {
    const p = {
      id: profile?.id || generateId(),
      name: form.name,
      role: form.role,
      employeeId: form.employeeId,
      storeNumber: form.storeNumber,
      startDate: form.startDate,
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcd-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const json = ev.target?.result as string;
        if (importData(json)) {
          window.location.reload();
        } else {
          alert('Failed to import data. Invalid format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Delete ALL data? This cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  const roleName = PAYROLL_RATES[form.role].role;
  const hourlyRate = PAYROLL_RATES[form.role].hourlyRate;

  return (
    <div className="flex flex-col gap-0 pb-4">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Employee settings & data</p>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {/* Avatar/summary card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-yellow to-brand-yellow-dark p-5">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20" />
          <div className="flex items-center gap-4 relative">
            <div className="w-16 h-16 rounded-3xl bg-white/30 flex items-center justify-center">
              <User size={28} className="text-gray-800" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{profile?.name || 'No name set'}</p>
              <p className="text-gray-700 text-sm font-medium">{roleName}</p>
              <p className="text-gray-700 text-xs">₱{hourlyRate}/hr · ID: {profile?.employeeId || '—'}</p>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Employee Information</h3>
          <div className="flex flex-col gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Maria Santos"
            />
            <Select
              label="Role"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as EmployeeRole }))}
              options={[
                { value: 'crew', label: `Crew — ₱${PAYROLL_RATES.crew.hourlyRate}/hr` },
                { value: 'crew_trainer', label: `Crew Trainer — ₱${PAYROLL_RATES.crew_trainer.hourlyRate}/hr` },
              ]}
            />
            <Input
              label="Employee ID"
              value={form.employeeId}
              onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
              placeholder="Your employee number"
            />
            <Input
              label="Store Number (optional)"
              value={form.storeNumber}
              onChange={e => setForm(f => ({ ...f, storeNumber: e.target.value }))}
              placeholder="e.g. 1234"
            />
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            />

            <Button
              fullWidth
              size="lg"
              onClick={handleSave}
              disabled={!form.name || !form.employeeId}
              variant={saved ? 'secondary' : 'primary'}
            >
              {saved ? '✓ Saved!' : 'Save Profile'}
            </Button>
          </div>
        </Card>

        {/* Pay rates info */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-brand-red" />
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Pay Rates</h3>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between py-1 border-b border-surface-border dark:border-surface-border-dark">
              <span className="text-gray-500">Crew Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">₱75.00/hr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-border dark:border-surface-border-dark">
              <span className="text-gray-500">Crew Trainer Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">₱77.00/hr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-border dark:border-surface-border-dark">
              <span className="text-gray-500">Overtime Rate</span>
              <span className="font-semibold text-purple-600">125% · after 8hrs</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-border dark:border-surface-border-dark">
              <span className="text-gray-500">Night Differential</span>
              <span className="font-semibold text-blue-600">+10% · 10PM–6AM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-border dark:border-surface-border-dark">
              <span className="text-gray-500">Special Holiday</span>
              <span className="font-semibold text-amber-600">+30%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Regular Holiday</span>
              <span className="font-semibold text-yellow-600">Double Pay (200%)</span>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Appearance</h3>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full py-2"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={18} className="text-brand-red" /> : <Sun size={18} className="text-brand-red" />}
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${isDark ? 'bg-brand-red' : 'bg-gray-300'} relative`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </Card>

        {/* Data Management */}
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Data</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-between w-full py-2.5 px-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download size={18} className="text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Export Data</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button
              onClick={handleImport}
              className="flex items-center justify-between w-full py-2.5 px-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Upload size={18} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Import Data</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button
              onClick={handleClearData}
              className="flex items-center justify-between w-full py-2.5 px-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-red-500" />
                <span className="text-sm font-medium text-red-500">Clear All Data</span>
              </div>
              <ChevronRight size={16} className="text-red-400" />
            </button>
          </div>
        </Card>

        {/* App info */}
        <div className="text-center py-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">McD Time Tracker v1.0.0</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Data stored locally on your device</p>
        </div>
      </div>
    </div>
  );
}
