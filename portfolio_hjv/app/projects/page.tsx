"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { projects, type Project } from "@/lib/data"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { AppExperienceModal } from "@/components/app-experience-modal"
import { Smartphone, Monitor, Apple } from "lucide-react"

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export default function ProjectsPage() {
  const isMobile = useIsMobile()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />

        {/* Hero Header */}
        <HeroSection isMobile={isMobile} />

        {/* Adaptive Layout: Mobile = Vertical, Desktop = Horizontal 3D */}
        {isMobile ? (
          <MobileProjectsLayout onOpenModal={setSelectedProject} />
        ) : (
          <DesktopProjectsLayout onOpenModal={setSelectedProject} />
        )}

        {/* Footer CTA */}
        <FooterCTA />

        <div className="grain" />
      </SmoothScroll>

      {/* App Experience Modal for native apps */}
      <AppExperienceModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection({ isMobile }: { isMobile: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (isMobile) return
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])

  return (
    <section className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Ambient background glow - Desktop only */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, rgba(100,100,100,0.08) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Floating geometric lines - Desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                left: "-10%",
                right: "-10%",
              }}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 0.5, 0] }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="text-center z-10 px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="text-muted-foreground text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase block mb-6 md:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Selected Work
        </motion.span>
        
        <div className="overflow-hidden">
          <motion.h1
            className="text-5xl md:text-8xl lg:text-[10rem] font-light tracking-[-0.04em] md:tracking-[-0.05em] leading-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Projects
          </motion.h1>
        </div>
        
        <motion.p
          className="mt-6 md:mt-8 text-muted-foreground max-w-sm md:max-w-lg mx-auto text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          A curated collection of work spanning web applications, 
          mobile experiences, and creative experiments.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.span 
          className="text-muted-foreground text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isMobile ? "Scroll" : "Scroll to Explore"}
        </motion.span>
        <div className="relative w-px h-12 md:h-20 bg-border/30 overflow-hidden">
          <motion.div
            className="absolute top-0 w-full h-6 md:h-8 bg-gradient-to-b from-foreground to-transparent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  )
}

// ============================================
// MOBILE LAYOUT - Vertical Editorial Style
// ============================================
function MobileProjectsLayout({ onOpenModal }: { onOpenModal: (project: Project) => void }) {
  return (
    <section className="bg-charcoal py-16 min-h-screen">
      {/* Section header */}
      <div className="px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <span className="text-cream/40 text-xs tracking-[0.3em] uppercase">
            {String(projects.length).padStart(2, "0")} Projects
          </span>
          <span className="flex-1 h-px bg-cream/10" />
        </motion.div>
      </div>

      {/* Project cards - Vertical stack */}
      <div className="flex flex-col gap-20 px-6">
        {projects.map((project, index) => (
          <MobileProjectCard key={project.id} project={project} index={index} onOpenModal={onOpenModal} />
        ))}
      </div>
    </section>
  )
}

function MobileProjectCard({ 
  project, 
  index,
  onOpenModal,
}: { 
  project: Project
  index: number
  onOpenModal: (project: Project) => void
}) {
  const isNativeApp = project.category === "native"
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.95, 1, 1, 1, 0.95])

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y, scale }}
      className="relative"
    >
      {/* Wrapper - use div with onClick for native apps, Link for others */}
      <CardWrapper
        isNativeApp={isNativeApp}
        project={project}
        onOpenModal={onOpenModal}
      >
        {/* Project number */}
        <motion.div
          className="absolute -top-8 -left-2 pointer-events-none select-none z-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.04 }}
          viewport={{ once: true }}
        >
          <span className="text-cream text-8xl font-extralight leading-none">
            {String(index + 1).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6">
          <motion.div
            className="absolute inset-0"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-active:scale-105"
              sizes="100vw"
              priority={index < 2}
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent opacity-60" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-cream/70 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 bg-charcoal/40 backdrop-blur-sm border border-cream/10">
              {project.category}
            </span>
          </div>

          {/* Platform badges for native apps */}
          {project.platforms && project.platforms.length > 0 && (
            <div className="absolute top-4 right-4 flex gap-1.5">
              {project.platforms.map((platform) => (
                <span
                  key={platform}
                  className="p-1.5 bg-charcoal/40 backdrop-blur-sm border border-cream/10 rounded"
                >
                  {platform === "android" && <Smartphone className="w-3.5 h-3.5 text-cream/70" />}
                  {platform === "ios" && <Apple className="w-3.5 h-3.5 text-cream/70" />}
                  {platform === "web" && <Monitor className="w-3.5 h-3.5 text-cream/70" />}
                </span>
              ))}
            </div>
          )}

          {/* View indicator on press */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity"
          >
            <div className="w-20 h-20 rounded-full border border-cream/30 flex items-center justify-center backdrop-blur-sm bg-charcoal/30">
              <span className="text-cream text-[10px] tracking-[0.2em] uppercase">View</span>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h2 
            className="text-cream text-2xl font-light tracking-[-0.02em] mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {project.title}
          </motion.h2>
          
          <motion.p 
            className="text-cream/60 text-sm leading-relaxed mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {project.shortDescription}
          </motion.p>

          {/* Tech stack - Simplified for mobile */}
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-cream/40 text-[10px] tracking-wider px-2 py-1 border border-cream/10"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-cream/30 text-[10px] tracking-wider px-2 py-1">
                +{project.techStack.length - 3}
              </span>
            )}
          </motion.div>
        </div>

        {/* Divider line */}
        <motion.div
          className="absolute -bottom-10 left-0 right-0 h-px bg-cream/10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </CardWrapper>
    </motion.div>
  )
}

