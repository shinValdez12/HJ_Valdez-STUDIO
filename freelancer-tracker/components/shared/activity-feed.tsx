import { formatDateTime } from '@/lib/utils/helpers'

interface ActivityLog {
  id: string
  type: string
  title: string
  description?: string
  created_at: string
  users: {
    name: string
  }
}

interface ActivityFeedProps {
  logs: ActivityLog[]
}

export default function ActivityFeed({ logs }: ActivityFeedProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-3xl border border-brand-200 bg-white p-6 text-sm text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No recent activity yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="rounded-3xl border border-brand-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brand-900 dark:text-slate-100">{log.title}</p>
              <p className="mt-1 text-sm text-brand-600 dark:text-slate-300">{log.description}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-500 dark:text-slate-400">{formatDateTime(new Date(log.created_at))}</p>
          </div>
          <p className="mt-4 text-sm text-brand-600 dark:text-slate-300">By {log.users?.name || 'Unknown'}</p>
        </div>
      ))}
    </div>
  )
}
