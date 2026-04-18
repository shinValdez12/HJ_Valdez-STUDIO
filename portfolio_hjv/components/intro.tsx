"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface IntroProps {
  onComplete: () => void
}

export function Intro({ onComplete }: IntroProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  const handleComplete = useCallback(() => {
    setIsExiting(true)
    setTimeout(onComplete, 1200)
  }, [onComplete])

  useEffect(() => {
    const duration = 2800
    const interval = 30
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0
    const timer = setInterval(() => {
      currentProgress += increment
      if (currentProgress >= 100) {
        setProgress(100)
        clearInterval(timer)
        setTimeout(handleComplete, 500)
      } else {
        setProgress(Math.floor(currentProgress))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [handleComplete])

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal"
          exit={{ 
            opacity: 0,
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Grain overlay */}
          <div className="grain" />

          {/* Cinematic lines */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px bg-cream/10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-cream/10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Year marker */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-cream/30 text-[10px] tracking-[0.5em] uppercase font-light">
                Portfolio 2024
              </span>
            </motion.div>

            {/* Brand name */}
            <div className="overflow-hidden">
              <motion.h1
                className="text-cream text-5xl md:text-7xl lg:text-[6rem] font-light tracking-[-0.03em] leading-none"
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                HJ Valdez
              </motion.h1>
            </div>

            {/* Divider line */}
            <motion.div
              className="my-6 w-16 h-px bg-cream/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />

            {/* Subtitle */}
            <div className="overflow-hidden">
              <motion.p
                className="text-cream/60 text-xs md:text-sm tracking-[0.3em] uppercase font-light"
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              >
                Developer & Digital Artist
              </motion.p>
            </div>

            {/* Progress section */}
            <motion.div
              className="mt-20 flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Progress bar container */}
              <div className="relative w-48 md:w-72">
                {/* Background line */}
                <div className="w-full h-[1px] bg-cream/10" />
                {/* Progress line */}
                <motion.div
                  className="absolute top-0 left-0 h-[1px] bg-cream"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: "linear" }}
                />
                {/* Glow effect */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cream/50 blur-sm"
                  style={{ left: `${progress}%` }}
                />
              </div>

              {/* Progress number */}
              <div className="flex items-baseline gap-1">
                <motion.span
                  className="text-cream text-2xl md:text-3xl font-light tracking-tight tabular-nums"
                  key={progress}
                >
                  {progress.toString().padStart(2, "0")}
                </motion.span>
                <span className="text-cream/40 text-xs">%</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom info */}
          <motion.div
            className="absolute bottom-8 left-8 right-8 flex justify-between items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-cream/20 text-[10px] tracking-[0.2em] uppercase">
              Loading Experience
            </span>
            <span className="text-cream/20 text-[10px] tracking-[0.2em] uppercase">
              Please Wait
            </span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-[100] bg-charcoal"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
