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
        .insert([{
          user_id: metadata.userId,
          date: metadata.date,
          time_slot: metadata.timeSlot,
          duration: metadata.duration,
          group_size: metadata.groupSize,
          price: parseFloat(metadata.finalPrice),
          message: metadata.message || null,
          user_email: metadata.userEmail,
          user_name: metadata.userName,
          user_phone: metadata.userPhone,
          payment_status: 'paid',
          status: 'confirmed',
          is_test_booking: isTestMode,
          payment_intent_id: session.payment_intent,
          promo_code_id: metadata.promoCodeId || null
        }]);

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw bookingError;
      }

      console.log('Booking created successfully:', {
        userId: metadata.userId,
        date: metadata.date,
        timeSlot: metadata.timeSlot,
        isTestMode
      });

      return { message: 'Booking created successfully' };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  return { message: `Unhandled event type: ${event.type}` };
};