// Card wrapper component for conditional rendering
function CardWrapper({
  isNativeApp,
  project,
  onOpenModal,
  children,
}: {
  isNativeApp: boolean
  project: Project
  onOpenModal: (project: Project) => void
  children: React.ReactNode
}) {
  if (isNativeApp) {
    return (
      <div
        onClick={() => onOpenModal(project)}
        className="block group cursor-pointer"
        data-cursor="text"
        data-cursor-text="Experience"
      >
        {children}
      </div>
    )
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block group"
      data-cursor="text"
      data-cursor-text="View"
    >
      {children}
    </Link>
  )
}

// ============================================
// DESKTOP LAYOUT - Horizontal 3D Scroll
// ============================================
function DesktopProjectsLayout({ onOpenModal }: { onOpenModal: (project: Project) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // One full screen width per project
  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(projects.length - 1) * 100}vw`]
  )

  const springX = useSpring(rawX, {
    stiffness: 50,
    damping: 20,
    mass: 0.8,
  })

  const cinematicProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 40,
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

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const maxIndex = projects.length - 1
      const index = Math.min(maxIndex, Math.floor(v * projects.length))
      setActiveIndex(index)
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div
      ref={containerRef}
      className="relative bg-charcoal"
      style={{ height: `${projects.length * 100}vh` }}
    >
      {/* Cinematic top gradient */}
      <div className="fixed top-0 left-0 right-0 h-40 bg-gradient-to-b from-charcoal via-charcoal/80 to-transparent z-30 pointer-events-none" />

      {/* Progress bar with glow */}
      <div className="fixed top-0 left-0 right-0 h-px z-50">
        <motion.div
          className="h-full bg-cream origin-left"
          style={{ scaleX: cinematicProgress }}
        />
        <motion.div
          className="absolute top-0 h-8 bg-cream/20 blur-md"
          style={{
            scaleX: cinematicProgress,
            transformOrigin: "left",
          }}
        />
      </div>

      {/* Project counter */}
      <motion.div
        className="fixed top-32 right-16 z-40 text-cream"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          <motion.span
            key={activeIndex}
            className="text-7xl font-extralight tabular-nums block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </motion.span>
          <div className="flex items-center gap-3 mt-2">
            <span className="w-8 h-px bg-cream/30" />
            <span className="text-cream/40 text-xs tracking-widest">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Project category indicator */}
      <motion.div
        className="fixed left-16 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <span className="w-12 h-px bg-cream/30" />
            <span
              className="text-cream/50 text-xs tracking-[0.3em] uppercase"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {projects[activeIndex]?.category}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Sticky horizontal container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="flex h-full items-center"
          style={{
            width: `${projects.length * 100}vw`,
            x: springX,
          }}
        >
          {projects.map((project, i) => (
            <DesktopProjectCard
              key={project.id}
              project={project}
              index={i}
              activeIndex={activeIndex}
              mousePosition={mousePosition}
              total={projects.length}
              scrollProgress={scrollYProgress}
              onHover={setIsHovering}
              onOpenModal={onOpenModal}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent z-30 pointer-events-none" />
    </div>
  )
}

interface DesktopProjectCardProps {
  project: Project
  index: number
  activeIndex: number
  mousePosition: { x: number; y: number }
  total: number
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  onHover: (isHovering: boolean) => void
  onOpenModal: (project: Project) => void
}

function DesktopProjectCard({ 
  project, 
  index, 
  activeIndex, 
  mousePosition, 
  total,
  scrollProgress,
  onHover,
  onOpenModal,
}: DesktopProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const isActive = index === activeIndex
  const distance = Math.abs(index - activeIndex)
  const isNativeApp = project.category === "native"

  // 3D perspective effect based on mouse (only when active)
  const rotateX = useSpring(isActive && isHovered ? mousePosition.y * -8 : 0, {
    stiffness: 150,
    damping: 25,
  })
  const rotateY = useSpring(isActive && isHovered ? mousePosition.x * 8 : 0, {
    stiffness: 150,
    damping: 25,
  })

  // Scale based on distance from active
  const scale = useSpring(
    isActive ? (isHovered ? 1.02 : 1) : 0.75 - distance * 0.05,
    { stiffness: 200, damping: 30 }
  )

  // Rotation based on position relative to active
  const cardRotation = useSpring(
    isActive ? 0 : (index < activeIndex ? 8 : -8),
    { stiffness: 100, damping: 20 }
  )

  // Opacity based on distance
  const opacity = isActive ? 1 : Math.max(0.2, 0.6 - distance * 0.2)

  // Z-index for proper layering
  const zIndex = isActive ? 10 : Math.max(1, 5 - distance)

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering)
    onHover(hovering)
  }

  return (
    <div
      className="w-screen h-full flex items-center justify-center px-8 lg:px-16"
      style={{ perspective: "1200px", zIndex }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <DesktopCardWrapper
        isNativeApp={isNativeApp}
        project={project}
        onOpenModal={onOpenModal}
      >
        <motion.div
          ref={cardRef}
          className="relative"
          style={{
            scale,
            rotateX,
            rotateY,
            rotateZ: cardRotation,
            transformStyle: "preserve-3d",
            opacity,
          }}
        >
          {/* Glow effect behind card */}
          <motion.div
            className="absolute -inset-8 rounded-lg opacity-0"
            style={{
              background: `radial-gradient(ellipse at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
            }}
            animate={{ opacity: isActive && isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Main card */}
          <div className="relative overflow-hidden rounded-sm">
            {/* Image container with parallax */}
            <div className="relative aspect-[16/10] overflow-hidden bg-cream/5">
              <motion.div
                className="absolute inset-0"
                style={{
                  scale: isHovered ? 1.1 : 1.05,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="80vw"
                  priority={index < 3}
                />
              </motion.div>

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />

              {/* Dynamic lighting effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePosition.x * 40}% ${50 + mousePosition.y * 40}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Glass reflection effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(${135 + mousePosition.x * 20}deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)`,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Content overlay */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-10 lg:p-14"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 30,
                }}
                transition={{ duration: 0.5, delay: isActive ? 0.1 : 0 }}
              >
                <motion.span 
                  className="text-cream/60 text-xs tracking-[0.3em] uppercase block mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20 }}
                  transition={{ delay: 0.2 }}
                >
                  {project.category}
                </motion.span>
                
                <motion.h2 
                  className="text-cream text-5xl lg:text-6xl font-light tracking-[-0.03em] mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                  transition={{ delay: 0.25 }}
                >
                  {project.title}
                </motion.h2>
                
                <motion.p 
                  className="text-cream/70 max-w-xl leading-relaxed text-base mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                  transition={{ delay: 0.3 }}
                >
                  {project.shortDescription}
                </motion.p>

                {/* Tech stack pills */}
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {project.techStack.slice(0, 4).map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className="text-cream/50 text-xs tracking-wider px-3 py-1.5 border border-cream/20 backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0, 
                        scale: isActive ? 1 : 0.9 
                      }}
                      transition={{ delay: 0.4 + techIndex * 0.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              {/* View button (appears on hover) */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isActive && isHovered ? 1 : 0, 
                  scale: isActive && isHovered ? 1 : 0.8 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-32 h-32 rounded-full border border-cream/30 flex items-center justify-center backdrop-blur-sm bg-charcoal/20">
                  <span className="text-cream text-xs tracking-[0.2em] uppercase">View</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Large index number with depth */}
          <motion.div
            className="absolute -left-8 lg:-left-16 top-1/2 -translate-y-1/2 pointer-events-none select-none"
            style={{ 
              transform: "translateZ(-80px)",
              opacity: isActive ? 0.08 : 0.03,
            }}
          >
            <span className="text-cream text-[14rem] lg:text-[18rem] font-extralight leading-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          </motion.div>
        </motion.div>
      </DesktopCardWrapper>
    </div>
  )
}

// Desktop card wrapper component for conditional rendering
function DesktopCardWrapper({
  isNativeApp,
  project,
  onOpenModal,
  children,
}: {
  isNativeApp: boolean
  project: Project
  onOpenModal: (project: Project) => void
  children: React.ReactNode
}) {
  if (isNativeApp) {
    return (
      <div
        onClick={() => onOpenModal(project)}
        className="block w-full max-w-6xl cursor-pointer"
        data-cursor="text"
        data-cursor-text="Experience"
      >
        {children}
      </div>
    )
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block w-full max-w-6xl"
      data-cursor="text"
      data-cursor-text="View"
    >
      {children}
    </Link>
  )
}

// ============================================
// FOOTER CTA
// ============================================
function FooterCTA() {
  return (
    <section className="bg-background py-32 md:py-56 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-muted rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-muted rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.span 
            className="text-muted-foreground text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase block mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Interested in working together?
          </motion.span>
          
          <div className="overflow-hidden">
            <motion.h2
              className="text-3xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em] mb-10 md:mb-12"
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Let&apos;s create something
              <span className="text-muted-foreground block mt-2">extraordinary</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="group relative inline-flex px-10 md:px-12 py-5 md:py-6 bg-foreground text-background text-[10px] md:text-xs tracking-[0.3em] uppercase overflow-hidden"
              data-cursor="expand"
            >
              <span className="relative z-10">Start a Project</span>
              <motion.div
                className="absolute inset-0 bg-muted-foreground"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
