import Link from 'next/link'

export default function ProjectsPage() {
  return (
    <main className="page-container page-content">
      <div className="space-y-6">
        <section className="card p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Projects</p>
              <h1 className="mt-2 text-3xl font-semibold text-brand-900">Project list</h1>
              <p className="mt-2 max-w-2xl text-sm text-brand-600">
                Your active projects will appear here once project CRUD is implemented.
              </p>
            </div>
            <Link href="/dashboard" className="btn-secondary">
              Back to dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Empty state</h2>
            <p className="mt-2 text-sm text-brand-600">
              No projects yet. You can create a new project from the dashboard once the feature is ready.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Next step</h2>
            <p className="mt-2 text-sm text-brand-600">
              Add project CRUD logic in `features/projects` and connect it to this route.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
