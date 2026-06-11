import { type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const inputId = props.id ?? (props.name ? String(props.name) : undefined)
  const describedBy = error && inputId ? `${inputId}-error` : undefined

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-brand-900 dark:text-slate-100">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-900 shadow-sm transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20 disabled:bg-brand-100 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
        {...props}
      />
      {error ? (
        <p id={describedBy} className="text-sm text-danger mt-1">
          {error}
        </p>
      ) : null}
    </div>
  )
}
