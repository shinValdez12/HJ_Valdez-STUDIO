import { cn } from '@/lib/utils'
import FadeIn from './FadeIn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl', className)}>
      {eyebrow && (
        <FadeIn>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">{eyebrow}</p>
        </FadeIn>
      )}
      <FadeIn delay={0.05}>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
          {title}
        </h2>
      </FadeIn>
      {description && (
        <FadeIn delay={0.1}>
          <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed text-balance">
            {description}
          </p>
        </FadeIn>
      )}
    </div>
  )
}
