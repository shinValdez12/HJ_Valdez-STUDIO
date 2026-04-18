'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Heart, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navBg = isHome
    ? scrolled
      ? 'bg-card/95 backdrop-blur-md border-b border-border shadow-sm'
      : 'bg-transparent'
    : 'bg-card/95 backdrop-blur-md border-b border-border'

  const textColor = isHome && !scrolled ? 'text-white' : 'text-foreground'
  const logoColor = isHome && !scrolled ? 'text-white' : 'text-foreground'
  const accentDot = isHome && !scrolled ? 'bg-white' : 'bg-accent'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        navBg,
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-18 flex items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Haven Realty Home">
          <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center flex-shrink-0">
            <Home className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className={cn('font-serif text-xl font-bold tracking-tight transition-colors', logoColor)}>
            Haven<span className={cn('text-accent', isHome && !scrolled && 'text-white/80')}>.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent relative py-1',
                  textColor,
                  pathname === link.href && 'text-accent',
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/favorites"
            aria-label="Saved properties"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent',
              textColor,
            )}
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only md:not-sr-only">Saved</span>
          </Link>
          <Link
            href="/contact"
            className="ml-2 px-5 py-2.5 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn('md:hidden p-2 rounded-md transition-colors', textColor)}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-1" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'block py-3 text-base font-medium border-b border-border/50 text-foreground hover:text-accent transition-colors',
                      pathname === link.href && 'text-accent',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3 flex flex-col gap-2">
                <Link
                  href="/favorites"
                  className="flex items-center gap-2 py-2.5 text-base font-medium text-foreground hover:text-accent transition-colors"
                >
                  <Heart className="w-4 h-4" aria-hidden="true" />
                  Saved Properties
                </Link>
                <Link
                  href="/contact"
                  className="w-full text-center px-5 py-3 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Get in Touch
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
