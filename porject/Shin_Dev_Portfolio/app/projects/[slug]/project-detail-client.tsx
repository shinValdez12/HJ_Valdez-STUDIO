"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import type { Project } from "@/lib/data"

interface Props {
  project: Project
}

export function ProjectDetailClient({ project }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[70vh] overflow-hidden">
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src={project.heroImage || project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex min-h-[70vh] flex-col justify-end px-6 pb-16 pt-32 md:px-8 md:pb-20"
        style={{ opacity }}
      >
        <div className="mx-auto w-full max-w-7xl">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
              All Projects
            </Link>
          </motion.div>

          <div className="flex flex-col gap-4">
            <motion.span
              className="font-mono text-xs uppercase tracking-[0.3em]"
              style={{ color: project.color }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {project.category}
            </motion.span>

            <motion.h1
              className="font-serif text-5xl font-bold text-foreground md:text-7xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              {project.title}
            </motion.h1>

            <motion.p
              className="max-w-xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              {project.subtitle}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
