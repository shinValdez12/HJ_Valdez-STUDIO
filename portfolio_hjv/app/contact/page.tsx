"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"

interface FormState {
  name: string
  email: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === "error") setStatus("idle")
  }

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navigation />

        <main className="min-h-screen bg-background pt-32 pb-24">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            {/* Header */}
            <motion.div
              className="mb-20 md:mb-32"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
                Get in Touch
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em]">
                Let&apos;s create
                <br />
                <span className="text-muted-foreground">something together</span>
              </h1>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left - Contact info */}
              <motion.div
                className="space-y-12"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div>
                  <h2 className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-4">
                    Email
                  </h2>
                  <a
                    href="mailto:hashimjaharadvaldez@gmail.com"
                    className="text-xl md:text-2xl font-light hover:text-muted-foreground transition-colors"
                    data-cursor="expand"
                  >
                    hashimjaharadvaldez@gmail.com
                  </a>
                </div>

                <div>
                  <h2 className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-4">
                    Location
                  </h2>
                  <p className="text-xl md:text-2xl font-light">
                    Philippines
                  </p>
                </div>

                <div>
                  <h2 className="text-muted-foreground text-xs tracking-[0.2em] uppercase mb-4">
                    Social
                  </h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "GitHub", href: "https://github.com/hjvaldez" },
                      { label: "LinkedIn", href: "https://linkedin.com/in/hjvaldez" },
                      { label: "Twitter", href: "https://twitter.com/hjvaldez" },
                    ].map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-light hover:text-muted-foreground transition-colors inline-flex items-center gap-2 group"
                        data-cursor="expand"
                      >
                        {link.label}
                        <motion.svg
                          className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </motion.svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Availability badge */}
                <motion.div
                  className="inline-flex items-center gap-3 px-5 py-3 border border-border rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm text-muted-foreground">Available for new projects</span>
                </motion.div>
              </motion.div>

              {/* Right - Contact form */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {status === "success" ? (
                  <motion.div
                    className="h-full flex flex-col items-center justify-center text-center py-16"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-light mb-2">Message Sent</h3>
                    <p className="text-muted-foreground mb-8">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-sm tracking-wide underline underline-offset-4 hover:text-muted-foreground transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                    {/* Name field */}
                    <div className="relative">
                      <label
                        htmlFor="name"
                        className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-3"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-border py-3 text-lg font-light focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
                        placeholder="Your name"
                        data-cursor="hidden"
                      />
                    </div>

                    {/* Email field */}
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-3"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-border py-3 text-lg font-light focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/50"
                        placeholder="your@email.com"
                        data-cursor="hidden"
                      />
                    </div>

                    {/* Message field */}
                    <div className="relative">
                      <label
                        htmlFor="message"
                        className="text-muted-foreground text-xs tracking-[0.2em] uppercase block mb-3"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-transparent border-b border-border py-3 text-lg font-light focus:outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground/50"
                        placeholder="Tell me about your project..."
                        data-cursor="hidden"
                      />
                    </div>

                    {/* Error message */}
                    {status === "error" && (
                      <motion.p
                        className="text-red-500 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errorMessage}
                      </motion.p>
                    )}

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      className="group relative w-full py-5 bg-foreground text-background text-xs tracking-[0.2em] uppercase overflow-hidden disabled:opacity-70"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      data-cursor="expand"
                    >
                      <span className="relative z-10">
                        {status === "loading" ? "Sending..." : "Send Message"}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-muted-foreground"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 border-t border-border bg-background">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-muted-foreground text-xs tracking-wider">
              &copy; {new Date().getFullYear()} HJ Valdez. All rights reserved.
            </span>
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                data-cursor="expand"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                data-cursor="expand"
              >
                Projects
              </Link>
              <Link
                href="/gallery"
                className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                data-cursor="expand"
              >
                Gallery
              </Link>
            </div>
          </div>
        </footer>

        <div className="grain" />
      </SmoothScroll>
    </>
  )
}
