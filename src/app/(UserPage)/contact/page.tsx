import ContactCenter from '@/components/UserPage/Contact/ContactCenter'
import React, { Suspense } from 'react'

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* CRITICAL: Next.js 16 requires Suspense for any component 
        using useSearchParams() during static generation.
      */}
      <Suspense fallback={
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <span className="ml-3 text-slate-500">Loading Contact Center...</span>
        </div>
      }>
        <ContactCenter />
      </Suspense>
    </div>
  )
}