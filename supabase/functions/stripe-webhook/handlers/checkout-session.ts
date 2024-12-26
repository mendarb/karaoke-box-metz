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
    bookingId: session.metadata?.bookingId
  });

  try {
    if (session.payment_status !== "paid") {
      console.log("❌ Payment not completed yet:", session.payment_status);
      return { received: true, status: "pending" };
    }

    // Get invoice URL from Stripe
    const stripe = new Stripe(Deno.env.get(session.livemode ? 'STRIPE_SECRET_KEY' : 'STRIPE_TEST_SECRET_KEY')!);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    console.log('💰 Retrieved payment intent:', {
      id: paymentIntent.id,
      invoiceId: paymentIntent.invoice
    });

    let invoiceUrl = null;
    if (paymentIntent.invoice) {
      const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
      invoiceUrl = invoice.hosted_invoice_url;
      console.log('📄 Retrieved invoice URL:', invoiceUrl);
    }

    // Update booking status
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      console.error('❌ No booking ID found in session metadata');
      throw new Error('Booking ID not found in session metadata');
    }

    console.log('🔍 Looking for booking with ID:', bookingId);
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !existingBooking) {
      console.error('❌ Error fetching booking:', fetchError || 'Booking not found');
      throw new Error(`Booking not found: ${bookingId}`);
    }

    console.log('✅ Found booking:', {
      id: existingBooking.id,
      status: existingBooking.status,
      paymentStatus: existingBooking.payment_status
    });

    const { data: booking, error: updateError } = await supabase
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
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.payment_status
    });

    // Send confirmation email
    try {
      console.log('📧 Sending confirmation email for booking:', booking.id);
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
        const errorText = await emailResponse.text();
        console.error('❌ Error response from email service:', errorText);
        throw new Error(errorText);
      }

      console.log('✅ Confirmation email sent successfully');
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