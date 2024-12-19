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
    amount: session.amount_total
  });

  if (event.type === 'checkout.session.completed') {
    try {
      // Mettre à jour la réservation existante
      const { data: booking, error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          payment_intent_id: session.payment_intent
        })
        .eq('id', metadata.bookingId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating booking:', updateError);
        throw updateError;
      }

      console.log('✅ Booking payment status updated:', booking);

      // Envoyer l'email de confirmation
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

      return { message: 'Booking payment status updated successfully', booking };
    } catch (error) {
      console.error('❌ Error in webhook handler:', error);
      throw error;
    }
  }

  return { message: `Unhandled event type: ${event.type}` };
};