'use client'

import { useActionState } from 'react'
import { createTask } from '@/app/actions/tasks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TaskCreatePanelProps {
  projectId: string
}

export default function TaskCreatePanel({ projectId }: TaskCreatePanelProps) {
  const [state, action] = useActionState(createTask, null)
  const isPending = state?.pending ?? false

  return (
    <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Quick add</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-900 dark:text-slate-100">Add a new task</h2>
        </div>
      </div>
      <form action={action} className="space-y-4" aria-live="polite">
        {state?.error ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200" role="alert">
            {state.error}
          </div>
        ) : null}
        {state?.success ? (
          <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-200" role="status">
            Task created successfully.
          </div>
        ) : null}
        <input type="hidden" name="projectId" value={projectId} />
        <Input label="Task title" name="title" placeholder="Write a brief task title" required />
        <Input label="Details" name="description" placeholder="Add a short description" />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Estimate (min)" name="estimate" type="number" placeholder="e.g. 60" min={0} />
          <Input label="Due date" name="dueDate" type="date" />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating task...' : 'Create task'}
        </Button>
      </form>
    </div>
  )
}
