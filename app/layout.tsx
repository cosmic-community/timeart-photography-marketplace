import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TimeArt - Beautiful Time Display & Photography Marketplace',
  description: 'Check the time while discovering stunning photography that can be yours. A unique marketplace disguised as a time display.',
  keywords: 'time, photography, art, marketplace, wall art, prints, digital art',
  authors: [{ name: 'TimeArt' }],
  openGraph: {
    title: 'TimeArt - Beautiful Time Display & Photography Marketplace',
    description: 'Check the time while discovering stunning photography that can be yours.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeArt - Beautiful Time Display & Photography Marketplace',
    description: 'Check the time while discovering stunning photography that can be yours.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}