export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Condo' | 'Townhouse' | 'Land'
export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Pending'
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'featured'

export interface Agent {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  title: string
}

export interface Property {
  id: string
  slug: string
  title: string
  description: string
  price: number
  location: string
  address: string
  city: string
  type: PropertyType
  status: PropertyStatus
  bedrooms: number
  bathrooms: number
  area: number
  garage: number
  featured: boolean
  images: string[]
  amenities: string[]
  agent: Agent
  yearBuilt: number
  listedDate: string
  coordinates: { lat: number; lng: number }
}

export interface FilterState {
  keyword: string
  location: string
  type: string
  status: string
  minPrice: number
  maxPrice: number
  bedrooms: string
  bathrooms: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Stat {
  value: string
  label: string
}
