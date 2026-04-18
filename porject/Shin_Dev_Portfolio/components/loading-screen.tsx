"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingScreenProps {
  onComplete: () => void
}

const WORDS = ["DESIGN", "CODE", "MOTION", "CRAFT"]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Cycle words
    const wordInterval = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length)
    }, 400)

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval)
          clearInterval(wordInterval)
          setTimeout(() => setDone(true), 200)
          return 100
        }
        return p + 2
      })
    }, 28)

    return () => {
      clearInterval(wordInterval)
      clearInterval(progressInterval)
    }
  }, [])

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 900)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          exit={{
            clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Logo / name */}
          <div className="relative mb-16 overflow-hidden">
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Shin
              </span>
              <div className="h-px w-12 bg-accent" />
            </motion.div>
          </div>

          {/* Cycling word */}
          <div className="relative h-20 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={wordIndex}
                className="font-serif text-7xl font-bold tracking-tight text-foreground md:text-8xl"
                initial={{ y: 80, opacity: 0, rotateX: -30 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: -80, opacity: 0, rotateX: 30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {WORDS[wordIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <motion.div
            className="absolute bottom-16 flex w-full max-w-xs flex-col items-center gap-3 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative h-px w-full overflow-hidden bg-border">
              <motion.div
                className="absolute inset-y-0 left-0 bg-accent"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {String(progress).padStart(3, "0")}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
