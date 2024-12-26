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

    // Create booking only after successful payment
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id: session.metadata?.userId,
        user_email: session.metadata?.userEmail,
        user_name: session.metadata?.userName,
        user_phone: session.metadata?.userPhone,
        date: session.metadata?.date,
        time_slot: session.metadata?.timeSlot,
        duration: session.metadata?.duration,
        group_size: session.metadata?.groupSize,
        price: parseFloat(session.metadata?.originalPrice || '0'),
        message: session.metadata?.message,
        status: 'confirmed',
        payment_status: 'paid',
        is_test_booking: session.metadata?.isTestMode === 'true',
        payment_intent_id: session.payment_intent as string,
        promo_code_id: session.metadata?.promoCodeId || null,
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Error creating booking:', bookingError);
      throw bookingError;
    }

    console.log('✅ Booking created:', {
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.payment_status
    });

    // Get receipt URL
    let receiptUrl = null;
    try {
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
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.latest_charge) {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        receiptUrl = charge.receipt_url;
        console.log('🧾 Receipt URL retrieved:', receiptUrl);

        // Update booking with receipt URL
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ invoice_url: receiptUrl })
          .eq('id', booking.id);

        if (updateError) {
          console.error('⚠️ Error updating booking with receipt URL:', updateError);
        }
      }
    } catch (receiptError) {
      console.error('⚠️ Error retrieving receipt:', receiptError);
    }

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
    }

    return { received: true, booking };
  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
};