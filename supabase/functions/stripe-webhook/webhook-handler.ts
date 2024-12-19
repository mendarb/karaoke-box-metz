import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@14.21.0';

export const handleWebhook = async (event: any, stripe: Stripe | null, supabase: any) => {
  console.log('🎯 Processing webhook event:', {
    type: event.type,
    id: event.id,
    isTestMode: event.data?.object?.metadata?.isTestMode === 'true'
  });

  const session = event.data?.object;
  const metadata = session?.metadata || {};
  const isTestMode = metadata.isTestMode === 'true';

  console.log('📦 Session metadata:', {
    metadata,
    isTestMode,
    mode: isTestMode ? 'test' : 'live',
    amount: session.amount_total,
    paymentStatus: session.payment_status
  });

  if (event.type === 'checkout.session.completed') {
    try {
      // Mark the booking as paid and confirmed for both test and live payments
      const { data: booking, error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          payment_intent_id: session.payment_intent,
          updated_at: new Date().toISOString()
        })
        .eq('id', metadata.bookingId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating booking:', updateError);
        throw updateError;
      }

      console.log('✅ Booking updated:', {
        bookingId: booking.id,
        status: booking.status,
        paymentStatus: booking.payment_status,
        isTestMode: booking.is_test_booking
      });

      // Send confirmation email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
          body: { booking }
        });

        if (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
        }
      } catch (emailError) {
        console.error('❌ Error invoking email function:', emailError);
      }

      return { 
        message: 'Booking payment status updated successfully', 
        booking,
        isTestMode 
      };
    } catch (error) {
      console.error('❌ Error in webhook handler:', error);
      throw error;
    }
  }

  return { message: `Unhandled event type: ${event.type}` };
};