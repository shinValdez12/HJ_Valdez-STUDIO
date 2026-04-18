"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion"

interface CursorState {
  isHovering: boolean
  text: string
  variant: "default" | "expand" | "text" | "hidden"
}

export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    text: "",
    variant: "default",
  })
  const [isVisible, setIsVisible] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasPointer = window.matchMedia("(pointer: fine)").matches
    if (!hasPointer) return

    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    // Handle hover states for interactive elements
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement
      const cursorType = target.closest("[data-cursor]")?.getAttribute("data-cursor")
      const cursorText = target.closest("[data-cursor-text]")?.getAttribute("data-cursor-text")

      if (cursorType === "expand") {
        setCursorState({ isHovering: true, text: "", variant: "expand" })
      } else if (cursorType === "text" && cursorText) {
        setCursorState({ isHovering: true, text: cursorText, variant: "text" })
      } else if (cursorType === "hidden") {
        setCursorState({ isHovering: false, text: "", variant: "hidden" })
      }
    }

    const handleElementLeave = () => {
      setCursorState({ isHovering: false, text: "", variant: "default" })
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    // Add event listeners to all interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, [data-cursor], input, textarea, select"
    )
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementHover)
      el.addEventListener("mouseleave", handleElementLeave)
    })

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(
        "a, button, [data-cursor], input, textarea, select"
      )
      newElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover)
        el.removeEventListener("mouseleave", handleElementLeave)
        el.addEventListener("mouseenter", handleElementHover)
        el.addEventListener("mouseleave", handleElementLeave)
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover)
        el.removeEventListener("mouseleave", handleElementLeave)
      })
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  if (!isVisible) return null

  const getCursorSize = () => {
    switch (cursorState.variant) {
      case "expand":
        return { width: 60, height: 60 }
      case "text":
        return { width: 100, height: 100 }
      case "hidden":
        return { width: 0, height: 0 }
      default:
        return { width: 12, height: 12 }
    }
  }

  const size = getCursorSize()

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full bg-white"
          animate={{
            width: size.width,
            height: size.height,
            x: -size.width / 2,
            y: -size.height / 2,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            mass: 0.5,
          }}
        >
          <AnimatePresence mode="wait">
            {cursorState.variant === "text" && cursorState.text && (
              <motion.span
                key="cursor-text"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xs font-medium text-black tracking-wide uppercase"
              >
                {cursorState.text}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Cursor glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="w-[200px] h-[200px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: cursorState.isHovering ? 1.5 : 1,
            opacity: cursorState.variant === "hidden" ? 0 : 1,
          }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 200,
          }}
        />
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  )
}
