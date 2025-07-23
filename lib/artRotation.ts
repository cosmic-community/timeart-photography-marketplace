import { getFeaturedPhotos, cosmic } from './cosmic'
import type { FeaturedPhoto } from '@/types'

/**
 * Get the featured photo for today based on automatic daily rotation
 * Uses date-based algorithm to ensure consistent daily changes
 */
export async function getTodaysFeaturedPhoto(): Promise<FeaturedPhoto | null> {
  try {
    // Get all active featured photos
    const photos = await getFeaturedPhotos()
    
    if (photos.length === 0) {
      return null
    }

    // Use today's date to determine which photo to show
    const today = new Date()
    // Reset time to midnight to ensure consistent daily rotation
    today.setHours(0, 0, 0, 0)
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
    
    // Use modulo to cycle through available photos
    const photoIndex = daysSinceEpoch % photos.length
    
    // Add explicit check for undefined
    const selectedPhoto = photos[photoIndex]
    return selectedPhoto || null
  } catch (error) {
    console.error('Error getting today\'s featured photo:', error)
    return null
  }
}

/**
 * Update the site settings to reflect today's automatically selected photo
 * This keeps the CMS in sync with the daily rotation
 */
export async function updateCurrentFeaturedPhoto(): Promise<void> {
  try {
    const todaysPhoto = await getTodaysFeaturedPhoto()
    
    if (!todaysPhoto) {
      console.log('No photo available for today')
      return
    }

    // Update the site settings with today's photo
    await cosmic.objects.updateOne('687eca3e713abc4f2911fadb', {
      metadata: {
        current_featured_photo: todaysPhoto.id
      }
    })

    console.log(`Updated featured photo to: ${todaysPhoto.metadata.title}`)
  } catch (error) {
    console.error('Error updating current featured photo:', error)
  }
}

/**
 * Get preview of upcoming photos for the next 7 days
 * Useful for admin interfaces or previews
 */
export async function getUpcomingPhotos(days: number = 7): Promise<Array<{ date: Date; photo: FeaturedPhoto }>> {
  try {
    const photos = await getFeaturedPhotos()
    
    if (photos.length === 0) {
      return []
    }

    const upcoming: Array<{ date: Date; photo: FeaturedPhoto }> = []
    const today = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      date.setHours(0, 0, 0, 0)
      
      const daysSinceEpoch = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
      const photoIndex = daysSinceEpoch % photos.length
      
      // Add explicit check for undefined before using the photo
      const selectedPhoto = photos[photoIndex]
      if (selectedPhoto) {
        upcoming.push({
          date,
          photo: selectedPhoto
        })
      }
    }

    return upcoming
  } catch (error) {
    console.error('Error getting upcoming photos:', error)
    return []
  }
}

/**
 * Check if we need to rotate to a new photo today
 * Compares current featured photo with what should be featured today
 */
export async function shouldRotatePhoto(): Promise<boolean> {
  try {
    const [currentPhoto, todaysPhoto] = await Promise.all([
      getCurrentFeaturedPhotoFromSettings(),
      getTodaysFeaturedPhoto()
    ])

    if (!currentPhoto || !todaysPhoto) {
      return true // Rotate if either is missing
    }

    return currentPhoto.id !== todaysPhoto.id
  } catch (error) {
    console.error('Error checking if photo should rotate:', error)
    return false
  }
}

/**
 * Helper function to get current photo from site settings
 */
async function getCurrentFeaturedPhotoFromSettings(): Promise<FeaturedPhoto | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'site-settings',
      slug: 'main-site-configuration'
    }).depth(2)

    const settings = response.object as any
    return settings.metadata?.current_featured_photo || null
  } catch (error) {
    return null
  }
}