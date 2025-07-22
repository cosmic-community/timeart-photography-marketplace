import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getFeaturedPhoto } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const { photoId, photoTitle, type, price } = await request.json()

    // Validate required fields
    if (!photoId || !photoTitle || !type || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the photo exists and prices match
    const photo = await getFeaturedPhoto(photoId)
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Verify price matches what's stored in CMS
    const expectedPrice = type === 'digital' 
      ? photo.metadata?.price_digital 
      : photo.metadata?.price_print

    if (!expectedPrice || expectedPrice !== price) {
      return NextResponse.json(
        { error: 'Price mismatch' },
        { status: 400 }
      )
    }

    // Create checkout session
    const session = await createCheckoutSession({
      photoId,
      photoTitle,
      price,
      type,
      successUrl: `${request.nextUrl.origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${request.nextUrl.origin}/purchase/cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}