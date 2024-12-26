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

    if (!signature) {
      console.error('❌ No Stripe signature found in request');
      throw new Error('No Stripe signature found in request');
    }

    // Get the raw body as text
    const rawBody = await req.text();
    console.log('📝 Raw webhook body received');

    // Initialize Stripe with the appropriate secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const stripeTestSecretKey = Deno.env.get('STRIPE_TEST_SECRET_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
    const liveWebhookSecret = Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET')!;

    // Determine if this is a test event based on the raw body content
    const isTestMode = rawBody.includes('"livemode":false');
    const stripe = new Stripe(isTestMode ? stripeTestSecretKey : stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verify webhook signature using constructEventAsync
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        rawBody,
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

      // Get invoice URL from Stripe
      let invoiceUrl = null;
      if (session.payment_intent) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
          if (paymentIntent.invoice) {
            const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
            invoiceUrl = invoice.hosted_invoice_url;
            console.log('📄 Retrieved invoice URL:', invoiceUrl);
          }
        } catch (error) {
          console.error('❌ Error retrieving invoice:', error);
          // Continue without invoice URL
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
        paymentStatus: updatedBooking.payment_status,
        paymentIntentId: updatedBooking.payment_intent_id
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
            body: JSON.stringify({ 
              booking: updatedBooking,
              type: 'confirmation'
            }),
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