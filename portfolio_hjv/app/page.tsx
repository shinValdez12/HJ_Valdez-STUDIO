"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Intro } from "@/components/intro"
import { Hero } from "@/components/hero"
import { ProjectsPreview, GalleryPreview, AboutPreview } from "@/components/home-preview"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"

const ThreeBackgroundLight = dynamic(
  () => import("@/components/three-background").then((mod) => mod.ThreeBackgroundLight),
  { ssr: false }
)

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hjv-intro-seen")
    if (hasSeenIntro) {
      setShowIntro(false)
      setHasLoadedBefore(true)
    }
    setIsReady(true)
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    sessionStorage.setItem("hjv-intro-seen", "true")
  }

  if (!isReady) {
    return null
  }

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {showIntro && !hasLoadedBefore && (
          <Intro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {(!showIntro || hasLoadedBefore) && (
        <SmoothScroll>
          <Navigation />
          <ThreeBackgroundLight />
          <main className="relative z-10">
            <Hero />
            <ProjectsPreview />
            <GalleryPreview />
            <AboutPreview />
            
            {/* Footer */}
            <footer className="py-12 px-6 md:px-12 border-t border-border">
              <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <span className="text-muted-foreground text-xs tracking-wider">
                  &copy; {new Date().getFullYear()} HJ Valdez. All rights reserved.
                </span>
                <div className="flex items-center gap-8">
                  <a
                    href="mailto:hashimjaharadvaldez@gmail.com"
                    className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    data-cursor="expand"
                  >
                    Email
                  </a>
                  <a
                    href="https://github.com/shinValdez12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    data-cursor="expand"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/hashim-jahara-d-valdez-245a20374/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    data-cursor="expand"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </footer>
          </main>
          <div className="grain" />
        </SmoothScroll>
      )}
    </>
  )
}
