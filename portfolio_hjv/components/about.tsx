"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { skills } from "@/lib/data"

export function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-32 md:py-48 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - About */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
              About
            </span>
            <h2 className="text-editorial text-4xl md:text-5xl lg:text-6xl font-light mt-4 tracking-[-0.02em]">
              Developer &<br />Digital Artist
            </h2>

            <div className="mt-12 space-y-6 text-muted-foreground text-editorial-body">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                I&apos;m Hashim Jahara Valdez, known as Shin. I work at the intersection of code and art, creating digital experiences that are both technically sophisticated and aesthetically compelling.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                With a background in full-stack development and a passion for visual design, I bring a unique perspective to every project. I believe that great software should be beautiful, and great art should be functional.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Currently focused on building immersive web experiences, mobile applications, and generative art systems. Open to collaborations and new opportunities.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {[
                { value: "1+", label: "Years Experience" },
                { value: "50+", label: "Projects Completed" },
                { value: "20+", label: "Happy Clients" },
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl md:text-4xl font-light tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-xs tracking-wider uppercase mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column - Skills */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
              Expertise
            </span>
            <h3 className="text-editorial text-2xl md:text-3xl font-light mt-4 tracking-[-0.01em]">
              Technologies & Tools
            </h3>

            <div className="mt-12 space-y-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="flex items-center justify-between py-4 border-b border-border/50 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-sm md:text-base font-light tracking-wide group-hover:text-foreground transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                    {skill.category}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Services */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="text-muted-foreground text-xs tracking-[0.3em] uppercase mb-6">
                Services
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  "Web Development",
                  "Mobile Apps",
                  "UI/UX Design",
                  "Digital Art",
                  "3D Graphics",
                  "Brand Identity",
                ].map((service) => (
                  <span
                    key={service}
                    className="px-4 py-2 border border-border text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors cursor-default"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <motion.div
        className="absolute -right-32 top-1/4 w-64 h-64 border border-border/20 rounded-full"
        style={{ y }}
      />
      <motion.div
        className="absolute -left-16 bottom-1/4 w-32 h-32 border border-border/10 rounded-full"
        style={{ y: useTransform(y, (v) => v * -0.5) }}
      />
    </section>
  )
}
