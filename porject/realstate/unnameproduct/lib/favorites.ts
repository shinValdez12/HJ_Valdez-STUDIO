const STORAGE_KEY = 'haven_favorites'

export function getFavoriteIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id)
}

export function toggleFavorite(id: string): boolean {
  const current = getFavoriteIds()
  const index = current.indexOf(id)
  if (index === -1) {
    const updated = [...current, id]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return true // added
  } else {
    const updated = current.filter((fid) => fid !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return false // removed
  }
}

export function clearFavorites(): void {
  localStorage.removeItem(STORAGE_KEY)
}
