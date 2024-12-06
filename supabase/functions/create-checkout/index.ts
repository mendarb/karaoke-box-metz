import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { price, groupSize, duration, date, timeSlot, message, userEmail, userName, userPhone } = await req.json();
    console.log('Request data:', { price, groupSize, duration, date, timeSlot, message, userEmail, userName, userPhone });

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment variables');
      throw new Error('Configuration Stripe manquante');
    }

    console.log('Initializing Stripe with secret key length:', stripeSecretKey.length);
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true
    });

    const successUrl = `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&test_mode=true`;

    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réservation Karaoké - ${groupSize} personnes - ${duration}h`,
              description: `Le ${new Date(date).toLocaleDateString('fr-FR')} à ${timeSlot}h`,
            },
            unit_amount: price * 100,
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
        isTestMode: 'true'
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