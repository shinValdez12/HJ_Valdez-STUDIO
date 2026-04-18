import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SectionReveal } from "@/components/page-transition"
import { GalleryGrid } from "./gallery-grid"

export const metadata: Metadata = {
  title: "Gallery",
  description: "A collection of digital art, generative works, and creative experiments.",
}

export default function GalleryPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="px-6 pb-12 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <SectionReveal>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Creative Works</span>
              <h1 className="font-serif text-5xl font-bold text-foreground md:text-7xl">Gallery</h1>
              <p className="max-w-lg text-balance leading-relaxed text-muted-foreground md:text-lg">
                Digital art, generative experiments, and explorations outside of client work. A space for pure creative expression.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <GalleryGrid />
        </div>
      </section>

      <Footer />
    </main>
  )
}
