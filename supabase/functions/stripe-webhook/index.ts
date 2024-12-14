import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    console.log('Webhook received');
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No Stripe signature found');
      return new Response(JSON.stringify({ error: 'No signature' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req.text();
    console.log('Webhook body:', body);
    
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Vérifier si c'est un paiement test
    const eventData = JSON.parse(body);
    const isTestMode = eventData.data.object?.metadata?.isTestMode === 'true';
    console.log('Processing webhook in mode:', isTestMode ? 'TEST' : 'LIVE');
    console.log('Event data:', JSON.stringify(eventData, null, 2));

    // Utiliser la bonne clé Stripe en fonction du mode
    const stripeSecretKey = isTestMode 
      ? Deno.env.get('STRIPE_TEST_SECRET_KEY')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      console.error(isTestMode ? 'Test mode API key not configured' : 'Live mode API key not configured');
      return new Response(
        JSON.stringify({ error: 'Stripe API key not configured' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Event constructed successfully:', event.type);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(
        JSON.stringify({ error: err.message }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;
      
      console.log('Checkout session completed. Details:', {
        sessionId: session.id,
        metadata,
        customer: session.customer,
        customerEmail: session.customer_email,
        paymentStatus: session.payment_status,
        mode: isTestMode ? 'test' : 'live'
      });

      if (!metadata) {
        console.error('No metadata found in session');
        return new Response(
          JSON.stringify({ error: 'No metadata found' }), 
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error('Missing Supabase credentials');
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('Creating Supabase client with URL:', supabaseUrl);
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

      const bookingData = {
        user_id: metadata.userId,
        date: metadata.date,
        time_slot: metadata.timeSlot,
        duration: metadata.duration,
        group_size: metadata.groupSize,
        status: 'confirmed',
        price: session.amount_total ? session.amount_total / 100 : 0,
        message: metadata.message || null,
        user_email: session.customer_email,
        user_name: metadata.userName,
        user_phone: metadata.userPhone,
        payment_status: session.payment_status,
        is_test_booking: isTestMode
      };

      console.log('Attempting to insert booking with data:', bookingData);

      try {
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert([bookingData])
          .select()
          .single();

        if (bookingError) {
          console.error('Error creating booking:', bookingError);
          throw bookingError;
        }

        console.log('Booking created successfully:', booking);

        // Envoyer l'email de confirmation
        try {
          const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
            body: { booking }
          });

          if (emailError) {
            console.error('Error sending confirmation email:', emailError);
          }
        } catch (emailError) {
          console.error('Error invoking send-booking-email function:', emailError);
        }

        return new Response(
          JSON.stringify({ received: true, booking }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      } catch (error) {
        console.error('Error in booking creation process:', error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify({ received: true }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Fatal error in webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});