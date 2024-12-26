import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

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
    console.log('📦 Données reçues pour la création de session:', {
      originalPrice: requestData.price,
      finalPrice: requestData.finalPrice,
      promoCode: requestData.promoCode,
      discountAmount: requestData.discountAmount,
      isTestMode: requestData.isTestMode
    });

    const stripeKey = requestData.isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      throw new Error(`Clé API Stripe ${requestData.isTestMode ? 'test' : 'live'} non configurée`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('💳 Création de la session Stripe...');

    // Utiliser le prix final après réduction
    const finalAmount = Math.round((requestData.finalPrice || requestData.price) * 100);
    console.log('💰 Montant final pour Stripe:', {
      originalPrice: requestData.price,
      finalPrice: requestData.finalPrice,
      finalAmount,
      promoDetails: {
        code: requestData.promoCode,
        discountAmount: requestData.discountAmount
      }
    });

    // Format price description with promo code if applicable
    let priceDescription = `${requestData.groupSize} personnes - ${requestData.duration}h`;
    if (requestData.promoCode && requestData.discountAmount) {
      priceDescription += ` (-${Math.round(requestData.discountAmount)}% avec ${requestData.promoCode})`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: finalAmount,
          product_data: {
            name: requestData.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: priceDescription,
            images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      customer_email: requestData.userEmail,
      metadata: {
        userId: requestData.userId,
        userEmail: requestData.userEmail,
        userName: requestData.userName,
        userPhone: requestData.userPhone,
        date: requestData.date,
        timeSlot: requestData.timeSlot,
        duration: requestData.duration,
        groupSize: requestData.groupSize,
        originalPrice: String(requestData.price),
        finalPrice: String(requestData.finalPrice || requestData.price),
        message: requestData.message || '',
        isTestMode: String(requestData.isTestMode),
        promoCodeId: requestData.promoCodeId || '',
        promoCode: requestData.promoCode || '',
        discountAmount: String(requestData.discountAmount || 0),
      },
    });

    console.log('✅ Session Stripe créée:', {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      metadata: session.metadata,
      finalAmount,
      promoDetails: {
        code: requestData.promoCode,
        discountAmount: requestData.discountAmount
      }
    });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        paymentIntentId: session.payment_intent 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans le processus de création de session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});