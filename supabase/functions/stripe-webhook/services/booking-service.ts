import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const createBooking = async (
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('🎯 Starting createBooking function:', {
    sessionId: session.id,
    metadata: session.metadata,
    customerEmail: session.customer_email
  });

  const metadata = session.metadata;
  if (!metadata) {
    console.error('❌ No metadata found in session:', session);
    throw new Error('No metadata found in session');
  }

  console.log('📝 Preparing booking data with metadata:', metadata);

  try {
    // Vérifier si la réservation existe déjà
    console.log('🔍 Checking for existing booking with payment intent:', session.payment_intent);
    
    if (session.payment_intent) {
      const { data: existingBooking, error: searchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_intent_id', session.payment_intent)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        console.error('❌ Error searching for existing booking:', {
          error: searchError,
          paymentIntent: session.payment_intent
        });
        throw searchError;
      }

      if (existingBooking) {
        console.log('⚠️ Booking already exists:', existingBooking);
        return existingBooking;
      }
    }

    const bookingData = {
      user_id: metadata.userId,
      date: metadata.date,
      time_slot: metadata.timeSlot,
      duration: metadata.duration,
      group_size: metadata.groupSize,
      status: 'confirmed',
      price: parseFloat(metadata.finalPrice),
      message: metadata.message || null,
      user_email: session.customer_email,
      user_name: metadata.userName,
      user_phone: metadata.userPhone,
      payment_status: session.amount_total === 0 ? 'paid' : session.payment_status,
      is_test_booking: metadata.isTestMode === 'true',
      payment_intent_id: session.payment_intent || null,
      promo_code_id: metadata.promoCodeId || null
    };

    console.log('📝 Attempting to create booking with data:', bookingData);

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Error creating booking:', {
        error: bookingError,
        data: bookingData
      });
      throw bookingError;
    }

    console.log('✅ Booking created successfully:', booking);
    return booking;
  } catch (error) {
    console.error('❌ Fatal error in createBooking:', {
      error: {
        message: error.message,
        stack: error.stack
      },
      session: {
        id: session.id,
        metadata: session.metadata,
        customerEmail: session.customer_email
      }
    });
    throw error;
  }
};