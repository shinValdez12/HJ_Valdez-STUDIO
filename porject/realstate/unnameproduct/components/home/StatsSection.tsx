'use client'

import { useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import SectionWrapper from '@/components/shared/SectionWrapper'
import FadeIn from '@/components/shared/FadeIn'

const stats = [
  { value: '18+', label: 'Years in Business', description: 'Trusted expertise since 2006' },
  { value: '4,200+', label: 'Homes Sold', description: 'Across greater Los Angeles' },
  { value: '$2.4B', label: 'Total Transactions', description: 'In residential & commercial' },
  { value: '98%', label: 'Client Satisfaction', description: 'Based on verified reviews' },
]

export default function StatsSection() {
  return (
    <SectionWrapper className="bg-secondary border-y border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.1} direction="up">
            <div className="text-center">
              <p className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
                {stat.value}
              </p>
              <p className="font-semibold text-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-muted-foreground text-xs">{stat.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  )
}
