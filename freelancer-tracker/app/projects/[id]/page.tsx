import { notFound } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/shared/app-shell'

export const dynamic = 'force-dynamic'
import PageTransition from '@/components/shared/page-transition'
import TaskCard from '@/components/shared/task-card'
import TaskCreatePanel from '@/components/shared/task-create-panel'
import ActivityFeed from '@/components/shared/activity-feed'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'
import { getProjectById } from '@/lib/db/queries'
import { formatDate, centsToUSD, calculatePercentage } from '@/lib/utils/helpers'

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  const tasks = project.tasks || []
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length
  const totalTasks = tasks.length
  const completion = project.completion_percentage ?? calculatePercentage(completedTasks, totalTasks)
  const dueDate = project.due_date ? formatDate(new Date(project.due_date), 'long') : 'No deadline'

  const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
    PLANNING: { label: 'Planning', variant: 'info' },
    ACTIVE: { label: 'Active', variant: 'warning' },
    ON_HOLD: { label: 'On hold', variant: 'danger' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    ARCHIVED: { label: 'Archived', variant: 'neutral' },
  }

  const projectStatus = statusMap[project.status] || { label: project.status, variant: 'neutral' }
  const scopeItems = project.scope_items || []
  const projectClientName = (project.clients as any)?.users?.[0]?.name || (project.clients as any)?.company || 'Client'
  const projectOwnerName = (project.freelancers as any)?.users?.[0]?.name || 'Freelancer'

  return (
    <AppShell title="Project details" description="View status, tasks and activity for this project.">
      <PageTransition className="space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Project overview</p>
                  <h2 className="mt-3 text-3xl font-semibold text-brand-900 dark:text-slate-100">{project.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-600 dark:text-slate-300">{project.description || 'No description provided for this project yet.'}</p>
                </div>
                <Badge variant={projectStatus.variant}>{projectStatus.label}</Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-500 dark:text-slate-400">Client</p>
                  <p className="mt-2 text-sm font-semibold text-brand-900 dark:text-slate-100">{projectClientName}</p>
                </div>
                <div className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-500 dark:text-slate-400">Lead</p>
                  <p className="mt-2 text-sm font-semibold text-brand-900 dark:text-slate-100">{projectOwnerName}</p>
                </div>
                <div className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-500 dark:text-slate-400">Due date</p>
                  <p className="mt-2 text-sm font-semibold text-brand-900 dark:text-slate-100">{dueDate}</p>
                </div>
              </div>
              <div className="mt-6">
                <ProgressBar value={completion} label="Project completion" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-brand-900 dark:text-slate-100">Tasks</p>
                    <p className="mt-1 text-sm text-brand-600 dark:text-slate-300">{completedTasks} of {totalTasks} completed</p>
                  </div>
                  <Badge variant="info">{totalTasks} cards</Badge>
                </div>
                <div className="mt-6 space-y-4">
                  {tasks.length ? (
                    tasks.map((task) => <TaskCard key={task.id} task={task} />)
                  ) : (
                    <div className="rounded-3xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                      No tasks found for this project.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <TaskCreatePanel projectId={project.id} />

                <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-brand-900 dark:text-slate-100">Scope items</p>
                      <p className="mt-1 text-sm text-brand-600 dark:text-slate-300">Track scope changes and approvals.</p>
                    </div>
                    <Badge variant="neutral">{scopeItems.length}</Badge>
                  </div>
                  <div className="mt-5 space-y-3">
                    {scopeItems.length ? (
                      scopeItems.map((item) => (
                        <div key={item.id} className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-brand-900 dark:text-slate-100">{item.title}</p>
                            <Badge variant={item.status === 'IN_SCOPE' ? 'success' : item.status === 'UNDER_REVIEW' ? 'warning' : 'danger'}>{item.status.replace('_', ' ')}</Badge>
                          </div>
                          <p className="mt-3 text-sm text-brand-600 dark:text-slate-300">{item.description || 'No description provided.'}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-brand-600 dark:text-slate-300">No scope items have been added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Project stats</p>
                  <h3 className="mt-2 text-xl font-semibold text-brand-900 dark:text-slate-100">Status overview</h3>
                </div>
                <Badge variant="info">{project.status}</Badge>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-sm text-brand-600 dark:text-slate-300">Budget</p>
                  <p className="mt-2 text-lg font-semibold text-brand-900 dark:text-slate-100">{project.budget !== null ? centsToUSD(project.budget) : '—'}</p>
                </div>
                <div className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-sm text-brand-600 dark:text-slate-300">Last updated</p>
                  <p className="mt-2 text-lg font-semibold text-brand-900 dark:text-slate-100">{formatDate(new Date(project.updated_at), 'long')}</p>
                </div>
                <div className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-sm text-brand-600 dark:text-slate-300">Created</p>
                  <p className="mt-2 text-lg font-semibold text-brand-900 dark:text-slate-100">{formatDate(new Date(project.created_at), 'long')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Activity</p>
                  <h3 className="mt-2 text-xl font-semibold text-brand-900 dark:text-slate-100">Recent updates</h3>
                </div>
                <Link href="/projects" className="text-sm font-medium text-brand-600 hover:text-brand-800 dark:text-slate-300 dark:hover:text-white">
                  Back to projects
                </Link>
              </div>
              <div className="mt-6">
                <ActivityFeed logs={(project.activity_logs as any) || []} />
              </div>
            </div>
          </aside>
        </div>
      </PageTransition>
    </AppShell>
  )
}
