'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import SectionWrapper from '@/components/shared/SectionWrapper'
import SectionHeading from '@/components/shared/SectionHeading'
import FadeIn from '@/components/shared/FadeIn'

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const prev = () => {
    setDirection(-1)
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  }
  const next = () => {
    setDirection(1)
    setCurrentIndex((i) => (i + 1) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <SectionWrapper className="bg-foreground overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <SectionHeading
          eyebrow="Client Stories"
          title={<span className="text-white">What Our Clients Say</span> as unknown as string}
          align="left"
          className="[&_p]:text-white/60"
        />
        <FadeIn direction="left" className="flex items-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Featured Testimonial */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-6"
              aria-live="polite"
            >
              {/* Stars */}
              <div className="flex gap-1" aria-label={`${current.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < current.rating ? 'fill-accent text-accent' : 'text-white/20'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/90 text-xl md:text-2xl font-serif leading-relaxed">
                &ldquo;{current.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-accent/40">
                  <Image
                    src={current.avatar}
                    alt={current.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-semibold">{current.name}</p>
                  <p className="text-white/50 text-sm">{current.role}</p>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="All testimonials">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i) }}
              aria-pressed={currentIndex === i}
              className={`text-left p-4 rounded-xl border transition-all ${
                currentIndex === i
                  ? 'border-accent/60 bg-white/5'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={t.avatar} alt={t.name} fill sizes="32px" className="object-cover" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{t.content}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-12" aria-label="Testimonial navigation">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-accent' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
