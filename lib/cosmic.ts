import { createBucketClient } from '@cosmicjs/sdk'
import type { FeaturedPhoto, Artist, SiteSettings } from '@/types'

// Initialize Cosmic client
export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || '',
  readKey: process.env.COSMIC_READ_KEY || '',
  writeKey: process.env.COSMIC_WRITE_KEY || ''
})

// Export bucket slug for footer component
export function getBucketSlug(): string {
  return process.env.COSMIC_BUCKET_SLUG || ''
}

/**
 * Get all featured photos that are active for sale
 */
export async function getFeaturedPhotos(): Promise<FeaturedPhoto[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'featured-photos' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    // Filter for active photos and properly type the response
    const photos = response.objects as FeaturedPhoto[]
    return photos.filter(photo => photo.metadata.is_active === true)
  } catch (error) {
    // Handle 404 errors (no objects found) by returning empty array
    if ((error as any)?.status === 404) {
      return []
    }
    console.error('Error fetching featured photos:', error)
    return []
  }
}

/**
 * Get current featured photo - uses daily rotation algorithm instead of site settings
 */
export async function getCurrentFeaturedPhoto(): Promise<FeaturedPhoto | null> {
  try {
    // Get all active photos for rotation
    const photos = await getFeaturedPhotos()
    
    if (photos.length === 0) {
      return null
    }

    // Use today's date to determine which photo to show
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset to midnight for consistent daily rotation
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
    
    // Use modulo to cycle through available photos
    const photoIndex = daysSinceEpoch % photos.length
    
    return photos[photoIndex] || null
  } catch (error) {
    console.error('Error getting current featured photo:', error)
    return null
  }
}

/**
 * Get a specific featured photo by slug - renamed from getFeaturedPhoto
 */
export async function getFeaturedPhoto(slug: string): Promise<FeaturedPhoto | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'featured-photos', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as FeaturedPhoto
  } catch (error) {
    console.error('Error fetching featured photo by slug:', error)
    return null
  }
}

/**
 * Get a specific featured photo by slug - alternative name for compatibility
 */
export async function getFeaturedPhotoBySlug(slug: string): Promise<FeaturedPhoto | null> {
  return getFeaturedPhoto(slug)
}

/**
 * Get all artists
 */
export async function getArtists(): Promise<Artist[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'artists' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Artist[]
  } catch (error) {
    // Handle 404 errors (no objects found) by returning empty array
    if ((error as any)?.status === 404) {
      return []
    }
    console.error('Error fetching artists:', error)
    return []
  }
}

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'site-settings', slug: 'main-site-configuration' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object as SiteSettings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Submit an artist application
 */
export async function submitArtistApplication(data: {
  name: string
  email: string
  portfolioSamples?: File[]
  portfolio_samples?: Array<{ url: string; imgix_url: string }>
  artist_statement: string
  artistStatement?: string
  social_links?: string
  socialLinks?: string
  agreed_to_terms: boolean
}): Promise<{ success: boolean; message: string }> {
  try {
    // Handle both property name formats for compatibility
    const artistStatement = data.artist_statement || data.artistStatement || ''
    const socialLinks = data.social_links || data.socialLinks || ''
    
    await cosmic.objects.insertOne({
      title: `Application from ${data.name}`,
      type: 'artist-applications',
      metadata: {
        name: data.name,
        email: data.email,
        artist_statement: artistStatement,
        social_links: socialLinks,
        status: 'submitted',
        agreed_to_terms: data.agreed_to_terms,
        portfolio_samples: data.portfolio_samples || []
      }
    })
    
    return {
      success: true,
      message: 'Application submitted successfully!'
    }
  } catch (error) {
    console.error('Error submitting artist application:', error)
    return {
      success: false,
      message: 'Failed to submit application. Please try again.'
    }
  }
}