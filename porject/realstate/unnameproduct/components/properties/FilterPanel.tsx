'use client'

import { type FilterState, type PropertyType, type PropertyStatus } from '@/types'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onReset: () => void
  activeCount: number
  className?: string
}

const propertyTypes: PropertyType[] = ['House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Land']
const statusOptions: PropertyStatus[] = ['For Sale', 'For Rent', 'Sold', 'Pending']
const bedroomOptions = ['1', '2', '3', '4', '5+']
const bathroomOptions = ['1', '2', '3', '4+']

const PRICE_MIN = 0
const PRICE_MAX = 10_000_000

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{label}</p>
      {children}
    </div>
  )
}

export default function FilterPanel({
  filters,
  onFilterChange,
  onReset,
  activeCount,
  className,
}: FilterPanelProps) {
  const update = (key: keyof FilterState, value: string | number) =>
    onFilterChange({ ...filters, [key]: value })

  const toggleArrayFilter = (key: 'type' | 'status', value: string) => {
    onFilterChange({ ...filters, [key]: filters[key] === value ? '' : value })
  }

  return (
    <aside
      className={cn('bg-card rounded-xl border border-border p-6 h-fit', className)}
      aria-label="Property filters"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" aria-hidden="true" />
          <h2 className="font-semibold text-foreground">Filters</h2>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-accent hover:underline"
          >
            <X className="w-3 h-3" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-7">
        {/* Property Type */}
        <FilterGroup label="Property Type">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by property type">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleArrayFilter('type', type)}
                aria-pressed={filters.type === type}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  filters.type === type
                    ? 'bg-accent border-accent text-white'
                    : 'bg-transparent border-border text-foreground hover:border-accent/50',
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Status */}
        <FilterGroup label="Status">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => toggleArrayFilter('status', status)}
                aria-pressed={filters.status === status}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  filters.status === status
                    ? 'bg-accent border-accent text-white'
                    : 'bg-transparent border-border text-foreground hover:border-accent/50',
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Price Range */}
        <FilterGroup label="Price Range">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label htmlFor="price-min" className="sr-only">Minimum price</label>
              <input
                id="price-min"
                type="number"
                min={0}
                max={filters.maxPrice}
                step={50000}
                value={filters.minPrice}
                onChange={(e) => update('minPrice', Number(e.target.value))}
                placeholder="Min"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <span className="text-muted-foreground text-sm">–</span>
            <div className="flex-1">
              <label htmlFor="price-max" className="sr-only">Maximum price</label>
              <input
                id="price-max"
                type="number"
                min={filters.minPrice}
                max={PRICE_MAX}
                step={50000}
                value={filters.maxPrice}
                onChange={(e) => update('maxPrice', Number(e.target.value))}
                placeholder="Max"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>
        </FilterGroup>

        {/* Bedrooms */}
        <FilterGroup label="Bedrooms">
          <div className="flex gap-2" role="group" aria-label="Filter by bedrooms">
            {bedroomOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => update('bedrooms', filters.bedrooms === opt ? '' : opt)}
                aria-pressed={filters.bedrooms === opt}
                className={cn(
                  'flex-1 py-1.5 rounded-md border text-xs font-medium transition-colors',
                  filters.bedrooms === opt
                    ? 'bg-accent border-accent text-white'
                    : 'border-border text-foreground hover:border-accent/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Bathrooms */}
        <FilterGroup label="Bathrooms">
          <div className="flex gap-2" role="group" aria-label="Filter by bathrooms">
            {bathroomOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => update('bathrooms', filters.bathrooms === opt ? '' : opt)}
                aria-pressed={filters.bathrooms === opt}
                className={cn(
                  'flex-1 py-1.5 rounded-md border text-xs font-medium transition-colors',
                  filters.bathrooms === opt
                    ? 'bg-accent border-accent text-white'
                    : 'border-border text-foreground hover:border-accent/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </FilterGroup>
      </div>
    </aside>
  )
}
