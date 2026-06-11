'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [state, action] = useActionState(login, null)
  const isPending = state?.pending ?? false

  return (
    <div className="min-h-screen bg-brand-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-[2rem] border border-brand-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-600 dark:text-slate-400">Welcome back</p>
            <h1 className="mt-4 text-3xl font-semibold text-brand-900 dark:text-slate-100">Sign in to your account</h1>
            <p className="mt-3 text-sm text-brand-600 dark:text-slate-300">Enter your email and password to continue managing your projects.</p>
          </div>

          <form action={action} className="space-y-5">
            {state?.error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200" role="alert" aria-live="assertive">
                {state.error}
              </div>
            ) : null}

            <Input label="Email address" id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            <Input label="Password" id="password" name="password" type="password" autoComplete="current-password" required placeholder="Password" />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-600 dark:text-slate-400">
            New here?{' '}
            <Link href="/signup" className="font-semibold text-brand-700 hover:text-brand-900 dark:text-slate-200 dark:hover:text-white">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
