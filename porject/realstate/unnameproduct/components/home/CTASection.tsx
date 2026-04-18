import Link from 'next/link'
import SectionWrapper from '@/components/shared/SectionWrapper'
import FadeIn from '@/components/shared/FadeIn'

export default function CTASection() {
  return (
    <SectionWrapper>
      <FadeIn>
        <div className="bg-foreground rounded-2xl px-8 md:px-16 py-16 text-center relative overflow-hidden">
          {/* Decorative accent shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true" />

          <div className="relative z-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">
              Ready to Get Started?
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance mb-6 max-w-2xl mx-auto leading-tight">
              Let Us Help You Find Your Perfect Home
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Whether you are buying, selling, or investing — our team of expert agents is here to guide
              you every step of the way. No pressure, just expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
                className="px-8 py-3.5 rounded-md bg-accent text-white font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-md border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors text-sm"
              >
                Talk to an Agent
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  )
}
