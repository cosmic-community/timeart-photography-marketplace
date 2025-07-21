// app/photos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getFeaturedPhoto } from '@/lib/cosmic'
import PhotoBackground from '@/components/PhotoBackground'
import PhotoInfoModal from '@/components/PhotoInfoModal'

interface PhotoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PhotoPageProps) {
  const { slug } = await params
  const photo = await getFeaturedPhoto(slug)

  if (!photo) {
    return {
      title: 'Photo Not Found - TimeArt',
    }
  }

  return {
    title: `${photo.metadata?.title || photo.title} - TimeArt`,
    description: photo.metadata?.description || `Beautiful photography by ${photo.metadata?.artist?.metadata?.name}`,
    openGraph: {
      title: photo.metadata?.title || photo.title,
      description: photo.metadata?.description,
      images: photo.metadata?.image?.imgix_url ? [{
        url: `${photo.metadata.image.imgix_url}?w=1200&h=630&fit=crop&auto=format`,
        width: 1200,
        height: 630,
      }] : [],
    },
  }
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug } = await params
  const photo = await getFeaturedPhoto(slug)

  if (!photo) {
    notFound()
  }

  return (
    <main className="relative min-h-screen">
      <PhotoBackground photo={photo} />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 p-8">
        <PhotoInfoModal 
          photo={photo}
          onClose={() => window.history.back()}
        />
      </div>
    </main>
  )
}