import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCheckoutSession } from './checkout-service.ts';
import { CheckoutData } from './types.ts';
import { getStripeInstance } from './stripe-config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('📥 Received create-checkout request');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data: CheckoutData = await req.json();
    console.log('📦 Received booking data:', {
      email: data.userEmail,
      date: data.date,
      timeSlot: data.timeSlot,
      duration: data.duration,
      groupSize: data.groupSize,
      price: data.price,
      finalPrice: data.finalPrice,
      promoCode: data.promoCode,
      userId: data.userId,
      isTestMode: data.isTestMode
    });

    // Validation des données requises
    if (!data.userEmail || !data.date || !data.timeSlot || !data.duration || 
        !data.groupSize || data.price === undefined || data.finalPrice === undefined || !data.userId) {
      console.error('❌ Missing required fields:', {
        hasEmail: !!data.userEmail,
        hasDate: !!data.date,
        hasTimeSlot: !!data.timeSlot,
        hasDuration: !!data.duration,
        hasGroupSize: !!data.groupSize,
        hasPrice: data.price !== undefined,
        hasFinalPrice: data.finalPrice !== undefined,
        hasUserId: !!data.userId
      });
      
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    console.log('✅ All required fields present, creating Stripe session...');
    const stripe = getStripeInstance(data.isTestMode);
    const origin = req.headers.get('origin') || '';
    const session = await createCheckoutSession(stripe, data, origin);

    console.log('✅ Checkout session created successfully:', {
      sessionId: session.id,
      url: session.url,
      isTestMode: data.isTestMode
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("❌ Checkout error:", {
      message: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});