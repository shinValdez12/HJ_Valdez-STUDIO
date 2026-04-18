'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Bed, Bath, Maximize2, MapPin, Tag } from 'lucide-react'
import { type Property } from '@/types'
import { formatPrice, formatArea } from '@/lib/format'
import { isFavorite, toggleFavorite } from '@/lib/favorites'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  onFavoriteChange?: (id: string, isFav: boolean) => void
}

export default function PropertyCard({ property, onFavoriteChange }: PropertyCardProps) {
  const [favorited, setFavorited] = useState(false)
  const [imgSrc, setImgSrc] = useState(property.images[0])

  useEffect(() => {
    setFavorited(isFavorite(property.id))
  }, [property.id])

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isNowFav = toggleFavorite(property.id)
    setFavorited(isNowFav)
    onFavoriteChange?.(property.id, isNowFav)
  }

  const statusColors: Record<string, string> = {
    'For Sale': 'bg-emerald-100 text-emerald-800',
    'For Rent': 'bg-blue-100 text-blue-700',
    Sold: 'bg-gray-100 text-gray-600',
    Pending: 'bg-amber-100 text-amber-700',
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <Link href={`/properties/${property.slug}`} aria-label={`View details for ${property.title}`}>
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={imgSrc}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc('/placeholder-property.jpg')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Status Badge */}
          <span
            className={cn(
              'absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold',
              statusColors[property.status],
            )}
          >
            {property.status}
          </span>

          {/* Featured badge */}
          {property.featured && (
            <span className="absolute top-3 left-[7.5rem] px-2.5 py-1 rounded-full text-xs font-semibold bg-accent text-white">
              Featured
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            aria-label={favorited ? `Remove ${property.title} from favorites` : `Save ${property.title}`}
            aria-pressed={favorited}
            className={cn(
              'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all',
              favorited
                ? 'bg-accent text-white'
                : 'bg-white/90 text-foreground hover:bg-white',
            )}
          >
            <Heart className={cn('w-4 h-4', favorited && 'fill-current')} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <p className="font-serif text-2xl font-bold text-foreground mb-1">
            {formatPrice(property.price, property.status)}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-base text-foreground mb-2 leading-snug">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" aria-hidden="true" />
            <span className="text-muted-foreground text-sm">{property.location}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border mb-4" />

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" aria-hidden="true" />
              <span>{property.bedrooms} <span className="sr-only">bedrooms</span></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" aria-hidden="true" />
              <span>{property.bathrooms} <span className="sr-only">bathrooms</span></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
              <span>{formatArea(property.area)}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
