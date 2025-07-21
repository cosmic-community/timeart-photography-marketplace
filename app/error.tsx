'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-white/60 mb-6">
          We encountered an error while loading the beautiful photography. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  )
}