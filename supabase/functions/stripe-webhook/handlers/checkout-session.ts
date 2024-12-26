import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const handleCheckoutSession = async (
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('💳 Processing checkout session:', {
    sessionId: session.id,
    metadata: session.metadata,
    paymentStatus: session.payment_status,
    livemode: session.livemode
  });

  try {
    if (session.payment_status !== "paid") {
      console.log("❌ Payment not completed yet:", session.payment_status);
      return { received: true, status: "pending" };
    }

    // Get payment intent to retrieve receipt
    const stripeKey = session.livemode 
      ? Deno.env.get('STRIPE_SECRET_KEY')
      : Deno.env.get('STRIPE_TEST_SECRET_KEY');

    if (!stripeKey) {
      throw new Error(`${session.livemode ? 'Live' : 'Test'} mode Stripe API key not configured`);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const paymentIntentId = session.payment_intent as string;
    console.log('🔍 Retrieving payment intent:', paymentIntentId, 'Mode:', session.livemode ? 'LIVE' : 'TEST');

    // Get receipt URL
    let receiptUrl = null;
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.latest_charge) {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        receiptUrl = charge.receipt_url;
        console.log('🧾 Receipt URL retrieved:', receiptUrl);
      } else {
        console.log('⚠️ No charge found in payment intent:', paymentIntentId);
      }
    } catch (receiptError) {
      console.error('⚠️ Error retrieving receipt:', receiptError);
      // Continue execution even if receipt retrieval fails
    }

    // Update booking status
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      throw new Error('Booking ID not found in session metadata');
    }

    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        payment_intent_id: paymentIntentId,
        invoice_url: receiptUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating booking:', updateError);
      throw updateError;
    }

    console.log('✅ Booking updated:', {
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.payment_status,
      receiptUrl: booking.invoice_url
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
          body: JSON.stringify({ booking }),
        }
      );

      if (!emailResponse.ok) {
        throw new Error(await emailResponse.text());
      }

      console.log('📧 Confirmation email sent');
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError);
      // Don't block the process if email fails
    }

    return { received: true, booking };
  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
};