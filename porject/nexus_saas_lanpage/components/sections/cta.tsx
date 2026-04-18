import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/fade-in"
import { siteConfig } from "@/config/site"

export function CTASection() {
  return (
    <section
      className="relative overflow-hidden border-t border-border bg-background py-24 md:py-32"
      aria-label="Call to action"
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <FadeIn>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
            Get started today
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Ready to ship faster?
          </h2>
          <p className="mb-10 text-base leading-relaxed text-muted-foreground md:text-lg">
            Join thousands of engineering teams that use {siteConfig.name} to deploy with
            confidence. Start for free — no credit card required.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 text-sm font-semibold">
              <Link href="#pricing">
                Start building for free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-sm font-semibold">
              <Link href="#features">See all features</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Free plan available &bull; No credit card &bull; Cancel anytime
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
