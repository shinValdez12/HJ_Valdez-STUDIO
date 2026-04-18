import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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

export const metadata: Metadata = {
  title: { default: 'Haven Realty — Find Your Perfect Home', template: '%s | Haven Realty' },
  description:
    'Discover exceptional properties with Haven Realty. Browse luxury homes, apartments, villas, and more across the most desirable locations.',
  keywords: ['real estate', 'homes for sale', 'luxury properties', 'buy home', 'rent apartment'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://havenrealty.com',
    siteName: 'Haven Realty',
    title: 'Haven Realty — Find Your Perfect Home',
    description: 'Discover exceptional properties with Haven Realty.',
  },
}

export const viewport: Viewport = {
  themeColor: '#f5efe3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

