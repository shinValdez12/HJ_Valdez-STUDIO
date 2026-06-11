import Link from 'next/link'
import AppShell from '@/components/shared/app-shell'
import PageTransition from '@/components/shared/page-transition'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { getProjectsByFreelancer } from '@/lib/db/queries'
import type { ProjectSummary } from '@/lib/types'
import { formatDate } from '@/lib/utils/helpers'

export default async function ProjectsPage() {
  const user = await getCurrentUser()
  const projects = user?.freelancerId ? await getProjectsByFreelancer(user.freelancerId) : []

  const sortedProjects = [...projects].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))

  return (
    <AppShell title="Projects" description="Browse your active projects and access project details with one click.">
      <PageTransition className="space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Project list</p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-900 dark:text-slate-100">All active work</h2>
              </div>
              <Link href="/dashboard" className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200">
                Back to dashboard
              </Link>
            </div>
            <p className="mt-4 text-sm text-brand-600 dark:text-slate-300">Select a project to review tasks, timeline, and client-facing status updates.</p>
          </div>

          <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-brand-900 dark:text-slate-100">Tip</h3>
            <p className="mt-3 text-sm leading-6 text-brand-600 dark:text-slate-300">
              Use the project detail page to create new tasks and keep client summaries accurate.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          {sortedProjects.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {sortedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group rounded-3xl border border-brand-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold text-brand-900 dark:text-slate-100">{project.name}</p>
                      <p className="mt-2 text-sm text-brand-600 dark:text-slate-300">{project.description || 'No project description available.'}</p>
                    </div>
                    <Badge variant={project.status === 'COMPLETED' ? 'success' : project.status === 'ACTIVE' ? 'warning' : 'neutral'}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4 text-sm text-brand-600 dark:text-slate-300">
                    <div>{(project.clients as any)?.company || 'Client not assigned'}</div>
                    <div>{project.due_date ? formatDate(new Date(project.due_date), 'short') : 'No due date'}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-brand-200 bg-brand-50 p-8 text-center text-brand-600 shadow-sm dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
              <p className="text-lg font-semibold text-brand-900 dark:text-slate-100">No projects yet</p>
              <p className="mt-3 text-sm">Once you add a project, it will appear here along with deadlines and progress insight.</p>
            </div>
          )}
        </section>
      </PageTransition>
    </AppShell>
  )
}
