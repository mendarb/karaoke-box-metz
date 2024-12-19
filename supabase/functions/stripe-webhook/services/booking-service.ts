import { Stripe } from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const createBooking = async (
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
) => {
  console.log('🎯 Creating booking for session:', session.id);

  const metadata = session.metadata;
  if (!metadata) {
    console.error('❌ No metadata in session');
    throw new Error('No metadata in session');
  }

  try {
    // Vérifier si la réservation existe déjà
    if (session.payment_intent) {
      console.log('🔍 Checking existing booking:', session.payment_intent);
      
      const { data: existingBooking, error: searchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_intent_id', session.payment_intent)
        .maybeSingle();

      if (searchError) {
        console.error('❌ Error checking existing booking:', searchError);
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
      user_email: session.customer_email || metadata.userEmail,
      user_name: metadata.userName,
      user_phone: metadata.userPhone,
      payment_status: session.amount_total === 0 ? 'paid' : session.payment_status,
      is_test_booking: metadata.isTestMode === 'true',
      payment_intent_id: session.payment_intent || null,
      promo_code_id: metadata.promoCodeId || null
    };

    console.log('📝 Creating booking with data:', bookingData);

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating booking:', insertError);
      throw insertError;
    }

    console.log('✅ Booking created successfully:', booking);
    return booking;
  } catch (error) {
    console.error('❌ Error in createBooking:', error);
    throw error;
  }
};