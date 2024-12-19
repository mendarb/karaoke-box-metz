import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { createBooking } from './services/booking-service.ts';
import { sendConfirmationEmail } from './services/email-service.ts';

export const handleWebhook = async (
  event: Stripe.Event,
  stripe: Stripe | null,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('🚀 Processing webhook event:', {
    type: event.type,
    id: event.id,
    object: event.data.object,
  });

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('💳 Processing completed checkout session:', {
        id: session.id,
        metadata: session.metadata,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
      });

      if (!session.metadata?.userId) {
        console.error('❌ No user ID in session metadata');
        throw new Error('No user ID in session metadata');
      }

      // Pour les réservations gratuites ou payées
      const isFreeBooking = session.amount_total === 0;
      const isPaid = session.payment_status === 'paid';
      
      console.log('💰 Payment status:', {
        isFreeBooking,
        isPaid,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total
      });

      if (isFreeBooking || isPaid) {
        console.log('✨ Creating booking for session:', session.id);

        const booking = await createBooking(session, supabase);
        console.log('✅ Booking created:', booking);

        try {
          await sendConfirmationEmail(booking, supabase);
          console.log('📧 Confirmation email sent');
        } catch (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
          // Continue even if email fails
        }

        return { received: true, booking };
      }

      console.log('⚠️ Skipping unpaid session:', session.id);
      return { received: true, skipped: true };
    }

    console.log('⚠️ Unhandled event type:', event.type);
    return { received: true, unhandled: true };
  } catch (error) {
    console.error('❌ Error in webhook handler:', error);
    throw error;
  }
};