import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  try {
    console.log('🎯 Webhook request received');
    console.log('📋 Method:', req.method);
    console.log('🔑 Headers:', Object.fromEntries(req.headers.entries()));

    if (req.method === 'OPTIONS') {
      console.log('✨ Responding to OPTIONS request');
      return new Response(null, { 
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // 1. Vérifier la présence de la signature Stripe
    const signature = req.headers.get('stripe-signature');
    console.log('📝 Stripe signature:', signature);

    if (!signature) {
      console.error('❌ No Stripe signature found in headers');
      return new Response(
        JSON.stringify({ 
          error: 'No Stripe signature found',
          headers: Object.fromEntries(req.headers.entries())
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Récupérer et logger le corps de la requête
    const body = await req.text();
    console.log('📦 Request body received:', body);

    // 3. Déterminer le mode (test/live) et le secret approprié
    const rawEvent = JSON.parse(body);
    const isTestMode = !rawEvent.livemode;
    console.log('🔑 Mode:', isTestMode ? 'TEST' : 'LIVE');

    // 4. Utiliser le secret webhook approprié
    const webhookSecret = isTestMode 
      ? Deno.env.get('STRIPE_WEBHOOK_SECRET')
      : Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('❌ Webhook secret not configured for', isTestMode ? 'test' : 'live', 'mode');
      return new Response(
        JSON.stringify({ 
          error: `Webhook secret not configured for ${isTestMode ? 'test' : 'live'} mode`,
          mode: isTestMode ? 'test' : 'live'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 5. Utiliser la clé API Stripe appropriée
    const stripeKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error('❌ Stripe key not configured for', isTestMode ? 'test' : 'live', 'mode');
      return new Response(
        JSON.stringify({ 
          error: `Stripe key not configured for ${isTestMode ? 'test' : 'live'} mode`,
          mode: isTestMode ? 'test' : 'live'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('🔐 Attempting to verify webhook signature with', isTestMode ? 'TEST' : 'LIVE', 'mode secret');
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
      console.log('✅ Webhook signature verified, event:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ 
          error: `Webhook Error: ${err.message}`,
          signature: signature,
          mode: isTestMode ? 'test' : 'live'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 6. Traiter l'événement vérifié
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Checkout session completed:', {
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        metadata: session.metadata,
      });

      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', session.metadata?.bookingId)
          .single();

        if (bookingError) {
          console.error('❌ Error finding booking:', bookingError);
          throw bookingError;
        }

        if (!booking) {
          console.error('❌ No booking found with ID:', session.metadata?.bookingId);
          throw new Error('Booking not found');
        }

        console.log('✅ Booking found:', booking);

        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString()
          })
          .eq('id', booking.id);

        if (updateError) {
          console.error('❌ Error updating booking:', updateError);
          throw updateError;
        }

        console.log('✅ Booking updated successfully');

        try {
          console.log('📧 Attempting to send confirmation email...');
          const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-booking-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ booking })
          });

          if (!emailResponse.ok) {
            throw new Error(`Failed to send email: ${await emailResponse.text()}`);
          }

          console.log('✅ Confirmation email sent');

        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
          // Ne pas bloquer le processus si l'email échoue
        }
      } catch (error) {
        console.error('❌ Error processing checkout session:', error);
        throw error;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in webhook handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});