'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDuration } from '@/lib/utils/helpers'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    status: string
    due_date?: string | null
    estimate?: number | null
    time_spent?: number | null
    is_blocked?: boolean | null
    blocked_reason?: string | null
  }
}

const statusMap: Record<string, { label: string; variant: string }> = {
  BACKLOG: { label: 'Backlog', variant: 'neutral' },
  TODO: { label: 'To do', variant: 'info' },
  IN_PROGRESS: { label: 'In progress', variant: 'warning' },
  REVIEW: { label: 'Review', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
}

export default function TaskCard({ task }: TaskCardProps) {
  const status = statusMap[task.status] || { label: task.status, variant: 'neutral' }
  const dueDate = task.due_date ? formatDate(new Date(task.due_date), 'long') : 'No due date'
  const duration = formatDuration(task.time_spent || 0)

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group rounded-3xl border border-brand-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-brand-900 dark:text-slate-100">{task.title}</h3>
          <p className="mt-2 text-sm text-brand-600 dark:text-slate-300">{task.description || 'No task description available.'}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-700 dark:bg-slate-800 dark:text-slate-200">
          <span className="font-semibold">Due</span>
          <p>{dueDate}</p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-700 dark:bg-slate-800 dark:text-slate-200">
          <span className="font-semibold">Tracked</span>
          <p>{duration}</p>
        </div>
      </div>
      {task.is_blocked && task.blocked_reason ? (
        <div className="mt-4 rounded-2xl border border-danger/20 bg-red-50 p-3 text-sm text-danger dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-semibold">Blocked</p>
          <p>{task.blocked_reason}</p>
        </div>
      ) : null}
    </motion.article>
  )
}
