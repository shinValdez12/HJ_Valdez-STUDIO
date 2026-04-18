"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

type Status = "idle" | "sending" | "success" | "error"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    // Simulate network request
    await new Promise((r) => setTimeout(r, 1800))
    setStatus("success")
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            className="flex flex-col items-center gap-6 py-20 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <CheckCircle size={28} className="text-emerald-500" />
            </motion.div>
            <div>
              <h3 className="mb-2 font-serif text-2xl font-medium text-foreground">Message sent!</h3>
              <p className="text-sm text-muted-foreground">
                Thanks for reaching out. I&apos;ll get back to you within 24 hours.
              </p>
            </div>
            <button
              onClick={() => { setStatus("idle"); setForm({ name: "", email: "", project: "", message: "" }) }}
              className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="project" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Project Type
              </label>
              <select
                id="project"
                name="project"
                value={form.project}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select a project type...</option>
                <option value="website">Website / Landing Page</option>
                <option value="app">Web Application</option>
                <option value="design-system">Design System</option>
                <option value="mobile">Mobile App</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Tell me about your project, timeline, and budget..."
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle size={14} />
                Something went wrong. Please try again.
              </div>
            )}

            <motion.button
              type="submit"
              disabled={status === "sending"}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-4 text-sm font-medium text-background transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
              whileTap={{ scale: 0.98 }}
            >
              {status === "sending" ? (
                <>
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-background/30 border-t-background"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
