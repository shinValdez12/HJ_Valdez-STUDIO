import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight, ExternalLink, Github, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SectionReveal, StaggerContainer, StaggerItem } from "@/components/page-transition"
import { ProjectDetailClient } from "./project-detail-client"
import { projects } from "@/lib/data"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <ProjectDetailClient project={project} />

      {/* Meta grid */}
      <section className="border-b border-border px-6 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionReveal>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { label: "Role", value: project.role },
                { label: "Year", value: project.year },
                { label: "Category", value: project.category },
                { label: "Tech", value: project.tech.slice(0, 2).join(", ") + (project.tech.length > 2 ? "…" : "") },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_340px]">
            {/* Main content */}
            <div className="flex flex-col gap-16">
              <SectionReveal>
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">Overview</span>
                  <p className="text-lg leading-relaxed text-muted-foreground">{project.overview}</p>
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent">The Challenge</span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{project.challenge}</p>
                  </div>
                  <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent">The Solution</span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{project.solution}</p>
                  </div>
                </div>
              </SectionReveal>

              <SectionReveal>
                <div className="flex flex-col gap-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">Key Features</span>
                  <StaggerContainer className="grid grid-cols-1 gap-3 sm:grid-cols-2" staggerDelay={0.06}>
                    {project.features.map((feature) => (
                      <StaggerItem key={feature}>
                        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span className="text-sm leading-relaxed text-muted-foreground">{feature}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </SectionReveal>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <SectionReveal>
                  <div className="flex flex-col gap-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent">Gallery</span>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {project.gallery.map((img, i) => (
                        <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border">
                          <Image
                            src={img}
                            alt={`${project.title} screenshot ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-8">
              <SectionReveal>
                <div className="sticky top-28 flex flex-col gap-6">
                  {/* Links */}
                  {(project.liveUrl || project.githubUrl) && (
                    <div className="rounded-2xl border border-border bg-card p-5">
                      <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">Links</span>
                      <div className="flex flex-col gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            <span className="flex items-center gap-2">
                              <ExternalLink size={13} />
                              Live Site
                            </span>
                            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:border-accent/50 hover:text-accent"
                          >
                            <span className="flex items-center gap-2">
                              <Github size={13} />
                              GitHub
                            </span>
                            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tech stack */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">Tech Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span key={t} className="rounded-full bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Next / Prev navigation */}
      <section className="border-t border-border px-6 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionReveal>
            <div className="flex flex-col items-stretch gap-4 sm:flex-row">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="group flex flex-1 flex-col gap-2 rounded-2xl border border-border p-6 transition-colors hover:border-foreground/20 hover:bg-surface"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Previous</span>
                  <span className="flex items-center gap-2 font-serif text-lg font-medium text-foreground">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    {prevProject.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{prevProject.subtitle}</span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group flex flex-1 flex-col items-end gap-2 rounded-2xl border border-border p-6 text-right transition-colors hover:border-foreground/20 hover:bg-surface"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Next</span>
                  <span className="flex items-center gap-2 font-serif text-lg font-medium text-foreground">
                    {nextProject.title}
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-xs text-muted-foreground">{nextProject.subtitle}</span>
                </Link>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
