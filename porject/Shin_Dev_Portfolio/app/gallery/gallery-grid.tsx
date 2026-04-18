"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn } from "lucide-react"
import { galleryItems } from "@/lib/data"

export function GalleryGrid() {
  const [selected, setSelected] = useState<typeof galleryItems[0] | null>(null)

  return (
    <>
      {/* Masonry-style grid */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {galleryItems.map((item, i) => (
          <motion.div
            key={item.id}
            className="mb-4 break-inside-avoid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
          >
            <motion.div
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setSelected(item)}
              data-cursor="hover"
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: i % 3 === 1 ? "3/4" : "4/3" }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="font-serif text-base font-medium text-foreground">{item.title}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{item.medium}</span>
                </div>
                {/* Zoom icon */}
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-background/20 bg-background/10 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn size={14} className="text-foreground" />
                </div>
              </div>

              {/* Info bar */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{item.medium}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{item.year}</span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <X size={14} />
              </button>

              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>

              {/* Caption */}
              <div className="flex items-start justify-between p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-xl font-medium text-foreground">{selected.title}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {selected.medium} · {selected.year}
                  </span>
                </div>
                {/* Color swatch */}
                <div
                  className="h-6 w-6 rounded-full border border-border/50"
                  style={{ backgroundColor: selected.color }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
