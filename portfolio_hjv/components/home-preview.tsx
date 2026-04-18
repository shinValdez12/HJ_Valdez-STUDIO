"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { projects, artworks } from "@/lib/data"
import { RevealSection } from "./page-transition"

export function ProjectsPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <RevealSection className="relative py-32 md:py-48 overflow-hidden bg-background">
      <div ref={containerRef} className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <motion.span
              className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Selected Work
            </motion.span>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Projects
            </motion.h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:flex items-center gap-4 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors group"
            data-cursor="expand"
          >
            <span>View All</span>
            <motion.span
              className="inline-block"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              &rarr;
            </motion.span>
          </Link>
        </div>

        {/* Horizontal scrolling projects */}
        <motion.div className="flex gap-8" style={{ x }}>
          {featuredProjects.map((project, i) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group relative flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[40vw]"
              data-cursor="text"
              data-cursor-text="View"
            >
              <motion.div
                className="relative aspect-[4/3] overflow-hidden bg-muted"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-500" />
              </motion.div>
              
              <div className="mt-6 flex items-start justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-muted-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{project.shortDescription}</p>
                </div>
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  {project.category}
                </span>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Mobile view all */}
        <Link
          href="/projects"
          className="md:hidden flex items-center justify-center gap-4 mt-12 text-sm tracking-wide text-foreground"
          data-cursor="expand"
        >
          <span>View All Projects</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </RevealSection>
  )
}

export function GalleryPreview() {
  const previewArtworks = artworks.slice(0, 4)

  return (
    <RevealSection className="relative py-32 md:py-48 bg-charcoal text-cream">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <motion.span
              className="text-cream/50 text-xs tracking-[0.3em] uppercase block mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Digital Art
            </motion.span>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Gallery
            </motion.h2>
          </div>
          <Link
            href="/gallery"
            className="hidden md:flex items-center gap-4 text-sm tracking-wide text-cream/60 hover:text-cream transition-colors"
            data-cursor="expand"
          >
            <span>Enter Gallery</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Gallery grid preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {previewArtworks.map((artwork, i) => (
            <Link
              key={artwork.id}
              href="/gallery"
              className="group relative overflow-hidden"
              data-cursor="text"
              data-cursor-text="View"
            >
              <motion.div
                className="aspect-[3/4] relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Spotlight effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Title reveal */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                >
                  <span className="text-cream text-sm font-light">{artwork.title}</span>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <Link
          href="/gallery"
          className="md:hidden flex items-center justify-center gap-4 mt-12 text-sm tracking-wide text-cream"
          data-cursor="expand"
        >
          <span>Enter Gallery</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </RevealSection>
  )
}

export function AboutPreview() {
  return (
    <RevealSection className="relative py-32 md:py-48 bg-background">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Left - Text */}
          <div>
            <motion.span
              className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              About
            </motion.span>
            
            <motion.h2
              className="text-3xl md:text-5xl font-light tracking-[-0.02em] leading-[1.2] mb-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Building at the intersection of
              <span className="text-muted-foreground"> technology</span> and
              <span className="text-muted-foreground"> art</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground leading-relaxed mb-8 max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              I create digital experiences that merge functional excellence with artistic vision.
              From web applications to native mobile apps, every project is crafted with attention
              to detail and a focus on user experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 text-sm tracking-wide group"
                data-cursor="expand"
              >
                <span>Get in Touch</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </motion.div>
          </div>

          {/* Right - Stats */}
          <div className="grid grid-cols-2 gap-8">
            {[
              { number: "5+", label: "Years Experience" },
              { number: "30+", label: "Projects Completed" },
              { number: "15+", label: "Happy Clients" },
              { number: "3", label: "Design Awards" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
              >
                <span className="text-4xl md:text-5xl font-light tracking-tight block mb-2">
                  {stat.number}
                </span>
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  )
}
