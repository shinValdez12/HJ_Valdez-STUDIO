"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { projects } from "@/lib/data"

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  const featuredProjects = projects.filter((p) => p.featured)

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative py-32 md:py-48 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          className="mb-20 md:mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
            Selected Work
          </span>
          <h2 className="text-editorial text-4xl md:text-6xl lg:text-7xl font-light mt-4 tracking-[-0.02em]">
            Projects
          </h2>
        </motion.div>

        {/* Featured projects grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.76, 0, 0.24, 1],
              }}
              className={index === 0 ? "lg:col-span-2" : ""}
            >
              <Link href={`/projects/${project.slug}`}>
                <ProjectCard project={project} large={index === 0} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* All projects link */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
          >
            View All Projects
            <span className="w-8 h-[1px] bg-current transition-all group-hover:w-12" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: (typeof projects)[0]
  large?: boolean
}

function ProjectCard({ project, large }: ProjectCardProps) {
  return (
    <motion.article
      className="group relative overflow-hidden bg-secondary/30 cursor-pointer"
      whileHover="hover"
    >
      {/* Image container */}
      <div
        className={`relative overflow-hidden ${
          large ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <motion.div
          className="absolute inset-0"
          variants={{
            hover: { scale: 1.05 },
          }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes={large ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
          />
        </motion.div>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-foreground/0 backdrop-blur-0"
          variants={{
            hover: { 
              backgroundColor: "rgba(10, 10, 10, 0.4)",
              backdropFilter: "blur(4px)",
            },
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Hover content */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
          initial={{ opacity: 0 }}
          variants={{
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs tracking-wider uppercase bg-background/20 text-background backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              {project.category}
            </span>
            <h3 className="text-xl md:text-2xl font-light mt-2 tracking-[-0.01em] group-hover:text-muted-foreground transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-3 line-clamp-2 max-w-xl">
              {project.shortDescription}
            </p>
          </div>
          <motion.div
            className="flex-shrink-0 w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center"
            variants={{
              hover: { 
                scale: 1.1,
                borderColor: "rgba(10, 10, 10, 0.5)",
              },
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 17L17 7M17 7H7M17 7V17"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.article>
  )
}
