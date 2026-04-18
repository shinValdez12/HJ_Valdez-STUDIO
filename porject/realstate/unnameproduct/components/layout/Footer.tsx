import Link from 'next/link'
import { Home, Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'

const propertyLinks = [
  { label: 'Homes for Sale', href: '/properties?status=For+Sale' },
  { label: 'For Rent', href: '/properties?status=For+Rent' },
  { label: 'Featured Listings', href: '/properties?featured=true' },
  { label: 'New Listings', href: '/properties?sort=newest' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Team', href: '/about#team' },
  { label: 'Testimonials', href: '/about#testimonials' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-5" aria-label="Haven Realty Home">
              <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center">
                <Home className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-serif text-xl font-bold text-white">Haven.</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Connecting discerning clients with exceptional properties across Los Angeles and beyond.
              Premium real estate, personal service.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Twitter, label: 'Twitter / X', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Properties</h3>
            <ul className="space-y-3" role="list">
              {propertyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Company</h3>
            <ul className="space-y-3" role="list">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-4" role="list">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                <address className="text-white/60 text-sm not-italic leading-relaxed">
                  450 North Rodeo Drive<br />
                  Beverly Hills, CA 90210
                </address>
              </li>
              <li>
                <a href="tel:+13105550100" className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                  +1 (310) 555-0100
                </a>
              </li>
              <li>
                <a href="mailto:hello@havenrealty.com" className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                  hello@havenrealty.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Haven Realty. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-white/40 text-xs hover:text-white/70 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
