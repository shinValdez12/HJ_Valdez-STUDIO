"use client"

import { motion } from "framer-motion"
import { experience as exp } from "@/lib/data"

interface Props {
  experience: typeof exp
}

export function AboutTimeline({ experience }: Props) {
  return (
    <div className="relative flex flex-col gap-0">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 hidden h-full w-px bg-border md:block" />

      {experience.map(({ role, company, period, description }, i) => (
        <motion.div
          key={i}
          className="group relative grid grid-cols-1 gap-4 pb-12 md:grid-cols-[220px_1fr] md:pl-12"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
        >
          {/* Dot */}
          <div className="absolute -left-[4.5px] top-1.5 hidden h-2.5 w-2.5 rounded-full border-2 border-accent bg-background md:block" />

          {/* Period */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground">{period}</span>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors group-hover:border-accent/30">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-medium text-foreground">{role}</h3>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">{company}</span>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
