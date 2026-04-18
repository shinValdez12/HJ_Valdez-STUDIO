import { steps } from "@/config/site"
import { Section, Container, SectionHeader } from "@/components/section"
import { FadeIn } from "@/components/fade-in"
import { cn } from "@/lib/utils"

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="bg-muted/20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="How it works"
            title="Three steps to production"
            description="Set up once. Ship forever. No DevOps degree required."
          />
        </FadeIn>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="pointer-events-none absolute top-10 left-0 right-0 hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent)",
            }}
            aria-hidden="true"
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.12}>
                <StepCard
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  isLast={i === steps.length - 1}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

function StepCard({
  step,
  title,
  description,
  isLast,
}: {
  step: string
  title: string
  description: string
  isLast: boolean
}) {
  return (
    <article className="relative flex flex-col gap-5">
      {/* Step number */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold",
            "border-primary bg-background text-primary"
          )}
          aria-hidden="true"
        >
          {step}
        </div>
        {!isLast && (
          <div
            className="h-px flex-1 bg-border lg:hidden"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </article>
  )
}
