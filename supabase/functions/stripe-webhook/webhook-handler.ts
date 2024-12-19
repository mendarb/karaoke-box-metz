import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { createBooking } from './services/booking-service.ts';
import { sendConfirmationEmail } from './services/email-service.ts';

export const handleWebhook = async (
  event: Stripe.Event,
  stripe: Stripe | null,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('🚀 Webhook event received:', {
    type: event.type,
    id: event.id,
    object: event.data.object,
    created: event.created,
    metadata: event.data.object?.metadata,
  });

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('💳 Processing checkout session:', {
        id: session.id,
        metadata: session.metadata,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email,
        paymentIntent: session.payment_intent,
        userId: session.metadata?.userId,
      });

      if (!session.metadata?.userId) {
        console.error('❌ No user ID in session metadata');
        throw new Error('No user ID in session metadata');
      }

      // Pour les réservations gratuites ou payées, on crée la réservation
      const isFreeBooking = session.amount_total === 0;
      const isPaid = session.payment_status === 'paid';
      
      console.log('💰 Payment status check:', {
        isFreeBooking,
        isPaid,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total
      });

      if (isFreeBooking || isPaid) {
        console.log('✨ Creating booking for session:', {
          sessionId: session.id,
          metadata: session.metadata,
          isFreeBooking,
          isPaid,
          userId: session.metadata?.userId
        });

        const booking = await createBooking(session, supabase);
        console.log('✅ Booking created successfully:', booking);

        await sendConfirmationEmail(booking, supabase);
        console.log('📧 Confirmation email sent for booking:', booking.id);

        return { received: true, booking };
      }

      console.log('⚠️ Skipping unpaid session:', {
        sessionId: session.id,
        paymentStatus: session.payment_status
      });
      return { received: true, skipped: true };
    }

    console.log(`⚠️ Unhandled event type: ${event.type}`);
    return { received: true, unhandled: true };
  } catch (error) {
    console.error('❌ Error processing webhook:', {
      error: {
        message: error.message,
        stack: error.stack
      },
      event: {
        type: event.type,
        id: event.id,
        object: event.data.object
      }
    });
    throw error;
  }
};