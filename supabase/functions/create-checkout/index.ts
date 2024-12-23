import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
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
    console.log('📝 Received request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    const requestData = await req.json();
    console.log('📦 Request data:', requestData);

    if (!requestData || !requestData.bookingId) {
      console.error('❌ Invalid request data:', requestData);
      throw new Error('Invalid request data: missing bookingId');
    }

    console.log('🔧 Processing checkout for booking:', requestData.bookingId);

    // Si le prix final est 0 (réservation gratuite), on traite directement comme un succès
    if (requestData.finalPrice === 0) {
      console.log('🆓 Processing free booking');
      
      try {
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/stripe-webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'stripe-signature': 'free-booking'
          },
          body: JSON.stringify({
            type: 'checkout.session.completed',
            data: {
              object: {
                metadata: {
                  bookingId: requestData.bookingId,
                  isTestMode: String(requestData.isTestMode)
                },
                payment_status: 'paid',
                customer_email: requestData.userEmail
              }
            }
          })
        });

        if (!response.ok) {
          console.error('❌ Failed to process free booking:', await response.text());
          throw new Error('Failed to process free booking');
        }

        console.log('✅ Free booking processed successfully');
        return new Response(
          JSON.stringify({ 
            url: `${req.headers.get('origin')}/success?booking_id=${requestData.bookingId}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('❌ Error processing free booking:', error);
        throw error;
      }
    }

    const formattedDate = requestData.date;
    console.log('📅 Formatted date:', formattedDate);

    const stripeKey = requestData.isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error('❌ Missing Stripe API key');
      throw new Error(`${requestData.isTestMode ? 'Test' : 'Live'} mode Stripe API key not configured`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log('💳 Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: requestData.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
              description: `${requestData.groupSize} personnes - ${requestData.duration}h`,
              images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
            },
            unit_amount: Math.round(requestData.finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${requestData.bookingId}`,
      cancel_url: `${req.headers.get('origin')}/error?error=payment_cancelled`,
      customer_email: requestData.userEmail,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expire après 30 minutes
      metadata: {
        bookingId: requestData.bookingId,
        date: formattedDate,
        timeSlot: requestData.timeSlot,
        duration: requestData.duration,
        groupSize: requestData.groupSize,
        isTestMode: String(requestData.isTestMode),
        userName: requestData.userName,
        userPhone: requestData.userPhone,
        promoCodeId: requestData.promoCodeId || '',
        originalPrice: String(requestData.price),
        finalPrice: String(requestData.finalPrice),
      }
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      mode: requestData.isTestMode ? 'TEST' : 'LIVE',
      url: session.url
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in checkout process:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});