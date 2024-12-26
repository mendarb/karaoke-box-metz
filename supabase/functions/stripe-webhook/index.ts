import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📦 Received webhook request');
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    if (!signature) {
      console.error('❌ No Stripe signature found in request');
      throw new Error('No Stripe signature found in request');
    }

    // Initialize Stripe with the appropriate secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const stripeTestSecretKey = Deno.env.get('STRIPE_TEST_SECRET_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
    const liveWebhookSecret = Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET')!;

    // Determine if this is a test event
    const isTestMode = body.includes('"livemode":false');
    const stripe = new Stripe(isTestMode ? stripeTestSecretKey : stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        isTestMode ? webhookSecret : liveWebhookSecret
      );
    } catch (err) {
      console.error('❌ Error verifying webhook signature:', err);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    console.log('✅ Webhook signature verified');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🎯 Processing webhook event:', {
      type: event.type,
      id: event.id,
      livemode: event.livemode
    });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Processing checkout session:', {
        sessionId: session.id,
        metadata: session.metadata,
        paymentStatus: session.payment_status
      });

      if (session.payment_status !== "paid") {
        console.log("❌ Payment not completed yet:", session.payment_status);
        return new Response(
          JSON.stringify({ received: true, status: "pending" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const bookingId = session.metadata?.bookingId;
      if (!bookingId) {
        console.error('❌ No booking ID found in session metadata');
        throw new Error('Booking ID not found in session metadata');
      }

      console.log('🔍 Looking for booking with ID:', bookingId);
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError || !booking) {
        console.error('❌ Error fetching booking:', bookingError || 'Booking not found');
        throw new Error(`Booking not found: ${bookingId}`);
      }

      console.log('✅ Found booking:', {
        id: booking.id,
        status: booking.status,
        paymentStatus: booking.payment_status
      });

      // Get invoice URL from Stripe
      let invoiceUrl = null;
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        if (paymentIntent.invoice) {
          const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
          invoiceUrl = invoice.hosted_invoice_url;
          console.log('📄 Retrieved invoice URL:', invoiceUrl);
        }
      }

      // Update booking status
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          payment_intent_id: session.payment_intent as string,
          invoice_url: invoiceUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating booking:', updateError);
        throw updateError;
      }

      console.log('✅ Booking updated successfully:', {
        id: updatedBooking.id,
        status: updatedBooking.status,
        paymentStatus: updatedBooking.payment_status
      });

      // Send confirmation email
      try {
        console.log('📧 Sending confirmation email for booking:', updatedBooking.id);
        const emailResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({ booking: updatedBooking }),
          }
        );

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('❌ Error response from email service:', errorText);
          throw new Error(errorText);
        }

        console.log('✅ Confirmation email sent successfully');
      } catch (emailError) {
        console.error('❌ Error sending confirmation email:', emailError);
        // Don't block the process if email fails
      }

      return new Response(
        JSON.stringify({ received: true, booking: updatedBooking }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});