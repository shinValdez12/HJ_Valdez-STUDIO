'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Bed, Bath, Maximize2, Car, Calendar, MapPin, Phone, Mail,
  Heart, Share2, ChevronRight, CheckCircle2, Home, Tag,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyGallery from '@/components/properties/PropertyGallery'
import PropertyCard from '@/components/properties/PropertyCard'
import InquiryForm from '@/components/shared/InquiryForm'
import FadeIn from '@/components/shared/FadeIn'
import { getPropertyBySlug, getRelatedProperties } from '@/data/properties'
import { formatPrice, formatArea, formatDate } from '@/lib/format'
import { isFavorite, toggleFavorite } from '@/lib/favorites'
import { cn } from '@/lib/utils'

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const property = getPropertyBySlug(slug)

  if (!property) notFound()

  const related = getRelatedProperties(property, 3)
  const [favorited, setFavorited] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setFavorited(isFavorite(property.id))
  }, [property.id])

  const handleFavorite = () => {
    const isNow = toggleFavorite(property.id)
    setFavorited(isNow)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silently
    }
  }

  const statusColors: Record<string, string> = {
    'For Sale': 'bg-emerald-100 text-emerald-800',
    'For Rent': 'bg-blue-100 text-blue-700',
    Sold: 'bg-gray-100 text-gray-600',
    Pending: 'bg-amber-100 text-amber-700',
  }

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <Link href="/properties" className="hover:text-accent transition-colors">Properties</Link>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{property.title}</span>
          </nav>

          {/* Gallery */}
          <FadeIn>
            <PropertyGallery images={property.images} title={property.title} />
          </FadeIn>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Title + Actions */}
              <FadeIn>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', statusColors[property.status])}>
                        {property.status}
                      </span>
                      {property.featured && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                          Featured
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-foreground border border-border">
                        {property.type}
                      </span>
                    </div>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm">{property.address}, {property.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleFavorite}
                      aria-pressed={favorited}
                      aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-md border text-sm font-medium transition-all',
                        favorited
                          ? 'bg-accent border-accent text-white'
                          : 'bg-card border-border text-foreground hover:border-accent/40',
                      )}
                    >
                      <Heart className={cn('w-4 h-4', favorited && 'fill-current')} aria-hidden="true" />
                      {favorited ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={handleShare}
                      aria-label="Copy link to clipboard"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
                    >
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                      {copied ? 'Copied!' : 'Share'}
                    </button>
                  </div>
                </div>
              </FadeIn>

              {/* Price + Stats */}
              <FadeIn delay={0.05}>
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Asking Price</p>
                      <p className="font-serif text-4xl font-bold text-foreground">
                        {formatPrice(property.price, property.status)}
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Listed {formatDate(property.listedDate)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                      { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                      { icon: Maximize2, label: 'Area', value: formatArea(property.area) },
                      { icon: Car, label: 'Garage', value: property.garage ? `${property.garage} car` : 'None' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary text-center">
                        <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                        <span className="font-semibold text-foreground text-base">{value}</span>
                        <span className="text-muted-foreground text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Description */}
              <FadeIn delay={0.08}>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">About This Property</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>
              </FadeIn>

              {/* Details Grid */}
              <FadeIn delay={0.1}>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-5">Property Details</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Property Type', value: property.type },
                      { label: 'Status', value: property.status },
                      { label: 'Year Built', value: property.yearBuilt },
                      { label: 'Bedrooms', value: property.bedrooms },
                      { label: 'Bathrooms', value: property.bathrooms },
                      { label: 'Living Area', value: formatArea(property.area) },
                      { label: 'Garage', value: property.garage ? `${property.garage} car` : 'None' },
                      { label: 'City', value: property.city },
                      { label: 'Listed', value: formatDate(property.listedDate) },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-card rounded-lg p-4 border border-border">
                        <p className="text-muted-foreground text-xs mb-1">{label}</p>
                        <p className="font-semibold text-foreground text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Amenities */}
              <FadeIn delay={0.12}>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-5">Features & Amenities</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 bg-card rounded-lg px-4 py-3 border border-border">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                        <span className="text-foreground text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Location */}
              <FadeIn delay={0.14}>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-5">Location</h2>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="h-56 bg-secondary flex items-center justify-center relative">
                      {/* Map placeholder — replace with Leaflet/Mapbox in production */}
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-10 h-10 text-accent mx-auto mb-3" aria-hidden="true" />
                          <p className="font-semibold text-foreground">{property.address}</p>
                          <p className="text-muted-foreground text-sm">{property.city}, CA</p>
                          <p className="text-muted-foreground text-xs mt-1">
                            {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <address className="text-sm text-muted-foreground not-italic">
                        {property.address}, {property.city}, CA
                      </address>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">

                {/* Agent Card */}
                <FadeIn direction="left">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="font-semibold text-foreground mb-5">Your Agent</h2>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={property.agent.avatar}
                          alt={property.agent.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{property.agent.name}</p>
                        <p className="text-muted-foreground text-xs">{property.agent.title}</p>
                      </div>
                    </div>
                    <div className="space-y-2.5 mb-5">
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                        {property.agent.phone}
                      </a>
                      <a
                        href={`mailto:${property.agent.email}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                        {property.agent.email}
                      </a>
                    </div>
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="block w-full text-center py-2.5 rounded-md border border-border text-sm font-semibold text-foreground hover:border-accent/40 transition-colors"
                    >
                      Call Agent
                    </a>
                  </div>
                </FadeIn>

                {/* Inquiry Form */}
                <FadeIn direction="left" delay={0.08}>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="font-semibold text-foreground mb-5">Request Viewing</h2>
                    <InquiryForm propertyTitle={property.title} compact />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>

          {/* Related Properties */}
          {related.length > 0 && (
            <div className="mt-20">
              <FadeIn>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Similar Properties
                </h2>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p, i) => (
                  <FadeIn key={p.id} delay={i * 0.07}>
                    <PropertyCard property={p} />
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
