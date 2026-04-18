"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { LoadingScreen } from "@/components/loading-screen"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ScrollVelocityProjects } from "@/components/scroll-velocity-projects"
import { Footer } from "@/components/footer"
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/page-transition"
import { skills } from "@/lib/data"

const marqueeItems = [
  "React", "Next.js", "TypeScript", "Framer Motion", "Node.js", "Figma",
  "WebGL", "Tailwind CSS", "Supabase", "Design Systems", "Motion Design", "Creative Dev",
]

function MarqueeBand() {
  return (
    <div className="relative overflow-hidden border-y border-border py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="mx-6 flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {item}
            <span className="h-1 w-1 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function FeaturedServices() {
  const services = [
    {
      num: "01",
      title: "UI Engineering",
      desc: "From pixel-perfect interfaces to complex interactive systems — built with performance and accessibility at the core.",
    },
    {
      num: "02",
      title: "Motion Design",
      desc: "Cinematic animations and micro-interactions that breathe life into digital products without sacrificing performance.",
    },
    {
      num: "03",
      title: "Design Systems",
      desc: "Scalable token-based design systems that unify teams and accelerate product development across the entire stack.",
    },
    {
      num: "04",
      title: "Creative Development",
      desc: "Experimental web experiences, generative art, and creative coding that push what browsers can do.",
    },
  ]

  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionReveal>
          <div className="mb-16 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">What I Do</span>
            <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Services</h2>
          </div>
        </SectionReveal>

        <StaggerContainer className="grid grid-cols-1 gap-px border border-border md:grid-cols-2">
          {services.map(({ num, title, desc }) => (
            <StaggerItem key={num}>
              <motion.div
                className="group relative bg-background p-8 transition-colors hover:bg-surface"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <span className="mb-4 block font-mono text-xs text-muted-foreground/50">{num}</span>
                <h3 className="mb-3 font-serif text-xl font-medium text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                <ArrowUpRight
                  size={16}
                  className="absolute right-8 top-8 text-muted-foreground/30 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

function SkillsCloud() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionReveal>
          <div className="mb-16 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Toolkit</span>
            <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">Skills</h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map(({ category, items }, ci) => (
            <SectionReveal key={category} delay={ci * 0.08}>
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">{category}</span>
                <ul className="flex flex-col gap-2">
                  {items.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-px w-4 bg-border" />
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
  )
}

function CTASection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-12 text-center md:p-20">
            {/* BG accent */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/20 blur-[80px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Let&apos;s Work Together</span>
              <h2 className="max-w-2xl text-balance font-serif text-4xl font-bold text-foreground md:text-6xl">
                Have a project in mind?
              </h2>
              <p className="max-w-lg text-balance text-muted-foreground">
                I&apos;m currently available for select freelance projects and full-time opportunities.
              </p>
              <Link
                href="/contact"
                className="group mt-4 flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-all hover:bg-accent hover:text-accent-foreground"
              >
                Start a Conversation
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Navbar />
        <HeroSection />
        <MarqueeBand />
        <FeaturedServices />
        <ScrollVelocityProjects />
        <SkillsCloud />
        <CTASection />
        <Footer />
      </motion.main>
    </>
  )
}
