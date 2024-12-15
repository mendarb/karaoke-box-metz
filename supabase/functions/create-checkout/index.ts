import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getStripeInstance } from './stripe-config.ts';
import { createCheckoutSession } from './checkout-service.ts';
import { CheckoutData } from './types.ts';

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
      price: data.price,
      finalPrice: data.finalPrice,
      promoCode: data.promoCode
    });

    const stripe = getStripeInstance(data.isTestMode);
    const session = await createCheckoutSession(
      stripe,
      data,
      req.headers.get('origin') || ''
    );

    console.log('Checkout session created:', {
      sessionId: session.id,
      mode: session.mode,
      finalPrice: data.finalPrice
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
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});