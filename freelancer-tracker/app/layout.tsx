import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Freelancer Project Tracker',
  description: 'Manage your projects professionally and share progress with clients',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-brand-50 text-brand-900 antialiased selection:bg-brand-300 selection:text-brand-950 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  )
}
