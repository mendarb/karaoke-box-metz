import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('📥 Received create-checkout request');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    console.log('📦 Received booking data:', {
      email: data.userEmail,
      date: data.date,
      timeSlot: data.timeSlot,
      duration: data.duration,
      groupSize: data.groupSize,
      price: data.price,
      finalPrice: data.finalPrice,
      promoCode: data.promoCode,
      userId: data.userId,
      isTestMode: data.isTestMode,
      bookingId: data.bookingId
    });

    // Validation des données requises
    if (!data.userEmail || !data.date || !data.timeSlot || !data.duration || 
        !data.groupSize || !data.finalPrice || !data.userId || !data.bookingId) {
      console.error('❌ Missing required fields:', {
        email: !data.userEmail,
        date: !data.date,
        timeSlot: !data.timeSlot,
        duration: !data.duration,
        groupSize: !data.groupSize,
        finalPrice: !data.finalPrice,
        userId: !data.userId,
        bookingId: !data.bookingId
      });
      
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    console.log('✅ All required fields present, creating Stripe session...');
    const stripe = new Stripe(data.isTestMode ? 
      Deno.env.get('STRIPE_TEST_SECRET_KEY') || '' : 
      Deno.env.get('STRIPE_SECRET_KEY') || '', 
      {
        apiVersion: '2023-10-16',
      }
    );

    // Get the origin from headers with fallback
    const origin = req.headers.get('origin');
    if (!origin) {
      console.error('❌ No origin header found in request');
      return new Response(
        JSON.stringify({ error: 'Missing origin header' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }
    console.log('🌐 Request origin:', origin);

    // Format price description
    let priceDescription = `${data.groupSize} personnes - ${data.duration}h`;
    if (data.promoCode) {
      priceDescription += ` (Code: ${data.promoCode})`;
    }

    console.log('💰 Creating Stripe session with amount:', Math.round(data.finalPrice * 100));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(data.finalPrice * 100),
          product_data: {
            name: data.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
            description: priceDescription,
            images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
          },
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
      customer_email: data.userEmail,
      metadata: {
        bookingId: data.bookingId,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: data.duration,
        groupSize: data.groupSize,
        userId: data.userId,
        isTestMode: String(data.isTestMode),
        originalPrice: String(data.price),
        finalPrice: String(data.finalPrice),
        promoCodeId: data.promoCodeId || '',
      },
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      url: session.url,
      isTestMode: data.isTestMode
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});