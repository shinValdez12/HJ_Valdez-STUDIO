"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { projects } from "@/lib/data"

interface PlaneCardProps {
  project: typeof projects[0]
  index: number
  scrollProgress: MotionValue<number>
  total: number
}

function PlaneCard({ project, index, scrollProgress, total }: PlaneCardProps) {
  const isEven = index % 2 === 0
  const col = index % 3

  // Each card gets unique parallax values based on position
  const yRange: [number, number] =
    col === 0 ? [80, -80] : col === 1 ? [-60, 60] : [40, -40]
  const rotateXRange: [number, number] = isEven ? [8, -6] : [-6, 8]
  const rotateYRange: [number, number] =
    col === 0 ? [-6, 4] : col === 1 ? [4, -4] : [-4, 6]
  const scaleRange: [number, number] = isEven ? [0.92, 1.04] : [1.04, 0.92]

  const y = useTransform(scrollProgress, [0, 1], yRange)
  const rotateX = useTransform(scrollProgress, [0, 1], rotateXRange)
  const rotateY = useTransform(scrollProgress, [0, 1], rotateYRange)
  const scale = useTransform(scrollProgress, [0, 1], scaleRange)

  const springY = useSpring(y, { stiffness: 60, damping: 18 })
  const springRotateX = useSpring(rotateX, { stiffness: 60, damping: 18 })
  const springRotateY = useSpring(rotateY, { stiffness: 60, damping: 18 })
  const springScale = useSpring(scale, { stiffness: 60, damping: 18 })

  // Hover state
  const hoverRotateX = useMotionValue(0)
  const hoverRotateY = useMotionValue(0)
  const hoverZ = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    hoverRotateY.set(dx * 8)
    hoverRotateX.set(-dy * 8)
    hoverZ.set(20)
  }

  const handleMouseLeave = () => {
    hoverRotateX.set(0)
    hoverRotateY.set(0)
    hoverZ.set(0)
  }

  return (
    <motion.div
      className="group relative"
      style={{
        y: springY,
        scale: springScale,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        zIndex: index,
      }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: hoverRotateX,
          rotateY: hoverRotateY,
          z: hoverZ,
          transformStyle: "preserve-3d",
          transformPerspective: 800,
        }}
        data-cursor="project"
      >
        <Link href={`/projects/${project.slug}`}>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-accent/10">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-foreground/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-background/40 bg-background/20 backdrop-blur-sm">
                  <ArrowUpRight size={20} className="text-background" />
                </div>
              </motion.div>
              {/* Category badge */}
              <div className="absolute left-4 top-4">
                <span className="rounded-full border border-background/20 bg-background/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-background backdrop-blur-sm">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="font-serif text-xl font-medium text-foreground">{project.title}</h3>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{project.year}</span>
              </div>
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* 3D depth shadow layer */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,0.06),
                  0 0 0 1px rgba(255,255,255,0.04)
                `,
              }}
            />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export function ScrollVelocityProjects() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  return (
    <section ref={ref} className="relative overflow-hidden py-32">
      {/* Section header */}
      <div className="mx-auto mb-20 max-w-7xl px-6 md:px-8">
        <motion.div
          className="flex items-end justify-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              Selected Work
            </span>
            <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
              Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="group hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
          >
            View all
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>

      {/* 3D plane grid */}
      <div
        className="mx-auto max-w-7xl px-6 md:px-8"
        style={{ perspective: "1200px" }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <PlaneCard
              key={project.id}
              project={project}
              index={i}
              scrollProgress={scrollYProgress}
              total={projects.length}
            />
          ))}
        </div>
      </div>

      {/* Mobile view all */}
      <div className="mx-auto mt-12 flex max-w-7xl justify-center px-6 md:hidden">
        <Link
          href="/projects"
          className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
        >
          View all projects
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  )
}
