import { Zap, Shield, BarChart3, GitBranch, Globe, Users, type LucideIcon } from "lucide-react"
import { features } from "@/config/site"
import { Section, Container, SectionHeader } from "@/components/section"
import { FadeIn } from "@/components/fade-in"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Shield,
  BarChart3,
  GitBranch,
  Globe,
  Users,
}

export function FeaturesSection() {
  return (
    <Section id="features">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Features"
            title="Everything you need to ship"
            description="A complete platform that handles the hard parts of modern software delivery — so your team can focus on what matters."
          />
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon] ?? Zap
            return (
              <FadeIn key={feature.title} delay={i * 0.07}>
                <FeatureCard
                  icon={<Icon className="h-5 w-5" aria-hidden="true" />}
                  title={feature.title}
                  description={feature.description}
                />
              </FadeIn>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </article>
  )
}
