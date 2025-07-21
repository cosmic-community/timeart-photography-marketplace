// Format time with 12hr or 24hr format
export function formatTime(date: Date, format: '12hr' | '24hr' = '12hr'): string {
  if (format === '24hr') {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return date.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

// Get optimized image URL with imgix parameters
export function getOptimizedImageUrl(
  imgixUrl: string,
  options: {
    width?: number;
    height?: number;
    fit?: 'crop' | 'scale' | 'fill';
    auto?: string;
    quality?: number;
  } = {}
): string {
  const {
    width,
    height,
    fit = 'crop',
    auto = 'format,compress',
    quality = 85
  } = options

  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('fit', fit)
  params.set('auto', auto)
  params.set('q', quality.toString())

  return `${imgixUrl}?${params.toString()}`
}

// Truncate text to specified length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Check if a date is within a range
export function isDateInRange(date: Date, startDate?: string, endDate?: string): boolean {
  if (!startDate && !endDate) return true
  
  const checkDate = date.getTime()
  
  if (startDate && !endDate) {
    return checkDate >= new Date(startDate).getTime()
  }
  
  if (endDate && !startDate) {
    return checkDate <= new Date(endDate).getTime()
  }
  
  if (startDate && endDate) {
    return checkDate >= new Date(startDate).getTime() && 
           checkDate <= new Date(endDate).getTime()
  }
  
  return true
}

// Generate a slug from a string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get social media platform from URL
export function getSocialPlatform(url: string): string {
  if (url.includes('instagram.com') || url.includes('@')) {
    return 'Instagram'
  }
  if (url.includes('behance.net')) {
    return 'Behance'
  }
  if (url.includes('twitter.com')) {
    return 'Twitter'
  }
  if (url.includes('linkedin.com')) {
    return 'LinkedIn'
  }
  return 'Website'
}

// Parse social links string into structured data
export function parseSocialLinks(socialLinksString?: string): Array<{ platform: string; url: string; handle?: string }> {
  if (!socialLinksString) return []

  const links = socialLinksString.split(',').map(link => link.trim())
  const socialLinks: Array<{ platform: string; url: string; handle?: string }> = []

  links.forEach(link => {
    if (link.includes('Instagram:') || link.includes('@')) {
      const handle = link.replace('Instagram:', '').trim()
      socialLinks.push({
        platform: 'Instagram',
        url: handle.startsWith('@') ? `https://instagram.com/${handle.slice(1)}` : `https://instagram.com/${handle}`,
        handle
      })
    } else if (link.includes('Website:') || link.startsWith('http')) {
      const url = link.replace('Website:', '').trim()
      socialLinks.push({
        platform: getSocialPlatform(url),
        url: url.startsWith('http') ? url : `https://${url}`
      })
    }
  })

  return socialLinks
}