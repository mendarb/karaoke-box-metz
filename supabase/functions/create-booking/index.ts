import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('📝 Données de réservation reçues:', requestBody);

    // Validation des données requises
    if (!requestBody.date || !requestBody.timeSlot || !requestBody.duration || !requestBody.groupSize) {
      throw new Error('Données de réservation manquantes');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Calcul du prix
    let price = requestBody.price;
    if (requestBody.discountAmount) {
      price = Math.max(0, price - requestBody.discountAmount);
    }

    const origin = req.headers.get('origin') || 'https://k-box.fr';
    console.log('🌐 URL d\'origine pour la redirection:', origin);

    // Formatage de la date pour l'affichage
    const bookingDate = new Date(requestBody.date);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(bookingDate);

    // Formatage des heures
    const startHour = parseInt(requestBody.timeSlot);
    const duration = parseInt(requestBody.duration);
    const endHour = startHour + duration;
    const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;
    
    // Construction de la description
    let description = `${formattedDate}\n`;
    description += `${formatHour(startHour)} - ${formatHour(endHour)}\n`;
    description += `${requestBody.groupSize} personne${parseInt(requestBody.groupSize) > 1 ? 's' : ''} - ${duration}h\n`;
    
    if (requestBody.message) {
      description += `Message: ${requestBody.message}\n`;
    }
    if (requestBody.promoCode) {
      description += `Code promo: ${requestBody.promoCode}`;
    }

    console.log('📝 Description formatée:', description);

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(price * 100),
          product_data: {
            name: requestBody.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: description,
            metadata: {
              booking_date: requestBody.date,
              time_slot: requestBody.timeSlot,
              duration: requestBody.duration,
              group_size: requestBody.groupSize,
            },
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      customer_email: requestBody.userEmail,
      client_reference_id: requestBody.userId,
      payment_intent_data: {
        metadata: {
          user_id: requestBody.userId,
          user_name: requestBody.userName,
          user_email: requestBody.userEmail,
          user_phone: requestBody.userPhone,
          booking_date: requestBody.date,
          time_slot: formatHour(startHour),
          end_time: formatHour(endHour),
          duration: `${duration}h`,
          group_size: `${requestBody.groupSize} personne${parseInt(requestBody.groupSize) > 1 ? 's' : ''}`,
          price: String(price),
          promo_code: requestBody.promoCode || '',
          discount_amount: String(requestBody.discountAmount || 0),
          is_test_mode: String(requestBody.isTestMode),
        },
        description: `Réservation Karaoké Box - ${formattedDate}`,
        statement_descriptor: 'KARAOKE BOX METZ',
        statement_descriptor_suffix: 'RESERVATION',
      },
      metadata: {
        userId: requestBody.userId,
        userEmail: requestBody.userEmail,
        userName: requestBody.userName,
        userPhone: requestBody.userPhone,
        date: requestBody.date,
        timeSlot: formatHour(startHour),
        endTime: formatHour(endHour),
        duration: `${duration}h`,
        groupSize: requestBody.groupSize,
        price: String(price),
        promoCode: requestBody.promoCode || '',
        discountAmount: String(requestBody.discountAmount || 0),
        message: requestBody.message || '',
        isTestMode: String(requestBody.isTestMode),
      },
      custom_fields: [
        {
          key: 'phone',
          label: { type: 'custom', custom: 'Téléphone' },
          type: 'text',
          optional: true,
        },
      ],
    });

    console.log('✅ Session Stripe créée:', {
      sessionId: session.id,
      amount: price,
      description: description
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erreur lors de la création de la session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});