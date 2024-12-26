import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const handleCheckoutSession = async (
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('💳 Processing checkout session:', {
    sessionId: session.id,
    metadata: session.metadata,
    paymentStatus: session.payment_status
  });

  try {
    if (session.payment_status !== "paid") {
      console.log("❌ Payment not completed yet:", session.payment_status);
      return { received: true, status: "pending" };
    }

    // Get invoice URL from Stripe
    const stripe = new Stripe(Deno.env.get(session.livemode ? 'STRIPE_SECRET_KEY' : 'STRIPE_TEST_SECRET_KEY')!);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    const invoice = await stripe.invoices.retrieve(paymentIntent.invoice as string);
    const invoiceUrl = invoice.hosted_invoice_url;

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

    console.log('✅ Booking updated:', booking);

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