import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No Stripe signature found');
      return new Response(JSON.stringify({ error: 'No signature' }), { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { status: 500 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }

    console.log('Processing webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;
      
      if (!metadata) {
        console.error('No metadata found in session');
        return new Response(JSON.stringify({ error: 'No metadata found' }), { status: 400 });
      }

      console.log('Creating booking with metadata:', metadata);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
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
          payment_status: 'paid',
          is_test_booking: metadata.isTestMode === 'true'
        }])
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        return new Response(JSON.stringify({ error: bookingError.message }), { status: 500 });
      }

      console.log('Booking created successfully:', booking);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500 }
    );
  }
});