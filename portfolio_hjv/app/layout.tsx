import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: 'HJ Valdez | Developer & Digital Artist',
  description: 'Portfolio of Hashim Jahara Valdez (Shin) - A Developer & Digital Artist crafting immersive digital experiences at the intersection of code and art.',
  keywords: ['developer', 'digital artist', 'web development', 'portfolio', 'React', 'Next.js', 'TypeScript', 'UI/UX', 'creative developer'],
  authors: [{ name: 'Hashim Jahara Valdez' }],
  creator: 'Hashim Jahara Valdez',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hjvaldez.dev',
    title: 'HJ Valdez | Developer & Digital Artist',
    description: 'Crafting immersive digital experiences at the intersection of code and art.',
    siteName: 'HJ Valdez Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HJ Valdez | Developer & Digital Artist',
    description: 'Crafting immersive digital experiences at the intersection of code and art.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: 'favicon.ico',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'favicon.ico',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'favicon.ico',
        type: 'image/x-icon',
      },
    ],
    apple: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
