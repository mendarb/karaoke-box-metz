import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { createBooking } from '../services/booking-service.ts';
import { sendConfirmationEmail } from '../services/email-service.ts';

export const handleCheckoutSession = async (
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('💳 Processing checkout session:', {
    sessionId: session.id,
    metadata: session.metadata,
    paymentStatus: session.payment_status,
    amount: session.amount_total
  });

  try {
    // Pour les réservations gratuites, on considère le paiement comme complété
    const isFreeBooking = session.amount_total === 0;
    if (!isFreeBooking && session.payment_status !== 'paid') {
      console.log('⚠️ Skipping unpaid session');
      return { received: true };
    }

    const booking = await createBooking(session, supabase);
    console.log('✅ Booking created:', booking);

    await sendConfirmationEmail(booking, supabase);
    console.log('📧 Confirmation email sent');

    return { received: true, booking };
  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
};