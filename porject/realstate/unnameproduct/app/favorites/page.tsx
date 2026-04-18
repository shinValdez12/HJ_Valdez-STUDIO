'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Search } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/properties/PropertyCard'
import FadeIn from '@/components/shared/FadeIn'
import { properties } from '@/data/properties'
import { getFavoriteIds } from '@/lib/favorites'
import type { Property } from '@/types'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loaded, setLoaded] = useState(false)

  const loadFavorites = () => {
    const ids = getFavoriteIds()
    setFavorites(properties.filter((p) => ids.includes(p.id)))
    setLoaded(true)
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  const handleFavoriteChange = (_id: string, isFav: boolean) => {
    // Re-sync if removed
    if (!isFav) {
      loadFavorites()
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        {/* Header */}
        <div className="bg-foreground py-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">My Collection</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">Saved Properties</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {!loaded ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-secondary animate-pulse" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <Heart className="w-9 h-9 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">No Saved Properties</h2>
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                  You haven&apos;t saved any properties yet. Browse our listings and click the heart icon to save homes you love.
                </p>
              </div>
              <Link
                href="/properties"
                className="flex items-center gap-2 mt-2 px-7 py-3.5 rounded-md bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                Browse Properties
              </Link>
            </div>
          ) : (
            // Favorites grid
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold text-foreground">{favorites.length}</span>{' '}
                  saved {favorites.length === 1 ? 'property' : 'properties'}
                </p>
                <Link
                  href="/properties"
                  className="text-accent text-sm font-medium hover:underline"
                >
                  Browse more
                </Link>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                aria-label="Saved properties"
              >
                {favorites.map((property, i) => (
                  <FadeIn key={property.id} delay={i * 0.07}>
                    <PropertyCard
                      property={property}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  </FadeIn>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-16 bg-secondary rounded-2xl p-8 text-center">
                <p className="font-serif text-xl font-bold text-foreground mb-2">
                  Ready to take the next step?
                </p>
                <p className="text-muted-foreground text-sm mb-5">
                  Contact one of our agents to schedule viewings for any of your saved properties.
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-7 py-3 rounded-md bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Talk to an Agent
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
