import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret!
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }

    console.log('Processing webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;
      
      if (!metadata) {
        throw new Error('No metadata found in session');
      }

      console.log('Creating booking with metadata:', metadata);

      // Créer la réservation une fois le paiement confirmé
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
        throw bookingError;
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