"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

interface CursorState {
  isHovering: boolean
  text: string
  variant: "default" | "expand" | "text" | "hidden" | "link" | "view" | "inspect" | "drag"
}

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    text: "",
    variant: "default",
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  // Use motion values for smooth cursor tracking
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // More refined spring config for luxury feel
  const springConfig = { 
    damping: 35, 
    stiffness: 400, 
    mass: 0.5,
    restSpeed: 0.001,
  }
  
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Separate spring for the trailing glow effect (slower follow)
  const glowSpringConfig = { 
    damping: 50, 
    stiffness: 200, 
    mass: 1,
  }
  const glowXSpring = useSpring(cursorX, glowSpringConfig)
  const glowYSpring = useSpring(cursorY, glowSpringConfig)

  // Velocity tracking for dynamic effects
  const velocityX = useMotionValue(0)
  const velocityY = useMotionValue(0)
  const lastX = useRef(0)
  const lastY = useRef(0)

  const handleElementHover = useCallback((e: Event) => {
    const target = e.target as HTMLElement
    const cursorType = target.closest("[data-cursor]")?.getAttribute("data-cursor")
    const cursorText = target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text")

    if (cursorType === "expand") {
      setCursorState({ isHovering: true, text: "", variant: "expand" })
    } else if (cursorType === "text" && cursorText) {
      setCursorState({ isHovering: true, text: cursorText, variant: "text" })
    } else if (cursorType === "hidden") {
      setCursorState({ isHovering: false, text: "", variant: "hidden" })
    } else if (cursorType === "link") {
      setCursorState({ isHovering: true, text: "", variant: "link" })
    } else if (cursorType === "view") {
      setCursorState({ isHovering: true, text: "View", variant: "view" })
    } else if (cursorType === "inspect") {
      setCursorState({ isHovering: true, text: "Inspect", variant: "inspect" })
    } else if (cursorType === "drag") {
      setCursorState({ isHovering: true, text: "", variant: "drag" })
    } else {
      // Default link behavior for anchors and buttons
      setCursorState({ isHovering: true, text: "", variant: "expand" })
    }
  }, [])

  const handleElementLeave = useCallback(() => {
    setCursorState({ isHovering: false, text: "", variant: "default" })
  }, [])

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasPointer = window.matchMedia("(pointer: fine)").matches
    if (!hasPointer) return

    setIsVisible(true)

    let animationFrameId: number
    let lastTime = performance.now()

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      // Calculate velocity
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTime
      if (deltaTime > 0) {
        const vx = (e.clientX - lastX.current) / deltaTime
        const vy = (e.clientY - lastY.current) / deltaTime
        velocityX.set(vx)
        velocityY.set(vy)
      }
      lastX.current = e.clientX
      lastY.current = e.clientY
      lastTime = currentTime
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Initial setup for interactive elements
    const setupListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      )
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover)
        el.removeEventListener("mouseleave", handleElementLeave)
        el.addEventListener("mouseenter", handleElementHover)
        el.addEventListener("mouseleave", handleElementLeave)
      })
    }

    setupListeners()

    // MutationObserver for dynamically added elements
    const observer = new MutationObserver(() => {
      setupListeners()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      observer.disconnect()
    }
  }, [cursorX, cursorY, velocityX, velocityY, handleElementHover, handleElementLeave])

  if (!isVisible) return null

  const getCursorSize = () => {
    if (isPressed) {
      return { width: 8, height: 8 }
    }
    switch (cursorState.variant) {
      case "expand":
        return { width: 64, height: 64 }
      case "text":
      case "view":
      case "inspect":
        return { width: 100, height: 100 }
      case "link":
        return { width: 48, height: 48 }
      case "drag":
        return { width: 80, height: 80 }
      case "hidden":
        return { width: 0, height: 0 }
      default:
        return { width: 10, height: 10 }
    }
  }

  const size = getCursorSize()

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          animate={{
            width: size.width,
            height: size.height,
            x: -size.width / 2,
            y: -size.height / 2,
            backgroundColor: cursorState.variant === "text" || cursorState.variant === "view" || cursorState.variant === "inspect"
              ? "rgba(5, 5, 5, 0.95)"
              : cursorState.variant === "expand" || cursorState.variant === "link"
              ? "rgba(245, 245, 245, 0.15)"
              : "rgb(2, 2, 2)",
            borderWidth: cursorState.variant === "expand" || cursorState.variant === "link" || cursorState.variant === "drag"
              ? 1
              : 0,
            borderColor: "rgba(245, 245, 245, 0.5)",
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            mass: 0.3,
          }}
          style={{
            backdropFilter: cursorState.variant === "expand" ? "blur(4px)" : "none",
          }}
        >
          {/* Cursor text content */}
          <AnimatePresence mode="wait">
            {(cursorState.variant === "text" || cursorState.variant === "view" || cursorState.variant === "inspect") && cursorState.text && (
              <motion.span
                key="cursor-text"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] font-medium text-charcoal tracking-[0.15em] uppercase whitespace-nowrap"
              >
                {cursorState.text}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Drag indicator */}
          <AnimatePresence>
            {cursorState.variant === "drag" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inner dot for expand state */}
          {(cursorState.variant === "expand" || cursorState.variant === "link") && (
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full bg-cream"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Trailing glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: glowXSpring,
          y: glowYSpring,
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: cursorState.isHovering ? 300 : 200,
            height: cursorState.isHovering ? 300 : 200,
            opacity: cursorState.variant === "hidden" ? 0 : 1,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
          }}
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* Secondary trailing ring (for depth) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{
          x: glowXSpring,
          y: glowYSpring,
        }}
      >
        <motion.div
          className="rounded-full border"
          animate={{
            width: cursorState.isHovering ? 100 : 60,
            height: cursorState.isHovering ? 100 : 60,
            opacity: cursorState.variant === "hidden" ? 0 : 0.1,
            borderColor: "rgba(255,255,255,0.1)",
          }}
          transition={{
            type: "spring",
            damping: 40,
            stiffness: 150,
          }}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        @media (pointer: fine) {
          *,
          *::before,
          *::after {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  )
}
