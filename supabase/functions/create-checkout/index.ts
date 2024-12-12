import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      price, 
      groupSize, 
      duration, 
      date, 
      timeSlot, 
      message, 
      userEmail, 
      userName, 
      userPhone,
      isTestMode 
    } = await req.json()

    console.log('Creating checkout session with params:', {
      price,
      groupSize,
      duration,
      date,
      timeSlot,
      userEmail,
      isTestMode
    });

    // Utiliser la clé appropriée en fonction du mode
    const stripeSecretKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      console.error('Missing Stripe secret key for mode:', isTestMode ? 'test' : 'live');
      throw new Error(isTestMode ? 'Test mode API key not configured' : 'Live mode API key not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    console.log('Creating Stripe session in', isTestMode ? 'TEST' : 'LIVE', 'mode');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${isTestMode ? '[TEST] ' : ''}Réservation - ${date} ${timeSlot}`,
              description: `${groupSize} personnes - ${duration}h`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      customer_email: userEmail,
      metadata: {
        date,
        timeSlot,
        duration,
        groupSize,
        message: message || '',
        userName,
        userPhone,
        isTestMode: String(isTestMode)
      },
    })

    console.log('Checkout session created:', {
      sessionId: session.id,
      mode: isTestMode ? 'test' : 'live',
      email: userEmail,
      metadata: session.metadata
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})