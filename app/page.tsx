import { Suspense } from 'react'
import { getCurrentFeaturedPhoto, getSiteSettings } from '@/lib/cosmic'
import TimeDisplay from '@/components/TimeDisplay'
import PhotoBackground from '@/components/PhotoBackground'
import PhotoInfoButton from '@/components/PhotoInfoButton'
import ArtistSubmissionButton from '@/components/ArtistSubmissionButton'
import Footer from '@/components/Footer'
import LoadingOverlay from '@/components/LoadingOverlay'

export const revalidate = 3600 // Revalidate every hour

async function HomePage() {
  const [featuredPhoto, siteSettings] = await Promise.all([
    getCurrentFeaturedPhoto(),
    getSiteSettings()
  ])

  if (!featuredPhoto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">TimeArt</h1>
          <p className="text-white/60">No featured photo available at the moment.</p>
        </div>
      </div>
    )
  }

  const timeFormat = siteSettings?.metadata?.time_format?.key as '12hr' | '24hr' || '12hr'
  const overlayOpacity = siteSettings?.metadata?.overlay_opacity || 75

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Photo Background */}
      <PhotoBackground photo={featuredPhoto} />
      
      {/* Time Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: `rgba(0, 0, 0, ${(100 - overlayOpacity) / 100})` }}
      >
        <TimeDisplay format={timeFormat} />
      </div>

      {/* Interactive Elements */}
      <PhotoInfoButton photo={featuredPhoto} />
      <ArtistSubmissionButton 
        guidelines={siteSettings?.metadata?.submission_guidelines}
        contactEmail={siteSettings?.metadata?.contact_email}
      />

      {/* Footer */}
      <Footer />
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <HomePage />
    </Suspense>
  )
}