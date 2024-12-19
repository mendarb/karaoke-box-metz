import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';

export const handleWebhook = async (event: any, stripe: Stripe | null, supabase: any) => {
  console.log('Processing webhook event:', {
    type: event.type,
    id: event.id,
    isTestMode: event.data?.object?.metadata?.isTestMode === 'true'
  });

  const session = event.data?.object;
  const metadata = session?.metadata || {};
  const isTestMode = metadata.isTestMode === 'true';

  console.log('Session metadata:', {
    metadata,
    isTestMode,
    mode: isTestMode ? 'test' : 'live'
  });

  if (event.type === 'checkout.session.completed') {
    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          payment_intent_id: session.payment_intent,
          is_test_booking: isTestMode,
          status: 'confirmed'
        })
        .eq('user_id', metadata.userId)
        .eq('date', metadata.date)
        .eq('time_slot', metadata.timeSlot);

      if (bookingError) {
        console.error('Error updating booking:', bookingError);
        throw bookingError;
      }

      console.log('Booking updated successfully:', {
        userId: metadata.userId,
        date: metadata.date,
        timeSlot: metadata.timeSlot,
        isTestMode
      });

      return { message: 'Booking updated successfully' };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  return { message: `Unhandled event type: ${event.type}` };
};