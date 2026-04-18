'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { type FAQ } from '@/types'
import FadeIn from './FadeIn'

interface FAQSectionProps {
  faqs: FAQ[]
  limit?: number
}

export default function FAQSection({ faqs, limit }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const items = limit ? faqs.slice(0, limit) : faqs

  return (
    <div className="max-w-3xl mx-auto" role="list" aria-label="Frequently asked questions">
      {items.map((faq, index) => (
        <FadeIn key={index} delay={index * 0.05} className="mb-3">
          <div
            className="bg-card rounded-xl border border-border overflow-hidden"
            role="listitem"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-secondary/50 transition-colors"
            >
              <span className="font-semibold text-foreground text-sm md:text-base leading-snug pr-2">
                {faq.question}
              </span>
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                {openIndex === index ? (
                  <Minus className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      ))}
    </div>
  )
}
