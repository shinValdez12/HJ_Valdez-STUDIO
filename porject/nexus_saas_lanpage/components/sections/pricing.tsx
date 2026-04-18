"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { pricingPlans } from "@/config/site"
import { Section, Container, SectionHeader } from "@/components/section"
import { FadeIn } from "@/components/fade-in"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <Section id="pricing">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            description="Start for free. Scale as you grow. No hidden fees."
          />
        </FadeIn>

        {/* Billing toggle */}
        <FadeIn delay={0.1}>
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual billing"
              onClick={() => setAnnual((p) => !p)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                annual ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                  annual ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
            <span
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                annual ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Annual
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                Save 20%
              </span>
            </span>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <PricingCard plan={plan} annual={annual} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function PricingCard({
  plan,
  annual,
}: {
  plan: (typeof pricingPlans)[number]
  annual: boolean
}) {
  const price = annual ? plan.price.annual : plan.price.monthly

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-xl border p-7 transition-all duration-300",
        plan.featured
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/30"
          : "border-border bg-card hover:border-border/80 hover:shadow-md"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {plan.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-4xl font-bold tracking-tight">${price}</span>
          <span className="mb-1 text-sm text-muted-foreground">/month</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <ul className="mb-8 flex flex-col gap-3" role="list">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                plan.featured ? "text-primary" : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button
          className="w-full"
          variant={plan.featured ? "default" : "outline"}
        >
          {plan.cta}
        </Button>
      </div>
    </article>
  )
}
