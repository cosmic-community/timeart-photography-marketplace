import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function getOptimizedImageUrl(
  imgixUrl: string, 
  options: {
    width?: number
    height?: number
    fit?: 'crop' | 'max' | 'scale' | 'fill'
    quality?: number
  } = {}
): string {
  const {
    width = 800,
    height = 600,
    fit = 'crop',
    quality = 85
  } = options

  const params = new URLSearchParams({
    w: width.toString(),
    h: height.toString(),
    fit,
    auto: 'format,compress',
    q: quality.toString()
  })

  return `${imgixUrl}?${params.toString()}`
}

export function formatTime(
  date: Date = new Date(), 
  format: '12hr' | '24hr' = '12hr'
): string {
  if (format === '24hr') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function parseSocialLinks(socialLinksString?: string): Array<{
  platform: string
  handle: string
  url: string
}> {
  if (!socialLinksString) return []
  
  const links: Array<{ platform: string; handle: string; url: string }> = []
  
  // Split by comma and parse each link
  const parts = socialLinksString.split(',').map(part => part.trim())
  
  for (const part of parts) {
    // Instagram pattern: "Instagram: @username" or "@username"
    const instagramMatch = part.match(/(?:Instagram:\s*)?@([a-zA-Z0-9._]+)/i)
    if (instagramMatch) {
      const handle = instagramMatch[1]
      if (handle) {
        links.push({
          platform: 'Instagram',
          handle: `@${handle}`,
          url: `https://instagram.com/${handle}`
        })
      }
      continue
    }
    
    // Website pattern: "Website: domain.com" or just "domain.com"
    const websiteMatch = part.match(/(?:Website:\s*)?(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
    if (websiteMatch) {
      let url = websiteMatch[1]
      if (url && !url.startsWith('http')) {
        url = `https://${url}`
      }
      
      // Fix the TypeScript error by adding proper null check
      if (url) {
        try {
          const urlObj = new URL(url)
          const hostname = urlObj.hostname
          links.push({
            platform: 'Website',
            handle: hostname,
            url
          })
        } catch (error) {
          // If URL parsing fails, use the original url as handle
          links.push({
            platform: 'Website',
            handle: url,
            url
          })
        }
      }
      continue
    }
    
    // Generic social link pattern
    const genericMatch = part.match(/([^:]+):\s*(.+)/)
    if (genericMatch) {
      const platform = genericMatch[1]?.trim()
      const handle = genericMatch[2]?.trim()
      
      if (platform && handle) {
        let url = handle
        
        // Try to construct URL if it doesn't start with http
        if (!url.startsWith('http')) {
          if (platform.toLowerCase().includes('twitter')) {
            url = `https://twitter.com/${handle.replace('@', '')}`
          } else if (platform.toLowerCase().includes('linkedin')) {
            url = `https://linkedin.com/in/${handle}`
          } else if (platform.toLowerCase().includes('behance')) {
            url = `https://behance.net/${handle}`
          } else {
            url = `https://${handle}`
          }
        }
        
        links.push({
          platform,
          handle,
          url
        })
      }
    }
  }
  
  return links
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}