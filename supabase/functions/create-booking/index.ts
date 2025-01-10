import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const requestBody = await req.json()
    console.log('📝 Request body:', requestBody)

    // Validation de l'email
    if (!requestBody.userEmail || !requestBody.userEmail.includes('@')) {
      throw new Error('Email invalide')
    }

    // Créer le client Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    console.log('🔍 Creating checkout session...')

    // Préparer les détails de facturation
    const billingDetails = {
      name: requestBody.userName || '',
      email: requestBody.userEmail || '',
      phone: requestBody.userPhone || '',
    }

    // Créer la session de paiement
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      payment_method_types: ['card', 'paypal', 'klarna'],
      customer_email: billingDetails.email,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        booking_id: requestBody.bookingId,
        user_id: requestBody.userId || null,
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réservation Box Karaoké - ${requestBody.date}`,
              description: `${requestBody.duration}h - ${requestBody.groupSize} personnes`,
            },
            unit_amount: Math.round(requestBody.price * 100),
          },
          quantity: 1,
        },
      ],
      custom_fields: [
        {
          key: 'booking_message',
          label: {
            type: 'custom',
            custom: 'Message pour votre réservation (optionnel)',
          },
          type: 'text',
          optional: true,
        },
      ],
    })

    console.log('✅ Checkout session created:', session.id)

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})