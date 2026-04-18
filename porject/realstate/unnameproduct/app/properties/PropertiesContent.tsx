'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, Home } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PropertyCard from '@/components/properties/PropertyCard'
import FilterPanel from '@/components/properties/FilterPanel'
import SearchBar from '@/components/properties/SearchBar'
import { properties } from '@/data/properties'
import type { FilterState, SortOption } from '@/types'
import { formatPrice } from '@/lib/format'

const ITEMS_PER_PAGE = 9

const DEFAULT_FILTERS: FilterState = {
  keyword: '',
  location: '',
  type: '',
  status: '',
  minPrice: 0,
  maxPrice: 10_000_000,
  bedrooms: '',
  bathrooms: '',
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

function countActive(filters: FilterState): number {
  let count = 0
  if (filters.keyword) count++
  if (filters.location) count++
  if (filters.type) count++
  if (filters.status) count++
  if (filters.minPrice > 0) count++
  if (filters.maxPrice < 10_000_000) count++
  if (filters.bedrooms) count++
  if (filters.bathrooms) count++
  return count
}

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    keyword: searchParams.get('keyword') ?? '',
    location: searchParams.get('location') ?? '',
    type: searchParams.get('type') ?? '',
    status: searchParams.get('status') ?? '',
  }))
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) ?? 'newest')
  const [page, setPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Reset page on filter/sort change
  useEffect(() => { setPage(1) }, [filters, sort])

  const filtered = useMemo(() => {
    let result = [...properties]

    // Keyword
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.city.toLowerCase().includes(kw) ||
          p.type.toLowerCase().includes(kw),
      )
    }

    // Location
    if (filters.location) {
      const loc = filters.location.toLowerCase()
      result = result.filter(
        (p) =>
          p.city.toLowerCase().includes(loc) ||
          p.location.toLowerCase().includes(loc) ||
          p.address.toLowerCase().includes(loc),
      )
    }

    // Type
    if (filters.type) result = result.filter((p) => p.type === filters.type)

    // Status
    if (filters.status) result = result.filter((p) => p.status === filters.status)

    // Price
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice,
    )

    // Bedrooms
    if (filters.bedrooms) {
      const bed = filters.bedrooms
      if (bed === '5+') result = result.filter((p) => p.bedrooms >= 5)
      else result = result.filter((p) => p.bedrooms === Number(bed))
    }

    // Bathrooms
    if (filters.bathrooms) {
      const bath = filters.bathrooms
      if (bath === '4+') result = result.filter((p) => p.bathrooms >= 4)
      else result = result.filter((p) => p.bathrooms === Number(bath))
    }

    // Sort
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    else if (sort === 'featured') result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    else result.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime())

    return result
  }, [filters, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const activeCount = countActive(filters)

  const handleSearch = useCallback(({ keyword, location, type }: { keyword: string; location: string; type: string }) => {
    setFilters((prev) => ({ ...prev, keyword, location, type }))
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-18 min-h-screen">
        {/* Page Header */}
        <div className="bg-foreground py-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Discover</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-8">All Properties</h1>
            <SearchBar
              variant="inline"
              initialValues={{ keyword: filters.keyword, location: filters.location, type: filters.type }}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground text-sm">
              <span className="font-semibold text-foreground">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'property' : 'properties'} found
              {activeCount > 0 && (
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="ml-3 text-accent text-xs hover:underline"
                >
                  Clear filters
                </button>
              )}
            </p>

            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen((v) => !v)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-md border border-border text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
                aria-expanded={mobileFiltersOpen}
                aria-controls="mobile-filters"
              >
                <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                Filters
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <label htmlFor="sort-select" className="sr-only">Sort properties</label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-md border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <motion.div
                id="mobile-filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden mb-6"
              >
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={() => setFilters(DEFAULT_FILTERS)}
                  activeCount={activeCount}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
                activeCount={activeCount}
                className="sticky top-24"
              />
            </div>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <Home className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <h2 className="font-semibold text-foreground text-lg">No properties found</h2>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Try adjusting your search criteria or clearing the active filters.
                  </p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-2 px-6 py-2.5 rounded-md bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    aria-label="Property listings"
                  >
                    <AnimatePresence mode="popLayout">
                      {paginated.map((property, i) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.04, duration: 0.3 }}
                        >
                          <PropertyCard property={property} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent/40 transition-colors"
                        aria-label="Previous page"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          aria-current={page === i + 1 ? 'page' : undefined}
                          className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                            page === i + 1
                              ? 'bg-accent text-white'
                              : 'border border-border text-foreground hover:border-accent/40'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent/40 transition-colors"
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
