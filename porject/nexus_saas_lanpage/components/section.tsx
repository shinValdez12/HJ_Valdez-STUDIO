import { cn } from "@/lib/utils"

interface SectionProps {
  id?: string
  className?: string
  children: React.ReactNode
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative w-full py-20 md:py-28 lg:py-32", className)}
    >
      {children}
    </section>
  )
}

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = true,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}) {
  return (
    <div className={cn("mb-14 max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
