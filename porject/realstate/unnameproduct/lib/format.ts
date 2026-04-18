/**
 * Format a price value. For properties "For Rent", the value is monthly rent.
 * For all other statuses, it's a sale price.
 */
export function formatPrice(price: number, status?: string): string {
  if (status === 'For Rent') {
    return `$${price.toLocaleString()}/mo`
  }
  if (price >= 1_000_000) {
    const millions = price / 1_000_000
    return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2)}M`
  }
  return `$${price.toLocaleString()}`
}

export function formatArea(area: number): string {
  return `${area.toLocaleString()} sq ft`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
