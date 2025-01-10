import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
      email: requestBody.userEmail,
      fullName: requestBody.userName,
      date: requestBody.date,
      timeSlot: requestBody.timeSlot,
      duration: requestBody.duration,
      groupSize: requestBody.groupSize,
      originalPrice: requestBody.price,
      finalPrice: requestBody.finalPrice,
      promoCode: requestBody.promoCode,
      discountAmount: requestBody.discountAmount,
      isTestMode: requestBody.isTestMode,
      userId: requestBody.userId,
    });

    const price = parseFloat(requestBody.finalPrice || requestBody.price);
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
      stripeAccount: 'acct_1PJFrf08cLtke4H4', // Ajout de l'ID du compte connecté
    });

    console.log('💳 Création de la session Stripe...');

    const origin = req.headers.get('origin') || 'https://k-box.fr';
    console.log('🌐 URL d\'origine pour la redirection:', origin);

    // Créer un objet pour la description du produit
    let description = `${requestBody.groupSize} personnes - ${requestBody.duration}h`;
    if (requestBody.promoCode) {
      description += ` (Code promo: ${requestBody.promoCode})`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'klarna'],
      customer_email: requestBody.userEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(price * 100),
          product_data: {
            name: requestBody.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: description,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      payment_intent_data: {
        metadata: {
          userId: requestBody.userId,
          userEmail: requestBody.userEmail,
          userName: requestBody.userName,
          userPhone: requestBody.userPhone,
          date: requestBody.date,
          timeSlot: requestBody.timeSlot,
          duration: requestBody.duration,
          groupSize: requestBody.groupSize,
          price: String(price),
          promoCode: requestBody.promoCode || '',
          discountAmount: String(requestBody.discountAmount || 0),
          message: requestBody.message || '',
          isTestMode: String(requestBody.isTestMode),
        }
      },
      metadata: {
        userId: requestBody.userId,
        userEmail: requestBody.userEmail,
        userName: requestBody.userName,
        userPhone: requestBody.userPhone,
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
      billing_details_collection: 'auto',
      customer_creation: 'always',
      payment_method_collection: 'always',
      phone_number_collection: {
        enabled: true,
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

    // Envoyer l'email de demande de paiement seulement si demandé
    if (requestBody.sendEmail) {
      try {
        await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-payment-request`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({
              booking: {
                userEmail: requestBody.userEmail,
                userName: requestBody.userName,
                date: requestBody.date,
                timeSlot: requestBody.timeSlot,
                duration: requestBody.duration,
                groupSize: requestBody.groupSize,
                price: price,
                promoCode: requestBody.promoCode,
                message: requestBody.message,
                paymentUrl: session.url
              }
            }),
          }
        );
        console.log('📧 Email de demande de paiement envoyé avec succès');
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', emailError);
        // On ne relance pas l'erreur pour ne pas bloquer la création de la session
      }
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