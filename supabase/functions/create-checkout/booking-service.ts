import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export const createBookingRecord = async (
  supabase: ReturnType<typeof createClient>,
  data: any,
  isTestMode: boolean
) => {
  console.log('📝 Création d\'une nouvelle réservation :', {
    userId: data.userId,
    email: data.userEmail,
    date: data.date,
    price: data.price,
    finalPrice: data.finalPrice,
    promoCode: data.promoCode
  });

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: data.userId,
      user_email: data.userEmail,
      user_name: data.userName,
      user_phone: data.userPhone,
      date: data.date,
      time_slot: data.timeSlot,
      duration: data.duration,
      group_size: data.groupSize,
      price: data.price,
      message: data.message,
      status: 'pending',
      payment_status: 'unpaid',
      is_test_booking: isTestMode,
      promo_code_id: data.promoCodeId,
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ Erreur lors de la création de la réservation:', error);
    throw error;
  }

  return booking;
};