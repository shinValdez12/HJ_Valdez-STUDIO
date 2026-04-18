"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Layered bg grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          y: gridY,
        }}
      />

      {/* Floating accent orbs */}
      <motion.div
        className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-accent/10 blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[10%] top-[50%] h-48 w-48 rounded-full bg-accent/8 blur-[80px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 text-center"
        style={{ y, opacity, scale }}
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <span className="h-px w-8 bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Creative Developer & UI Designer
          </span>
          <span className="h-px w-8 bg-accent" />
        </motion.div>

        {/* Headline — character split */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 overflow-hidden">
          {["SHIN"].map((word, wi) => (
            <div key={word} className="flex overflow-hidden">
              {word.split("").map((char, ci) => (
                <motion.span
                  key={`${wi}-${ci}`}
                  className="font-serif text-[clamp(3.5rem,12vw,9rem)] font-bold leading-none tracking-tight text-foreground"
                  initial={{ y: 120, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.25 + (wi * word.length + ci) * 0.04,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          className="max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
        >
          I craft immersive digital experiences that live at the intersection of design precision and engineering excellence.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1 }}
        >
          <Link
            href="/projects"
            className="group flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:bg-accent hover:text-accent-foreground"
          >
            View Work
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
          >
            About Me
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-4 flex items-center gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
        >
          {[
            { value: "6+", label: "Years Experience" },
            { value: "40+", label: "Projects Shipped" },
            { value: "3", label: "Awwwards Nominated" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="font-serif text-2xl font-bold text-foreground">{value}</span>
              <span className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
}
