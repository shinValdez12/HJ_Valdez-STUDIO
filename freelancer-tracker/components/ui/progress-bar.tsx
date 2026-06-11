'use client'

import { motion } from 'framer-motion'
import { type HTMLAttributes } from 'react'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  label?: string
}

export function ProgressBar({ value, label, className = '', ...props }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value))
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {label ? (
        <div className="flex items-center justify-between text-sm font-medium text-brand-700 dark:text-slate-200">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full bg-brand-100 dark:bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-blue-500"
        />
      </div>
    </div>
  )
}
