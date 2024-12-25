import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    console.log('🔍 Récupération de la session:', sessionId);

    if (!sessionId) {
      console.error('❌ Session ID manquant');
      throw new Error('Session ID is required');
    }

    // Utiliser la clé de test si la session commence par cs_test
    const isTestMode = sessionId.startsWith('cs_test_');
    const stripeKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error('❌ Clé Stripe non configurée');
      throw new Error(`${isTestMode ? 'Test' : 'Live'} mode Stripe API key not configured`);
    }

    console.log('💳 Mode:', isTestMode ? 'TEST' : 'LIVE');

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Session Stripe récupérée:', {
      id: session.id,
      paymentStatus: session.payment_status,
      paymentIntent: session.payment_intent
    });

    if (!session.payment_intent) {
      console.error('❌ Pas de payment_intent dans la session');
      throw new Error('No payment intent found for this session');
    }
    
    return new Response(
      JSON.stringify({ 
        paymentIntentId: session.payment_intent 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans get-payment-intent:', error);
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