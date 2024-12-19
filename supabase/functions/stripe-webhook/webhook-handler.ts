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
      // Vérifier si la réservation existe déjà
      const { data: existingBooking, error: searchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_intent_id', session.payment_intent)
        .maybeSingle();

      if (searchError) {
        console.error('Error checking existing booking:', searchError);
        throw searchError;
      }

      if (existingBooking) {
        console.log('Booking already exists:', existingBooking);
        return { message: 'Booking already exists', booking: existingBooking };
      }

      // Créer la nouvelle réservation
      const bookingData = {
        user_id: metadata.userId,
        date: metadata.date,
        time_slot: metadata.timeSlot,
        duration: metadata.duration,
        group_size: metadata.groupSize,
        price: parseFloat(metadata.finalPrice),
        message: metadata.message || null,
        user_email: session.customer_email || metadata.userEmail,
        user_name: metadata.userName,
        user_phone: metadata.userPhone,
        payment_status: 'paid',
        status: 'confirmed',
        is_test_booking: isTestMode,
        payment_intent_id: session.payment_intent,
        promo_code_id: metadata.promoCodeId || null
      };

      console.log('Creating new booking with data:', bookingData);

      const { data: booking, error: insertError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating booking:', insertError);
        throw insertError;
      }

      console.log('✅ Booking created successfully:', booking);

      // Envoyer l'email de confirmation
      try {
        const { error: emailError } = await supabase.functions.invoke('send-booking-email', {
          body: { bookingId: booking.id }
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      } catch (emailError) {
        console.error('Error invoking email function:', emailError);
      }

      return { message: 'Booking created successfully', booking };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  return { message: `Unhandled event type: ${event.type}` };
};