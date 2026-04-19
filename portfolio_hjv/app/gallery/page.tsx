"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import { artworks } from "@/lib/data"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"

export default function GalleryPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<(typeof artworks)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeRoom, setActiveRoom] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  const { scrollYProgress } = useScroll()

  // Track mouse for ambient effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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

        {/* Immersive Hero */}
        <section className="relative h-screen flex items-center justify-center bg-charcoal overflow-hidden">
          {/* Dynamic ambient lighting */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                `radial-gradient(ellipse 100% 100% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(60,60,60,0.15) 0%, transparent 50%)`,
              ],
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-cream/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center px-6">
            <motion.div
              className="overflow-hidden mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                className="text-cream/40 text-[10px] md:text-xs tracking-[0.6em] uppercase block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Digital Art Collection
              </motion.span>
            </motion.div>
            
            <div className="overflow-hidden">
              <motion.h1
                className="text-cream text-6xl md:text-8xl lg:text-[10rem] font-extralight tracking-[-0.05em] leading-none"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Gallery
              </motion.h1>
            </div>
            
            <motion.p
              className="text-cream/50 mt-8 max-w-md mx-auto text-sm leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              A collection of digital artworks exploring the boundaries 
              between technology and artistic expression.
            </motion.p>

            {/* Collection count */}
            <motion.div
              className="mt-12 flex items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="w-16 h-px bg-cream/20" />
              <span className="text-cream/30 text-[10px] tracking-[0.4em] uppercase">
                {artworks.length} Works
              </span>
              <span className="w-16 h-px bg-cream/20" />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <motion.span 
              className="text-cream/30 text-[9px] tracking-[0.5em] uppercase"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Enter Gallery
            </motion.span>
            <div className="relative w-px h-16 bg-cream/10 overflow-hidden">
              <motion.div
                className="absolute top-0 w-full h-8 bg-gradient-to-b from-cream/50 to-transparent"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </section>

        {/* Gallery - Museum-style fullscreen rooms */}
        <div ref={containerRef} className="bg-charcoal">
          {artworks.map((artwork, i) => (
            <ArtworkRoom
              key={artwork.id}
              artwork={artwork}
              index={i}
              total={artworks.length}
              onOpen={() => openViewer(artwork, i)}
              isActive={activeRoom === i}
              setActive={() => setActiveRoom(i)}
              mousePosition={mousePosition}
            />
          ))}
        </div>

        {/* End section */}
        <section className="py-32 md:py-48 bg-charcoal">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-cream/30 text-[10px] tracking-[0.5em] uppercase block mb-8">
                End of Collection
              </span>
              <h2 className="text-cream text-3xl md:text-5xl font-light tracking-tight mb-4">
                Thank you for viewing
              </h2>
              <p className="text-cream/50 max-w-md mx-auto text-sm">
                Each piece represents a moment of creative exploration.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-charcoal border-t border-cream/10">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-cream/30 text-xs tracking-wider">
              &copy; {new Date().getFullYear()} HJ Valdez. All artworks reserved.
            </span>
            <span className="text-cream/30 text-xs tracking-wider">
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
  isActive: boolean
  setActive: () => void
  mousePosition: { x: number; y: number }
}

