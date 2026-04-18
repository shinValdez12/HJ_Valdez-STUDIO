import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import ServicesSection from '@/components/home/ServicesSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import StatsSection from '@/components/home/StatsSection'
import CTASection from '@/components/home/CTASection'
import FAQSection from '@/components/shared/FAQSection'
import SectionWrapper from '@/components/shared/SectionWrapper'
import SectionHeading from '@/components/shared/SectionHeading'
import { faqs } from '@/data/faqs'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturedProperties />
      <ServicesSection />
      <CategoriesSection />
      <StatsSection />
      <TestimonialsSection />
      <SectionWrapper>
        <SectionHeading
          eyebrow="Common Questions"
          title="Frequently Asked Questions"
          description="Everything you need to know about buying, selling, and renting with Haven Realty."
          className="mb-12"
        />
        <FAQSection faqs={faqs} limit={5} />
        <div className="text-center mt-8">
          <Link
            href="/contact"
            className="inline-flex items-center text-accent font-medium text-sm hover:underline"
          >
            Still have questions? Contact us
          </Link>
        </div>
      </SectionWrapper>
      <CTASection />
      <Footer />
    </main>
  )
}
