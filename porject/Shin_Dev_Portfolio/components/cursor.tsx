"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

type CursorVariant = "default" | "hover" | "link" | "project" | "text"

export function CustomCursor() {
  const [variant, setVariant] = useState<CursorVariant>("default")
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const followerSpringConfig = { damping: 28, stiffness: 150, mass: 0.8 }

  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const followerXSpring = useSpring(cursorX, followerSpringConfig)
  const followerYSpring = useSpring(cursorY, followerSpringConfig)

  useEffect(() => {
    // Detect touch device
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-cursor='project']")) {
        setVariant("project")
      } else if (target.closest("a, button, [role='button'], [data-cursor='hover']")) {
        setVariant("hover")
      } else if (target.closest("p, h1, h2, h3, h4, [data-cursor='text']")) {
        setVariant("text")
      } else {
        setVariant("default")
      }
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mousemove", handleHoverStart)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mousemove", handleHoverStart)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", checkMobile)
    }
  }, [cursorX, cursorY])

  if (isMobile) return null

  const dotSize = variant === "hover" ? 8 : variant === "project" ? 6 : 6
  const ringSize =
    variant === "hover" ? 44 :
    variant === "project" ? 80 :
    variant === "text" ? 4 :
    32

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-foreground mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: dotSize,
          height: dotSize,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Ring / follower */}
      <motion.div
        className="pointer-events-none fixed z-[9998] rounded-full border border-foreground/40 mix-blend-difference"
        style={{
          x: followerXSpring,
          y: followerYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isVisible ? (variant === "text" ? 0 : 1) : 0,
          backgroundColor: variant === "project" ? "oklch(var(--highlight) / 0.15)" : "transparent",
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Project label */}
      {variant === "project" && (
        <motion.div
          className="pointer-events-none fixed z-[9997] flex items-center justify-center text-[10px] font-medium uppercase tracking-widest text-foreground mix-blend-difference"
          style={{
            x: followerXSpring,
            y: followerYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
        >
          View
        </motion.div>
      )}
    </>
  )
}
