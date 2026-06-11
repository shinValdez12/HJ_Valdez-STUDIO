import React from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-2xl border text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5',
          'border-surface-border dark:border-surface-border-dark',
          'focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red',
          'placeholder:text-gray-400 dark:placeholder:text-gray-600',
          'text-base transition-all duration-200',
          error && 'border-red-400 focus:ring-red-300',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full px-4 py-3 rounded-2xl border text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5',
          'border-surface-border dark:border-surface-border-dark',
          'focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red',
          'text-base transition-all duration-200 appearance-none',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
