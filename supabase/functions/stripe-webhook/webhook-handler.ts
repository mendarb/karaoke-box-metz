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
    eventId: event.id
  });

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Session data:', {
        id: session.id,
        metadata: session.metadata,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email,
        paymentIntent: session.payment_intent,
        userId: session.metadata?.userId
      });

      if (!session.metadata?.userId) {
        console.error('❌ No user ID in session metadata');
        throw new Error('No user ID in session metadata');
      }

      // Pour les réservations gratuites ou payées, on crée la réservation
      const isFreeBooking = session.amount_total === 0;
      const isPaid = session.payment_status === 'paid';
      
      if (isFreeBooking || isPaid) {
        console.log('Creating booking with session:', {
          sessionId: session.id,
          metadata: session.metadata,
          isFreeBooking,
          isPaid,
          userId: session.metadata?.userId
        });

        const booking = await createBooking(session, supabase);
        console.log('✅ Booking created:', booking);

        await sendConfirmationEmail(booking, supabase);
        console.log('📧 Confirmation email sent');

        return { received: true, booking };
      }

      console.log('⚠️ Skipping unpaid session');
      return { received: true, skipped: true };
    }

    console.log(`⚠️ Unhandled event type: ${event.type}`);
    return { received: true, unhandled: true };
  } catch (error) {
    console.error('❌ Error processing webhook:', error, {
      eventType: event.type,
      sessionId: event.data.object?.id,
      metadata: event.data.object?.metadata
    });
    throw error;
  }
};