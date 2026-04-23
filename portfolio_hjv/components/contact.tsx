"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { contact } from "@/lib/data"

interface FormData {
  name: string
  email: string
  message: string
}

interface FormState {
  status: "idle" | "loading" | "success" | "error"
  message: string
}

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormState({ status: "error", message: "Please fill in all fields." })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setFormState({ status: "error", message: "Please enter a valid email address." })
      return
    }

    setFormState({ status: "loading", message: "" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setFormState({ status: "success", message: "Message sent successfully! I&apos;ll get back to you soon." })
        setFormData({ name: "", email: "", message: "" })
      } else {
        setFormState({ status: "error", message: data.error || "Something went wrong. Please try again." })
      }
    } catch {
      setFormState({ status: "error", message: "Failed to send message. Please try again later." })
    }
  }

  return (
    <section id="contact" className="relative py-32 md:py-48 bg-[#0a0a0a] text-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="text-[#a3a3a3] text-xs tracking-[0.3em] uppercase">
              Get in Touch
            </span>
            <h2 className="text-editorial text-4xl md:text-5xl lg:text-6xl font-light mt-4 tracking-[-0.02em]">
              Let&apos;s work<br />together
            </h2>

            <p className="mt-8 text-[#a3a3a3] text-editorial-body max-w-md">
              Have a project in mind or just want to chat? I&apos;m always open to discussing new opportunities and creative collaborations.
            </p>

            <div className="mt-12 space-y-6">
              <div>
                <p className="text-[#a3a3a3] text-xs tracking-[0.2em] uppercase mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-lg hover:text-[#a3a3a3] transition-colors"
                >
                  {contact.email}
                </a>
              </div>

              <div>
                <p className="text-[#a3a3a3] text-xs tracking-[0.2em] uppercase mb-2">
                  Location
                </p>
                <p className="text-lg">Available Worldwide</p>
              </div>

              <div>
                <p className="text-[#a3a3a3] text-xs tracking-[0.2em] uppercase mb-2">
                  Social
                </p>
                <div className="flex gap-6">
                  {["GitHub", "LinkedIn", "instagarm"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-sm tracking-wide hover:text-[#a3a3a3] transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[#a3a3a3] text-xs tracking-[0.2em] uppercase mb-3"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-[#333] py-4 text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-[#f5f5f5] transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[#a3a3a3] text-xs tracking-[0.2em] uppercase mb-3"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-[#333] py-4 text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-[#f5f5f5] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[#a3a3a3] text-xs tracking-[0.2em] uppercase mb-3"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-transparent border-b border-[#333] py-4 text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-[#f5f5f5] transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Status message */}
              {formState.message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm ${
                    formState.status === "success" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formState.message}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={formState.status === "loading"}
                className="w-full py-5 bg-[#f5f5f5] text-[#0a0a0a] text-sm tracking-[0.15em] uppercase hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState.status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-32 pt-12 border-t border-[#262626] flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[#666] text-sm">
            &copy; {new Date().getFullYear()} HJ Valdez. All rights reserved.
          </p>
          <p className="text-[#666] text-sm">
            Designed & Built with care
          </p>
        </motion.div>
      </div>
    </section>
  )
}
