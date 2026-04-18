'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PropertyType } from '@/types'

interface SearchBarProps {
  className?: string
  initialValues?: { keyword?: string; location?: string; type?: string }
  onSearch?: (values: { keyword: string; location: string; type: string }) => void
  variant?: 'hero' | 'inline'
}

const propertyTypes: PropertyType[] = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land']

export default function SearchBar({ className, initialValues, onSearch, variant = 'hero' }: SearchBarProps) {
  const router = useRouter()
  const [keyword, setKeyword] = useState(initialValues?.keyword ?? '')
  const [location, setLocation] = useState(initialValues?.location ?? '')
  const [type, setType] = useState(initialValues?.type ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (location) params.set('location', location)
    if (type) params.set('type', type)
    if (onSearch) {
      onSearch({ keyword, location, type })
    } else {
      router.push(`/properties${params.toString() ? `?${params}` : ''}`)
    }
  }

  const isHero = variant === 'hero'

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden',
        isHero ? 'shadow-2xl' : 'shadow-sm border border-border',
        className,
      )}
      role="search"
      aria-label="Search properties"
    >
      {/* Keyword */}
      <div className={cn('flex items-center gap-3 flex-1 bg-white px-5 py-4 md:border-r border-border/30', !isHero && 'bg-card')}>
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
        <label htmlFor="sb-keyword" className="sr-only">Search by keyword</label>
        <input
          id="sb-keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by keyword, title..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Location */}
      <div className={cn('flex items-center gap-3 flex-1 bg-white px-5 py-4 md:border-r border-border/30 border-t md:border-t-0', !isHero && 'bg-card')}>
        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
        <label htmlFor="sb-location" className="sr-only">Filter by location</label>
        <input
          id="sb-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, neighborhood..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Type */}
      <div className={cn('flex items-center bg-white px-5 py-4 border-t md:border-t-0', !isHero && 'bg-card')}>
        <label htmlFor="sb-type" className="sr-only">Property type</label>
        <select
          id="sb-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-transparent text-sm text-foreground focus:outline-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Property Types</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={cn(
          'flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity',
          isHero ? 'border-t md:border-t-0' : '',
        )}
      >
        <Search className="w-4 h-4" aria-hidden="true" />
        Search
      </button>
    </form>
  )
}
