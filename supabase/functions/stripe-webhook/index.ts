import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { handleCheckoutSession } from "./handlers/checkout-session.ts";
import { verifySignature } from "./webhook-verification.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📦 Received webhook request');
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    if (!signature) {
      console.error('❌ No Stripe signature found in request');
      throw new Error('No Stripe signature found in request');
    }

    // Initialize Stripe with the appropriate secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const stripeTestSecretKey = Deno.env.get('STRIPE_TEST_SECRET_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
    const liveWebhookSecret = Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET')!;

    // Verify webhook signature
    const event = await verifySignature(body, signature, webhookSecret, liveWebhookSecret);
    console.log('✅ Webhook signature verified');

    // Initialize Stripe client based on event mode
    const stripe = new Stripe(event.livemode ? stripeSecretKey : stripeTestSecretKey);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🎯 Processing webhook event:', {
      type: event.type,
      id: event.id,
      livemode: event.livemode
    });

    let result;
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        result = await handleCheckoutSession(session, supabase);
        break;
      default:
        console.log(`🤔 Unhandled event type: ${event.type}`);
        return new Response(
          JSON.stringify({ received: true, message: `Unhandled event type: ${event.type}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ received: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});