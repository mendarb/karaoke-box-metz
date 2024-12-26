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

    // Get payment intent to retrieve invoice
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    });

    const paymentIntentId = session.payment_intent as string;
    console.log('🔍 Retrieving payment intent:', paymentIntentId);

    // Get invoice URL
    let invoiceUrl = null;
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.latest_charge) {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        if (charge.invoice) {
          const invoice = await stripe.invoices.retrieve(charge.invoice as string);
          invoiceUrl = invoice.invoice_pdf;
          console.log('📄 Invoice URL retrieved:', invoiceUrl);
        }
      }
    } catch (invoiceError) {
      console.error('⚠️ Error retrieving invoice (non-blocking):', invoiceError);
      // Continue execution even if invoice retrieval fails
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