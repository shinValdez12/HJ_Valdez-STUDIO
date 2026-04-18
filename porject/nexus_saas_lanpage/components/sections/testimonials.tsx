import { testimonials } from "@/config/site"
import { Section, Container, SectionHeader } from "@/components/section"
import { FadeIn } from "@/components/fade-in"
import { cn } from "@/lib/utils"

export function TestimonialsSection() {
  return (
    <Section className="bg-muted/20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Testimonials"
            title="Loved by engineers worldwide"
            description="Don&apos;t take our word for it. Here&apos;s what teams building on Nexus have to say."
          />
        </FadeIn>

        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {testimonials.map((testimonial, i) => (
            <FadeIn key={testimonial.author} delay={i * 0.07} className="mb-6 break-inside-avoid">
              <TestimonialCard testimonial={testimonial} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number]
}) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
      )}
    >
      {/* Stars */}
      <div className="flex gap-0.5" aria-label="5 out of 5 stars" role="img">
        {Array.from({ length: 5 }).map((_, j) => (
          <svg
            key={j}
            className="h-4 w-4 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <blockquote className="text-sm leading-relaxed text-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary"
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="text-sm font-semibold">{testimonial.author}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </figcaption>
    </figure>
  )
}
