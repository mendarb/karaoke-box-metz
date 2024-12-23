import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createStripeSession } from "./stripe-service.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('📦 Request data:', {
      ...requestData,
      promoDetails: {
        promoCode: requestData.promoCode,
        originalPrice: requestData.price,
        finalPrice: requestData.finalPrice,
        discountAmount: requestData.discountAmount
      }
    });

    if (!requestData) {
      throw new Error('No data provided');
    }

    const stripeKey = requestData.isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      throw new Error(`${requestData.isTestMode ? 'Test' : 'Live'} mode Stripe API key not configured`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Créer la session Stripe sans créer la réservation
    const session = await createStripeSession(
      stripe,
      requestData,
      req.headers.get('origin') || ''
    );

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      mode: requestData.isTestMode ? 'TEST' : 'LIVE',
      url: session.url,
      priceDetails: {
        originalPrice: requestData.price,
        finalPrice: requestData.finalPrice,
        promoCode: requestData.promoCode,
        discountAmount: requestData.discountAmount
      }
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