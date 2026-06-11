import Link from 'next/link'
import AppShell from '@/components/shared/app-shell'
import PageTransition from '@/components/shared/page-transition'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'
import { getCurrentUser } from '@/lib/auth'
import { getFreelancerWithProjects } from '@/lib/db/queries'
import type { FreelancerWithProjects } from '@/lib/types'
import { formatDate, calculatePercentage } from '@/lib/utils/helpers'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const data = user?.freelancerId ? await getFreelancerWithProjects(user.freelancerId) : null
  const projects = data?.projects ?? []

  const upcomingTasks = projects.flatMap((project) => project.tasks ?? []).filter((task) => task.due_date)
  const totalTasks = projects.flatMap((project) => project.tasks ?? []).length
  const completedTasks = projects.flatMap((project) => project.tasks ?? []).filter((task) => task.status === 'COMPLETED').length
  const averageCompletion = projects.length ? Math.round(projects.reduce((sum, project) => sum + (project.completion_percentage ?? 0), 0) / projects.length) : 0
  const sortedProjects = [...projects].sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
  const activeProjects = projects.filter((project) => project.status !== 'COMPLETED')

  return (
    <AppShell title="Dashboard" description="Monitor project health, track progress, and stay ahead of deadlines.">
      <PageTransition className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Active projects</p>
            <p className="mt-4 text-4xl font-semibold text-brand-900 dark:text-slate-100">{activeProjects.length}</p>
            <p className="mt-3 text-sm text-brand-600 dark:text-slate-300">Projects currently in progress or planning.</p>
          </div>
          <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Average completion</p>
            <p className="mt-4 text-4xl font-semibold text-brand-900 dark:text-slate-100">{averageCompletion}%</p>
            <p className="mt-3 text-sm text-brand-600 dark:text-slate-300">Across all current projects.</p>
          </div>
          <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Task completion</p>
            <p className="mt-4 text-4xl font-semibold text-brand-900 dark:text-slate-100">{totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
            <p className="mt-3 text-sm text-brand-600 dark:text-slate-300">{completedTasks} of {totalTasks} tasks completed.</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Active projects</p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-900 dark:text-slate-100">Project snapshots</h2>
              </div>
              <Link href="/projects" className="text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-slate-200 dark:hover:text-white">
                View all
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {sortedProjects.length ? (
                sortedProjects.slice(0, 4).map((project) => (
                  <div key={project.id} className="rounded-3xl border border-brand-200 bg-brand-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-brand-900 dark:text-slate-100">{project.name}</p>
                        <p className="mt-1 text-sm text-brand-600 dark:text-slate-300">{project.clients?.[0]?.company ?? 'Private client'}</p>
                      </div>
                      <Badge variant={project.status === 'COMPLETED' ? 'success' : project.status === 'ACTIVE' ? 'warning' : 'neutral'}>{project.status.replace('_', ' ')}</Badge>
                    </div>
                    <div className="mt-4">
                      <ProgressBar value={project.completion_percentage ?? 0} label="Progress" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
                  No projects available yet. Create your first project to start tracking progress.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Upcoming work</p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-900 dark:text-slate-100">Tasks due soon</h2>
              <div className="mt-6 space-y-4">
                {upcomingTasks.length ? (
                  upcomingTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="rounded-3xl border border-brand-200 bg-brand-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                      <p className="font-semibold text-brand-900 dark:text-slate-100">{task.title}</p>
                      <p className="mt-1 text-sm text-brand-600 dark:text-slate-300">Due {formatDate(new Date(task.due_date!), 'long')}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-brand-600 dark:text-slate-300">No upcoming deadlines in your active projects.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Project health</p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-900 dark:text-slate-100">Insights at a glance</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-brand-50 p-4 dark:bg-slate-950/60">
                  <p className="text-sm text-brand-600 dark:text-slate-300">Project completion average</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-900 dark:text-slate-100">{averageCompletion}%</p>
                </div>
                <div className="rounded-3xl bg-brand-50 p-4 dark:bg-slate-950/60">
                  <p className="text-sm text-brand-600 dark:text-slate-300">Total tasks</p>
                  <p className="mt-2 text-2xl font-semibold text-brand-900 dark:text-slate-100">{totalTasks}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </AppShell>
  )
}
