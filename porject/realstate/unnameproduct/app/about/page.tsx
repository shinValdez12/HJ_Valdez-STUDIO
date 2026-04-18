import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionWrapper from '@/components/shared/SectionWrapper'
import SectionHeading from '@/components/shared/SectionHeading'
import FadeIn from '@/components/shared/FadeIn'
import FAQSection from '@/components/shared/FAQSection'
import { teamMembers } from '@/data/team'
import { testimonials } from '@/data/testimonials'
import { faqs } from '@/data/faqs'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Haven Realty — our story, mission, and the team behind Los Angeles\'s most trusted real estate firm.',
}

const stats = [
  { value: '18+', label: 'Years of Excellence' },
  { value: '4,200+', label: 'Homes Sold' },
  { value: '$2.4B', label: 'In Transactions' },
  { value: '98%', label: 'Client Satisfaction' },
]

const values = [
  {
    title: 'Client First, Always',
    description: 'Every decision we make is guided by one principle: your best interests. We earn your trust by consistently putting your needs before our own.',
  },
  {
    title: 'Integrity & Transparency',
    description: 'We operate with complete honesty. No hidden fees, no pressure tactics, no surprises. You will always know exactly where you stand.',
  },
  {
    title: 'Deep Local Expertise',
    description: 'Our agents live and breathe Los Angeles real estate. We know every neighborhood, every market trend, and every opportunity before it goes public.',
  },
  {
    title: 'Excellence in Everything',
    description: 'From our property photography to our negotiation strategy, we bring the highest standards to every aspect of what we do.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-18">

        {/* Hero */}
        <div className="bg-foreground py-24 px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-white text-balance mb-6">
                Redefining Real Estate in Los Angeles
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-white/70 text-lg leading-relaxed">
                Haven Realty was founded on a simple belief: buying or selling a home should be an exceptional experience — not a stressful one. For over 18 years, we have been turning that belief into reality for thousands of clients.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Stats */}
        <SectionWrapper className="bg-secondary border-b border-border" as="div">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="text-center">
                  <p className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </SectionWrapper>

        {/* Mission & Vision */}
        <SectionWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                  Exceptional Homes, Exceptional Service
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Haven Realty was born from a frustration with an industry that too often treated clients as transactions. Our founder, Eleanor Hayes, set out to build something different — a firm where every client receives the same dedication and care regardless of budget.
                  </p>
                  <p>
                    Today, with a team of seasoned professionals and a track record that speaks for itself, we remain committed to that founding vision. We are not in the business of selling homes — we are in the business of changing lives.
                  </p>
                  <p>
                    Our mission is to make every real estate journey seamless, informed, and truly personal. We measure our success not by the number of transactions we close, but by the satisfaction of every client we serve.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1} direction="left">
              <div className="grid grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <div key={v.title} className="bg-card rounded-xl p-5 border border-border">
                    <h3 className="font-semibold text-foreground mb-2 text-sm leading-tight">{v.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </SectionWrapper>

        {/* Team */}
        <SectionWrapper id="team" className="bg-secondary">
          <SectionHeading
            eyebrow="The People Behind Haven"
            title="Meet Our Team"
            description="Our agents are some of the most knowledgeable and respected professionals in Los Angeles real estate."
            className="mb-14"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <FadeIn key={member.id} delay={i * 0.07}>
                <div className="bg-card rounded-xl border border-border overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-serif text-lg font-bold text-foreground mb-0.5">{member.name}</p>
                    <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </SectionWrapper>

        {/* Testimonials */}
        <SectionWrapper id="testimonials">
          <SectionHeading
            eyebrow="Client Stories"
            title="What Our Clients Say"
            description="Don&apos;t just take our word for it. Here are real stories from clients who found their dream homes with Haven Realty."
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.07}>
                <div className="bg-card rounded-xl border border-border p-6 flex flex-col gap-5 h-full">
                  <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < t.rating ? 'fill-accent text-accent' : 'text-border'}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="text-foreground text-sm leading-relaxed flex-1">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </SectionWrapper>

        {/* FAQ */}
        <SectionWrapper className="bg-secondary">
          <SectionHeading
            eyebrow="FAQ"
            title="Common Questions"
            className="mb-12"
          />
          <FAQSection faqs={faqs} limit={6} />
        </SectionWrapper>

        {/* CTA */}
        <SectionWrapper>
          <FadeIn>
            <div className="bg-foreground rounded-2xl px-8 md:px-16 py-16 text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white text-balance mb-4 max-w-xl mx-auto">
                Ready to Work with the Best?
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                Let&apos;s start your real estate journey together. Our team is ready to help you find, buy, or sell your next home.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3.5 rounded-md bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Get in Touch Today
              </Link>
            </div>
          </FadeIn>
        </SectionWrapper>

      </main>
      <Footer />
    </>
  )
}
