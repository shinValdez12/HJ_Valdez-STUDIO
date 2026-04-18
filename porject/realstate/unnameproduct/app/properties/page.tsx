'use client'

import { Suspense } from 'react'
import PropertiesPage from './PropertiesContent' // Import your original component

export default function Page() {
  return (
    // This Suspense boundary fixes the "useSearchParams()" build error
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PropertiesPage />
    </Suspense>
  )
}