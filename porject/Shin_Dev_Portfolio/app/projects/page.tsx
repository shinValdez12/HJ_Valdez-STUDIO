import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/page-transition"
import { projects } from "@/lib/data"

export const metadata: Metadata = {
  title: "Projects",
  description: "A curated selection of projects spanning design systems, web apps, mobile, and creative development.",
}

export default function ProjectsPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="px-6 pb-12 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <SectionReveal>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Portfolio</span>
              <h1 className="font-serif text-5xl font-bold text-foreground md:text-7xl">Projects</h1>
              <p className="max-w-xl text-balance leading-relaxed text-muted-foreground md:text-lg">
                A curated selection of work spanning design systems, full-stack applications, mobile apps, and experimental creative development.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Featured row — first 2 large */}
      <section className="px-6 pb-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.slice(0, 2).map((project, i) => (
              <SectionReveal key={project.id} delay={i * 0.1}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card"
                  data-cursor="project"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {project.category}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                    </div>
                    <h2 className="mb-1 font-serif text-2xl font-medium text-foreground">{project.title}</h2>
                    <p className="mb-4 text-sm text-muted-foreground">{project.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Rest as grid */}
      <section className="px-6 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.07}>
            {projects.slice(2).map((project) => (
              <StaggerItem key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-accent/5"
                  data-cursor="project"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute left-4 top-4">
                      <span
                        className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-background"
                        style={{ backgroundColor: project.color }}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-serif text-xl font-medium text-foreground">{project.title}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{project.subtitle}</p>
                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground/70">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </main>
  )
}
