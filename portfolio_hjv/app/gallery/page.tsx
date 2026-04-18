"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { artworks } from "@/lib/data"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"

export default function GalleryPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<(typeof artworks)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()

  // Handle keyboard navigation in viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtwork) return
      
      if (e.key === "Escape") {
        setSelectedArtwork(null)
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const nextIndex = (currentIndex + 1) % artworks.length
        setCurrentIndex(nextIndex)
        setSelectedArtwork(artworks[nextIndex])
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length
        setCurrentIndex(prevIndex)
        setSelectedArtwork(artworks[prevIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedArtwork, currentIndex])

  // Lock body scroll when viewer is open
  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedArtwork])

  const openViewer = useCallback((artwork: (typeof artworks)[0], index: number) => {
    setCurrentIndex(index)
    setSelectedArtwork(artwork)
  }, [])

  const navigateViewer = useCallback((direction: "prev" | "next") => {
    const newIndex = direction === "next"
      ? (currentIndex + 1) % artworks.length
      : (currentIndex - 1 + artworks.length) % artworks.length
    setCurrentIndex(newIndex)
    setSelectedArtwork(artworks[newIndex])
  }, [currentIndex])

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />

        {/* Hero */}
        <section className="relative h-screen flex items-center justify-center bg-charcoal overflow-hidden">
          {/* Ambient background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(ellipse at center, rgba(100,100,100,0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10 text-center px-6">
            <motion.span
              className="text-cream/50 text-xs tracking-[0.4em] uppercase block mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Digital Art Collection
            </motion.span>
            <motion.h1
              className="text-cream text-5xl md:text-7xl lg:text-[8rem] font-light tracking-[-0.04em]"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              Gallery
            </motion.h1>
            <motion.p
              className="text-cream/60 mt-6 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              A collection of digital artworks exploring the boundaries 
              between technology and artistic expression.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-cream/40 text-[10px] tracking-[0.4em] uppercase">
              Enter Gallery
            </span>
            <motion.div className="w-px h-12 bg-cream/20 overflow-hidden">
              <motion.div
                className="w-full h-4 bg-cream/60"
                animate={{ y: ["-100%", "300%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Gallery - Full screen artwork rooms */}
        <div ref={containerRef} className="bg-charcoal">
          {artworks.map((artwork, i) => (
            <ArtworkRoom
              key={artwork.id}
              artwork={artwork}
              index={i}
              total={artworks.length}
              onOpen={() => openViewer(artwork, i)}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="py-12 bg-charcoal border-t border-cream/10">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-cream/40 text-xs tracking-wider">
              &copy; {new Date().getFullYear()} HJ Valdez. All artworks reserved.
            </span>
            <span className="text-cream/40 text-xs tracking-wider">
              {artworks.length} Artworks in Collection
            </span>
          </div>
        </footer>

        <div className="grain" />
      </SmoothScroll>

      {/* Immersive Viewer Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkViewer
            artwork={selectedArtwork}
            currentIndex={currentIndex}
            total={artworks.length}
            onClose={() => setSelectedArtwork(null)}
            onNavigate={navigateViewer}
          />
        )}
      </AnimatePresence>
    </>
  )
}

interface ArtworkRoomProps {
  artwork: (typeof artworks)[0]
  index: number
  total: number
  onOpen: () => void
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}

function ArtworkRoom({ artwork, index, total, onOpen }: ArtworkRoomProps) {
  const roomRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  const { scrollYProgress } = useScroll({
    target: roomRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <motion.section
      ref={roomRef}
      className="relative min-h-screen flex items-center justify-center py-32"
      onMouseMove={handleMouseMove}
      style={{ opacity }}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        <motion.div
          className="grid md:grid-cols-[1fr,auto] gap-12 md:gap-24 items-center"
          style={{ scale, y }}
        >
          {/* Artwork frame */}
          <motion.button
            className="relative group"
            onClick={onOpen}
            data-cursor="text"
            data-cursor-text="View"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            {/* Frame border */}
            <div className="absolute -inset-4 md:-inset-6 border border-cream/10" />
            
            {/* Artwork */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-cream/5">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
              
              {/* Light reflection */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(${mousePosition.x * 180}deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
                }}
              />
            </div>
          </motion.button>

          {/* Info panel */}
          <div className="md:w-64 text-cream">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-cream/40 text-xs tracking-[0.3em] uppercase block mb-4">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">
                {artwork.title}
              </h2>
              <div className="flex items-center gap-4 text-cream/50 text-xs tracking-wider">
                <span>{artwork.category}</span>
                <span className="w-1 h-1 rounded-full bg-cream/30" />
                <span>{artwork.year}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

interface ArtworkViewerProps {
  artwork: (typeof artworks)[0]
  currentIndex: number
  total: number
  onClose: () => void
  onNavigate: (direction: "prev" | "next") => void
}

function ArtworkViewer({ artwork, currentIndex, total, onClose, onNavigate }: ArtworkViewerProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-charcoal flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-10 w-12 h-12 flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
        data-cursor="expand"
        aria-label="Close viewer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation */}
      <button
        onClick={() => onNavigate("prev")}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-cream/40 hover:text-cream transition-colors"
        data-cursor="expand"
        aria-label="Previous artwork"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => onNavigate("next")}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-cream/40 hover:text-cream transition-colors"
        data-cursor="expand"
        aria-label="Next artwork"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Artwork display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={artwork.id}
          className="relative max-w-[85vw] max-h-[80vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={artwork.image}
            alt={artwork.title}
            width={1200}
            height={1600}
            className="max-h-[80vh] w-auto object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Info bar */}
      <motion.div
        className="absolute bottom-8 left-8 right-8 flex items-end justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <h3 className="text-cream text-xl font-light">{artwork.title}</h3>
          <div className="flex items-center gap-3 text-cream/50 text-xs mt-1">
            <span>{artwork.category}</span>
            <span className="w-1 h-1 rounded-full bg-cream/30" />
            <span>{artwork.year}</span>
          </div>
        </div>
        <div className="text-cream/40 text-sm tabular-nums">
          {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </motion.div>

      {/* Keyboard hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/20 text-xs tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Use arrow keys to navigate • ESC to close
      </motion.div>
    </motion.div>
  )
}
