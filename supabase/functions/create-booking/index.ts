import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('📦 Données de réservation reçues:', {
      email: requestBody.email,
      fullName: requestBody.fullName,
      date: requestBody.date,
      timeSlot: requestBody.timeSlot,
      duration: requestBody.duration,
      groupSize: requestBody.groupSize,
      price: requestBody.price,
      promoCode: requestBody.promoCode,
      discountAmount: requestBody.discountAmount,
      isTestMode: requestBody.isTestMode,
      userId: requestBody.userId,
    });

    if (!requestBody.userId) {
      console.error('❌ Pas d\'ID utilisateur fourni');
      throw new Error('ID utilisateur requis');
    }

    const price = parseFloat(requestBody.price);
    if (isNaN(price) || price < 0) {
      console.error('❌ Prix invalide:', price);
      throw new Error('Prix invalide');
    }

    const stripeKey = requestBody.isTestMode ? 
      Deno.env.get('STRIPE_TEST_SECRET_KEY')! : 
      Deno.env.get('STRIPE_SECRET_KEY')!;

    if (!stripeKey) {
      throw new Error(`Clé Stripe ${requestBody.isTestMode ? 'test' : 'live'} non configurée`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('💳 Création de la session Stripe...');

    // Récupérer l'origine de la requête pour la redirection
    const origin = req.headers.get('origin') || 'https://k-box.fr';
    console.log('🌐 URL d\'origine pour la redirection:', origin);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(price * 100),
          product_data: {
            name: requestBody.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: `${requestBody.groupSize} personnes - ${requestBody.duration}h${requestBody.promoCode ? ` (Code promo: ${requestBody.promoCode})` : ''}`,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      customer_email: requestBody.email,
      metadata: {
        userId: requestBody.userId,
        userEmail: requestBody.email,
        userName: requestBody.fullName,
        userPhone: requestBody.phone,
        date: requestBody.date,
        timeSlot: requestBody.timeSlot,
        duration: requestBody.duration,
        groupSize: requestBody.groupSize,
        price: String(price),
        promoCode: requestBody.promoCode || '',
        discountAmount: String(requestBody.discountAmount || 0),
        message: requestBody.message || '',
        isTestMode: String(requestBody.isTestMode),
      },
    });

    console.log('✅ Session Stripe créée:', {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      userId: requestBody.userId,
      price: price,
      metadata: session.metadata,
      successUrl: session.success_url,
      cancelUrl: session.cancel_url
    });

    if (!session.url) {
      console.error('❌ Pas d\'URL de paiement retournée par Stripe');
      throw new Error('Pas d\'URL de paiement retournée par Stripe');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        url: session.url 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans le processus de réservation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});