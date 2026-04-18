import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { featuredProperties } from '@/data/properties'
import PropertyCard from '@/components/properties/PropertyCard'
import SectionWrapper from '@/components/shared/SectionWrapper'
import SectionHeading from '@/components/shared/SectionHeading'
import FadeIn from '@/components/shared/FadeIn'

export default function FeaturedProperties() {
  return (
    <SectionWrapper>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <SectionHeading
          eyebrow="Curated for You"
          title="Featured Properties"
          description="Hand-selected listings that represent the finest homes on the market right now."
          align="left"
        />
        <FadeIn direction="left" className="flex-shrink-0">
          <Link
            href="/properties"
            className="flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all group"
          >
            View All Properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProperties.slice(0, 3).map((property, i) => (
          <FadeIn key={property.id} delay={i * 0.08}>
            <PropertyCard property={property} />
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  )
}
