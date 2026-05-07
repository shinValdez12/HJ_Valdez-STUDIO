import Link from 'next/link'

export default function DashboardPage() {
  return (
    <main className="page-container page-content">
      <div className="space-y-6">
        <section className="card p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-brand-900">Welcome back</h1>
              <p className="mt-2 max-w-2xl text-sm text-brand-600">
                Track your projects, manage tasks, and share progress with clients.
              </p>
            </div>
            <Link href="/projects" className="btn-primary">
              View projects
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Project overview</h2>
            <p className="mt-2 text-sm text-brand-600">
              Your active projects and status updates will appear here.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Task progress</h2>
            <p className="mt-2 text-sm text-brand-600">
              Manage tasks, deadlines, and risk indicators from one place.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Client view</h2>
            <p className="mt-2 text-sm text-brand-600">
              Public progress pages for clients are generated with secure tokens.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
