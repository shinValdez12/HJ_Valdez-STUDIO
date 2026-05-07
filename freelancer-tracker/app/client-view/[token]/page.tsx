import { notFound } from 'next/navigation'

interface ClientViewPageProps {
  params: {
    token: string
  }
}

export default function ClientViewPage({ params }: ClientViewPageProps) {
  const { token } = params

  if (!token) {
    notFound()
  }

  return (
    <main className="page-container page-content">
      <section className="card p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Client View</p>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">Shared project status</h1>
        <p className="mt-4 text-sm text-brand-600 max-w-2xl">
          This page will render a token-based client summary for the requested project.
        </p>

        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <p className="text-sm text-brand-700">
            Viewing token: <span className="font-mono text-brand-900">{token}</span>
          </p>
          <p className="mt-3 text-sm text-brand-600">
            When the client view system is implemented, this page will show project progress, task status, and presentation-ready updates.
          </p>
        </div>
      </section>
    </main>
  )
}
