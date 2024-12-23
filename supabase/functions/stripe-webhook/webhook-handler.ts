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
      console.log('💳 Processing completed checkout session:', {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        bookingId: metadata.bookingId
      });

      // Vérifier si la réservation n'est pas déjà prise
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', metadata.date)
        .eq('time_slot', metadata.timeSlot)
        .neq('id', metadata.bookingId)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (checkError) {
        console.error('❌ Error checking existing bookings:', checkError);
        throw checkError;
      }

      if (existingBookings && existingBookings.length > 0) {
        console.error('❌ Time slot already taken');
        throw new Error('Ce créneau est déjà réservé');
      }

      // Mettre à jour la réservation
      const { data: booking, error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          payment_intent_id: session.payment_intent,
          updated_at: new Date().toISOString()
        })
        .eq('id', metadata.bookingId)
        .select('*')
        .single();

      if (updateError) {
        console.error('❌ Error updating booking:', updateError);
        throw updateError;
      }

      console.log('✅ Booking updated successfully:', {
        bookingId: booking.id,
        status: booking.status,
        paymentStatus: booking.payment_status,
        isTestMode: booking.is_test_booking
      });

      // Envoyer l'email de confirmation
      try {
        console.log('📧 Sending confirmation email for booking:', booking.id);
        
        const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
          body: { 
            booking,
            type: 'confirmation'
          }
        });

        if (emailError) {
          console.error('❌ Error sending confirmation email:', emailError);
          throw emailError;
        }

        console.log('✅ Confirmation email sent successfully');
      } catch (emailError) {
        console.error('❌ Error in email sending process:', emailError);
        // Continue même si l'envoi d'email échoue
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