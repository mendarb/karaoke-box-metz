import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Récupérer les variables d'environnement
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Récupérer les données de la requête
    const {
      email,
      fullName,
      phone,
      date,
      timeSlot,
      duration,
      groupSize,
      price,
      message,
      isTestMode,
      userId,
      promoCode,
      promoCodeId,
      discountAmount
    } = await req.json()

    console.log('📝 Données reçues:', {
      email,
      date,
      timeSlot,
      duration,
      groupSize,
      price,
      isTestMode
    })

    // Initialiser Stripe avec la clé appropriée
    const stripeSecretKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!stripeSecretKey) {
      throw new Error('Clé Stripe non configurée')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    console.log('💳 Mode de paiement:', isTestMode ? 'TEST' : 'PRODUCTION')

    // S'assurer que la durée est un nombre
    const durationNumber = parseInt(duration)
    if (isNaN(durationNumber)) {
      console.error('❌ Durée invalide:', duration)
      throw new Error('Duration invalide')
    }

    console.log('⏱️ Durée calculée:', {
      rawDuration: duration,
      parsedDuration: durationNumber,
    })

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(price * 100),
            product_data: {
              name: `${isTestMode ? '[TEST] ' : ''}Réservation Karaoké - ${durationNumber}h - ${groupSize} pers.`,
              description: `${date} à ${timeSlot} - ${durationNumber} heure${durationNumber > 1 ? 's' : ''} - ${groupSize} personne${parseInt(groupSize) > 1 ? 's' : ''}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}`,
      customer_email: email,
      metadata: {
        booking_date: date,
        time_slot: timeSlot,
        duration: durationNumber.toString(),
        group_size: groupSize,
        user_id: userId,
        is_test_mode: isTestMode ? 'true' : 'false',
        promo_code: promoCode || '',
        promo_code_id: promoCodeId || '',
        discount_amount: discountAmount?.toString() || '0',
      },
    })

    console.log('✅ Session de paiement créée:', {
      sessionId: session.id,
      amount: price,
      duration: durationNumber,
      isTestMode
    })

    // Créer la réservation dans la base de données
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert([
        {
          user_id: userId,
          user_email: email,
          user_name: fullName,
          user_phone: phone,
          date,
          time_slot: timeSlot,
          duration: durationNumber.toString(),
          group_size: groupSize,
          price,
          message,
          payment_intent_id: session.payment_intent as string,
          is_test_booking: isTestMode,
          promo_code_id: promoCodeId,
        },
      ])
      .select()
      .single()

    if (bookingError) {
      console.error('❌ Erreur lors de la création de la réservation:', bookingError)
      throw bookingError
    }

    console.log('✅ Réservation créée:', booking)

    return new Response(
      JSON.stringify({
        url: session.url,
        bookingId: booking.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Erreur:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})