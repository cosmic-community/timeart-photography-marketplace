'use client'

import { useState } from 'react'
import { ShoppingCart, Download, Loader } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface PurchaseButtonProps {
  photoId: string
  photoTitle: string
  priceDigital?: number
  pricePrint?: number
  type: 'digital' | 'print'
  className?: string
}

export default function PurchaseButton({
  photoId,
  photoTitle,
  priceDigital,
  pricePrint,
  type,
  className = ''
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)
  
  const price = type === 'digital' ? priceDigital : pricePrint
  
  if (!price) return null

  const handlePurchase = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoId,
          photoTitle,
          type,
          price,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('There was an error processing your purchase. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const icon = type === 'digital' ? Download : ShoppingCart
  const IconComponent = loading ? Loader : icon
  
  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm
        ${type === 'digital' 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-green-600 hover:bg-green-700 text-white'
        }
        ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}
        ${className}
      `}
    >
      <IconComponent 
        size={16} 
        className={loading ? 'animate-spin' : ''}
      />
      {loading ? 'Processing...' : (
        type === 'digital' ? 'Buy Now' : 'Order Print'
      )}
    </button>
  )
}