import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getFeaturedPhoto } from '@/lib/cosmic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { photoId, photoTitle, type, price } = await req.json()

    if (!photoId || !photoTitle || !type || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the photo exists and get full details
    const photo = await getFeaturedPhoto(photoId)
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Verify the price matches what's in the database
    const expectedPrice = type === 'digital' 
      ? photo.metadata?.price_digital 
      : photo.metadata?.price_print

    if (!expectedPrice || expectedPrice !== price) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${photoTitle} - ${type === 'digital' ? 'Digital Download' : 'Physical Print'}`,
              description: photo.metadata?.description || '',
              images: photo.metadata?.image?.imgix_url 
                ? [`${photo.metadata.image.imgix_url}?w=800&h=600&fit=crop&auto=format`]
                : [],
              metadata: {
                photoId: photo.id,
                type: type,
                artistName: photo.metadata?.artist?.metadata?.name || 'Unknown Artist',
              },
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/photos/${photo.slug}?success=true`,
      cancel_url: `${req.nextUrl.origin}/photos/${photo.slug}?canceled=true`,
      metadata: {
        photoId: photo.id,
        photoSlug: photo.slug,
        type: type,
        artistId: photo.metadata?.artist?.id || '',
        artistName: photo.metadata?.artist?.metadata?.name || '',
        artistEmail: photo.metadata?.artist?.metadata?.contact_email || '',
        commissionRate: photo.metadata?.artist?.metadata?.commission_rate?.toString() || '70',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}