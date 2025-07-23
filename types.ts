export interface FeaturedPhoto {
  id: string
  title: string
  slug: string
  metadata: {
    title: string
    description: string
    image: {
      url: string
      imgix_url: string
    }
    artist: Artist
    price_digital: number
    price_print: number
    category: {
      key: string
      value: string
    }
    featured_start_date?: string
    featured_end_date?: string
    is_active: boolean
    dimensions?: string
    license_type: {
      key: string
      value: string
    }
    stripe_product_id_digital?: string | null
    stripe_price_id_digital?: string | null
    stripe_product_id_print?: string | null
    stripe_price_id_print?: string | null
    download_files?: Array<{
      url: string
      imgix_url: string
    }> | null
    print_fulfillment_partner?: string | null
    stock_status?: {
      key: string
      value: string
    }
    total_sales?: number
    revenue_generated?: number
  }
}

export interface Artist {
  id: string
  title: string
  slug: string
  metadata: {
    name: string
    bio: string
    profile_image?: {
      url: string
      imgix_url: string
    }
    website?: string
    instagram?: string
    portfolio?: string
    commission_rate: number
    status: {
      key: string
      value: string
    }
    contact_email: string
    location?: string
    social_links?: string
  }
}

export interface SiteSettings {
  id: string
  title: string
  slug: string
  metadata: {
    current_featured_photo?: FeaturedPhoto
    default_display_duration: number
    overlay_opacity: number
    time_format: {
      key: '12hr' | '24hr'
      value: string
    }
    submission_guidelines: string
    commission_structure: string
    contact_email: string
  }
}

export interface ArtistApplication {
  id: string
  title: string
  slug: string
  metadata: {
    name: string
    email: string
    portfolio_samples: Array<{
      url: string
      imgix_url: string
    }>
    artist_statement: string
    social_links?: string
    status: {
      key: 'submitted' | 'reviewing' | 'approved' | 'rejected'
      value: string
    }
    review_notes?: string
    agreed_to_terms: boolean
  }
}

export interface Order {
  id: string
  title: string
  slug: string
  metadata: {
    order_id: string
    customer_email: string
    customer_name: string
    purchased_photo: FeaturedPhoto
    license_type: {
      key: 'personal' | 'commercial' | 'extended'
      value: string
    }
    format_type: {
      key: 'digital' | 'print'
      value: string
    }
    order_total: number
    artist_commission: number
    platform_fee?: number
    stripe_session_id?: string
    stripe_payment_intent?: string
    order_status: {
      key: 'pending' | 'processing' | 'completed' | 'refunded' | 'failed' | 'cancelled'
      value: string
    }
    purchase_date: string
    download_url?: string
    download_expires?: string
    print_size?: string
    shipping_address?: string
    tracking_number?: string
    order_notes?: string
    customer_notes?: string
  }
}

// Component Props Types
export interface ArtistSubmissionProps {
  guidelines?: string
  contactEmail?: string
  onClose: () => void
}

export interface PhotoInfoProps {
  photo: FeaturedPhoto
  onClose: () => void
}

export interface TimeDisplayProps {
  format?: '12hr' | '24hr'
  className?: string
}

export type TimeFormat = '12hr' | '24hr'

export interface PurchaseData {
  photoId: string
  licenseType: 'personal' | 'commercial' | 'extended'
  formatType: 'digital' | 'print'
  printSize?: string
  customerEmail: string
  customerName: string
}