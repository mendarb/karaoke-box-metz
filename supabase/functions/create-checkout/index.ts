import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { price, groupSize, duration, date, timeSlot, message, userEmail, userName, userPhone } = await req.json();
    console.log('Request data:', { price, groupSize, duration, date, timeSlot, message, userEmail, userName, userPhone });

    // Récupérer le mode test depuis les paramètres
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: settingsData, error: settingsError } = await supabaseClient
      .from('booking_settings')
      .select('value')
      .eq('key', 'booking_settings')
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      throw new Error('Impossible de récupérer les paramètres');
    }

    const isTestMode = settingsData?.value?.isTestMode ?? true;
    console.log('Using test mode:', isTestMode);

    const stripeSecretKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      console.error('Stripe secret key not found for mode:', isTestMode ? 'test' : 'production');
      throw new Error('Configuration Stripe manquante');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true
    });

    const successUrl = `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&test_mode=${isTestMode}`;
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réservation Karaoké Box`,
              description: `${groupSize} personnes - ${duration}h\nLe ${formattedDate} à ${timeSlot}`,
              images: ['https://lxkaosgjtqonrnlivzev.supabase.co/storage/v1/object/public/assets/logo.png'],
            },
            unit_amount: Math.round(price * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: `${req.headers.get('origin')}/cancel`,
      customer_email: userEmail,
      metadata: {
        date,
        timeSlot,
        groupSize,
        duration,
        message: message || '',
        userName,
        userPhone,
        isTestMode: isTestMode ? 'true' : 'false'
      },
      custom_fields: [
        {
          key: 'special_requests',
          label: { type: 'custom', custom: 'Demandes spéciales' },
          type: 'text',
          optional: true,
        },
      ],
      custom_text: {
        submit: { message: 'Nous traiterons votre paiement de manière sécurisée avec Stripe' },
        shipping_address: { message: 'La réservation aura lieu à notre établissement' },
      },
      billing_address_collection: 'auto',
      locale: 'fr',
      phone_number_collection: {
        enabled: true,
      },
      customer_creation: 'always',
      payment_intent_data: {
        description: `Réservation Karaoké Box - ${formattedDate} ${timeSlot}`,
        metadata: {
          booking_date: date,
          time_slot: timeSlot,
          duration: duration,
          group_size: groupSize,
        },
      },
    });

    console.log('Checkout session created successfully:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur est survenue lors de la création de la session de paiement',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});