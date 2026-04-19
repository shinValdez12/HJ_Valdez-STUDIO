"use client"

import { motion, AnimatePresence, useScroll, useTransform, useSpring, MotionValue } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode, useRef } from "react"

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Enhanced reveal animation wrapper for sections
export function RevealSection({ 
  children, 
  className = "",
  delay = 0,
  direction = "up",
}: { 
  children: ReactNode
  className?: string
  delay?: number 
  direction?: "up" | "down" | "left" | "right"
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 80, x: 0 }
      case "down": return { y: -80, x: 0 }
      case "left": return { y: 0, x: 80 }
      case "right": return { y: 0, x: -80 }
    }
  }

  const initial = getInitialPosition()

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, ...initial }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.section>
  )
}

// Staggered text reveal animation with word-by-word reveal
export function StaggerText({ 
  text, 
  className = "",
  once = true,
  delay = 0,
}: { 
  text: string
  className?: string
  once?: boolean
  delay?: number
}) {
  const words = text.split(" ")

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      initial="initial"
      whileInView="animate"
      viewport={{ once, margin: "-50px" }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              initial: { y: "100%", opacity: 0 },
              animate: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.8,
                  delay: delay + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

// Premium character by character reveal
export function CharacterReveal({ 
  text, 
  className = "",
  delay = 0,
  stagger = 0.02,
}: { 
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const characters = text.split("")

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {characters.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              initial: { y: "110%", rotateX: -90 },
              animate: {
                y: 0,
                rotateX: 0,
                transition: {
                  duration: 0.6,
                  delay: delay + i * stagger,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

// Line reveal effect for large text
export function LineReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Magnetic button effect with smooth following
export function MagneticWrapper({ 
  children, 
  className = "",
  strength = 0.4,
}: { 
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0px, 0px)"
  }

  return (
    <motion.div
      ref={ref}
      className={`relative transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

// Parallax scroll wrapper with smooth physics
export function ParallaxWrapper({ 
  children, 
  className = "",
  speed = 0.5,
  direction = "y",
}: { 
  children: ReactNode
  className?: string
  speed?: number
  direction?: "x" | "y"
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [-100 * speed, 100 * speed]
  )

  const springTransform = useSpring(transform, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  })

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={{
          [direction]: springTransform,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Scroll-triggered scale effect
export function ScaleOnScroll({
  children,
  className = "",
  scaleRange = [0.9, 1],
}: {
  children: ReactNode
  className?: string
  scaleRange?: [number, number]
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], scaleRange)
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])

  const springScale = useSpring(scale, {
    stiffness: 100,
    damping: 30,
  })

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale: springScale, opacity }}>
        {children}
      </motion.div>
    </div>
  )
}

// Horizontal scroll progress indicator
export function ScrollProgress({
  className = "",
}: {
  className?: string
}) {
  const { scrollYProgress } = useScroll()
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-px bg-foreground origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  )
}

// Fade mask effect for content
export function FadeMask({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  )

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ opacity }}>
        {children}
      </motion.div>
    </div>
  )
}

// Number counter animation
export function CountUp({
  value,
  duration = 2,
  className = "",
}: {
  value: number
  duration?: number
  className?: string
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ count: 0 }}
        whileInView={{ count: value }}
        viewport={{ once: true }}
        transition={{ duration, ease: "easeOut" }}
      >
        {/* This would need a custom implementation */}
        {value}
      </motion.span>
    </motion.span>
  )
}

// Blur reveal effect
export function BlurReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(20px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Split reveal (left and right)
export function SplitReveal({
  leftContent,
  rightContent,
  className = "",
}: {
  leftContent: ReactNode
  rightContent: ReactNode
  className?: string
}) {
  return (
    <div className={`flex ${className}`}>
      <motion.div
        className="flex-1"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        {leftContent}
      </motion.div>
      <motion.div
        className="flex-1"
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {rightContent}
      </motion.div>
    </div>
  )
}
