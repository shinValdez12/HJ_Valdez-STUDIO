"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Play, Pause, Download, ExternalLink, Smartphone, Monitor, Apple } from "lucide-react"
import type { Project } from "@/lib/data"

interface AppExperienceModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function AppExperienceModal({ project, isOpen, onClose }: AppExperienceModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<"screenshots" | "video">("screenshots")

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0)
      setIsVideoPlaying(false)
      setActiveTab("screenshots")
    }
  }, [isOpen])

  // Handle escape key
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !project?.screenshots) return
      if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev - 1 + project.screenshots!.length) % project.screenshots!.length)
      } else if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => (prev + 1) % project.screenshots!.length)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, project])

  if (!project) return null

  const screenshots = project.screenshots || [project.image]
  const platforms = project.platforms || []
  const hasVideo = !!project.videoUrl
  const hasMultipleScreenshots = screenshots.length > 1

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

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
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl overflow-hidden shadow-2xl border border-border/50"
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                data-cursor="expand"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
                {/* Left Side - Media Section */}
                <div className="relative lg:w-3/5 bg-charcoal/50 flex-shrink-0">
                  {/* Tab Switcher (if video available) */}
                  {hasVideo && (
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <button
                        onClick={() => setActiveTab("screenshots")}
                        className={`px-4 py-2 text-xs tracking-wider uppercase rounded-full transition-all ${
                          activeTab === "screenshots"
                            ? "bg-cream text-charcoal"
                            : "bg-charcoal/50 text-cream/70 hover:text-cream"
                        }`}
                        data-cursor="expand"
                      >
                        Screenshots
                      </button>
                      <button
                        onClick={() => setActiveTab("video")}
                        className={`px-4 py-2 text-xs tracking-wider uppercase rounded-full transition-all ${
                          activeTab === "video"
                            ? "bg-cream text-charcoal"
                            : "bg-charcoal/50 text-cream/70 hover:text-cream"
                        }`}
                        data-cursor="expand"
                      >
                        Demo Video
                      </button>
                    </div>
                  )}

                  {/* Screenshot Carousel */}
                  {activeTab === "screenshots" && (
                    <div className="relative h-[300px] md:h-[400px] lg:h-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSlide}
                          className="absolute inset-0"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            src={screenshots[currentSlide]}
                            alt={`${project.title} screenshot ${currentSlide + 1}`}
                            fill
                            className="object-cover"
                          />
                          {/* Vignette overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-charcoal/20" />
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation Arrows */}
                      {hasMultipleScreenshots && (
                        <>
                          <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal/50 backdrop-blur-sm text-cream/70 hover:text-cream hover:bg-charcoal/70 transition-all"
                            data-cursor="expand"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal/50 backdrop-blur-sm text-cream/70 hover:text-cream hover:bg-charcoal/70 transition-all"
                            data-cursor="expand"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Slide Indicators */}
                      {hasMultipleScreenshots && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {screenshots.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentSlide
                                  ? "bg-cream w-6"
                                  : "bg-cream/30 hover:bg-cream/50"
                              }`}
                              data-cursor="expand"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video Player */}
                  {activeTab === "video" && hasVideo && (
                    <div className="relative h-[300px] md:h-[400px] lg:h-full flex items-center justify-center bg-charcoal">
                      {/* Placeholder for video - in production would be an actual video player */}
                      <div className="relative w-full h-full">
                        <Image
                          src={project.image}
                          alt={`${project.title} demo`}
                          fill
                          className="object-cover opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                            className="p-6 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream hover:bg-cream/20 transition-all"
                            data-cursor="expand"
                          >
                            {isVideoPlaying ? (
                              <Pause className="w-8 h-8" />
                            ) : (
                              <Play className="w-8 h-8 ml-1" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side - Info Section */}
                <div className="lg:w-2/5 p-6 md:p-8 flex flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="mb-6">
                    <motion.span
                      className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {project.category}
                    </motion.span>
                    <motion.h2
                      className="text-3xl md:text-4xl font-light tracking-tight"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {project.title}
                    </motion.h2>
                  </div>

                  {/* Platform Badges */}
                  {platforms.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-2 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      {platforms.map((platform) => (
                        <span
                          key={platform}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs tracking-wider uppercase"
                        >
                          {platform === "android" && <Smartphone className="w-3.5 h-3.5" />}
                          {platform === "ios" && <Apple className="w-3.5 h-3.5" />}
                          {platform === "web" && <Monitor className="w-3.5 h-3.5" />}
                          {platform}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  {/* Description */}
                  <motion.p
                    className="text-muted-foreground text-sm leading-relaxed mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {project.fullDescription}
                  </motion.p>

                  {/* Tech Stack */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-muted/30 text-xs text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Action Buttons */}
                  <motion.div
                    className="space-y-3 pt-6 border-t border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* Primary CTA */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-foreground text-background text-sm tracking-wider uppercase font-medium hover:opacity-90 transition-opacity"
                        data-cursor="expand"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live App
                      </a>
                    )}

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      {project.apkUrl && (
                        <a
                          href={project.apkUrl}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 text-foreground text-xs tracking-wider uppercase hover:bg-muted transition-colors"
                          data-cursor="expand"
                        >
                          <Download className="w-4 h-4" />
                          Download APK
                        </a>
                      )}
                      {project.iosUrl && (
                        <a
                          href={project.iosUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 text-foreground text-xs tracking-wider uppercase hover:bg-muted transition-colors"
                          data-cursor="expand"
                        >
                          <Apple className="w-4 h-4" />
                          {project.iosUrl === "coming-soon" ? "iOS Coming Soon" : "View on TestFlight"}
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 text-foreground text-xs tracking-wider uppercase hover:bg-muted transition-colors col-span-2"
                          data-cursor="expand"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          View Source Code
                        </a>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
