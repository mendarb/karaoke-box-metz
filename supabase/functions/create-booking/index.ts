import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      originalPrice: requestBody.originalPrice,
      finalPrice: requestBody.finalPrice,
      promoCode: requestBody.promoCode,
      discountAmount: requestBody.discountAmount,
      isTestMode: requestBody.isTestMode,
      userId: requestBody.userId,
    });

    if (!requestBody.userId) {
      console.error('❌ Pas d\'ID utilisateur fourni');
      throw new Error('ID utilisateur requis');
    }

    // Initialiser le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Créer la réservation avec l'ID utilisateur
    console.log('📅 Création de la réservation pour l\'utilisateur:', requestBody.userId);
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: requestBody.userId,
        user_email: requestBody.userEmail,
        user_name: requestBody.userName,
        user_phone: requestBody.userPhone,
        date: requestBody.date,
        time_slot: requestBody.timeSlot,
        duration: requestBody.duration,
        group_size: requestBody.groupSize,
        price: requestBody.finalPrice || requestBody.originalPrice,
        message: requestBody.message,
        status: 'pending',
        payment_status: 'awaiting_payment',
        is_test_booking: requestBody.isTestMode,
        promo_code_id: requestBody.promoCodeId,
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Erreur lors de la création de la réservation:', bookingError);
      throw bookingError;
    }

    console.log('✅ Réservation créée:', booking);

    // Créer la session Stripe
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

    // Utiliser le prix final pour la session Stripe
    const priceToCharge = requestBody.finalPrice || requestBody.originalPrice;
    console.log('💰 Prix final pour Stripe:', priceToCharge);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(priceToCharge * 100),
          product_data: {
            name: requestBody.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: `${requestBody.groupSize} personnes - ${requestBody.duration}h${requestBody.promoCode ? ` (Code promo: ${requestBody.promoCode})` : ''}`,
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      customer_email: requestBody.userEmail,
      metadata: {
        bookingId: booking.id,
        userId: requestBody.userId,
        userEmail: requestBody.userEmail,
        userName: requestBody.userName,
        userPhone: requestBody.userPhone,
        date: requestBody.date,
        timeSlot: requestBody.timeSlot,
        duration: requestBody.duration,
        groupSize: requestBody.groupSize,
        originalPrice: String(requestBody.originalPrice),
        finalPrice: String(priceToCharge),
        promoCode: requestBody.promoCode || '',
        discountAmount: String(requestBody.discountAmount || 0),
        message: requestBody.message || '',
        isTestMode: String(requestBody.isTestMode),
      },
    });

    console.log('✅ Session Stripe créée:', {
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      bookingId: booking.id,
      userId: requestBody.userId,
      metadata: session.metadata
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        bookingId: booking.id,
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