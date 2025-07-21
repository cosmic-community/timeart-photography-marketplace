'use client'

import { useEffect } from 'react'
import { X, ExternalLink, User, Tag, DollarSign } from 'lucide-react'
import { formatPrice, getOptimizedImageUrl, parseSocialLinks } from '@/lib/utils'
import type { PhotoInfoProps } from '@/types'

export default function PhotoInfoModal({ photo, onClose }: PhotoInfoProps) {
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

  const artist = photo.metadata?.artist
  const socialLinks = parseSocialLinks(artist?.metadata?.social_links)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative">
          {photo.metadata?.image?.imgix_url && (
            <div className="h-64 overflow-hidden">
              <img
                src={getOptimizedImageUrl(photo.metadata.image.imgix_url, {
                  width: 800,
                  height: 400,
                  fit: 'crop'
                })}
                alt={photo.metadata.title || 'Artwork'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {/* Photo Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {photo.metadata?.title || photo.title}
          </h2>

          {/* Category */}
          {photo.metadata?.category?.value && (
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Tag size={16} />
              <span>{photo.metadata.category.value}</span>
            </div>
          )}

          {/* Description */}
          {photo.metadata?.description && (
            <p className="text-gray-700 leading-relaxed mb-6">
              {photo.metadata.description}
            </p>
          )}

          {/* Artist Info */}
          {artist && (
            <div className="border-t pt-4 mb-6">
              <div className="flex items-start gap-4">
                {artist.metadata?.profile_image?.imgix_url && (
                  <img
                    src={getOptimizedImageUrl(artist.metadata.profile_image.imgix_url, {
                      width: 80,
                      height: 80,
                      fit: 'crop'
                    })}
                    alt={artist.metadata.name || 'Artist'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={16} className="text-gray-500" />
                    <span className="font-semibold text-gray-900">
                      {artist.metadata?.name || artist.title}
                    </span>
                  </div>
                  
                  {artist.metadata?.location && (
                    <p className="text-sm text-gray-600 mb-2">
                      {artist.metadata.location}
                    </p>
                  )}
                  
                  {artist.metadata?.bio && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {artist.metadata.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  {socialLinks.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                        >
                          {social.handle || social.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-gray-500" />
              <span className="font-semibold text-gray-900">Pricing</span>
            </div>
            
            <div className="space-y-2">
              {photo.metadata?.price_digital && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Digital Download</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(photo.metadata.price_digital)}
                  </span>
                </div>
              )}
              
              {photo.metadata?.price_print && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Print</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(photo.metadata.price_print)}
                  </span>
                </div>
              )}
            </div>

            {/* Dimensions */}
            {photo.metadata?.dimensions && (
              <div className="mt-3 text-sm text-gray-600">
                <strong>Available sizes:</strong><br />
                <div className="mt-1 whitespace-pre-line">
                  {photo.metadata.dimensions}
                </div>
              </div>
            )}

            {/* License Type */}
            {photo.metadata?.license_type?.value && (
              <div className="mt-3 text-sm">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {photo.metadata.license_type.value}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex gap-3">
            <button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Purchase Digital
            </button>
            
            {photo.metadata?.price_print && (
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Order Print
              </button>
            )}
            
            {artist?.metadata?.website && (
              <a
                href={artist.metadata.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Artist
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}