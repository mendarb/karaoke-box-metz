import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();
    
    console.log('💳 Creating checkout session with data:', {
      bookingId: data.bookingId,
      userEmail: data.userEmail,
      isTestMode: data.isTestMode
    });

    // Determine which Stripe key to use
    const mode = data.isTestMode ? 'TEST' : 'LIVE';
    const stripeKey = data.isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error(`❌ Missing Stripe ${mode} mode API key`);
      throw new Error(`Stripe ${mode} mode API key not configured`);
    }

    console.log('🔑 Using Stripe mode:', mode, {
      isTestMode: data.isTestMode,
      mode
    });

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Booking #${data.bookingId}`,
            },
            unit_amount: data.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancelUrl,
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      mode,
      url: session.url
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
