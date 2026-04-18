import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { CustomCursor } from '@/components/cursor'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Shin — Creative Developer',
    template: '%s | Shin',
  },
  description: 'Creative Developer & UI Designer crafting immersive digital experiences at the intersection of design and code.',
  keywords: ['Creative Developer', 'Frontend Engineer', 'UI Designer', 'Portfolio', 'Next.js', 'React'],
  authors: [{ name: 'Shin' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alexmorgan.dev',
    siteName: 'Shin Portfolio',
    title: 'Shin — Creative Developer',
    description: 'Creative Developer & UI Designer crafting immersive digital experiences.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shin — Creative Developer',
    description: 'Creative Developer & UI Designer crafting immersive digital experiences.',
    creator: '@alexmorgan',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f6f3' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0d13' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CustomCursor />
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
