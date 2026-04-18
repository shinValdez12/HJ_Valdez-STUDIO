"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { projects } from "@/lib/data"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
  })

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(projects.length - 1) * 100}%`]
  )

  const springX = useSpring(x, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  })

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

  // Calculate active index based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const index = Math.round(v * (projects.length - 1))
      setActiveIndex(index)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />

        {/* Hero Header */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
          <motion.div
            className="text-center z-10 px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="text-muted-foreground text-xs tracking-[0.4em] uppercase block mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Selected Work
            </motion.span>
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-light tracking-[-0.04em]">
              Projects
            </h1>
            <motion.p
              className="mt-6 text-muted-foreground max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              A curated collection of work spanning web applications, 
              mobile experiences, and creative experiments.
            </motion.p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
              Scroll to Explore
            </span>
            <motion.div className="w-px h-12 bg-border overflow-hidden">
              <motion.div
                className="w-full h-4 bg-foreground"
                animate={{ y: ["-300%", "900%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Horizontal Scroll Section */}
        <div
          ref={containerRef}
          className="relative bg-charcoal"
          style={{ height: `${projects.length * 100}vh` }}
        >
          {/* Progress bar */}
          <div className="fixed top-0 left-0 right-0 h-px bg-cream/10 z-50">
            <motion.div
              className="h-full bg-cream"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </div>

          {/* Counter */}
          <motion.div
            className="fixed top-32 right-8 z-40 text-cream hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-4xl font-light tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-cream/30 text-sm mx-2">/</span>
            <span className="text-cream/30 text-sm">
              {String(projects.length).padStart(2, "0")}
            </span>
          </motion.div>

          {/* Sticky horizontal container */}
          <div className="sticky top-0 h-screen overflow-hidden">
            <motion.div
              ref={horizontalRef}
              className="flex h-full"
              style={{ x: springX }}
            >
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  isActive={i === activeIndex}
                  mousePosition={mousePosition}
                  total={projects.length}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Footer CTA */}
        <section className="bg-background py-32">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
                Interested in working together?
              </span>
              <h2 className="text-4xl md:text-6xl font-light tracking-[-0.03em] mb-8">
                Let&apos;s create something
                <span className="text-muted-foreground"> extraordinary</span>
              </h2>
              <Link
                href="/contact"
                className="inline-flex px-10 py-5 bg-foreground text-background text-xs tracking-[0.2em] uppercase hover:bg-muted-foreground transition-colors"
                data-cursor="expand"
              >
                Start a Project
              </Link>
            </motion.div>
          </div>
        </section>

        <div className="grain" />
      </SmoothScroll>
    </>
  )
}

interface ProjectCardProps {
  project: (typeof projects)[0]
  index: number
  isActive: boolean
  mousePosition: { x: number; y: number }
  total: number
}

function ProjectCard({ project, index, isActive, mousePosition, total }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D perspective effect based on mouse
  const rotateX = useSpring(isActive ? mousePosition.y * -5 : 0, {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(isActive ? mousePosition.x * 5 : 0, {
    stiffness: 150,
    damping: 20,
  })

  return (
    <div
      className="w-screen h-full flex items-center justify-center px-8 md:px-16"
      style={{ perspective: "1000px" }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block w-full max-w-5xl"
        data-cursor="text"
        data-cursor-text="Open"
      >
        <motion.div
          ref={cardRef}
          className="relative group"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card */}
          <motion.div
            className={`relative overflow-hidden transition-all duration-700 ${
              isActive ? "scale-100" : "scale-90 opacity-50"
            }`}
          >
            {/* Image container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-cream/5">
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 80vw"
                  priority={index < 3}
                />
              </motion.div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-60" />

              {/* Light effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                }}
              />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="text-cream/60 text-xs tracking-[0.2em] uppercase">
                    {project.category}
                  </span>
                  <h2 className="text-cream text-3xl md:text-5xl font-light tracking-[-0.02em] mt-2">
                    {project.title}
                  </h2>
                  <p className="text-cream/70 mt-4 max-w-xl leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-cream/50 text-xs tracking-wider px-3 py-1 border border-cream/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Index number */}
          <motion.div
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 text-cream/10 text-[8rem] md:text-[12rem] font-light pointer-events-none select-none"
            style={{ transform: "translateZ(-50px)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.div>
        </motion.div>
      </Link>
    </div>
  )
}
