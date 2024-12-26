import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  try {
    console.log('🎯 Webhook request received');

    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Get the raw body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    console.log('📝 Stripe signature:', signature);

    if (!signature) {
      console.error('❌ No Stripe signature found in headers');
      return new Response(
        JSON.stringify({ error: 'No Stripe signature found' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Parse the event to determine test/live mode
    const rawEvent = JSON.parse(body);
    const isTestMode = !rawEvent.livemode;
    console.log('🔑 Mode:', isTestMode ? 'TEST' : 'LIVE');

    // 3. Get appropriate webhook secret and Stripe key
    const webhookSecret = isTestMode 
      ? Deno.env.get('STRIPE_WEBHOOK_SECRET')
      : Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET');

    const stripeKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!webhookSecret || !stripeKey) {
      console.error('❌ Missing configuration for', isTestMode ? 'test' : 'live', 'mode');
      return new Response(
        JSON.stringify({ error: 'Invalid configuration' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 4. Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 5. Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified, event:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 6. Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 7. Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Processing completed checkout session:', {
        sessionId: session.id,
        metadata: session.metadata,
        paymentStatus: session.payment_status
      });

      if (session.payment_status !== 'paid') {
        console.log('❌ Payment not completed yet:', session.payment_status);
        return new Response(
          JSON.stringify({ received: true, status: 'pending' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      try {
        // Update booking status
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
          throw new Error('No booking ID in metadata');
        }

        const { data: booking, error: updateError } = await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating booking:', updateError);
          throw updateError;
        }

        console.log('✅ Booking updated successfully:', {
          bookingId: booking.id,
          status: booking.status,
          paymentStatus: booking.payment_status
        });

        // Send confirmation email
        try {
          const emailResponse = await fetch(
            `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({ booking })
            }
          );

          if (!emailResponse.ok) {
            throw new Error(await emailResponse.text());
          }

          console.log('✅ Confirmation email sent');
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
          // Don't block the process if email fails
        }

        return new Response(
          JSON.stringify({ received: true, booking }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error('❌ Error processing webhook:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    // Return 200 for other events
    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Unhandled error in webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});