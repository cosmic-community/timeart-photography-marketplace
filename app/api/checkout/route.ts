import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getFeaturedPhoto } from '@/lib/cosmic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
})

export async function POST(req: NextRequest) {
  try {
    const { photoId, photoTitle, type, price, printSize } = await req.json()

    // Validate required fields
    if (!photoId || !photoTitle || !type || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: photoId, photoTitle, type, and price are required' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['digital', 'print'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "digital" or "print"' },
        { status: 400 }
      )
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Invalid price. Must be a positive number' },
        { status: 400 }
      )
    }

    // Verify the photo exists and get full details
    let photo
    try {
      photo = await getFeaturedPhoto(photoId)
    } catch (error) {
      console.error('Error fetching photo:', error)
      return NextResponse.json(
        { error: 'Failed to verify photo' },
        { status: 500 }
      )
    }

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Check if photo is active for sale
    if (!photo.metadata?.is_active) {
      return NextResponse.json(
        { error: 'This photo is not available for purchase' },
        { status: 400 }
      )
    }

    // Verify the price matches what's in the database (with some tolerance for print size variations)
    const expectedPrice = type === 'digital' 
      ? photo.metadata?.price_digital 
      : photo.metadata?.price_print

    if (!expectedPrice) {
      return NextResponse.json(
        { error: `${type === 'digital' ? 'Digital' : 'Print'} purchases are not available for this photo` },
        { status: 400 }
      )
    }

    // For prints, allow price variations for different sizes (within reasonable bounds)
    const priceVariationAllowed = type === 'print' ? expectedPrice * 2 : 0
    if (price < expectedPrice || price > expectedPrice + priceVariationAllowed) {
      return NextResponse.json(
        { error: 'Invalid price for this item' },
        { status: 400 }
      )
    }

    // Build product name and description
    const productName = `${photoTitle} - ${type === 'digital' ? 'Digital Download' : 'Physical Print'}`
    const productDescription = [
      photo.metadata?.description || '',
      printSize ? `Size: ${printSize}` : '',
      `License: ${photo.metadata?.license_type?.value || 'Personal Use'}`
    ].filter(Boolean).join(' • ')

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDescription,
              images: photo.metadata?.image?.imgix_url 
                ? [`${photo.metadata.image.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`]
                : [],
              metadata: {
                photoId: photo.id,
                type: type,
                printSize: printSize || '',
                artistName: photo.metadata?.artist?.metadata?.name || 'Unknown Artist',
                licenseType: photo.metadata?.license_type?.value || 'Personal Use',
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
        photoTitle: photoTitle,
        type: type,
        printSize: printSize || '',
        artistId: photo.metadata?.artist?.id || '',
        artistName: photo.metadata?.artist?.metadata?.name || '',
        artistEmail: photo.metadata?.artist?.metadata?.contact_email || '',
        commissionRate: photo.metadata?.artist?.metadata?.commission_rate?.toString() || '70',
        licenseType: photo.metadata?.license_type?.value || 'Personal Use',
      },
      billing_address_collection: 'required',
      shipping_address_collection: type === 'print' ? {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK'],
      } : undefined,
    })

    if (!session.url) {
      throw new Error('Failed to create checkout session URL')
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment processing error: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}