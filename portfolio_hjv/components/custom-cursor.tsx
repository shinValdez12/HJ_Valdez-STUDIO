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

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = {
    damping: 35,
    stiffness: 400,
    mass: 0.5,
    restSpeed: 0.001,
  }

  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const glowSpringConfig = {
    damping: 50,
    stiffness: 200,
    mass: 1,
  }

  const glowXSpring = useSpring(cursorX, glowSpringConfig)
  const glowYSpring = useSpring(cursorY, glowSpringConfig)

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
      setCursorState({ isHovering: true, text: "", variant: "expand" })
    }
  }, [])

  const handleElementLeave = useCallback(() => {
    setCursorState({ isHovering: false, text: "", variant: "default" })
  }, [])

  useEffect(() => {
    const hasPointer = window.matchMedia("(pointer: fine)").matches
    if (!hasPointer) return

    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", () => setIsPressed(true))
    window.addEventListener("mouseup", () => setIsPressed(false))

    const setupListeners = () => {
      const elements = document.querySelectorAll(
        "a, button, [data-cursor], input, textarea, select, [role='button']"
      )

      elements.forEach((el) => {
        el.addEventListener("mouseenter", handleElementHover)
        el.addEventListener("mouseleave", handleElementLeave)
      })
    }

    setupListeners()

    const observer = new MutationObserver(setupListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()
    }
  }, [cursorX, cursorY, handleElementHover, handleElementLeave])

  if (!isVisible) return null

  const size =
    cursorState.variant === "expand"
      ? { width: 64, height: 64 }
      : cursorState.variant === "text" ||
        cursorState.variant === "view" ||
        cursorState.variant === "inspect"
      ? { width: 100, height: 100 }
      : cursorState.variant === "link"
      ? { width: 48, height: 48 }
      : cursorState.variant === "drag"
      ? { width: 80, height: 80 }
      : cursorState.variant === "hidden"
      ? { width: 0, height: 0 }
      : { width: 10, height: 10 }

  return (
    <>
      {/* MAIN CURSOR */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full"
          animate={{
            width: size.width,
            height: size.height,
            x: -size.width / 2,
            y: -size.height / 2,

            backgroundColor:
              cursorState.variant === "text" ||
              cursorState.variant === "view" ||
              cursorState.variant === "inspect"
                ? "rgba(0, 0, 0, 0.85)"
                : cursorState.variant === "expand" ||
                  cursorState.variant === "link"
                ? "rgba(0, 0, 0, 0.10)"
                : "rgba(0, 0, 0, 0.9)",

            borderWidth:
              cursorState.variant === "expand" ||
              cursorState.variant === "link" ||
              cursorState.variant === "drag"
                ? 1
                : 0,

            borderColor: "rgba(0, 0, 0, 0.2)",
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            mass: 0.3,
          }}
        >
          {/* TEXT */}
          <AnimatePresence mode="wait">
            {(cursorState.variant === "text" ||
              cursorState.variant === "view" ||
              cursorState.variant === "inspect") &&
              cursorState.text && (
                <motion.span
                  key="cursor-text"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-[10px] font-medium text-white uppercase tracking-widest"
                >
                  {cursorState.text}
                </motion.span>
              )}
          </AnimatePresence>

          {/* INNER DOT */}
          {(cursorState.variant === "expand" ||
            cursorState.variant === "link") && (
            <motion.div className="absolute w-1.5 h-1.5 rounded-full bg-black" />
          )}
        </motion.div>
      </motion.div>

      {/* GLOW */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ x: glowXSpring, y: glowYSpring }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: cursorState.isHovering ? 300 : 200,
            height: cursorState.isHovering ? 300 : 200,
            opacity: cursorState.variant === "hidden" ? 0 : 1,
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* RING */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{ x: glowXSpring, y: glowYSpring }}
      >
        <motion.div
          className="rounded-full border"
          animate={{
            width: cursorState.isHovering ? 100 : 60,
            height: cursorState.isHovering ? 100 : 60,
            opacity: cursorState.variant === "hidden" ? 0 : 0.12,
            borderColor: "rgba(0,0,0,0.15)",
          }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </motion.div>

      {/* HIDE CURSOR */}
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