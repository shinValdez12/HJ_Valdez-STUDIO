import { trustedLogos } from "@/config/site"
import { Container } from "@/components/section"
import { FadeIn } from "@/components/fade-in"

export function LogosSection() {
  return (
    <section
      className="relative border-y border-border bg-muted/30 py-10"
      aria-label="Trusted by"
    >
      <Container>
        <FadeIn>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by engineering teams at
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
            aria-label="Partner logos"
          >
            {trustedLogos.map((logo) => (
              <LogoPlaceholder key={logo.name} name={logo.name} />
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="flex h-7 items-center justify-center opacity-40 transition-opacity duration-300 hover:opacity-70"
      aria-label={name}
    >
      <span className="text-sm font-bold tracking-tight text-foreground" aria-hidden="false">
        {name}
      </span>
    </div>
  )
}
