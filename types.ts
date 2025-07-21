// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Featured Photos interface
interface FeaturedPhoto extends CosmicObject {
  type: 'featured-photos';
  metadata: {
    title?: string;
    description?: string;
    image?: {
      url: string;
      imgix_url: string;
    };
    artist?: Artist;
    price_digital?: number;
    price_print?: number;
    category?: {
      key: string;
      value: string;
    };
    featured_start_date?: string;
    featured_end_date?: string;
    is_active?: boolean;
    dimensions?: string;
    license_type?: {
      key: string;
      value: string;
    };
  };
}

// Artists interface
interface Artist extends CosmicObject {
  type: 'artists';
  metadata: {
    name?: string;
    bio?: string;
    profile_image?: {
      url: string;
      imgix_url: string;
    };
    website?: string;
    instagram?: string;
    portfolio?: string;
    commission_rate?: number;
    status?: {
      key: string;
      value: string;
    };
    contact_email?: string;
    location?: string;
    social_links?: string;
  };
}

// Site Settings interface
interface SiteSettings extends CosmicObject {
  type: 'site-settings';
  metadata: {
    current_featured_photo?: FeaturedPhoto;
    default_display_duration?: number;
    overlay_opacity?: number;
    time_format?: {
      key: string;
      value: string;
    };
    submission_guidelines?: string;
    commission_structure?: string;
    contact_email?: string;
  };
}

// Artist Applications interface
interface ArtistApplication extends CosmicObject {
  type: 'artist-applications';
  metadata: {
    name?: string;
    email?: string;
    portfolio_samples?: Array<{
      url: string;
      imgix_url: string;
    }>;
    artist_statement?: string;
    social_links?: string;
    status?: {
      key: string;
      value: string;
    };
    review_notes?: string;
    agreed_to_terms?: boolean;
  };
}

// Type literals for select-dropdown values
type PhotoCategory = 'landscape' | 'cityscape' | 'nature' | 'abstract' | 'architecture' | 'minimalist';
type LicenseType = 'personal' | 'commercial' | 'extended';
type ArtistStatus = 'active' | 'pending' | 'suspended';
type ApplicationStatus = 'submitted' | 'reviewing' | 'approved' | 'rejected';
type TimeFormat = '12hr' | '24hr';

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards for runtime validation
function isFeaturedPhoto(obj: CosmicObject): obj is FeaturedPhoto {
  return obj.type === 'featured-photos';
}

function isArtist(obj: CosmicObject): obj is Artist {
  return obj.type === 'artists';
}

function isSiteSettings(obj: CosmicObject): obj is SiteSettings {
  return obj.type === 'site-settings';
}

function isArtistApplication(obj: CosmicObject): obj is ArtistApplication {
  return obj.type === 'artist-applications';
}

// Form data types
interface ArtistApplicationFormData {
  name: string;
  email: string;
  artist_statement: string;
  social_links?: string;
  portfolio_samples: File[];
  agreed_to_terms: boolean;
}

// Component prop types
interface TimeDisplayProps {
  format?: '12hr' | '24hr';
  className?: string;
}

interface PhotoInfoProps {
  photo: FeaturedPhoto;
  opacity?: number;
  onClose: () => void;
}

interface ArtistSubmissionProps {
  guidelines?: string;
  contactEmail?: string;
  onClose: () => void;
}

// Export all types
export type {
  CosmicObject,
  FeaturedPhoto,
  Artist,
  SiteSettings,
  ArtistApplication,
  PhotoCategory,
  LicenseType,
  ArtistStatus,
  ApplicationStatus,
  TimeFormat,
  CosmicResponse,
  ArtistApplicationFormData,
  TimeDisplayProps,
  PhotoInfoProps,
  ArtistSubmissionProps,
};

export {
  isFeaturedPhoto,
  isArtist,
  isSiteSettings,
  isArtistApplication,
};