"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { notFound, useParams } from "next/navigation"
import { projects } from "@/lib/data"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"

export default function ProjectPage() {
  const params = useParams()
  const project = projects.find((p) => p.slug === params.slug)
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.3])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (!project) {
    notFound()
  }

  const currentIndex = projects.findIndex((p) => p.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length]

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />

        {/* Cinematic Hero Section */}
        <section ref={heroRef} className="relative h-[120vh] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ scale: heroScale, y: heroY }}
          >
            <motion.div style={{ opacity: heroOpacity }}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-charcoal/50" />
              
              {/* Dynamic vignette effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, transparent 0%, rgba(0,0,0,0.4) 100%)`,
                }}
              />
            </motion.div>
          </motion.div>

          {/* Hero content with parallax */}
          <motion.div 
            className="relative h-screen flex flex-col justify-end pb-20 md:pb-32 px-6 md:px-12"
            style={{ y: titleY }}
          >
            <div className="max-w-[1800px] mx-auto w-full">
              {/* Project number */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-cream/30 text-7xl md:text-9xl font-extralight">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-12 h-px bg-cream/40" />
                  <span className="text-cream/60 text-[10px] md:text-xs tracking-[0.4em] uppercase">
                    {project.category}
                  </span>
                  <span className="text-cream/30">•</span>
                  <span className="text-cream/60 text-[10px] md:text-xs tracking-[0.4em] uppercase">
                    {project.role}
                  </span>
                </div>
                
                <div className="overflow-hidden">
                  <motion.h1 
                    className="text-cream text-5xl md:text-7xl lg:text-[7rem] font-light tracking-[-0.04em] leading-[0.9]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {project.title}
                  </motion.h1>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-wrap gap-4 mt-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-8 py-4 bg-cream text-charcoal text-xs tracking-[0.2em] uppercase overflow-hidden"
                    data-cursor="expand"
                  >
                    <span className="relative z-10">View Live</span>
                    <motion.div
                      className="absolute inset-0 bg-cream/80"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-8 py-4 border border-cream/30 text-cream text-xs tracking-[0.2em] uppercase overflow-hidden"
                    data-cursor="expand"
                  >
                    <span className="relative z-10">View Code</span>
                    <motion.div
                      className="absolute inset-0 bg-cream/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                )}
                {project.apkUrl && (
                  <a
                    href={project.apkUrl}
                    className="group relative px-8 py-4 border border-cream/30 text-cream text-xs tracking-[0.2em] uppercase overflow-hidden"
                    data-cursor="expand"
                  >
                    <span className="relative z-10">Download APK</span>
                    <motion.div
                      className="absolute inset-0 bg-cream/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-cream/40 text-[9px] tracking-[0.4em] uppercase">Scroll</span>
              <svg className="w-5 h-5 text-cream/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* Overview Section - Split layout */}
        <StorySection className="py-32 md:py-48 bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Left - Section label & Overview text */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center gap-6 mb-10">
                    <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">01</span>
                    <span className="w-16 h-px bg-border" />
                    <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">Overview</span>
                  </div>
                </motion.div>
                
                <motion.p 
                  className="text-2xl md:text-4xl lg:text-5xl font-light leading-[1.3] tracking-[-0.02em]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  {project.fullDescription}
                </motion.p>
              </div>

              {/* Right - Meta info */}
              <div className="lg:col-span-4 lg:pt-20">
                <motion.div 
                  className="space-y-10"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div>
                    <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase block mb-4">
                      Role
                    </span>
                    <p className="text-foreground text-lg font-light">{project.role}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase block mb-4">
                      Category
                    </span>
                    <p className="text-foreground text-lg font-light capitalize">{project.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase block mb-4">
                      Technology
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, i) => (
                        <motion.span
                          key={tech}
                          className="px-4 py-2 text-xs tracking-wider border border-border hover:border-foreground/30 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </StorySection>

        {/* Large showcase image with parallax */}
        <ParallaxImage 
          src={project.image} 
          alt={project.title}
        />

        {/* Challenge & Solution Section */}
        <StorySection className="py-32 md:py-48 bg-secondary/30">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
              {/* Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-6 mb-10">
                  <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">02</span>
                  <span className="w-16 h-px bg-border" />
                  <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">The Challenge</span>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed">
                  {project.challenges}
                </h3>
              </motion.div>

              {/* Solution */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                <div className="flex items-center gap-6 mb-10">
                  <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">03</span>
                  <span className="w-16 h-px bg-border" />
                  <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">The Solution</span>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed">
                  {project.solution}
                </h3>
              </motion.div>
            </div>
          </div>
        </StorySection>

        {/* Tech Stack Visual Grid */}
        <StorySection className="py-32 md:py-48 bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <motion.div
              className="flex items-center gap-6 mb-16"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">04</span>
              <span className="w-16 h-px bg-border" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">Technology Stack</span>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {project.techStack.map((tech, i) => (
                <motion.div
                  key={tech}
                  className="group relative aspect-[4/3] flex items-center justify-center border border-border hover:border-foreground/30 transition-all duration-500 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  data-cursor="expand"
                >
                  <span className="text-lg md:text-xl font-light tracking-wide">{tech}</span>
                  <motion.div
                    className="absolute inset-0 bg-foreground/5"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </StorySection>

        {/* Second large image */}
        <ParallaxImage 
          src={project.image} 
          alt={`${project.title} showcase`}
        />

        {/* Navigation between projects */}
        <section className="py-32 md:py-40 border-t border-border bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              {/* Previous */}
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group relative py-8 md:py-12"
                data-cursor="text"
                data-cursor-text="Prev"
              >
                <motion.div
                  className="flex items-center gap-6"
                  whileHover={{ x: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500"
                  >
                    <svg
                      className="w-6 h-6 text-foreground group-hover:text-background transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.div>
                  <div>
                    <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase block mb-2">
                      Previous Project
                    </span>
                    <span className="text-2xl md:text-3xl font-light group-hover:text-muted-foreground transition-colors">
                      {prevProject.title}
                    </span>
                  </div>
                </motion.div>
              </Link>

              {/* Next */}
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group relative py-8 md:py-12 text-right"
                data-cursor="text"
                data-cursor-text="Next"
              >
                <motion.div
                  className="flex items-center justify-end gap-6"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase block mb-2">
                      Next Project
                    </span>
                    <span className="text-2xl md:text-3xl font-light group-hover:text-muted-foreground transition-colors">
                      {nextProject.title}
                    </span>
                  </div>
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500"
                  >
                    <svg
                      className="w-6 h-6 text-foreground group-hover:text-background transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-muted-foreground text-xs tracking-wider">
              &copy; {new Date().getFullYear()} HJ Valdez
            </span>
            <Link
              href="/projects"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              data-cursor="expand"
            >
              Back to All Projects
            </Link>
          </div>
        </footer>

        <div className="grain" />
      </SmoothScroll>
    </>
  )
}

// Story section wrapper with reveal animation
function StorySection({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <section className={className}>
      {children}
    </section>
  )
}

// Parallax image component
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])

  return (
    <section 
      ref={containerRef}
      className="relative h-[70vh] md:h-[90vh] overflow-hidden bg-charcoal"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <motion.div style={{ opacity }}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-40" />
    </section>
  )
}
