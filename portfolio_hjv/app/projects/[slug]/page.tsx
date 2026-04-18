"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { notFound, useParams } from "next/navigation"
import { projects } from "@/lib/data"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { RevealSection } from "@/components/page-transition"

export default function ProjectPage() {
  const params = useParams()
  const project = projects.find((p) => p.slug === params.slug)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    window.scrollTo(0, 0)
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

        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ scale: heroScale, opacity: heroOpacity }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-charcoal/60" />
          </motion.div>

          {/* Hero content */}
          <div className="relative h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12">
            <div className="max-w-[1800px] mx-auto w-full">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-cream/60 text-xs tracking-[0.3em] uppercase">
                  {project.category} / {project.role}
                </span>
                <h1 className="text-cream text-4xl md:text-7xl lg:text-[6rem] font-light tracking-[-0.03em] mt-4">
                  {project.title}
                </h1>
              </motion.div>

              {/* Quick links */}
              <motion.div
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-cream text-charcoal text-xs tracking-[0.15em] uppercase hover:bg-cream/90 transition-colors"
                    data-cursor="expand"
                  >
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-cream/30 text-cream text-xs tracking-[0.15em] uppercase hover:bg-cream/10 transition-colors"
                    data-cursor="expand"
                  >
                    View Code
                  </a>
                )}
                {project.apkUrl && (
                  <a
                    href={project.apkUrl}
                    className="px-6 py-3 border border-cream/30 text-cream text-xs tracking-[0.15em] uppercase hover:bg-cream/10 transition-colors"
                    data-cursor="expand"
                  >
                    Download APK
                  </a>
                )}
              </motion.div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="w-6 h-6 text-cream/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* Overview Section */}
        <RevealSection className="py-24 md:py-40 bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-3 gap-16">
              {/* Left - Overview text */}
              <div className="md:col-span-2">
                <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
                  Overview
                </span>
                <p className="text-2xl md:text-4xl font-light leading-[1.4] tracking-[-0.01em]">
                  {project.fullDescription}
                </p>
              </div>

              {/* Right - Meta */}
              <div className="space-y-8">
                <div>
                  <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-3">
                    Role
                  </span>
                  <p className="text-foreground">{project.role}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-3">
                    Category
                  </span>
                  <p className="text-foreground capitalize">{project.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-3">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs tracking-wider border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Problem & Solution */}
        <RevealSection className="py-24 md:py-40 bg-secondary/30">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-16 md:gap-24">
              {/* Problem */}
              <div>
                <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
                  The Challenge
                </span>
                <h3 className="text-xl md:text-2xl font-light leading-relaxed">
                  {project.challenges}
                </h3>
              </div>

              {/* Solution */}
              <div>
                <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
                  The Solution
                </span>
                <h3 className="text-xl md:text-2xl font-light leading-relaxed">
                  {project.solution}
                </h3>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Large Image */}
        <section className="py-24 md:py-40 bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <motion.div
              className="relative aspect-[16/9] overflow-hidden"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Navigation between projects */}
        <section className="py-24 border-t border-border bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Previous */}
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex items-center gap-6"
                data-cursor="text"
                data-cursor-text="Prev"
              >
                <motion.div
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg
                    className="w-5 h-5 text-foreground group-hover:text-background transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.div>
                <div>
                  <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-1">
                    Previous
                  </span>
                  <span className="text-xl font-light group-hover:text-muted-foreground transition-colors">
                    {prevProject.title}
                  </span>
                </div>
              </Link>

              {/* Next */}
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex items-center justify-end gap-6 text-right"
                data-cursor="text"
                data-cursor-text="Next"
              >
                <div>
                  <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-1">
                    Next
                  </span>
                  <span className="text-xl font-light group-hover:text-muted-foreground transition-colors">
                    {nextProject.title}
                  </span>
                </div>
                <motion.div
                  className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg
                    className="w-5 h-5 text-foreground group-hover:text-background transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
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
              className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
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
