"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { experiments, type Experiment } from "@/lib/data"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { Play, ExternalLink, X, Sparkles, Layers, MousePointer, Waves, Code2 } from "lucide-react"

// Category icons mapping
const categoryIcons = {
  "3d": Layers,
  motion: Sparkles,
  interaction: MousePointer,
  generative: Code2,
  audio: Waves,
}

const categoryLabels = {
  motion: "Motion",
  interaction: "Interaction",
  generative: "Generative",
}

export default function ExperimentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  
  const categories = Array.from(new Set(experiments.map((e) => e.category)))
  
  const filteredExperiments = selectedCategory
    ? experiments.filter((e) => e.category === selectedCategory)
    : experiments

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />

        {/* Hero Section */}
        <HeroSection />

        {/* Category Filter */}
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-[1800px] mx-auto">
            <motion.div
              className="flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all ${
                  selectedCategory === null
                    ? "bg-foreground text-background"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-cursor="expand"
              >
                All
              </button>
              {categories.map((category) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons]
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all ${
                      selectedCategory === category
                        ? "bg-foreground text-background"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-cursor="expand"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </button>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Experiments Grid */}
        <section className="py-12 pb-32 px-6 md:px-12">
          <div className="max-w-[1800px] mx-auto">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredExperiments.map((experiment, index) => (
                  <ExperimentCard
                    key={experiment.id}
                    experiment={experiment}
                    index={index}
                    isHovered={hoveredId === experiment.id}
                    onHover={() => setHoveredId(experiment.id)}
                    onLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedExperiment(experiment)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 md:px-12 border-t border-border">
          <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-muted-foreground text-xs tracking-wider">
              Experiments Lab - Creative Coding Playground
            </span>
            <span className="text-xs text-muted-foreground">
              Built with React, Three.js & Framer Motion
            </span>
          </div>
        </footer>

        <div className="grain" />
      </SmoothScroll>

      {/* Experiment Modal */}
      <ExperimentModal
        experiment={selectedExperiment}
        isOpen={!!selectedExperiment}
        onClose={() => setSelectedExperiment(null)}
      />
    </>
  )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-foreground/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div className="text-center z-10 px-6" style={{ y, opacity }}>
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
            Creative Lab
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            className="text-5xl md:text-8xl lg:text-[10rem] font-light tracking-[-0.04em] leading-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Experiments
          </motion.h1>
        </div>

        <motion.p
          className="mt-8 text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          A playground of creative coding, motion design, and interactive 
          explorations. Where ideas become experiences.
        </motion.p>

        <motion.div
          className="mt-12 flex items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {Object.entries(categoryLabels).slice(0, 4).map(([key, label], i) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons]
            return (
              <motion.div
                key={key}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="p-3 rounded-xl bg-muted/30">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-[10px] tracking-wider text-muted-foreground uppercase hidden md:block">
                  {label}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          Explore
        </span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}

// ============================================
// EXPERIMENT CARD
// ============================================
function ExperimentCard({
  experiment,
  index,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  experiment: Experiment
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  const Icon = categoryIcons[experiment.category as keyof typeof categoryIcons]

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      data-cursor="view"
    >
      <motion.div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        {/* Image */}
        <Image
          src={experiment.image}
          alt={experiment.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Spotlight effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal/50 backdrop-blur-sm">
            <Icon className="w-3.5 h-3.5 text-cream/70" />
            <span className="text-[10px] tracking-wider text-cream/70 uppercase">
              {categoryLabels[experiment.category as keyof typeof categoryLabels]}
            </span>
          </div>
        </div>

        {/* Featured badge */}
        {experiment.featured && (
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 rounded-full bg-cream/10 backdrop-blur-sm">
              <span className="text-[10px] tracking-wider text-cream uppercase">
                Featured
              </span>
            </div>
          </div>
        )}

        {/* Play button overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20">
            <Play className="w-6 h-6 text-cream fill-cream" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <h3 className="text-xl md:text-2xl font-light text-cream mb-2">
              {experiment.title}
            </h3>
            <p className="text-cream/60 text-sm line-clamp-2">
              {experiment.description}
            </p>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div
            className="flex flex-wrap gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            {experiment.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded-full bg-cream/10 text-[10px] text-cream/70 tracking-wider"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// EXPERIMENT MODAL
// ============================================
function ExperimentModal({
  experiment,
  isOpen,
  onClose,
}: {
  experiment: Experiment | null
  isOpen: boolean
  onClose: () => void
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!experiment) return null

  const Icon = categoryIcons[experiment.category as keyof typeof categoryIcons]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-charcoal/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground transition-all"
                data-cursor="expand"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
                {/* Demo Area */}
                <div className="relative lg:w-3/5 aspect-video lg:aspect-auto bg-charcoal flex items-center justify-center">
                  <Image
                    src={experiment.image}
                    alt={experiment.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="p-6 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 mb-4 inline-block">
                        <Play className="w-10 h-10 text-cream fill-cream" />
                      </div>
                      <p className="text-cream/60 text-sm">
                        Interactive demo coming soon
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="lg:w-2/5 p-6 md:p-8 flex flex-col overflow-y-auto">
                  {/* Category */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                      {categoryLabels[experiment.category as keyof typeof categoryLabels]}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                    {experiment.title}
                  </h2>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {experiment.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {experiment.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-full bg-muted/30 text-xs text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="space-y-3 pt-6 border-t border-border/50">
                    <button
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-foreground text-background text-sm tracking-wider uppercase font-medium hover:opacity-90 transition-opacity"
                      data-cursor="expand"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Launch Demo
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-muted/50 text-foreground text-xs tracking-wider uppercase hover:bg-muted transition-colors"
                      data-cursor="expand"
                    >
                      <Code2 className="w-4 h-4" />
                      View Source Code
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
