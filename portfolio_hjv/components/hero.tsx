"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import Link from "next/link"
import { CharacterReveal } from "./page-transition"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 400])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9])

  const springConfig = { damping: 30, stiffness: 150 }
  const parallaxX = useSpring(useTransform(mouseX, [-500, 500], [-30, 30]), springConfig)
  const parallaxY = useSpring(useTransform(mouseY, [-500, 500], [-30, 30]), springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set(clientX - innerWidth / 2)
      mouseY.set(clientY - innerHeight / 2)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      style={{ opacity, scale }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background pointer-events-none" />
      
      {/* Grid lines for luxury feel */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-0 right-0 h-px bg-border/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 right-0 h-px bg-border/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-[1400px] mx-auto"
        style={{ y, x: parallaxX }}
      >
        {/* Subtitle */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-muted-foreground text-xs md:text-sm tracking-[0.4em] uppercase font-light">
            Developer & Digital Artist
          </span>
        </motion.div>

        {/* Main heading */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="text-5xl md:text-8xl lg:text-[10rem] font-light tracking-[-0.04em] leading-[0.9]"
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <CharacterReveal text="Hashim" delay={0.4} />
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-4">
          <motion.h1
            className="text-5xl md:text-8xl lg:text-[10rem] font-light tracking-[-0.04em] leading-[0.9]"
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            <span className="text-muted-foreground">Jahara</span>
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            className="text-5xl md:text-8xl lg:text-[10rem] font-light tracking-[-0.04em] leading-[0.9]"
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            <span className="text-muted-foreground/60">Valdez</span>
          </motion.h1>
        </div>

        {/* Brand nickname */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-12 h-px bg-border" />
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">Shin</span>
          <div className="w-12 h-px bg-border" />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mt-12 text-muted-foreground text-sm md:text-base tracking-wide max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          Crafting digital experiences at the intersection of code and art.
          Building products that feel like exhibitions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Link
            href="/projects"
            data-cursor="text"
            data-cursor-text="View"
            className="group relative px-10 py-5 bg-foreground text-background text-xs tracking-[0.2em] uppercase overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <span className="relative z-10">Explore Projects</span>
            <motion.div
              className="absolute inset-0 bg-muted-foreground"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </Link>
          <Link
            href="/gallery"
            data-cursor="text"
            data-cursor-text="View"
            className="group relative px-10 py-5 border border-foreground text-foreground text-xs tracking-[0.2em] uppercase overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <span className="relative z-10 group-hover:text-background transition-colors duration-300">
              Art Gallery
            </span>
            <motion.div
              className="absolute inset-0 bg-foreground"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {/* <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-16 bg-border overflow-hidden"
        >
          <motion.div
            className="w-full h-6 bg-foreground"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div> */}

      {/* Corner accents */}
      <motion.div
        className="absolute top-20 right-8 text-muted-foreground text-[10px] tracking-[0.2em] uppercase hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Based in Philippines
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 text-muted-foreground text-[10px] tracking-[0.2em] uppercase hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Available for Work
      </motion.div>
    </motion.section>
  )
}
