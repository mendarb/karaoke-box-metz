import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { corsHeaders } from "../_shared/cors.ts";

const formatHour = (hour: string | number): string => {
  const parsedHour = parseInt(String(hour));
  return parsedHour ? `${String(parsedHour).padStart(2, '0')}:00` : '';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('📝 Données de réservation reçues:', requestBody);

    // Validation des données requises
    const { date, timeSlot, duration, groupSize, price, email, fullName } = requestBody;
    
    // Validation spécifique de la durée
    const parsedDuration = parseInt(duration);
    if (!parsedDuration || parsedDuration <= 0) {
      console.error('❌ Durée invalide:', duration);
      throw new Error('La durée de réservation doit être supérieure à 0');
    }

    if (!date || !timeSlot || !groupSize || !price || !email || !fullName) {
      throw new Error('Données de réservation incomplètes');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Formatage de la date et des heures
    const bookingDate = new Date(date);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(bookingDate);

    // Extraire l'heure du timeSlot (format "HH:00")
    const startHourInt = parseInt(timeSlot.split(':')[0]);
    const endHourInt = startHourInt + parsedDuration;
    const startTime = formatHour(startHourInt);
    const endTime = formatHour(endHourInt);
    
    console.log('⏰ Heures formatées:', {
      startHourInt,
      endHourInt,
      startTime,
      endTime,
      duration: parsedDuration
    });
    
    // Construction de la description
    const description = [
      formattedDate,
      `${startTime} - ${endTime}`,
      `${groupSize} personne${parseInt(groupSize) > 1 ? 's' : ''} - ${parsedDuration}h`,
      requestBody.message ? `Message: ${requestBody.message}` : '',
      requestBody.promoCode ? `Code promo: ${requestBody.promoCode}` : ''
    ].filter(Boolean).join('\n');

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
              booking_date: date,
              time_slot: startTime,
              duration: String(parsedDuration),
              group_size: groupSize,
            },
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.get('origin') || 'https://k-box.fr'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'https://k-box.fr'}`,
      customer_email: email,
      client_reference_id: requestBody.userId,
      payment_intent_data: {
        metadata: {
          user_id: requestBody.userId,
          user_name: fullName,
          user_email: email,
          user_phone: requestBody.phone || '',
          booking_date: date,
          time_slot: startTime,
          end_time: endTime,
          duration: String(parsedDuration),
          group_size: `${groupSize} personne${parseInt(groupSize) > 1 ? 's' : ''}`,
          price: String(price),
          promo_code: requestBody.promoCode || '',
          discount_amount: String(requestBody.discountAmount || 0),
          is_test_mode: String(requestBody.isTestMode || false),
        },
        description: `Réservation Karaoké Box - ${formattedDate}`,
        statement_descriptor: 'KARAOKE BOX METZ',
        statement_descriptor_suffix: 'RESERVATION',
      },
      metadata: {
        userId: requestBody.userId,
        userEmail: email,
        userName: fullName,
        userPhone: requestBody.phone || '',
        date: date,
        timeSlot: startTime,
        endTime: endTime,
        duration: String(parsedDuration),
        groupSize: groupSize,
        price: String(price),
        promoCode: requestBody.promoCode || '',
        discountAmount: String(requestBody.discountAmount || 0),
        message: requestBody.message || '',
        isTestMode: String(requestBody.isTestMode || false),
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
      JSON.stringify({ 
        error: error.message,
        details: 'Une erreur est survenue lors de la création de la réservation. Veuillez réessayer.' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});