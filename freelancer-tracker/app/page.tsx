import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const user = await getCurrentUser()

  if (user) {
    if (user.role === 'FREELANCER') {
      redirect('/dashboard')
    } else {
      redirect('/client-view')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600 dark:text-slate-400">Freelancer SaaS</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-brand-900 dark:text-slate-100 sm:text-6xl">
                Professional project tracking built for freelancers and client-ready reporting.
              </h1>
              <p className="mt-6 text-lg leading-8 text-brand-600 dark:text-slate-300">
                Run your projects with confidence, keep your clients in the loop, and keep every deadline visible.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                Get started
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-brand-200 bg-white px-8 py-3 text-sm font-semibold text-brand-900 transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                Sign in
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Projects</p>
                <p className="mt-3 text-3xl font-semibold text-brand-900 dark:text-slate-100">Launch faster</p>
                <p className="mt-2 text-sm text-brand-600 dark:text-slate-300">Stay on top of every phase with clear progress tracking.</p>
              </div>
              <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Clients</p>
                <p className="mt-3 text-3xl font-semibold text-brand-900 dark:text-slate-100">Share status</p>
                <p className="mt-2 text-sm text-brand-600 dark:text-slate-300">Present clean client pages with token-based project summaries.</p>
              </div>
              <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Tasks</p>
                <p className="mt-3 text-3xl font-semibold text-brand-900 dark:text-slate-100">Move faster</p>
                <p className="mt-2 text-sm text-brand-600 dark:text-slate-300">Manage and prioritize work with responsive task cards.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-200 bg-white p-8 shadow-lg shadow-brand-200/50 dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-6">
              <div className="rounded-3xl bg-brand-50 p-5 dark:bg-slate-950/80">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Why freelancers choose us</p>
                <ul className="mt-6 space-y-4 text-sm text-brand-600 dark:text-slate-300">
                  <li>• Clean project status and task tracking in one place.</li>
                  <li>• Secure token-based client summaries.</li>
                  <li>• Fast, responsive workflows with modern UI polish.</li>
                </ul>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-brand-200 p-5 dark:border-slate-800">
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Build trust</p>
                  <p className="mt-2 text-lg font-semibold text-brand-900 dark:text-slate-100">Client-ready updates</p>
                </div>
                <div className="rounded-3xl border border-brand-200 p-5 dark:border-slate-800">
                  <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">Stay aligned</p>
                  <p className="mt-2 text-lg font-semibold text-brand-900 dark:text-slate-100">Track deadlines effortlessly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
