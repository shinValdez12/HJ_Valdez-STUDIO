import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/ui/progress-bar'

export const dynamic = 'force-dynamic'
import PageTransition from '@/components/shared/page-transition'
import { getValidAccessToken } from '@/lib/db/queries'
import { formatDate, centsToUSD } from '@/lib/utils/helpers'

const ClientViewPage = async (props: { params: Promise<{ token: string }> }) => {
  const params = await props.params
  const tokenData = await getValidAccessToken(params.token)

  if (!tokenData || !tokenData.clients || !tokenData.clients.projects?.length) {
    notFound()
  }

  const client = tokenData.clients
  const project = client.projects[0]
  type ClientTask = { id: string; title: string; status: string; due_date?: string | null }
  const tasks = (project.tasks ?? []) as ClientTask[]
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length
  const dueDate = project.due_date ? formatDate(new Date(project.due_date), 'long') : 'No deadline'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <PageTransition className="space-y-10">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Client view</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">{project.name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">A private, read-only view for your client that highlights progress, upcoming milestones, and completion status.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="info">Tasks allowed: {tokenData.can_view_tasks ? 'Yes' : 'No'}</Badge>
                <Badge variant="success">Timeline access: {tokenData.can_view_timeline ? 'Yes' : 'No'}</Badge>
                <Badge variant="neutral">Budget access: {tokenData.can_view_budget ? 'Yes' : 'No'}</Badge>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Client</p>
                <p className="mt-3 text-xl font-semibold text-white">{client.company}</p>
                <p className="mt-2 text-sm text-slate-400">Contact: {client.users?.[0]?.name || 'Unknown'}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Due date</p>
                <p className="mt-3 text-xl font-semibold text-white">{dueDate}</p>
                <p className="mt-2 text-sm text-slate-400">Budget: {project.budget !== null ? centsToUSD(project.budget) : 'TBD'}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Progress</p>
                <p className="mt-3 text-xl font-semibold text-white">{project.completion_percentage ?? 0}%</p>
                <div className="mt-4">
                  <ProgressBar value={project.completion_percentage ?? 0} />
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Project summary</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Status at a glance</h2>
                  </div>
                  <Badge variant="success">{completedTasks}/{tasks.length} complete</Badge>
                </div>
                <div className="mt-6 space-y-4 text-sm text-slate-300">
                  <p>{project.description || 'No project description available.'}</p>
                  <p>Tasks are presented in a clean, safe format so clients only see the current delivery status.</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Task delivery</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">Completed tasks</h3>
                  </div>
                  <Badge variant="success">{completedTasks} done</Badge>
                </div>
                <div className="mt-6 space-y-3">
                  {tasks.filter((task) => task.status === 'COMPLETED').slice(0, 5).map((task) => (
                    <div key={task.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-white">{task.title}</p>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{task.status.replace('_', ' ')}</span>
                      </div>
                      {task.due_date ? <p className="mt-2 text-sm text-slate-400">Due {formatDate(new Date(task.due_date), 'short')}</p> : null}
                    </div>
                  ))}
                  {!completedTasks ? <p className="text-sm text-slate-400">No tasks completed yet.</p> : null}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Client summary</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Client-safe presentation</h3>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <p>Your client can review project status while sensitive freelancer-only details remain hidden.</p>
                <p>If the token expires, access is denied automatically based on your settings.</p>
                <p>Current token is valid for viewing the linked project.</p>
              </div>
            </div>
          </section>
        </PageTransition>
      </div>
    </div>
  )
}

export default ClientViewPage
