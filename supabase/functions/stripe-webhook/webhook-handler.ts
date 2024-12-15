import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { createBooking } from './services/booking-service.ts';
import { sendConfirmationEmail } from './services/email-service.ts';

export const handleWebhook = async (
  event: Stripe.Event,
  stripe: Stripe | null,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('💳 Processing webhook event:', {
    type: event.type,
    metadata: event.data.object?.metadata,
  });

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Pour les réservations gratuites, on considère le paiement comme complété
      const isFreeBooking = session.amount_total === 0;
      if (!isFreeBooking && session.payment_status !== 'paid') {
        console.log('⚠️ Skipping unpaid session');
        return { received: true };
      }

      console.log('Creating booking with session:', {
        sessionId: session.id,
        metadata: session.metadata,
        isFreeBooking
      });

      const booking = await createBooking(session, supabase);
      console.log('✅ Booking created:', booking);

      await sendConfirmationEmail(booking, supabase);
      console.log('📧 Confirmation email sent');

      return { received: true, booking };
    }

    console.log(`⚠️ Unhandled event type: ${event.type}`);
    return { received: true };
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    throw error;
  }
};