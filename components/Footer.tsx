import { getBucketSlug } from '@/lib/cosmic'

export default function Footer() {
  const bucketSlug = getBucketSlug()

  return (
    <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <a
        href={`https://www.cosmicjs.com?utm_source=bucket_${bucketSlug}&utm_medium=referral&utm_campaign=app_footer&utm_content=built_with_cosmic`}
        target="_blank"
        rel="noopener noreferrer"
        className="cosmic-button"
      >
        <img 
          src="https://cdn.cosmicjs.com/b67de7d0-c810-11ed-b01d-23d7b265c299-logo508x500.svg" 
          alt="Cosmic Logo" 
          className="w-5 h-5"
        />
        Built with Cosmic
      </a>
    </footer>
  )
}