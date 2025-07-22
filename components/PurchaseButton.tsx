'use client'

import { useState } from 'react'
import { ShoppingCart, Download, Loader, CreditCard } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface PurchaseButtonProps {
  photoId: string
  photoTitle: string
  priceDigital?: number
  pricePrint?: number
  printSize?: string
  type: 'digital' | 'print'
  className?: string
}

export default function PurchaseButton({
  photoId,
  photoTitle,
  priceDigital,
  pricePrint,
  printSize,
  type,
  className = ''
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const price = type === 'digital' ? priceDigital : pricePrint
  
  if (!price) {
    return (
      <div className={`text-sm text-gray-500 text-center py-3 ${className}`}>
        Price not available
      </div>
    )
  }

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const requestBody = {
        photoId,
        photoTitle,
        type,
        price,
        ...(printSize && { printSize })
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`)
      }

      if (!data.url) {
        throw new Error('No checkout URL received from server')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Purchase error:', error)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
      
      setError(errorMessage)
      
      // Show user-friendly error message
      if (errorMessage.includes('fetch')) {
        setError('Network error. Please check your connection and try again.')
      } else if (errorMessage.includes('404')) {
        setError('This item is no longer available.')
      } else if (errorMessage.includes('400')) {
        setError('Invalid request. Please refresh the page and try again.')
      } else {
        setError('There was an error processing your purchase. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader size={16} className="animate-spin" />
          <span>Processing...</span>
        </>
      )
    }

    if (type === 'digital') {
      return (
        <>
          <Download size={16} />
          <span>Buy Digital - {formatPrice(price)}</span>
        </>
      )
    }

    return (
      <>
        <ShoppingCart size={16} />
        <span>
          Order Print - {formatPrice(price)}
          {printSize && <span className="text-xs block opacity-90">{printSize}</span>}
        </span>
      </>
    )
  }

  const getButtonStyles = () => {
    const baseStyles = `
      flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium 
      transition-all duration-200 text-sm min-h-[48px] relative
      ${className}
    `
    
    if (loading) {
      return `${baseStyles} bg-gray-400 text-white cursor-not-allowed`
    }
    
    if (error) {
      return `${baseStyles} bg-red-600 hover:bg-red-700 text-white`
    }
    
    return type === 'digital' 
      ? `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:transform active:scale-[0.98]`
      : `${baseStyles} bg-green-600 hover:bg-green-700 text-white hover:shadow-lg active:transform active:scale-[0.98]`
  }

  return (
    <div className="relative">
      <button
        onClick={handlePurchase}
        disabled={loading}
        className={getButtonStyles()}
        aria-label={`Purchase ${photoTitle} as ${type === 'digital' ? 'digital download' : 'print'}`}
      >
        {error ? (
          <>
            <CreditCard size={16} />
            <span>Try Again</span>
          </>
        ) : (
          getButtonContent()
        )}
      </button>
      
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 z-10">
          {error}
        </div>
      )}
    </div>
  )
}