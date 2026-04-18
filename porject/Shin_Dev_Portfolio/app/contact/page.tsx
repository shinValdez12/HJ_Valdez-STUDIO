import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SectionReveal } from "@/components/page-transition"
import { ContactForm } from "./contact-form"
import { Mail, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to discuss your next project or just say hello.",
}

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="px-6 pb-16 pt-32 md:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <SectionReveal>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Get In Touch</span>
              <h1 className="max-w-2xl text-balance font-serif text-5xl font-bold text-foreground md:text-7xl">
                Let&apos;s build something&nbsp;
                <span className="italic text-accent">great</span>
              </h1>
              <p className="max-w-md text-balance leading-relaxed text-muted-foreground md:text-lg">
                I&apos;m currently available for freelance projects and open to full-time opportunities. Let&apos;s talk.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_400px]">
            {/* Form */}
            <SectionReveal>
              <ContactForm />
            </SectionReveal>

            {/* Info */}
            <SectionReveal delay={0.15}>
              <div className="flex flex-col gap-8 lg:pt-2">
                <div className="flex flex-col gap-6">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: "hashimjaharadvaldez@gmail.com",
                      href: "mailto:hashimjaharadvaldez@gmail.com",
                    },
                    {
                      icon: MapPin,
                      label: "Location",
                      value: "Based in Philippines",
                      href: null,
                    },
                    {
                      icon: Clock,
                      label: "Timezone",
                      value: "PST (UTC+8)",
                      href: null,
                    },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                        <Icon size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {label}
                        </span>
                        {href ? (
                          <a href={href} className="text-sm text-foreground hover:text-accent transition-colors">
                            {value}
                          </a>
                        ) : (
                          <span className="text-sm text-foreground">{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Availability */}
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">Available</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Currently open to freelance projects and full-time senior roles. I typically respond within 24 hours.
                  </p>
                </div>

                {/* Social */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Social</span>
                  {[
                    { label: "GitHub", href: "https://github.com" },
                    { label: "Twitter / X", href: "https://twitter.com" },
                    { label: "LinkedIn", href: "https://linkedin.com" },
                    { label: "Dribbble", href: "https://dribbble.com" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between border-b border-border py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                      <span className="font-mono text-xs text-muted-foreground/50">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
