import { createBucketClient } from '@cosmicjs/sdk'
import type { 
  FeaturedPhoto, 
  Artist, 
  SiteSettings, 
  ArtistApplication,
  CosmicResponse 
} from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch current featured photo from site settings
export async function getCurrentFeaturedPhoto(): Promise<FeaturedPhoto | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'site-settings',
      slug: 'main-site-configuration'
    }).depth(2)

    const settings = response.object as SiteSettings
    return settings.metadata?.current_featured_photo || null
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching current featured photo:', error)
    return null
  }
}

// Fetch all active featured photos
export async function getFeaturedPhotos(): Promise<FeaturedPhoto[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'featured-photos',
        'metadata.is_active': true
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return response.objects as FeaturedPhoto[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching featured photos:', error)
    return []
  }
}

// Fetch specific featured photo by slug
export async function getFeaturedPhoto(slug: string): Promise<FeaturedPhoto | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'featured-photos',
      slug
    }).depth(1)

    return response.object as FeaturedPhoto
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching featured photo:', error)
    return null
  }
}

// Fetch all active artists
export async function getArtists(): Promise<Artist[]> {
  try {
    const response = await cosmic.objects
      .find({
        type: 'artists',
        'metadata.status': 'active'
      })
      .props(['id', 'title', 'slug', 'metadata'])

    return response.objects as Artist[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    console.error('Error fetching artists:', error)
    return []
  }
}

// Fetch specific artist by slug
export async function getArtist(slug: string): Promise<Artist | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'artists',
      slug
    })

    return response.object as Artist
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching artist:', error)
    return null
  }
}

// Fetch site settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'site-settings',
      slug: 'main-site-configuration'
    }).depth(2)

    return response.object as SiteSettings
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    console.error('Error fetching site settings:', error)
    return null
  }
}

// Submit artist application
export async function submitArtistApplication(data: {
  name: string;
  email: string;
  artist_statement: string;
  social_links?: string;
  portfolio_samples: Array<{ url: string; imgix_url: string }>;
  agreed_to_terms: boolean;
}): Promise<ArtistApplication> {
  try {
    const response = await cosmic.objects.insertOne({
      title: `Application from ${data.name}`,
      type: 'artist-applications',
      metadata: {
        name: data.name,
        email: data.email,
        artist_statement: data.artist_statement,
        social_links: data.social_links || '',
        portfolio_samples: data.portfolio_samples,
        status: 'submitted',
        review_notes: '',
        agreed_to_terms: data.agreed_to_terms
      }
    })

    return response.object as ArtistApplication
  } catch (error) {
    console.error('Error submitting artist application:', error)
    throw new Error('Failed to submit application')
  }
}

// Get bucket slug for UTM tracking
export function getBucketSlug(): string {
  return process.env.COSMIC_BUCKET_SLUG || 'timeart-marketplace'
}