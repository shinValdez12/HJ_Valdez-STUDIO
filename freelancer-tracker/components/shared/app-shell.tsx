import Link from 'next/link'
import { ReactNode } from 'react'
import SignOutButton from './sign-out-button'

interface AppShellProps {
  title: string
  description: string
  children: ReactNode
  breadcrumbs?: { label: string; href: string }[]
}

export default function AppShell({ title, description, children, breadcrumbs = [] }: AppShellProps) {
  return (
    <div className="min-h-screen bg-brand-50 dark:bg-slate-950">
      <div className="border-b border-brand-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-brand-900 dark:text-slate-100">
            Freelancer Tracker
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/dashboard" className="text-sm text-brand-700 hover:text-brand-900 dark:text-slate-300 dark:hover:text-white">
              Dashboard
            </Link>
            <Link href="/projects" className="text-sm text-brand-700 hover:text-brand-900 dark:text-slate-300 dark:hover:text-white">
              Projects
            </Link>
          </div>
          <SignOutButton />
        </div>
      </div>

      <main className="page-content py-10">
        <div className="space-y-6">
          <div className="rounded-3xl border border-brand-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600 dark:text-slate-400">{title}</p>
                <h1 className="mt-3 text-3xl font-semibold text-brand-900 dark:text-slate-100">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-600 dark:text-slate-300">{description}</p>
              </div>
              <div className="flex flex-wrap gap-3">{breadcrumbs.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm text-brand-700 hover:bg-brand-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {item.label}
                </Link>
              ))}</div>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
