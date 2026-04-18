import { Search, Key, TrendingUp, Users, Shield, Star } from 'lucide-react'
import SectionWrapper from '@/components/shared/SectionWrapper'
import SectionHeading from '@/components/shared/SectionHeading'
import FadeIn from '@/components/shared/FadeIn'

const services = [
  {
    icon: Search,
    title: 'Smart Property Search',
    description:
      'Access thousands of listings with advanced filters for location, price, type, and amenities. Find exactly what you need, fast.',
  },
  {
    icon: Key,
    title: 'Seamless Buying & Selling',
    description:
      'From first consultation to closing, our agents guide you through every step with expertise, transparency, and care.',
  },
  {
    icon: TrendingUp,
    title: 'Investment Advisory',
    description:
      'Maximize your returns with data-driven market analysis, portfolio strategy, and off-market opportunities curated for investors.',
  },
  {
    icon: Users,
    title: 'Dedicated Agent Support',
    description:
      'Every client is paired with a dedicated agent who provides personalized attention and 24/7 responsiveness throughout your journey.',
  },
  {
    icon: Shield,
    title: 'Trusted & Transparent',
    description:
      'We operate with complete honesty and integrity. No surprises, no hidden fees — just clear guidance and your best interests first.',
  },
  {
    icon: Star,
    title: 'Premium Marketing',
    description:
      'Your property is showcased with cinematic photography, 3D tours, and targeted digital campaigns that attract qualified buyers.',
  },
]

export default function ServicesSection() {
  return (
    <SectionWrapper className="bg-secondary">
      <SectionHeading
        eyebrow="Why Haven Realty"
        title="A Better Way to Buy, Sell & Invest"
        description="We combine deep local expertise with premium service to deliver an unmatched real estate experience."
        className="mb-16"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <FadeIn key={service.title} delay={i * 0.07}>
            <div className="bg-card rounded-xl p-7 border border-border hover:border-accent/30 hover:shadow-md transition-all group h-full">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <service.icon className="w-5 h-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground mb-2.5">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  )
}
