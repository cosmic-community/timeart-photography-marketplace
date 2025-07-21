import { getOptimizedImageUrl } from '@/lib/utils'
import type { FeaturedPhoto } from '@/types'

interface PhotoBackgroundProps {
  photo: FeaturedPhoto
}

export default function PhotoBackground({ photo }: PhotoBackgroundProps) {
  if (!photo.metadata?.image?.imgix_url) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
    )
  }

  const optimizedUrl = getOptimizedImageUrl(photo.metadata.image.imgix_url, {
    width: 2400,
    height: 1600,
    fit: 'crop',
    quality: 90
  })

  return (
    <div className="absolute inset-0">
      <img
        src={optimizedUrl}
        alt={photo.metadata.title || 'Featured artwork'}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30" />
    </div>
  )
}