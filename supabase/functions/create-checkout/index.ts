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
      bookingId: requestData.bookingId,
      ...requestData,
      promoDetails: {
        promoCode: requestData.promoCode,
        originalPrice: requestData.price,
        finalPrice: requestData.finalPrice,
        discountAmount: requestData.discountAmount
      }
    });

    if (!requestData || !requestData.bookingId) {
      throw new Error('No booking ID provided');
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

    // Créer la session Stripe
    const session = await createStripeSession(
      stripe,
      requestData,
      req.headers.get('origin') || ''
    );

    // Mettre à jour la réservation avec le payment_intent_id
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ payment_intent_id: session.payment_intent as string })
      .eq('id', requestData.bookingId);

    if (updateError) {
      console.error('❌ Error updating booking with payment_intent_id:', updateError);
      throw updateError;
    }

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      mode: requestData.isTestMode ? 'TEST' : 'LIVE',
      url: session.url,
      bookingId: requestData.bookingId,
      paymentIntentId: session.payment_intent
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