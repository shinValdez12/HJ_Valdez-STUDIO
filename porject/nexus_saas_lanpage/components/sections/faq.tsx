"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { faqs } from "@/config/site"
import { Section, Container, SectionHeader } from "@/components/section"
import { FadeIn } from "@/components/fade-in"
import { cn } from "@/lib/utils"

export function FAQSection() {
  return (
    <Section id="faq">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Everything you need to know about Nexus. Can&apos;t find an answer? Talk to our team."
          />
        </FadeIn>

        <div className="mx-auto max-w-2xl">
          <dl className="flex flex-col divide-y divide-border" role="list">
            {faqs.map((faq, i) => (
              <FadeIn key={faq.question} delay={i * 0.05}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </FadeIn>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <dt>
        <button
          onClick={() => setOpen((p) => !p)}
          aria-expanded={open}
          className={cn(
            "group flex w-full items-start justify-between gap-4 py-5 text-left",
            "text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          )}
        >
          <span>{question}</span>
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-200",
              open && "rotate-45 border-primary bg-primary/10 text-primary"
            )}
            aria-hidden="true"
          >
            <Plus className="h-3 w-3" />
          </span>
        </button>
      </dt>
      <AnimatePresence initial={false}>
        {open && (
          <motion.dd
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
          </motion.dd>
        )}
      </AnimatePresence>
    </div>
  )
}
