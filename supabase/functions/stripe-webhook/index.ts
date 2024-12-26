import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { handleWebhook } from './webhook-handler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  try {
    console.log('🎯 Webhook request received');
    console.log('📋 Method:', req.method);
    console.log('🔑 Headers:', Object.fromEntries(req.headers.entries()));

    if (req.method === 'OPTIONS') {
      console.log('✨ Responding to OPTIONS request');
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Get and log the raw body
    const body = await req.text();
    console.log('📦 Request body received:', body);

    // 2. Get Stripe signature
    const signature = req.headers.get('stripe-signature');
    console.log('📝 Stripe signature:', signature);

    if (!signature) {
      console.error('❌ No Stripe signature found in headers');
      return new Response(
        JSON.stringify({ error: 'No Stripe signature found' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 3. Parse the event
    const rawEvent = JSON.parse(body);
    const isTestMode = !rawEvent.livemode;
    console.log('🔑 Mode:', isTestMode ? 'TEST' : 'LIVE');

    // 4. Get appropriate webhook secret
    const webhookSecret = isTestMode 
      ? Deno.env.get('STRIPE_WEBHOOK_SECRET')
      : Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('❌ Webhook secret not configured for', isTestMode ? 'test' : 'live', 'mode');
      return new Response(
        JSON.stringify({ error: `Webhook secret not configured for ${isTestMode ? 'test' : 'live'} mode` }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 5. Get appropriate Stripe key
    const stripeKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error('❌ Stripe key not configured for', isTestMode ? 'test' : 'live', 'mode');
      return new Response(
        JSON.stringify({ error: `Stripe key not configured for ${isTestMode ? 'test' : 'live'} mode` }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 6. Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 7. Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified, event:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 8. Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 9. Handle the event
    const result = await handleWebhook(event, stripe, supabase);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Error in webhook handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});