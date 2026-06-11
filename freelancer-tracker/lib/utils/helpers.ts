/**
 * Utility functions for common operations
 */

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * Math.pow(10, dm)) / Math.pow(10, dm) + ' ' + sizes[i]
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: '2-digit',
  })
  return formatter.format(date)
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return formatter.format(date)
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date): boolean {
  return new Date(date) < new Date()
}

/**
 * Check if date is within N days
 */
export function isWithinDays(date: Date, days: number): boolean {
  const now = new Date()
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  return new Date(date) <= futureDate && new Date(date) > now
}

/**
 * Get week start date (Monday)
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  return new Date(d.setDate(diff))
}

/**
 * Get week end date (Sunday)
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return end
}

/**
 * Calculate percentage safely
 */
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}

/**
 * Convert cents to dollars
 */
export function centsToUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

/**
 * Slug generation from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Omit keys from object
 */
export function omit<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
  const result = { ...obj }
  keys.forEach((key) => delete result[key])
  return result
}

/**
 * Pick keys from object
 */
export function pick<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
  const result = {} as Partial<T>
  keys.forEach((key) => {
    result[key] = obj[key]
  })
  return result
}
