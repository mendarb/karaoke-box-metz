import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📥 Received checkout request');
    const { data } = await req.json();
    
    console.log('🔧 Processing checkout with data:', {
      bookingId: data.bookingId,
      email: data.userEmail,
      isTestMode: data.isTestMode
    });

    // Initialize Stripe with the appropriate key based on test mode
    const stripeKey = data.isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error('❌ Missing Stripe API key');
      throw new Error(`${data.isTestMode ? 'Test' : 'Live'} mode Stripe API key not configured`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('💳 Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: data.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
              description: `${data.groupSize} personnes - ${data.duration}h`,
              images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
            },
            unit_amount: Math.round(data.finalPrice * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}&booking_id=${data.bookingId}`,
      cancel_url: data.cancelUrl,
      customer_email: data.userEmail,
      metadata: {
        bookingId: data.bookingId,
        isTestMode: String(data.isTestMode)
      }
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      mode: data.isTestMode ? 'TEST' : 'LIVE',
      url: session.url
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in checkout process:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});