"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
}

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background pt-16"
      aria-label="Hero"
    >
      {/* Background grid + glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />

      {/* Subtle radial overlay to fade grid edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, var(--background) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Announcing Nexus 2.0 &mdash; Global Edge Functions
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight text-balance leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {siteConfig.tagline.split(" ").slice(0, 2).join(" ")}{" "}
            <span className="text-primary">
              {siteConfig.tagline.split(" ").slice(2).join(" ")}
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          >
            {siteConfig.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button size="lg" asChild className="gap-2 text-sm font-semibold">
              <Link href="#pricing">
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 text-sm font-semibold">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View on GitHub
              </Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.p
            variants={itemVariants}
            className="text-xs text-muted-foreground"
          >
            No credit card required &bull; Free plan available &bull; Deploy in 60 seconds
          </motion.p>
        </motion.div>

        {/* Hero terminal / dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mt-16 w-full"
        >
          <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20">
            {/* Window chrome */}
            <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/40 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" aria-hidden="true" />
              <span className="ml-4 text-xs text-muted-foreground font-mono">nexus deploy</span>
            </div>
            {/* Terminal body */}
            <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed text-left">
              <TerminalLine color="text-muted-foreground" delay={0.9}>$ nexus deploy --prod</TerminalLine>
              <TerminalLine color="text-primary" delay={1.0}> Detected Next.js 16 · Turbopack</TerminalLine>
              <TerminalLine color="text-muted-foreground" delay={1.1}> Building... (14s)</TerminalLine>
              <TerminalLine color="text-muted-foreground" delay={1.2}> Optimizing 42 routes</TerminalLine>
              <TerminalLine color="text-muted-foreground" delay={1.3}> Propagating to 51 edge regions</TerminalLine>
              <TerminalLine color="text-green-500" delay={1.5}> Deployed in 18.4s → nexus.app/your-app</TerminalLine>
              <TerminalLine color="text-muted-foreground/60" delay={1.7}>&nbsp;</TerminalLine>
              <TerminalLine color="text-foreground" delay={1.8}>
                <span className="text-muted-foreground">$</span>
                <span className="ml-2 inline-block w-2 h-4 align-middle bg-primary animate-pulse" aria-hidden="true" />
              </TerminalLine>
            </div>
          </div>
          {/* Glow under card */}
          <div
            className="pointer-events-none absolute -bottom-8 inset-x-8 h-16 rounded-full blur-2xl opacity-30 bg-primary"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  )
}

function TerminalLine({
  children,
  color,
  delay,
}: {
  children: React.ReactNode
  color: string
  delay: number
}) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={color}
    >
      {children}
    </motion.p>
  )
}
