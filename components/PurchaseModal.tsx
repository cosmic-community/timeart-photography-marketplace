'use client'

import { useState, useEffect } from 'react'
import { X, Download, ShoppingCart, Info, Shield, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import PurchaseButton from './PurchaseButton'
import type { FeaturedPhoto } from '@/types'

interface PurchaseModalProps {
  photo: FeaturedPhoto
  onClose: () => void
}

export default function PurchaseModal({ photo, onClose }: PurchaseModalProps) {
  const [selectedType, setSelectedType] = useState<'digital' | 'print'>('digital')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const hasDigital = Boolean(photo.metadata?.price_digital)
  const hasPrint = Boolean(photo.metadata?.price_print)

  if (!hasDigital && !hasPrint) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-up" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Purchase Artwork</h2>
            <p className="text-gray-600 mt-1">{photo.metadata?.title || photo.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Type Selection */}
          {hasDigital && hasPrint && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Choose Format</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedType('digital')}
                  className={`
                    flex-1 p-4 rounded-lg border-2 transition-all
                    ${selectedType === 'digital'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Download size={20} />
                    <div className="text-left">
                      <div className="font-medium">Digital Download</div>
                      <div className="text-sm opacity-75">Instant download</div>
                    </div>
                    <div className="ml-auto font-bold">
                      {formatPrice(photo.metadata?.price_digital || 0)}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType('print')}
                  className={`
                    flex-1 p-4 rounded-lg border-2 transition-all
                    ${selectedType === 'print'
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} />
                    <div className="text-left">
                      <div className="font-medium">Physical Print</div>
                      <div className="text-sm opacity-75">Shipped to you</div>
                    </div>
                    <div className="ml-auto font-bold">
                      {formatPrice(photo.metadata?.price_print || 0)}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Purchase Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info size={16} />
              What's Included
            </h4>

            {(selectedType === 'digital' || !hasPrint) && hasDigital && (
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Download size={14} className="text-blue-600" />
                  High-resolution digital files
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-600" />
                  Instant download after payment
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-600" />
                  {photo.metadata?.license_type?.value || 'Personal Use'} license
                </div>
              </div>
            )}

            {(selectedType === 'print' || !hasDigital) && hasPrint && (
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={14} className="text-green-600" />
                  Professional quality print
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-green-600" />
                  Ships within 3-5 business days
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-green-600" />
                  {photo.metadata?.license_type?.value || 'Personal Use'} license
                </div>
              </div>
            )}
          </div>

          {/* Available Sizes */}
          {photo.metadata?.dimensions && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Available Sizes</h4>
              <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded">
                {photo.metadata.dimensions}
              </div>
            </div>
          )}

          {/* Artist Info */}
          {photo.metadata?.artist && (
            <div className="border-t pt-4 mb-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Artist:</span> {photo.metadata.artist.metadata?.name || photo.metadata.artist.title}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Commission:</span> {photo.metadata.artist.metadata?.commission_rate || 70}% goes to the artist
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            
            {hasDigital && (selectedType === 'digital' || !hasPrint) && (
              <PurchaseButton
                photoId={photo.id}
                photoTitle={photo.metadata?.title || photo.title}
                priceDigital={photo.metadata?.price_digital}
                type="digital"
                className="flex-1"
              />
            )}
            
            {hasPrint && (selectedType === 'print' || !hasDigital) && (
              <PurchaseButton
                photoId={photo.id}
                photoTitle={photo.metadata?.title || photo.title}
                pricePrint={photo.metadata?.price_print}
                type="print"
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}