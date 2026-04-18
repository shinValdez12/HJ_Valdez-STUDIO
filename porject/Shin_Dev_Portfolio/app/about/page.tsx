import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/page-transition"
import { skills, experience } from "@/lib/data"
import { AboutTimeline } from "./about-timeline"

export const metadata: Metadata = {
  title: "About",
  description: "Creative Developer & UI Designer with 6+ years of experience crafting immersive digital experiences.",
}

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="px-6 pb-16 pt-32 md:px-8 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr]">
            <SectionReveal>
              <div className="flex flex-col gap-6">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">About</span>
                <h1 className="font-serif text-5xl font-bold leading-tight text-foreground md:text-7xl">
                  Crafting the web&apos;s most&nbsp;
                  <span className="italic text-accent">immersive</span>
                  &nbsp;experiences
                </h1>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.15}>
              <div className="flex flex-col justify-end gap-6 lg:pt-12">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  I&apos;m Shin — a Creative Developer and UI Designer based in San Francisco. I specialize in building interfaces that don&apos;t just look good, but feel extraordinary.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  My work lives at the intersection of design precision and engineering rigor. I&apos;ve shipped award-winning products for startups, scale-ups, and studios across four continents — always chasing that moment where a user says <em>&ldquo;wow.&rdquo;</em>
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  When I&apos;m not pushing pixels, I&apos;m writing generative art algorithms, contributing to open source, or mentoring the next generation of creative developers.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-y border-border bg-surface px-6 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3" staggerDelay={0.1}>
            {[
              {
                title: "Design is a system",
                body: "Great products aren&apos;t assembled from beautiful parts — they&apos;re grown from intentional systems. Every decision compounds.",
              },
              {
                title: "Motion is communication",
                body: "Animation isn&apos;t decoration. Done right, it&apos;s the clearest language a UI has — communicating state, hierarchy, and character.",
              },
              {
                title: "Performance is respect",
                body: "A beautiful interface that makes a user wait isn&apos;t beautiful. Speed is a feature, and one that shows you care about people&apos;s time.",
              },
            ].map(({ title, body }) => (
              <StaggerItem key={title}>
                <div className="flex flex-col gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <h3 className="font-serif text-lg font-medium text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionReveal>
            <div className="mb-16 flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Expertise</span>
              <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Skills</h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map(({ category, items }, ci) => (
              <SectionReveal key={category} delay={ci * 0.08}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-accent">{category}</span>
                  <ul className="flex flex-col gap-2.5">
                    {items.map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-border" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience timeline */}
      <section className="px-6 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionReveal>
            <div className="mb-16 flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Background</span>
              <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Experience</h2>
            </div>
          </SectionReveal>
          <AboutTimeline experience={experience} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
