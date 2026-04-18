'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setActiveIndex((i) => (i + 1) % images.length)

  const prevLightbox = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length)
  const nextLightbox = () => setLightboxIndex((i) => (i + 1) % images.length)

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 md:h-[500px] rounded-2xl overflow-hidden">
        {/* Main large image */}
        <div
          className="col-span-4 md:col-span-3 row-span-2 relative cursor-zoom-in group"
          onClick={() => openLightbox(activeIndex)}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} — main view`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </div>
          {/* Arrow controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" aria-hidden="true" />
              </button>
            </>
          )}
          {/* Counter */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 text-white text-xs">
            {activeIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails — visible on md+ */}
        <div className="hidden md:flex col-span-1 row-span-2 flex-col gap-2">
          {images.slice(0, 2).map((img, i) => {
            const thumbIndex = i
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(thumbIndex)}
                aria-label={`View image ${thumbIndex + 1}`}
                className={cn(
                  'relative flex-1 overflow-hidden rounded-sm',
                  activeIndex === thumbIndex && 'ring-2 ring-accent',
                )}
              >
                <Image
                  src={img}
                  alt={`${title} — thumbnail ${thumbIndex + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
            )
          })}
          {images.length > 3 && (
            <button
              onClick={() => openLightbox(2)}
              aria-label={`View all ${images.length} photos`}
              className="relative flex-1 overflow-hidden rounded-sm"
            >
              <Image
                src={images[2]}
                alt={`${title} — more photos`}
                fill
                sizes="25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">+{images.length - 3} more</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              onClick={prevLightbox}
              aria-label="Previous photo"
              className="absolute left-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>

            <div className="relative w-full max-w-5xl max-h-[80vh] aspect-video mx-14">
              <Image
                src={images[lightboxIndex]}
                alt={`${title} — photo ${lightboxIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            <button
              onClick={nextLightbox}
              aria-label="Next photo"
              className="absolute right-5 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`View photo ${i + 1}`}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === lightboxIndex ? 'bg-white' : 'bg-white/40',
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
