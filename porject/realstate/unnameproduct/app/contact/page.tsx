import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionWrapper from '@/components/shared/SectionWrapper'
import SectionHeading from '@/components/shared/SectionHeading'
import FadeIn from '@/components/shared/FadeIn'
import InquiryForm from '@/components/shared/InquiryForm'
import FAQSection from '@/components/shared/FAQSection'
import { faqs } from '@/data/faqs'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Haven Realty. Our team of expert agents is ready to help you buy, sell, or rent your next property.',
}

const contactInfo = [
  {
    icon: MapPin,
    label: 'Office Address',
    value: '450 North Rodeo Drive, Beverly Hills, CA 90210',
    link: 'https://maps.google.com/?q=450+North+Rodeo+Drive+Beverly+Hills+CA',
    linkLabel: 'Get Directions',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (310) 555-0100',
    link: 'tel:+13105550100',
    linkLabel: 'Call Now',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@havenrealty.com',
    link: 'mailto:hello@havenrealty.com',
    linkLabel: 'Send Email',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon – Fri: 9:00 AM – 7:00 PM\nSat – Sun: 10:00 AM – 5:00 PM',
    link: null,
    linkLabel: null,
  },
]

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-18">

        {/* Header */}
        <div className="bg-foreground py-20 px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">Let&apos;s Talk</p>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white text-balance mb-5">
                We&apos;d Love to Hear From You
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-white/70 text-lg leading-relaxed">
                Whether you have a question, want to schedule a viewing, or are ready to get started — reach out and our team will respond within one business day.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Main Content */}
        <SectionWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <FadeIn>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                  <div className="space-y-5">
                    {contactInfo.map(({ icon: Icon, label, value, link, linkLabel }) => (
                      <div key={label} className="flex items-start gap-4 bg-card rounded-xl p-5 border border-border">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
                          <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{value}</p>
                          {link && (
                            <a
                              href={link}
                              className="text-accent text-xs font-medium mt-1.5 block hover:underline"
                              target={link.startsWith('http') ? '_blank' : undefined}
                              rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {linkLabel}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Map Placeholder */}
              <FadeIn delay={0.1}>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="h-52 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <div className="text-center px-6">
                      <MapPin className="w-10 h-10 text-accent mx-auto mb-3" aria-hidden="true" />
                      <p className="font-semibold text-foreground text-sm">450 North Rodeo Drive</p>
                      <p className="text-muted-foreground text-xs">Beverly Hills, CA 90210</p>
                      <a
                        href="https://maps.google.com/?q=450+North+Rodeo+Drive+Beverly+Hills+CA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-xs text-accent font-medium hover:underline"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Form */}
            <FadeIn delay={0.08} direction="left" className="lg:col-span-3">
              <div className="bg-card rounded-xl border border-border p-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground text-sm mb-7">
                  Fill out the form below and one of our agents will be in touch with you shortly.
                </p>
                <InquiryForm />
              </div>
            </FadeIn>
          </div>
        </SectionWrapper>

        {/* FAQ */}
        <SectionWrapper className="bg-secondary">
          <SectionHeading
            eyebrow="Support"
            title="Frequently Asked Questions"
            description="Find quick answers to the most common questions we receive."
            className="mb-12"
          />
          <FAQSection faqs={faqs} />
        </SectionWrapper>

      </main>
      <Footer />
    </>
  )
}
