import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyWebhookSignature } from '@/lib/stripe'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Verify the webhook signature
    const event = verifyWebhookSignature(body, signature)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        
        // Extract metadata
        const photoId = session.metadata?.photoId
        const type = session.metadata?.type
        
        if (!photoId || !type) {
          console.error('Missing metadata in checkout session:', session.id)
          break
        }

        try {
          // Create order record in Cosmic CMS
          await cosmic.objects.insertOne({
            title: `Order ${session.id}`,
            type: 'orders',
            metadata: {
              order_id: session.id,
              customer_email: session.customer_details?.email || '',
              customer_name: session.customer_details?.name || '',
              purchased_photo: photoId,
              license_type: type === 'digital' ? 'personal' : 'personal',
              format_type: type,
              order_total: session.amount_total ? session.amount_total / 100 : 0,
              artist_commission: 0, // Calculate based on artist commission rate
              platform_fee: 0, // Calculate platform fee
              stripe_session_id: session.id,
              stripe_payment_intent: session.payment_intent,
              order_status: 'completed',
              purchase_date: new Date().toISOString().split('T')[0],
              download_url: type === 'digital' ? `https://example.com/download/${session.id}` : '',
              download_expires: type === 'digital' 
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days
                : '',
              shipping_address: session.shipping_details?.address ? 
                `${session.shipping_details.address.line1}\n${session.shipping_details.address.city}, ${session.shipping_details.address.state} ${session.shipping_details.address.postal_code}\n${session.shipping_details.address.country}` : '',
              order_notes: `Order processed via Stripe. Session ID: ${session.id}`,
              customer_notes: ''
            }
          })

          console.log(`Order created for session ${session.id}`)
        } catch (error) {
          console.error('Failed to create order record:', error)
        }
        
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        console.log(`Payment failed: ${paymentIntent.id}`)
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}