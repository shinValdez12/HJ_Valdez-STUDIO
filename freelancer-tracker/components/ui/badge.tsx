import { type ReactNode } from 'react'

const variantStyles: Record<string, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  neutral: 'bg-brand-100 text-brand-700 dark:bg-slate-800 dark:text-slate-200',
}

export interface BadgeProps {
  variant?: keyof typeof variantStyles
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
