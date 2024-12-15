import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCheckoutSession } from './checkout-service.ts';
import { CheckoutData } from './types.ts';
import { getStripeInstance } from './stripe-config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data: CheckoutData = await req.json();
    console.log('Received checkout request:', {
      email: data.userEmail,
      date: data.date,
      timeSlot: data.timeSlot,
      duration: data.duration,
      groupSize: data.groupSize,
      price: data.price,
      finalPrice: data.finalPrice,
      promoCode: data.promoCode,
      userId: data.userId
    });

    // Validation des données requises
    if (!data.userEmail || !data.date || !data.timeSlot || !data.duration || 
        !data.groupSize || data.price === undefined || data.finalPrice === undefined || !data.userId) {
      console.error('Missing required fields:', data);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: {
            hasEmail: !!data.userEmail,
            hasDate: !!data.date,
            hasTimeSlot: !!data.timeSlot,
            hasDuration: !!data.duration,
            hasGroupSize: !!data.groupSize,
            hasPrice: data.price !== undefined,
            hasFinalPrice: data.finalPrice !== undefined,
            hasUserId: !!data.userId
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    const stripe = getStripeInstance(data.isTestMode);
    const session = await createCheckoutSession(stripe, data, req.headers.get('origin') || '');

    console.log('Checkout session created successfully:', {
      sessionId: session.id,
      url: session.url,
      isFree: data.finalPrice === 0
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.constructor.name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});