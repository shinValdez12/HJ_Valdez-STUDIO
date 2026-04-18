import Link from 'next/link'
import { Building2, Home, Hotel, Layers, TreePine, Warehouse } from 'lucide-react'
import SectionWrapper from '@/components/shared/SectionWrapper'
import SectionHeading from '@/components/shared/SectionHeading'
import FadeIn from '@/components/shared/FadeIn'

const categories = [
  {
    icon: Home,
    label: 'Houses',
    count: 6,
    href: '/properties?type=House',
    description: 'Single-family homes',
  },
  {
    icon: Building2,
    label: 'Apartments',
    count: 3,
    href: '/properties?type=Apartment',
    description: 'Urban living',
  },
  {
    icon: Hotel,
    label: 'Villas',
    count: 3,
    href: '/properties?type=Villa',
    description: 'Luxury estates',
  },
  {
    icon: Layers,
    label: 'Condos',
    count: 1,
    href: '/properties?type=Condo',
    description: 'Modern residences',
  },
  {
    icon: Warehouse,
    label: 'Townhouses',
    count: 2,
    href: '/properties?type=Townhouse',
    description: 'Multi-level living',
  },
  {
    icon: TreePine,
    label: 'Land',
    count: 0,
    href: '/properties?type=Land',
    description: 'Build your dream',
  },
]

export default function CategoriesSection() {
  return (
    <SectionWrapper>
      <SectionHeading
        eyebrow="Browse by Type"
        title="Explore Property Categories"
        description="Whether you are looking for a family home, a city apartment, or a luxury villa, we have options to match every lifestyle."
        className="mb-14"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <FadeIn key={cat.label} delay={i * 0.06}>
            <Link
              href={cat.href}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-md transition-all group text-center"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <cat.icon className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{cat.label}</p>
                <p className="text-muted-foreground text-xs">{cat.description}</p>
              </div>
              <span className="text-xs font-medium text-accent">{cat.count} listings</span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  )
}
