'use client'

import { useState, useEffect } from 'react'
import { X, Download, ShoppingCart, Info, Shield, Clock, Package, CreditCard } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import PurchaseButton from './PurchaseButton'
import type { FeaturedPhoto } from '@/types'

interface PurchaseModalProps {
  photo: FeaturedPhoto
  onClose: () => void
}

interface PrintSize {
  size: string
  price: number
}

export default function PurchaseModal({ photo, onClose }: PurchaseModalProps) {
  const [selectedType, setSelectedType] = useState<'digital' | 'print'>('digital')
  const [selectedPrintSize, setSelectedPrintSize] = useState<string>('')
  const [printSizes, setPrintSizes] = useState<PrintSize[]>([])

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

  useEffect(() => {
    // Parse print sizes from dimensions if available
    if (photo.metadata?.dimensions && photo.metadata?.price_print) {
      const dimensions = photo.metadata.dimensions
      const basePrintPrice = photo.metadata.price_print
      
      // Extract print sizes - this is a simplified example
      // In a real app, you might store structured size/price data
      const sizes: PrintSize[] = []
      
      if (dimensions.includes('Print:')) {
        const printSection = dimensions.split('Print:')[1]?.trim()
        if (printSection) {
          const sizeStrings = printSection.split(',').map(s => s.trim())
          sizeStrings.forEach((size, index) => {
            // Simple pricing logic - larger sizes cost more
            const multiplier = 1 + (index * 0.5)
            sizes.push({
              size: size.replace(' inches', '"'),
              price: Math.round(basePrintPrice * multiplier)
            })
          })
        }
      }
      
      if (sizes.length === 0) {
        // Fallback to base price if no specific sizes found
        sizes.push({
          size: 'Standard Print',
          price: basePrintPrice
        })
      }
      
      setPrintSizes(sizes)
      setSelectedPrintSize(sizes[0]?.size || '')
    }
  }, [photo.metadata?.dimensions, photo.metadata?.price_print])

  const hasDigital = Boolean(photo.metadata?.price_digital)
  const hasPrint = Boolean(photo.metadata?.price_print) && printSizes.length > 0

  // Set initial selection based on availability
  useEffect(() => {
    if (hasDigital && !hasPrint) {
      setSelectedType('digital')
    } else if (!hasDigital && hasPrint) {
      setSelectedType('print')
    }
  }, [hasDigital, hasPrint])

  if (!hasDigital && !hasPrint) {
    return null
  }

  const selectedPrintPrice = printSizes.find(size => size.size === selectedPrintSize)?.price || photo.metadata?.price_print

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between p-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Purchase Artwork</h2>
              <p className="text-gray-600 mt-1 truncate">{photo.metadata?.title || photo.title}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0 ml-4"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview Image */}
          <div className="mb-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              {photo.metadata?.image?.imgix_url && (
                <img
                  src={`${photo.metadata.image.imgix_url}?w=600&h=337&fit=crop&auto=format,compress`}
                  alt={photo.metadata?.title || photo.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Type Selection */}
          {hasDigital && hasPrint && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Choose Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedType('digital')}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${selectedType === 'digital'
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <Download size={20} className="mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">Digital Download</div>
                      <div className="text-sm opacity-75 mt-1">Instant download after payment</div>
                      <div className="font-bold text-lg mt-2">
                        {formatPrice(photo.metadata?.price_digital || 0)}
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType('print')}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-left
                    ${selectedType === 'print'
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <Package size={20} className="mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">Physical Print</div>
                      <div className="text-sm opacity-75 mt-1">Professional quality, shipped to you</div>
                      <div className="font-bold text-lg mt-2">
                        From {formatPrice(printSizes[0]?.price || photo.metadata?.price_print || 0)}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Print Size Selection */}
          {(selectedType === 'print' || (!hasDigital && hasPrint)) && printSizes.length > 1 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Choose Print Size</h3>
              <div className="space-y-2">
                {printSizes.map((printSize) => (
                  <label
                    key={printSize.size}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedPrintSize === printSize.size
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="printSize"
                        value={printSize.size}
                        checked={selectedPrintSize === printSize.size}
                        onChange={(e) => setSelectedPrintSize(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="font-medium">{printSize.size}</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {formatPrice(printSize.price)}
                    </span>
                  </label>
                ))}
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
                  <Download size={14} className="text-blue-600 shrink-0" />
                  <span>High-resolution digital files (4K, 8K)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-600 shrink-0" />
                  <span>Instant download after payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-600 shrink-0" />
                  <span>{photo.metadata?.license_type?.value || 'Personal Use'} license included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-blue-600 shrink-0" />
                  <span>Secure payment processing via Stripe</span>
                </div>
              </div>
            )}

            {(selectedType === 'print' || !hasDigital) && hasPrint && (
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-green-600 shrink-0" />
                  <span>Professional quality print on premium paper</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-green-600 shrink-0" />
                  <span>Ships within 3-5 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-green-600 shrink-0" />
                  <span>{photo.metadata?.license_type?.value || 'Personal Use'} license included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-green-600 shrink-0" />
                  <span>Billing & shipping info collected at checkout</span>
                </div>
              </div>
            )}
          </div>

          {/* Available Sizes/Dimensions */}
          {photo.metadata?.dimensions && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Available Options</h4>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                <div className="whitespace-pre-line">{photo.metadata.dimensions}</div>
              </div>
            </div>
          )}

          {/* Artist Info */}
          {photo.metadata?.artist && (
            <div className="border-t pt-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                {photo.metadata.artist.metadata?.profile_image?.imgix_url && (
                  <img
                    src={`${photo.metadata.artist.metadata.profile_image.imgix_url}?w=40&h=40&fit=crop&auto=format,compress`}
                    alt={photo.metadata.artist.metadata?.name || photo.metadata.artist.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">
                    {photo.metadata.artist.metadata?.name || photo.metadata.artist.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {photo.metadata.artist.metadata?.commission_rate || 70}% commission goes to artist
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t bg-white rounded-b-xl">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
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
                  pricePrint={selectedPrintPrice}
                  printSize={selectedPrintSize}
                  type="print"
                  className="flex-1"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}