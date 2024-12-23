import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { format } from "https://esm.sh/date-fns@2.30.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();
    
    console.log('🔧 Processing checkout with data:', {
      bookingId: data.bookingId,
      email: data.userEmail,
      isTestMode: data.isTestMode,
      finalPrice: data.finalPrice,
      promoCodeId: data.promoCodeId
    });

    // Si le prix final est 0 (réservation gratuite), on traite directement comme un succès
    if (data.finalPrice === 0) {
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
                  bookingId: data.bookingId,
                  isTestMode: String(data.isTestMode)
                },
                payment_status: 'paid',
                customer_email: data.userEmail
              }
            }
          })
        });

        if (!response.ok) {
          console.error('❌ Failed to process free booking:', await response.text());
          throw new Error('Failed to process free booking');
        }

        return new Response(
          JSON.stringify({ url: `${req.headers.get('origin')}/success?booking_id=${data.bookingId}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('❌ Error processing free booking:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    const formattedDate = format(new Date(data.date), 'yyyy-MM-dd');
    console.log('📅 Formatted date:', formattedDate);

    const stripeKey = data.isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error('❌ Missing Stripe API key');
      throw new Error(`${data.isTestMode ? 'Test' : 'Live'} mode Stripe API key not configured`);
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
              name: data.isTestMode ? '[TEST MODE] Karaoké BOX - MB EI' : 'Karaoké BOX - MB EI',
              description: `${data.groupSize} personnes - ${data.duration}h`,
              images: ['https://raw.githubusercontent.com/lovable-karaoke/assets/main/logo.png'],
            },
            unit_amount: Math.round(data.finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${data.bookingId}`,
      cancel_url: `${req.headers.get('origin')}/error?error=payment_cancelled`,
      customer_email: data.userEmail,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expire après 30 minutes
      metadata: {
        bookingId: data.bookingId,
        date: formattedDate,
        timeSlot: data.timeSlot,
        duration: data.duration,
        groupSize: data.groupSize,
        isTestMode: String(data.isTestMode),
        userName: data.userName,
        userPhone: data.userPhone,
        promoCodeId: data.promoCodeId || '',
        originalPrice: String(data.price),
        finalPrice: String(data.finalPrice),
      }
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      mode: data.isTestMode ? 'TEST' : 'LIVE',
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