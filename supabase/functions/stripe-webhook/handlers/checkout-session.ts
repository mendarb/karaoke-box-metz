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
    const isPaid = isFreeBooking || session.payment_status === 'paid';

    // Mettre à jour le statut de la réservation
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      throw new Error('Booking ID not found in session metadata');
    }

    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: isPaid ? 'paid' : 'unpaid',
        status: isPaid ? 'confirmed' : 'cancelled',
        payment_intent_id: session.payment_intent as string,
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating booking:', updateError);
      throw updateError;
    }

    console.log('✅ Booking updated:', booking);

    // Envoyer l'email de confirmation avec le statut approprié
    await sendConfirmationEmail(booking, supabase);
    console.log('📧 Confirmation email sent');

    return { received: true, booking };
  } catch (error) {
    console.error('❌ Error processing checkout session:', error);
    throw error;
  }
};