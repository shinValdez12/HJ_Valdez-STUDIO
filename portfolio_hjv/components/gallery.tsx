"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { artworks } from "@/lib/data"

export function Gallery() {
  const [selectedArtwork, setSelectedArtwork] = useState<(typeof artworks)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 })
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    const container = containerRef.current
    container?.addEventListener("mousemove", handleMouseMove)
    return () => container?.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const openViewer = (artwork: (typeof artworks)[0], index: number) => {
    setSelectedArtwork(artwork)
    setCurrentIndex(index)
    document.body.style.overflow = "hidden"
  }

  const closeViewer = () => {
    setSelectedArtwork(null)
    document.body.style.overflow = ""
  }

  const navigateArtwork = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + artworks.length) % artworks.length
        : (currentIndex + 1) % artworks.length
    setCurrentIndex(newIndex)
    setSelectedArtwork(artworks[newIndex])
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtwork) return
      if (e.key === "Escape") closeViewer()
      if (e.key === "ArrowLeft") navigateArtwork("prev")
      if (e.key === "ArrowRight") navigateArtwork("next")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedArtwork, currentIndex])

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="relative py-32 md:py-48 bg-[#0a0a0a] text-[#f5f5f5] overflow-hidden"
    >
      {/* Subtle cursor glow */}
      <motion.div
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          x: smoothX,
          y: smoothY,
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          className="mb-20 md:mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="text-[#a3a3a3] text-xs tracking-[0.3em] uppercase">
            Digital Art
          </span>
          <h2 className="text-editorial text-4xl md:text-6xl lg:text-7xl font-light mt-4 tracking-[-0.02em]">
            Gallery
          </h2>
          <p className="mt-6 text-[#a3a3a3] text-sm md:text-base max-w-lg">
            A curated collection of digital artworks exploring the boundaries between technology and artistic expression.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              className="break-inside-avoid group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
              onClick={() => openViewer(artwork, index)}
            >
              <div className="relative overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </motion.div>

                {/* Hover overlay */}
                <motion.div
                  className="absolute inset-0 bg-[#0a0a0a]/60 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-[#a3a3a3] mb-2">
                      {artwork.category}
                    </p>
                    <h3 className="text-lg font-light tracking-wide">
                      {artwork.title}
                    </h3>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Close button */}
            <button
              onClick={closeViewer}
              className="absolute top-8 right-8 z-10 text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
              aria-label="Close viewer"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation */}
            <button
              onClick={() => navigateArtwork("prev")}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-10 text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors p-4"
              aria-label="Previous artwork"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => navigateArtwork("next")}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-10 text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors p-4"
              aria-label="Next artwork"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Artwork display */}
            <motion.div
              key={selectedArtwork.id}
              className="relative max-w-5xl max-h-[80vh] mx-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            >
              <Image
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                width={1200}
                height={800}
                className="max-h-[70vh] w-auto object-contain"
              />
            </motion.div>

            {/* Info */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div>
                <p className="text-[#a3a3a3] text-xs tracking-[0.3em] uppercase mb-1">
                  {selectedArtwork.category}
                </p>
                <h3 className="text-xl font-light">{selectedArtwork.title}</h3>
              </div>
              <p className="text-[#a3a3a3] text-sm">
                {currentIndex + 1} / {artworks.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
