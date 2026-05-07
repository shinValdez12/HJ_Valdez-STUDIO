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
    <html lang="en">
      <body className="bg-brand-50 text-brand-900">
        {children}
      </body>
    </html>
  )
}
