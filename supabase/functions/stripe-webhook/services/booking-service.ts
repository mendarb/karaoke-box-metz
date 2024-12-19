import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const createBooking = async (
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
) => {
  const metadata = session.metadata;
  if (!metadata) {
    throw new Error('No metadata found in session');
  }

  console.log('📝 Creating booking with metadata:', metadata);
  console.log('Session details:', {
    customer_email: session.customer_email,
    payment_status: session.payment_status,
    amount_total: session.amount_total,
    userId: metadata.userId
  });

  // Vérifier si la réservation existe déjà
  const { data: existingBooking, error: searchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('payment_intent_id', session.payment_intent)
    .maybeSingle();

  if (searchError) {
    console.error('Error searching for existing booking:', searchError);
    throw searchError;
  }

  if (existingBooking) {
    console.log('⚠️ Booking already exists:', existingBooking);
    return existingBooking;
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

  console.log('📝 Creating booking with data:', bookingData);

  try {
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (bookingError) {
      console.error('❌ Error creating booking:', bookingError);
      throw bookingError;
    }

    console.log('✅ Booking created successfully:', booking);
    return booking;
  } catch (error) {
    console.error('❌ Error in createBooking:', error);
    throw error;
  }
};