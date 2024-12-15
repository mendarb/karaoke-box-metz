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

  const bookingData = {
    user_id: metadata.userId,
    date: metadata.date,
    time_slot: metadata.timeSlot,
    duration: metadata.duration,
    group_size: metadata.groupSize,
    status: 'confirmed',
    price: session.amount_total ? session.amount_total / 100 : 0,
    message: metadata.message || null,
    user_email: session.customer_email,
    user_name: metadata.userName,
    user_phone: metadata.userPhone,
    payment_status: session.amount_total === 0 ? 'paid' : session.payment_status,
    is_test_booking: metadata.isTestMode === 'true',
    payment_intent_id: session.payment_intent,
    promo_code_id: metadata.promoCodeId || null
  };

  console.log('📝 Creating booking with data:', bookingData);

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
};