function ArtworkRoom({ 
  artwork, 
  index, 
  total, 
  onOpen, 
  isActive,
  setActive,
  mousePosition 
}: ArtworkRoomProps) {
  const roomRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const { scrollYProgress } = useScroll({
    target: roomRef,
    offset: ["start end", "end start"],
  })

  // Parallax transforms
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.85, 1, 1, 1, 0.85])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15])

  // Spring versions for smoother motion
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 })
  const springY = useSpring(y, { stiffness: 100, damping: 30 })

  // Update active room based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v > 0.3 && v < 0.7) {
        setActive()
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress, setActive])

  return (
    <motion.section
      ref={roomRef}
      className="relative min-h-screen flex items-center justify-center py-24 md:py-32"
      style={{ opacity }}
    >
      {/* Spotlight effect following cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.03) 0%, transparent 100%)`,
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full">
        <motion.div
          className="grid lg:grid-cols-[1.2fr,auto] gap-12 lg:gap-20 items-center"
          style={{ scale: springScale, y: springY }}
        >
          {/* Artwork frame with museum-style presentation */}
          <motion.button
            className="relative group block w-full"
            onClick={onOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-cursor="text"
            data-cursor-text="View"
          >
            {/* Outer frame shadow */}
            <div className="absolute -inset-6 md:-inset-10 bg-gradient-to-b from-cream/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Frame border */}
            <motion.div 
              className="absolute -inset-3 md:-inset-5 border border-cream/[0.08]"
              animate={{ borderColor: isHovered ? "rgba(245,245,245,0.15)" : "rgba(245,245,245,0.08)" }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Inner frame accent */}
            <div className="absolute -inset-1.5 md:-inset-2 border border-cream/[0.04]" />
            
            {/* Artwork container */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-cream/[0.02]">
              <motion.div
                className="absolute inset-0"
                style={{ scale: imageScale }}
              >
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </motion.div>
              
              {/* Hover overlay with glass effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Texture/light reflection */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(${mousePosition.x * 180}deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)`,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Inspect indicator */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0, 
                  scale: isHovered ? 1 : 0.8 
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border border-cream/30 flex items-center justify-center backdrop-blur-sm bg-charcoal/30">
                  <span className="text-cream text-[10px] md:text-xs tracking-[0.3em] uppercase">Inspect</span>
                </div>
              </motion.div>
            </div>
          </motion.button>

          {/* Info panel - museum label style */}
          <motion.div 
            className="lg:w-72 xl:w-80"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Index */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-cream/20 text-5xl md:text-6xl font-extralight tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 h-px bg-cream/10" />
              <span className="text-cream/30 text-xs tracking-wider">
                {String(total).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-cream text-2xl md:text-3xl lg:text-4xl font-light tracking-tight mb-4">
              {artwork.title}
            </h2>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-cream/40 text-xs tracking-wider mb-8">
              <span className="uppercase">{artwork.category}</span>
              <span className="w-1 h-1 rounded-full bg-cream/20" />
              <span>{artwork.year}</span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-cream/10 mb-8" />

            {/* View button */}
            <motion.button
              onClick={onOpen}
              className="group flex items-center gap-4 text-cream/50 hover:text-cream transition-colors"
              data-cursor="expand"
              whileHover={{ x: 5 }}
            >
              <span className="text-xs tracking-[0.2em] uppercase">View Artwork</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
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
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-charcoal/98 backdrop-blur-xl flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Close button */}
      <motion.button
        onClick={onClose}
        className="absolute top-8 right-8 z-10 w-14 h-14 flex items-center justify-center text-cream/40 hover:text-cream transition-colors"
        data-cursor="expand"
        aria-label="Close viewer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.1 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Navigation arrows */}
      <motion.button
        onClick={() => onNavigate("prev")}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center text-cream/30 hover:text-cream transition-colors"
        data-cursor="expand"
        aria-label="Previous artwork"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ x: -5 }}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <motion.button
        onClick={() => onNavigate("next")}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center text-cream/30 hover:text-cream transition-colors"
        data-cursor="expand"
        aria-label="Next artwork"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ x: 5 }}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Artwork display */}
      <div className="relative max-w-[85vw] max-h-[80vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={artwork.id}
            className="relative"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Frame effect */}
            <div className="absolute -inset-4 md:-inset-6 border border-cream/10" />
            
            <Image
              src={artwork.image}
              alt={artwork.title}
              width={1200}
              height={1600}
              className="max-h-[75vh] w-auto object-contain"
              priority
              onLoad={() => setIsImageLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Info bar */}
      <motion.div
        className="absolute bottom-8 left-8 right-8 flex items-end justify-between"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div>
          <motion.h3 
            key={artwork.title}
            className="text-cream text-2xl md:text-3xl font-light tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {artwork.title}
          </motion.h3>
          <div className="flex items-center gap-4 text-cream/40 text-xs mt-2 tracking-wider">
            <span className="uppercase">{artwork.category}</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span>{artwork.year}</span>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {artworks.map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-px"
                animate={{
                  backgroundColor: i === currentIndex ? "rgba(245,245,245,0.8)" : "rgba(245,245,245,0.2)",
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          <span className="text-cream/60 text-sm tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="text-cream/30 mx-1">/</span>
            {String(total).padStart(2, "0")}
          </span>
        </div>
      </motion.div>

      {/* Keyboard hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 text-cream/20 text-[10px] tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 border border-cream/20 rounded">←</kbd>
          <kbd className="px-2 py-1 border border-cream/20 rounded">→</kbd>
          Navigate
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 border border-cream/20 rounded">ESC</kbd>
          Close
        </span>
      </motion.div>
    </motion.div>
  )
}
